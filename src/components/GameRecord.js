import GoBoard from "./GameBoard";
import { useState } from "react";

/* Display "WIN", "LOSS" or "DRAW" text (made uppercase in css) */
function WinLoss({name, winner, type}) {
    if (name === winner) {
        return (
            <div class="win-loss">
                <p class="game-status">Win:&nbsp;</p>
                <p class="game-mode">{type}</p>
            </div>
        );
    }
    else if (winner === "") {
        return (
            <div class="win-loss">
                <p class="game-status">Draw:&nbsp;</p>
                <p class="game-mode">{type}</p>
            </div>
        );
    }
    else {
        return (
            <div class="win-loss">
                <p class="game-status">Loss:&nbsp;</p>
                <p class="game-mode">{type}</p>
            </div>
        );
    }
}

/* Highlight the winning player by giving it a background color */
function HighlightWinner({winner, piece, player, score}) {
    if (winner === player) {
        return (
            <div class="player winner">
                <p className={piece}></p>
                <p>{player}</p>
                <p>{score}</p>
            </div>
        );
    }
    else {
        return (
            <div class="player">
                <p className={piece}></p>
                <p>{player}</p>
                <p>{score}</p>
            </div>
        );
    }
}

export default function GameRecord({name, winner, type, black, black_score, white, white_score, time_elapsed, starting_time, date, boardArray}) {
    /* Debugging
    console.log({boardArray});
    */

    /* Formatting time elapsed */
    const min = Math.floor(time_elapsed / 60);
    let sec = time_elapsed % 60;
    if (sec < 10) {
        sec = sec.toString();
        sec = sec.padStart(2, '0');
    }

    /* "View board" button functionality */
    const [state, currentState] = useState(true);
    const handleClick = () => {
        currentState(current => !current);
    }

    return (
        <div class="record">
            <div class="record-container">
                <WinLoss name={name} winner={winner} type={type} />
                {/* Need to fix */}
                <div><button onClick={handleClick}>View board</button></div>
                <HighlightWinner winner={winner} piece='black-piece' player={black} score={black_score}/>
                <div><p>Time: {min}:{sec}</p></div>
                <div><p>Played on</p></div>
                <HighlightWinner winner={winner} piece='white-piece' player={white} score={white_score}/>
                <div><p>Start: {starting_time}</p></div>
                <div><p>{date}</p></div>
                {/* To render the board, use <GoBoard boardArray={boardArray} /> */}
            </div>
            <div class="board-container" style={{display: state ? "none" : "inline-block"}}>
                <GoBoard boardArray={boardArray} />
            </div>
        </div>
    );
}