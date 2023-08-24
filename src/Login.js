// function StartScreen(props) {
//   const {
//     playerName,
//     setPlayerName,
//     playerID,
//     setPlayerID,
//     handleNameSubmit,
//     isNameInSheet,
//   } = props;

//   return (
//     <div className="start-screen">
//       <h1>
//         Welcome to <span className="alert-title">SAMPLE ALERT!</span>
//       </h1>
//       <input
//         value={playerName}
//         onChange={(e) => setPlayerName(e.target.value)}
//         placeholder="Enter your Uniqname"
//         maxLength="20"
//       />
//       <input
//         value={playerID}
//         onChange={(e) => setPlayerID(e.target.value)}
//         placeholder="Enter your UMID"
//         type="number"
//         maxLength="20"
//       />
//       {isNameInSheet && <p>Your response has already been submitted.</p>}
//       <button onClick={handleNameSubmit}>Start Game</button>
//     </div>
//   );
// }

// export default StartScreen;