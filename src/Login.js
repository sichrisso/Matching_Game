import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuthInfo } from "./auth";

const fetchDataFromGoogleSheets = async () => {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbyLsnQc7nnePzgSU3aNCdrbtBTHvtOrub0FvoksMc7kVc7LXVYjl9Us8usyuMY1uOT6hw/exec"; // Replace this with your endpoint
  try {
    const response = await fetch(endpoint, { method: "GET", mode: "cors" });
    if (response.ok) {
      console.log(response);
      const data = await response.json();
      return data.names || [];
    } else {
      console.error("Error fetching data:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("There was an error fetching from Google Sheets", error);
    return [];
  }
};

const StartScreen = () => {
  const [isNameInSheet, setIsNameInSheet] = useState(false);
  const { setUserInfo } = useAuthInfo();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      playerName: "",
      playerID: "",
    },
    validationSchema: Yup.object({
      playerName: Yup.string()
        .required("Required")
        .matches(/^[a-zA-Z]+$/, "Only alphabetic characters are allowed"),
      playerID: Yup.string()
        .required("Required")
        .matches(/^\d{8}$/, "UMID should be a number with exactly 8 digits"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    const namesFromSheet = await fetchDataFromGoogleSheets();

    const exists = namesFromSheet.some(
      (entry) =>
        entry.playerName === values.playerName &&
        entry.playerID === values.playerID
    );

    if (exists) {
      setIsNameInSheet(true);
    } else {
      setUserInfo(values.playerName, values.playerID);
      navigate("/matchingGame");
    }
  };

  return (
    <div className="start-parent">
      <div className="start-screen">
        <h1>
          Welcome to{" "}
          <span
            style={{
              color: "#FF6666",
              fontStyle: "italic",
              fontSize: "50px",
            }}
          >
            SAMPLE ALERT!
          </span>
        </h1>

        <form onSubmit={formik.handleSubmit}>
          <input
            name="playerName"
            value={formik.values.playerName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your Uniqname"
          />
          {formik.touched.playerName && formik.errors.playerName ? (
            <div
              style={{
                color: "#00274c",
                borderColor: "red",
                fontStyle: "italic",
              }}
            >
              {formik.errors.playerName}
            </div>
          ) : null}

          <input
            name="playerID"
            value={formik.values.playerID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your UMID"
          />
          {formik.touched.playerID && formik.errors.playerID ? (
            <div
              style={{
                color: "#00274c",
                borderColor: "red",
                fontStyle: "italic",
              }}
            >
              {formik.errors.playerID}
            </div>
          ) : null}

          {isNameInSheet && <p>Your response has already been submitted.</p>}
          <button style={{ color: "white" }} type="submit">
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;
