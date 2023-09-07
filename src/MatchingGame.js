import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import students from "./data";
import { useAuthInfo } from "./auth";

//Sheffling the choices
function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get the feedback based on the score
const getScoreFeedback = (score, total) => {
  const percentage = (score / total) * 100;

  if (percentage >= 90) return { feedback: "Outstanding", emoji: "🎉" };
  if (percentage >= 75) return { feedback: "Great job", emoji: "👍" };
  if (percentage >= 50) return { feedback: "Good effort", emoji: "😊" };
  if (percentage >= 25) return { feedback: "Needs improvement", emoji: "🤔" };
  return { feedback: "Keep trying", emoji: "🙁" };
};

// send data to google sheets
const postDataToGoogleSheets = async (playerName, playerID, points) => {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbwuzG9FUWbL2c5KzvZpQQhKFVeSgA6V1O0TtqXiEMmtYsVubPDhVMOE6xxqsKRn62_f/exec"; // Use the URL provided
  const formData = new FormData();
  formData.append("Name", playerName);
  formData.append("ID", playerID.toString()); // Append the player's ID
  formData.append("Score", points.toString()); // Convert points to a string before appending

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log(response);
      console.log("Data successfully saved to Google Sheets");
    } else {
      console.error(
        "There was an error saving to Google Sheets: ",
        response.statusText
      );
    }
  } catch (error) {
    console.error("There was an error saving to Google Sheets", error);
  }
};

function MatchingGame({ playerName, playerID }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [points, setPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSticker, setShowSticker] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuthInfo();

  useEffect(() => {
    setCurrentImage(students[currentIndex]);
    const wrongChoices = shuffleArray(
      students.filter((s) => s.id !== students[currentIndex].id)
    ).slice(0, 3);
    const shuffledChoices = shuffleArray([
      ...wrongChoices,
      students[currentIndex],
    ]);
    setChoices(shuffledChoices);
  }, [currentIndex]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleChoice = (choice) => {
    if (selected) return;

    setSelected(choice);

    if (choice.id === currentImage.id) {
      setPoints((prev) => prev + 1);
      setShowSticker(true);
      setTimeout(() => setShowSticker(false), 1000);
    }
    // Immediately move to the next question
    setTimeout(handleNext, 1000);
  };

  const handleNext = () => {
    if (currentIndex < students.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelected(null);
    setPoints(0);
    setIsGameOver(false);
  };

  // write a handle subimt function
  const handleSubmit = () => {
    postDataToGoogleSheets(user.playerName, user.playerID, points);
    handleLogout();
  };

  if (isGameOver) {
    const feedback = getScoreFeedback(points, students.length);
    const percentage = Math.round((points / students.length) * 100);

    return (
      <div className="score-container">
        <div className="score-output">
          Your score is: {points} out of {students.length}
          <br></br>
          <div style={{ color: "blue", marginTop: "10px" }}>{percentage}%!</div>
          <div className="feedback">
            <span className="feedback-text">{feedback.feedback}</span>
            <span className="emoji">{feedback.emoji}</span>
          </div>
          <br />
          <button onClick={() => handleRetry()}>Retry</button>{" "}
          <button onClick={() => handleSubmit()}>Submit</button>{" "}
        </div>
      </div>
    );
  }
  return (
    <div className="game-container">
      <div className="header">
        <div className="player-info">
          <span className="player-name">
            <span className="label">Uniqname:</span>
            {user.playerName}
          </span>
          <span className="player-id">
            <span className="label">UMID:</span> #{user.playerID}
          </span>
        </div>

        <div className="logout-button" onClick={handleLogout}>
          Logout
        </div>
      </div>

      <h1>🎓 Guess the Student 🤔 </h1>
      <div className="counter">
        {currentIndex + 1}/{students.length}
      </div>

      <div className="image-container">
        {showSticker && <div className="sticker">+1</div>}
        {currentImage && (
          <img
            src={currentImage.photoUrl}
            alt="Guess Who?"
            className="centered-image"
          />
        )}
      </div>
      <div className="choices-list">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice)}
            className={
              selected
                ? choice.id === currentImage.id
                  ? "correct"
                  : choice.id === selected.id
                  ? "wrong"
                  : ""
                : ""
            }
          >
            {choice.name}
          </button>
        ))}
      </div>
      <div className="points">
        Points:{" "}
        <span
          style={{
            color: "white",
            padding: "10px 15px",
            borderRadius: "20px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            fontSize: "1.2em",
            fontWeight: "600",
          }}
        >
          {points}
        </span>
      </div>
    </div>
  );
}

export default MatchingGame;
