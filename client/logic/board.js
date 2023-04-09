import { Engine, Utils } from "./engine.js";
const color = {
    EMPTY: 0,
    BLACK: -1,
    WHITE: 1
}
Object.freeze(color);

class Cell {
    pieceColor;
    turn;

    constructor() {
        this.pieceColor = color.EMPTY;
        this.turn = -1;
    }
}

export class Board {
    boardWidth;
    currentPlayer; // color of the current player (BLACK or WHITE)
    turn; 
    cells; // array of cells in the board
    passCount; // number of passes made by each player
    engine;
    startTime;
    endTime;

    /**
     * Initializes the game board.
     * 
     * @param {number} difficulty The difficulty for the computer player.
     */
    constructor(difficulty) {
        this.boardWidth = 19;
        this.currentPlayer = color.BLACK;
        this.turn = 1;
        this.cells = new Array(this.boardWidth);
        for (var i = 0; i < this.boardWidth; i++) {
            this.cells[i] = new Array(this.boardWidth);
            for (var j = 0; j < this.boardWidth; j++) {
                this.cells[i][j] = new Cell();
            }
        }
        this.passCount = {
            BLACK: 0,
            WHITE: 0
        }
        this.engine = new Engine(difficulty);
    }

    /**
     * Place the current player's piece at the specified position and
     * updates other information of the board. Rows are numbered 1 to 19 
     * from bottom to top, and columns are labelled A to S from left to 
     * right. For example, 'A19' would be top left corner.
     * 
     * @param {string} posString The string representing the move to
     * be made. 
     * @returns {number} 0 represents successful move; 1 means move failed.
     */
    
    doMove(posString) {
        if (this.isOccupied(posString)) {
            return 1;
        } else {
            var coords = this.stringToCoords(posString);
            var i = coords[0];
            var j = coords[1];
            this.cells[i][j].pieceColor = this.currentPlayer;
            this.cells[i][j].turn = this.turn;
            this.engine.doMove(posString, this.currentPlayer);

            this.currentPlayer = this.invertColor(this.currentPlayer);
            this.turn++;
            return 0;
        }
    }

    /**
     * Undo the previous move and restore the information of the board
     * accordingly.
     */
    undoMove() {
        var previousI, previousJ;
        for (var i = 0; i < this.boardWidth; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                if (this.cells[i][j].turn == this.turn - 1) {
                    previousI = i;
                    previousJ = j;
                    break;
                }
            }
        }
        this.cells[previousI][previousJ].pieceColor = color.EMPTY;
        this.cells[previousI][previousJ].turn = -1;

        this.currentPlayer = this.invertColor(this.currentPlayer);
        this.turn--;
        
        this.engine.undoMove();
    }

    /**
     * Pass the turn to the other player.
     */
    pass() {
        if (this.currentPlayer = color.BLACK) {
            this.passCount.BLACK++;
        } else {
            this.passCount.WHITE++;
        }

        this.currentPlayer = this.invertColor(this.currentPlayer);
        this.turn++;

        this.engine.turn++;
    }

    /**
     * Do the best move as predicted by the engine.
     * @return {number} returns the best move.
     */
    doBestMove() {
        var bestMove = Utils.intToString(this.engine.generateBestMove(this.currentPlayer)[0]);
        this.doMove(bestMove);
        return bestMove;
    }

    /**
     * Checks whether a piece is present in the specified position.
     * 
     * @param {string} posString The string representing the position to be checked.
     * @returns {boolean} True if the position is occupied by a piece, False otherwise.
     */
    isOccupied(posString) {
        var coords = this.stringToCoords(posString);
        return this.cells[coords[0]][coords[1]].pieceColor != color.EMPTY;
    }

    /**
     * Returns a 2D array representation of the board.
     * 
     * @returns {Array<Array<number>>} A 2D array representing the cells of the
     * board. 0 represents an empty cell, 1 represents a white piece and -1 represents
     * a black piece.
     */
    getBoard() {
        var boardArray = [];
        for (var i = 0; i < this.boardWidth; i++) {
            var row = [];
            for (var j = 0; j < this.boardWidth; j++) {
                row.push(cells[i][j].pieceColor);
            }
            boardArray.push(row);
        }
        return boardArray;
    }

    /**
     * Initializes the start time of the game
     */
    startGame() {
        this.startTime = new Date();
    }

    /**
     * Initializes the end time of the game
     */
    endGame() {
        this.endTime = new Date();
    }

    /**
     * Get the time elasped during a game in seconds. Should only be
     * called after both startGame() and endGame() has been called
     * already.
     * 
     * @returns {number} The time elasped during the game in seconds.
     */
    getElaspedTimeSeconds() {
        return (this.endTime - this.startTime)/1000; 
    }

    /**
     * Checks if the board has reached a terminal state.
     * 
     * @returns {number} A number indicating the board's state.
     * 0 represents draw, -1 represents black's win, 1 represents
     * white's win, and 2 for none of the above.
     */

    checkWinner() {
        return this.engine.eval.checkWinner();
    }

    // Utilities
    stringToCoords(posString) {
        var j = posString.charCodeAt(0) - 65;
        posString = posString.slice(1);
        var i = this.boardWidth - parseInt(posString);
        return [i, j];
    }

    invertColor(pieceColor) {
        return color.WHITE + color.BLACK - pieceColor;
    }

    printBoard() {
        var colorRed = "\x1b[31m";
        var colorWhite = "\x1b[37m";
        var colorDefault = "\x1b[0m";
        
        for (var i = 0; i < this.boardWidth; i++) {
            var y = 19 - i;
            var space = y < 10 ? "  " : " ";
            process.stdout.write(colorWhite + y.toString() + space);
            for (var j = 0; j < this.boardWidth; j++) {
                var pieceColor = this.cells[i][j].pieceColor;
                if (pieceColor == -1) {
                    process.stdout.write(colorWhite + "|" + colorRed + "X");
                } else if (pieceColor == 1) {
                    process.stdout.write(colorWhite + "|" + colorDefault + "O");
                } else {
                    process.stdout.write(colorWhite + "| ");
                }
            }
            process.stdout.write(colorWhite + "|\n");
        }
        process.stdout.write(space + " ");
        for (var j = 0; j < this.boardWidth; j++) {
            process.stdout.write(colorWhite + " " + String.fromCharCode(j + 65));
        }
        process.stdout.write("\n" + colorDefault);
    }

    printTurns() {
        for (var i = 0; i < this.boardWidth; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                var turn = this.cells[i][j].turn;
                process.stdout.write("|" + turn + "\t");
            }
            process.stdout.write("|\n");
        }
    }
}