import React, { useState } from "react";

function S_Board({Difficulty}) {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartGame = () => {
    setGameStarted(true);
  };

  // Render the game setup screen or the game board
  return (
    <div className="app">
      {!gameStarted ? (
        <button className="start-button" onClick={handleStartGame}>Start Game</button>
      ) : (
        <Gomoku />
      )}
    </div>
  );
}


export default S_Board