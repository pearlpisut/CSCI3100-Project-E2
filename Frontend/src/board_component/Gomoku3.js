import React, { useState, useEffect } from "react";
import "./Gomoku.css";
import {New_Board} from "../board_logic/New_Board"
import {BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";

var new_board = new New_Board(3)
new_board.startGame();
function Gomoku3(){ 
  //Thants initialization
  //new_board.changeDifficulty(Diff);

  const [board, setBoard] = useState(Array(19).fill(Array(19).fill(null)));
  const [player, setPlayer] = useState("X");
  const [current_p, setCurrent_p] = useState("Your")
  //const [winner, setWinner] = useState(null);

  const navigate = useNavigate();
  const goBack = () => navigate('/choose_diff')


  useEffect(() => {
    if (new_board.checkWinner() == 1){
      alert(`Computer wins!`);
      setBoard(Array(19).fill(Array(19).fill(null)));
      setPlayer("X");
      new_board.resetBoard()
      goBack()
    }
    else if (new_board.checkWinner() == -1){
      alert(`Player X wins!`);
      setBoard(Array(19).fill(Array(19).fill(null)));
      setPlayer("X");
      new_board.resetBoard()
      goBack()
    }
    /*
    if (winner) {
      alert(`Player ${winner} wins!`);
      setBoard(Array(19).fill(Array(19).fill(null)));
      setWinner(null);
      setPlayer("X");
      new_board.resetBoard()
    }*/ 
    else if (player === "O") {
      setTimeout(() => {
        makeAiMove();
      }, 100); // Wait for 0.5 seconds making AI move
    }
  }, [board, player]);

  function makeMove(row, col) {
    if (board[row][col]) {
      return;
    }
    // If it a human move, do the move on the board
    if (player === "X"){
      var temp_row = 19 - row;
      var temp_col =  (col + 10).toString(36).toUpperCase();
      var position = temp_col + temp_row.toString()
      new_board.doMove(position);
    }
    const newBoard = board.map((rowArray, r) =>
      row === r ? rowArray.map((colVal, c) => (col === c ? player : colVal)) : rowArray
    );
    setBoard(newBoard);
    console.log(new_board.exportBoardData().boardArray)
    setPlayer(player === "X" ? "O" : "X");
    setCurrent_p(current_p === "Your" ? "AI" : "Your")

  }

  function makeAiMove() {
    const aiMove = new_board.doBestMove()
    var temp = new_board.stringToCoords(aiMove)
    console.log(temp)
    makeMove(temp[0], temp[1]);
  }

  

  //Time Counter
  const [seconds, setSeconds] = useState(0);
    
  useEffect(() => {
      const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

  //Get local time
  const [startTime] = useState(new Date());

  return (
      <div className="App">
          <div className="meta-container">
              <div className="time-container">
                  <div>Start Time: {startTime.toLocaleTimeString('en-GB')}</div>
                  <div>{current_p}'s Turn</div>
              </div>
              <div className="game-info-container">
                  <div>Time Elapsed: {formatTime(seconds)}</div>
                  <div>Stone Type: {player}</div>
              </div>
          </div>
              <div className="board">
              {board.map((rowArray, row) => (
                <div key={row} className="row">
                  {rowArray.map((colVal, col) => (
                    <div key={col} className="col" onClick={() => makeMove(row, col)}>
                      {colVal}
                    </div>
                  ))}
                </div>
              ))}
            </div>
      </div>
  );
  }

export default Gomoku3;