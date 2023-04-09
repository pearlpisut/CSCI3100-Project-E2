import { Board } from "./board.js"
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

/** This is a demo version of how the player versus computer game will be implemented */

var gameBoard = new Board(19);
gameBoard.startGame();
while (gameBoard.checkWinner() == 2) {
    if (gameBoard.currentPlayer == -1) {
        var move = await rl.question('Input Black\'s move: ');
        rl.pause();
        var moveFail = gameBoard.doMove(move);
        if (moveFail == 1) {
            continue;
        }
    } else {
        var bestMove = gameBoard.doBestMove();
        console.log('Computer\'s turn: ' + bestMove);
    }
    gameBoard.printBoard();
}
gameBoard.endGame();
var winner = gameBoard.checkWinner();
switch(winner) {
    case 1:
        console.log('White wins!');
        break;
    case -1:
        console.log('Black wins!');
        break;
    case 0:
        console.log('Draw...');
        break;
}
console.log('Time elasped: ' + gameBoard.getElaspedTimeSeconds() + 's');