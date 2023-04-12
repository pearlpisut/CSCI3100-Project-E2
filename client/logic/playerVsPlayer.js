import { Board } from "./board.js"
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

/** This is a demo version of how the player versus player game will be implemented */

var gameBoard = new Board(3);
gameBoard.startGame();
while (gameBoard.checkWinner() == 2) {
    if (gameBoard.currentPlayer == 1) {
        var move = await rl.question('Input White\'s move: ');
    } else {
        var move = await rl.question('Input Black\'s move: ');
    }
    rl.pause();
    if (move == 'undo') {
        console.log(gameBoard.undoMove());
    } else {
        var moveFail = gameBoard.doMove(move);
        if (moveFail == 1) {
            continue;
        }
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
var data = gameBoard.exportBoardData();
console.log('Start time: ' + data.startTime + '\nTime elasped: ' + data.timeElasped + 's' +
'\nWinner: ' + data.winner);