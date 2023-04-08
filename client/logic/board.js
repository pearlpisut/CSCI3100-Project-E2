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

class Board {
    boardWidth;
    currentPlayer; // color of the current player (BLACK or WHITE)
    turn; 
    cells; // array of cells in the board
    passCount; // number of passes made by each player
    engine;

    /**
     * Initializes the game board.
     * 
     * @param {number} boardWidth The width of the board to be created.
     */
    constructor(boardWidth) {
        this.boardWidth = boardWidth;
        this.currentPlayer = color.BLACK;
        this.turn = 1;
        this.cells = new Array(boardWidth);
        for (var i = 0; i < boardWidth; i++) {
            this.cells[i] = new Array(boardWidth);
            for (var j = 0; j < boardWidth; j++) {
                this.cells[i][j] = new Cell();
            }
        }
        this.passCount = {
            BLACK: 0,
            WHITE: 0
        }
        this.engine = new Engine();
    }

    /**
     * Place the current player's piece at the specified position and
     * updates other information of the board.
     * 
     * @param {string} posString The string representing the move to
     * be made.
     */
    
    doMove(posString) {
        this.currentPlayer = this.invertColor(this.currentPlayer);
        this.turn++;

        var coords = this.stringToCoords(posString);
        var i = coords[0];
        var j = coords[1];
        this.cells[i][j].pieceColor = this.currentPlayer;
        this.cells[i][j].turn = this.turn;

        this.engine.doMove(posString, this.currentPlayer);
    }

    /**
     * Undo the previous move and restore the information of the board
     * accordingly.
     */
    undoMove() {
        this.currentPlayer = this.invertColor(this.currentPlayer);
        this.turn--;

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
        
        this.engine.undoMove();
    }

    /**
     * Pass the turn to the other player.
     */
    pass() {
        this.currentPlayer = this.invertColor(this.currentPlayer);
        this.turn++;

        if (this.currentPlayer = color.BLACK) {
            this.passCount.BLACK++;
        } else {
            this.passCount.WHITE++;
        }

        this.engine.turn++;
    }

    /**
     * Do the best move as predicted by the engine.
     */
    doBestMove() {
        var bestMove = this.engine.doBestMove(this.currentPlayer)[0];
        this.doMove(Utils.intToString(bestMove));
    }

    /**
     * Checks whether a piece is present in the specified position.
     * 
     * @param {string} posString The string representing the position to be checked.
     * @returns {boolean} True if the position is occupied by a piece, False otherwise.
     */
    isOccupied(posString) {
        var coords = this.coordsToIndex(posString);
        return this.cells[coords[0]][coords[1]].pieceColor == color.EMPTY;
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
     * Checks if the board has reached a terminal state.
     * 
     * @returns {number} A number indicating the board's state.
     * 0 represents draw, -1 represents black's win, 1 represents
     * white's win, and 2 for none of the above.
     */

    checkWinner() {
        return this.engine.checkWinner();
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
        for (var i = 0; i < this.boardWidth; i++) {
            for (var j = 0; j < this.boardWidth; j++) {
                var pieceColor = this.cells[i][j].pieceColor;
                switch(pieceColor) {
                    case color.EMPTY:
                        process.stdout.write("| ");
                        break;
                    case color.WHITE:
                        process.stdout.write("|O");
                        break;
                    case color.BLACK:
                        process.stdout.write("|X");
                        break;
                }
            }
            process.stdout.write("|\n");
        }
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