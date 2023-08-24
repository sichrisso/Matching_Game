// ... [Your previous imports and constants]

// Splitting the restartGame into two different functions
const handleRetry = () => {
  setCurrentIndex(0);
  setSelected(null);
  setPoints(0);
  setIsGameOver(false);
};

const handleSubmit = async () => {
  await postDataToGoogleSheets(playerName, playerID, points);
  // Record the score when the game is over
  setScoreHistory((prevHistory) => [
    ...prevHistory,
    { name: playerName, score: points },
  ]);
  setIsGameOver(true);
  // If you want to sign them out or end their session, add your code here.
};



// ... [The rest of your component's logic]

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

// ... [The rest of your component's render logic]
