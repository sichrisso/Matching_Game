import React, { useState } from "react";
import MatchingGame from "./MatchingGame";
import "./App.css";
import StartScreen from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/matchingGame" element={<MatchingGame />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
