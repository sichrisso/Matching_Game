import React, { useState, useEffect } from "react";
import abhipol_Vibhatasilpin from "./assets/abhipol_Vibhatasilpin.jpg";
import Alanson_Sample from "./assets/Alanson_Sample.jpeg";
import Cameron_Haire from "./assets/Cameron_Haire.jpeg";
import Christina_Solomon from "./assets/Christina_Solomon.jpg";
import Hyunmin_Park from "./assets/Hyunmin_Park.jpg";
import Kunpeng_Huang from "./assets/Kunpeng_Huang.jpg";
import Raghav_Varshney from "./assets/Raghav_Varshney.jpg";
import Tianyuan_Du from "./assets/Tianyuan_Du.jpg";
import Tom_Krolikowski from "./assets/Tom_Krolikowski.jpg";
import Yang_Hsi_Su from "./assets/Yang-Hsi_Su.jpg";
import Yasha_Iravantchi from "./assets/Yasha_Iravantchi.jpg";
import Yaxuan_Li from "./assets/Yaxuan_Li.jpg";

const students = [
  { id: 1, name: "Abhipol Vibhatasilpin", photoUrl: abhipol_Vibhatasilpin },
  { id: 2, name: "Alanson Sample", photoUrl: Alanson_Sample },
  { id: 3, name: "Cameron Haire", photoUrl: Cameron_Haire },
  { id: 4, name: "Christina Solomon", photoUrl: Christina_Solomon },
  { id: 5, name: "Hyunmin Park", photoUrl: Hyunmin_Park },
  { id: 6, name: "Kunpeng Huang", photoUrl: Kunpeng_Huang },
  { id: 7, name: "Raghav Varshney", photoUrl: Raghav_Varshney },
  { id: 8, name: "Tianyuan Du", photoUrl: Tianyuan_Du },
  { id: 9, name: "Tom Krolikowski", photoUrl: Tom_Krolikowski },
  { id: 10, name: "Yang Hsi Su", photoUrl: Yang_Hsi_Su },
  { id: 11, name: "Yasha Iravantchi", photoUrl: Yasha_Iravantchi },
  { id: 12, name: "Yaxuan Li", photoUrl: Yaxuan_Li },
];

function shuffleArray(array) {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const getScoreFeedback = (score, total) => {
  const percentage = (score / total) * 100;

  if (percentage >= 90) return { feedback: "Outstanding", emoji: "🎉" };
  if (percentage >= 75) return { feedback: "Great job", emoji: "👍" };
  if (percentage >= 50) return { feedback: "Good effort", emoji: "😊" };
  if (percentage >= 25) return { feedback: "Needs improvement", emoji: "🤔" };
  return { feedback: "Keep trying", emoji: "🙁" };
};

const postDataToGoogleSheets = async (playerName, playerID, points) => {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbyLsnQc7nnePzgSU3aNCdrbtBTHvtOrub0FvoksMc7kVc7LXVYjl9Us8usyuMY1uOT6hw/exec"; // Use the URL provided
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

const fetchDataFromGoogleSheets = async () => {
  const endpoint =
    "https://script.google.com/macros/s/AKfycbyLsnQc7nnePzgSU3aNCdrbtBTHvtOrub0FvoksMc7kVc7LXVYjl9Us8usyuMY1uOT6hw/exec"; // Replace this with your endpoint
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
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

function MatchingGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [points, setPoints] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerName, setPlayerName] = useState(""); // State for player's name
  const [playerID, setPlayerID] = useState(""); // State for player's ID
  const [scoreHistory, setScoreHistory] = useState([]); // State for score history
  const [isGameStarted, setIsGameStarted] = useState(false); // State to check if the game is started
  const [isNameInSheet, setIsNameInSheet] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((currentIndex / students.length) * 100);
  }, [currentIndex]);

  const validateNameAndId = () => {
    if (playerName.length <= 20 && /^(\d+)?$/.test(playerID)) {
      handleNameSubmit();
    }
  };

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

  const handleChoice = (choice) => {
    if (selected) return;

    setSelected(choice);

    if (choice.id === currentImage.id) {
      setPoints((prev) => prev + 1);
    }
    // Immediately move to the next question
    setTimeout(handleNext, 1500);
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

  const handleSubmit = async () => {
    postDataToGoogleSheets(playerName, playerID, points);
    // Record the score when the game is over
    setScoreHistory((prevHistory) => [
      ...prevHistory,
      { name: playerName, score: points },
    ]);
    setIsGameOver(true); // Reset the game over state
    setIsGameStarted(false); // Return to the game start screen
    setPlayerName(""); // Reset player's name
    setPlayerID(""); // Reset player's ID
    setCurrentIndex(0);
    setSelected(null);
    setPoints(0);
  };

  const handleNameSubmit = async () => {
    const namesFromSheet = await fetchDataFromGoogleSheets();

    if (namesFromSheet.includes(playerName)) {
      setIsNameInSheet(true);
    } else {
      setIsGameStarted(true);
    }
  };

  if (!isGameStarted) {
    return (
      <div className="start-screen">
        <h1>Welcome to SAMPLE ALERT!</h1>
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your Uniqname"
        />
        <input
          value={playerID}
          onChange={(e) => setPlayerID(e.target.value)}
          placeholder="Enter your UMID"
        />
        {isNameInSheet && <p>Your response has already been submitted.</p>}
        <button onClick={validateNameAndId}>Start Game</button>
      </div>
    );
  }

  if (isGameOver) {
    const feedback = getScoreFeedback(points, students.length);

    return (
      <div className="game-container">
        <div className="score-output">
          Your score is: {points} out of {students.length}
          <br />
          {feedback.feedback} {feedback.emoji}
          <br />
          <button onClick={() => handleRetry()}>Retry</button>{" "}
          {/* The Retry Button */}
          <button onClick={() => handleSubmit()}>Submit</button>{" "}
          {/* The Submit Button */}
        </div>
        <div>
          <h2>Score History</h2>
          <ul>
            {scoreHistory.map((record, idx) => (
              <li key={idx}>
                {record.name}: {record.score} out of {students.length}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="game-container">
      <h1>🎓 Guess the Student 🤔</h1>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      {currentImage && (
        <img
          src={currentImage.photoUrl}
          alt="Guess Who?"
          className="centered-image"
        />
      )}
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

      <div className="points">Points: {points}</div>
    </div>
  );
}

export default MatchingGame;
