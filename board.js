const color = {
    EMPTY: 0,
    BLACK: -1,
    WHITE: 1
}
Object.freeze(color);

class Cell {
    pieceColor = color.EMPTY; 
    turn = 0;
}

export class Board {
    boardWidth;
    currentPlayer; // color of the current player (BLACK or WHITE)
    turn; 
    cells; // array of cells in the board
    passCount; // number of passes made by each player

    constructor(boardWidth) {
        
    }
    
    doMove(posString) {
        
    }

    undoMove() {

    }

    nextBestMove() {

    }

    pass() {

    }

    swapPlayers() {
        
    }

    // Helper functions
    isOccupied(posString) {

    }

    checkOpen3(posString) {

    }

    checkOpen4(posString) {

    }

    // Utilities
    stringToIndex(posString) {

    }

    coordsToIndex(xCoord, yCoord) {

    }

    invertColor(pieceColor) {
        
    }

    printBoard() {
        
    }
}