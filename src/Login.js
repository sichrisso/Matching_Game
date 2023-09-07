import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuthInfo } from "./auth";

const fetchDataFromGoogleSheets = async () => {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbwuzG9FUWbL2c5KzvZpQQhKFVeSgA6V1O0TtqXiEMmtYsVubPDhVMOE6xxqsKRn62_f/exec"; // Replace this with your endpoint
  try {
    const response = await fetch(endpoint, { method: "GET", mode: "cors" });
    if (response.ok) {
      console.log(response);
      const data = await response.json();
      return data || [];
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
      if (formik.isValid) {
        handleSubmit(values);
      }
    },
  });

  const handleSubmit = async (values) => {
    formik.setSubmitting(true); // Set isSubmitting to true when you start submitting

    const namesFromSheet = await fetchDataFromGoogleSheets();

    const exists = namesFromSheet.some(
      (entry) =>
        entry.Name === values.playerName && entry.ID === Number(values.playerID)
    );

    if (exists) {
      // Create a modal overlay
      const modalOverlay = document.createElement("div");
      modalOverlay.classList.add("modal-overlay");
      document.body.appendChild(modalOverlay);
      // Create a centered alert dialog
      const alertContainer = document.createElement("div");
      alertContainer.classList.add("centered-alert");

      const alertMessage = document.createElement("p");
      alertMessage.textContent = "Your response has already been submitted.";

      const okButton = document.createElement("button");
      okButton.textContent = "OK";
      okButton.classList.add("centered-button");
      okButton.addEventListener("click", () => {
        document.body.removeChild(modalOverlay); // Remove the modal overlay
        document.body.removeChild(alertContainer); // Remove the alert on OK button click
      });

      alertContainer.appendChild(alertMessage);
      alertContainer.appendChild(okButton);
      document.body.appendChild(alertContainer);
    } else {
      setUserInfo(values.playerName, values.playerID);
      navigate("/matchingGame");
    }

    formik.setSubmitting(false); // Set isSubmitting to false when you finish submitting
    formik.resetForm(); // Clear the form fields after successful submission
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
          {formik.isSubmitting ? (
            <p>Checking if your response has already been submitted...</p>
          ) : null}

          {formik.status && <p>{formik.status}</p>}

          <button
            style={{ color: "white" }}
            type="submit"
            disabled={formik.isSubmitting}
          >
            {console.log(formik.isSubmitting)}
            {formik.isSubmitting ? "Checking..." : "Start Game"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;
