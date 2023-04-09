const BOARD_WIDTH = 19;

/**
 * This class represents the patterns which are checked
 * when the board is evaluated.
 */
export class Pattern {
    present;
    absent;
    width;
    height;
    weight;
    id;
    bitCount;
    static row4Patterns = new Array(4);
    static row5Patterns = new Array(4);
    static openings = [
        [],
        ['J10'],
        ['I11', 'J11', 'K11',
         'I10',        'K10',
         'I9' , 'J9' , 'K9' ],
        ['H12', 'I12', 'J12', 'K12', 'L12',
         'H11',                      'L11',
         'H10',                      'L10',
         'H9' ,                      'L9' ,
         'H8' , 'I8' , 'J8' , 'K8' , 'L8' ]
    ]

    /**
     * Creates a pattern.
     * 
     * @param {BigInt} present These bits should be present among the player's pieces.
     * @param {BigInt} absent These bits must be absent among the opponent's pieces.
     * @param {number} width An integer representing the width of the pattern
     * @param {number} height An integer representing the height of the pattern
     * @param {number} weight An integer representing the importance of the pattern
     * @param {number} bitCount An integer representing the number of bits in the present
     * OR absent
     * @param {number} id An integer indicating whether the pattern is in one of the
     * four main orientation. 0 represents horizontal, 1 represents vertical and 2 and 3
     * represent 2 different diagonals.
     */
    constructor(present, absent, width, height, weight, bitCount, id) {
        this.present = present;
        this.absent = absent;
        this.width = width;
        this.height = height;
        this.weight = weight;
        this.bitCount = bitCount;
        this.id = id;
    }
}

/**
 * Initializes the static properties of the Pattern class.
 */
function initializePatterns() {
    var row4 = {
        present: [0n, 0n, 0n, 0n],
        absent: [0n, 0n, 0n, 0n],
        height: [1, 6, 6, 6],
        width: [6, 1, 6, 6],
        weight: [0, 0.1, 0.5, 14, 30]
    }

    var row5 = {
        present: [0n, 0n, 0n, 0n],
        absent: [0n, 0n, 0n, 0n],
        height: [1, 5, 5, 5],
        width: [5, 1, 5, 5],
        weight: [0, 0.1, 0.5, 12, 30, Infinity]
    }
    for (var i = 1; i < 5; i++) {
        row4.present[0] = row4.present[0] | (1n << BigInt(i));
        row4.present[1] = row4.present[1] | (1n << BigInt(i * BOARD_WIDTH));
        row4.present[2] = row4.present[2] | (BigInt("0b100000000000000000000") << BigInt((i - 1) * (BOARD_WIDTH + 1)));
        row4.present[3] = row4.present[3] | (BigInt("0b100000000000000000000000") << BigInt((i - 1) * (BOARD_WIDTH - 1)));
    }

    for (var i = 0; i < 6; i++) {
        row4.absent[0] = row4.absent[0] | (1n << BigInt(i));
        row4.absent[1] = row4.absent[1] | (1n << BigInt(i * BOARD_WIDTH));
        row4.absent[2] = row4.absent[2] | (1n << BigInt(i * (BOARD_WIDTH + 1)));
        row4.absent[3] = row4.absent[3] | (BigInt("0b100000") << BigInt(i * (BOARD_WIDTH - 1)));
    }

    for (var i = 0; i < 5; i++) {
        row5.present[0] = row5.present[0] | (1n << BigInt(i));
        row5.present[1] = row5.present[1] | (1n << BigInt(i * BOARD_WIDTH));
        row5.present[2] = row5.present[2] | (1n << BigInt(i * (BOARD_WIDTH + 1)));
        row5.present[3] = row5.present[3] | (BigInt("0b10000") << BigInt(i * (BOARD_WIDTH - 1)));
    }

    row5.absent = row5.present;
    
    for (var i = 0; i < 4; i++) {
        Pattern.row4Patterns[i] = new Pattern(row4.present[i], row4.absent[i], row4.width[i], row4.height[i], row4.weight, 6, i);
        Pattern.row5Patterns[i] = new Pattern(row5.present[i], row5.absent[i], row5.width[i], row5.height[i], row5.weight, 5, i);
    }
}

initializePatterns();

/**
 * This is the main engine for the game.
 */
export class Engine {
    black;
    white;
    blackScore; 
    whiteScore; 
    turn;
    moveHistory = [];

    /**
     * Initializes the game engine.
     */
    constructor() {
        this.black = 0n;
        this.white = 0n;
        this.blackScore = 0;
        this.whiteScore = 0;
        this.eval = new Evaluator(this);
        this.turn = 1;
    }

    /**
     * Flips a bit in the player's bitboard at index num.
     * @param {number} num The index of the bit to be flipped
     * @param {number} player Player number: 1 for white and -1 for black
     */
    flipBit(num, player) {
        player == 1 ? (this.white = this.white ^ (1n << BigInt(num))) : (this.black = this.black ^ (1n << BigInt(num)));
    }

    /**
     * Places a piece in the player's bitboard at index num. 
     * The difference between this and flipBit is that this also
     * updates other relevant information, such as the scores 
     * and turn.
     * @param {number} num The index of the position to be placed
     * @param {number} player Player number: 1 for white and -1 for black
     */
    doMoveInt(num, player) {
        this.flipBit(num, player);
        this.moveHistory.push([num, player]);
        var score = this.eval.evaluateBoard(this.whiteScore, this.blackScore, num, player);
        this.whiteScore = score[0];
        this.blackScore = score[1];
        this.turn++;
    }

    /**
     * A variant of doMoveInt which accepts a position string as an input.
     * @param {string} posString The position string
     * @param {number} player Player number: 1 for white and -1 for black
     */
    doMove(posString, player) {
        var move = Utils.stringToInt(posString);
        this.doMoveInt(move, player);
    }

    /**
     * Places the player's pieces at the positions specified by an integer array.
     * @param {Array<number>} numArr Array of position integers
     * @param {number} player Player number: 1 for white and -1 for black
     */
    doMovesInt(numArr, player) {
        for (var i = 0; i < numArr.length; i++) {
            this.doMoveInt(numArr[i], player);
        }
    }

    /**
     * Places the player's pieces at the positions specified by a string array.
     * @param {Array<string>} posStringArr Array of position strings
     * @param {number} player Player number: 1 for white and -1 for black
     */
    doMoves(posStringArr, player) {
        for (var i = 0; i < posStringArr.length; i++) {
            this.doMove(posStringArr[i], player);
        }
    }

    /**
     * Undo the previous move.
     */
    undoMove() {
        var lastTurn = this.moveHistory.pop();
        var lastMove = lastTurn[0];
        var lastPlayer = lastTurn[1];
        this.flipBit(lastMove, lastPlayer);
        var score = this.eval.evaluateBoard(this.whiteScore, this.blackScore, lastMove, lastPlayer);
        this.whiteScore = score[0];
        this.blackScore = score[1];
        this.turn--;
    }
    
    /**
     * Generates the best move according to the evaluator of the engine.
     * @param {number} p Player number: 1 for white and -1 for black
     * @returns {Array<number>} An array consisting of the best move found and the score of this move
     */
    generateBestMove(p) {
        if (this.turn <= 3) {
            var moveCount = [0, 1, 8, 16];
            var moveIndex = Utils.getRandomInt(moveCount[this.turn]);
            var bestMove = Utils.stringToInt(Pattern.openings[this.turn][moveIndex]);
        } else {
            var moveList = this.generateMoves();
            var maxScore = -Infinity;
            var bestMove = moveList[0];
            for (var i = 0; i < moveList.length; i++) {
                this.flipBit(moveList[i], p);
                var score = this.eval.evaluateBoard(this.whiteScore, this.blackScore, moveList[i], p);
                (p == 1) ? score = score[0] : score = -score[1];
                if (maxScore < score) {
                    maxScore = score;
                    bestMove = moveList[i];
                }
                this.flipBit(moveList[i], p);
            }
        }
        return (p == 1) ? [bestMove, this.whiteScore] : [bestMove, this.blackScore];
    }

    doBestMove2(p) {
        if (this.turn <= 3) {
            var moveCount = [0, 1, 8, 16];
            var moveIndex = Utils.getRandomInt(moveCount[this.turn]);
            var move = Utils.stringToInt(Pattern.openings[this.turn][moveIndex]);
            this.doMoveInt(move, p);
            
            return (p == 1) ? [move, this.whiteScore] : [move, this.blackScore];
        } else {
            if (p == 1) {
                var whiteMoves = this.generateMoves();
                var bestWhiteMove = whiteMoves[0];
                var bestWhiteScore = -Infinity;
                for (var i = 0; i < whiteMoves.length; i++) {
                    this.doMoveInt(whiteMoves[i], 1);
                    var blackMoves = this.generateMoves();
                    var bestBlackScore = +Infinity;
                    for (var j = 0; j < blackMoves.length; j++) {
                        this.doMoveInt(blackMoves[j], -1);
                        if (this.blackScore <= bestBlackScore) {
                            bestBlackScore = this.blackScore;
                        }
                        this.undoMove();
                        if (bestBlackScore <= bestWhiteScore) {
                            break;
                        }
                    }
                    this.undoMove();
                    if (bestBlackScore >= bestWhiteScore) {
                        bestWhiteScore = bestBlackScore;
                        bestWhiteMove = whiteMoves[i];
                    }
                }
                this.doMoveInt(bestWhiteMove, p);
                return [bestWhiteMove, bestWhiteScore]
            } else {
                var blackMoves = this.generateMoves();
                var bestBlackMove = blackMoves[0];
                var bestBlackScore = +Infinity;
                for (var i = 0; i < blackMoves.length; i++) {
                    this.doMoveInt(blackMoves[i], -1);
                    var whiteMoves = this.generateMoves();
                    var bestWhiteScore = -Infinity;
                    for (var j = 0; j < whiteMoves.length; j++) {
                        this.doMoveInt(whiteMoves[j], 1);
                        if (this.whiteScore >= bestWhiteScore) {
                            bestWhiteScore = this.whiteScore;
                        }
                        this.undoMove();
                        if (bestWhiteScore >= bestBlackScore) {
                            break;
                        }
                    }
                    this.undoMove();
                    if (bestWhiteScore <= bestBlackScore) {
                        bestBlackScore = bestWhiteScore;
                        bestBlackMove = blackMoves[i];
                    }
                }
                this.doMoveInt(bestBlackMove, p);
                return [bestBlackMove, bestBlackScore]
            }
        }
    }

    /**
     * Generates a list of currently available moves.
     * @returns {Array<number>} An array of currently available moves
     */
    generateMoves() {
        var occupied = this.black | this.white;
        var moves = [];
        for (var i = 0; i < BOARD_WIDTH * BOARD_WIDTH; i++) {
            var currentBit = occupied & 1n;
            if (currentBit == 0n) {moves.push(i)};
            occupied = occupied >> 1n;
        }
        return moves;
    }

    /**
     * Prints the board on the console. Used for debugging only.
     */

    printBoard() {
        var colorRed = "\x1b[31m";
        var colorWhite = "\x1b[37m";
        var colorDefault = "\x1b[0m";
        
        var black = this.black;
        var white = this.white;
        for (var i = 0; i < BOARD_WIDTH; i++) {
            var y = 19 - i;
            var space = y < 10 ? "  " : " ";
            process.stdout.write(colorWhite + y.toString() + space);
            for (var j = 0; j < BOARD_WIDTH; j++) {
                if ((black & 1n) == 1n) {
                    process.stdout.write(colorWhite + "|" + colorRed + "X");
                } else if ((white & 1n) == 1n) {
                    process.stdout.write(colorWhite + "|" + colorDefault + "O");
                } else {
                    process.stdout.write(colorWhite + "| ");
                }
                black = black >> 1n;
                white = white >> 1n;
            }
            process.stdout.write(colorWhite + "|\n");
        }
        process.stdout.write(space + " ");
        for (var j = 0; j < BOARD_WIDTH; j++) {
            process.stdout.write(colorWhite + " " + String.fromCharCode(j + 65));
        }
        process.stdout.write("\n" + colorDefault);
    }
}

/**
 * This class is used for evaluating the board in the Engine class.
 */
class Evaluator {
    engine;

    constructor(engine) {
        this.engine = engine;
    }

    /**
     * Checks a pattern and outputs the adjustment for the player's
     * current score.
     * 
     * @param {Pattern} pattern The pattern to be checked
     * @param {number} lastMove The last move done on the board
     * @param {number} lastPlayer The player who made the last move, 1 
     * for white and -1 for black
     * @returns {Array<number>} An array consisting of score adjustment for
     * the white player and that for the black player.
     */
    adjustPatternScores(pattern, lastMove, lastPlayer) {
        var weight = pattern.weight;
        var id = pattern.id;
        var bitCount = pattern.bitCount;

        var start;
        var iterateCount;
        var shift;

        var j = (lastMove) % BOARD_WIDTH;
        var i = (lastMove - j) / BOARD_WIDTH;

        var i1 = Math.max(i - bitCount + 1, 0);
        var i2 = Math.min(i + bitCount - 1, BOARD_WIDTH - 1);
        var j1 = Math.max(j - bitCount + 1, 0);
        var j2 = Math.min(j + bitCount - 1, BOARD_WIDTH - 1);

        switch(id) {
            case 0:
                start = Utils.CoordsToInt(i, j1);
                iterateCount = j2 - j1 - bitCount + 2;
                shift = BigInt(1);
                break;
            case 1:
                start = Utils.CoordsToInt(i1, j);
                iterateCount = i2 - i1 - bitCount + 2;
                shift = BigInt(BOARD_WIDTH);
                break;
            case 2:
                start = (i - i1 < j - j1) ? Utils.CoordsToInt(i1, j - i + i1) : Utils.CoordsToInt(i - j + j1, j1);
                var end = (i - i2 < j - j2) ? Utils.CoordsToInt(i - j + j2, j2) : Utils.CoordsToInt(i2, j - i + i2);
                var length = (end - start)/(BOARD_WIDTH + 1) + 1;
                iterateCount = length < bitCount ? 0 : length - bitCount + 1;
                shift = BigInt(BOARD_WIDTH + 1);
                break;
            case 3:
                var corner1 = (i + j < i1 + j2) ? [i1, i + j - i1] : [i + j - j2, j2];
                var corner2 = (i + j < i2 + j1) ? [i + j - j1, j1] : [i2, i + j - i2];
                start = Utils.CoordsToInt(corner1[0], corner1[1] - bitCount + 1);
                var length = corner1[1] - corner2[1] + 1;
                iterateCount = length < bitCount ? 0 : length - bitCount + 1;
                shift = BigInt(BOARD_WIDTH - 1);
                break;
        }

        this.engine.flipBit(lastMove, lastPlayer);
        var present = pattern.present << BigInt(start);
        var absent = pattern.absent << BigInt(start);
        var oldWhiteAdvantage = 0;
        var oldWhiteDisadvantage = 0;
        for (var k = 1; k <= iterateCount; k++) {
            if ((this.engine.black & absent) == 0n) {
                var closeness = Utils.hammingWeight(this.engine.white & present);
                var score = weight[closeness];
                oldWhiteAdvantage += score;
            }
            if ((this.engine.white & absent) == 0n) {
                var closeness = Utils.hammingWeight(this.engine.black & present);
                var score = weight[closeness];
                oldWhiteDisadvantage += score;
            }
            present = present << shift;
            absent = absent << shift;
        }
        
        this.engine.flipBit(lastMove, lastPlayer);
        var present = pattern.present << BigInt(start);
        var absent = pattern.absent << BigInt(start);
        var newWhiteAdvantage = 0;
        var newWhiteDisadvantage = 0;
        for (var k = 1; k <= iterateCount; k++) {
            if ((this.engine.black & absent) == 0n) {
                var closeness = Utils.hammingWeight(this.engine.white & present);
                var score = weight[closeness];
                newWhiteAdvantage += score;
            }
            if ((this.engine.white & absent) == 0n) {
                var closeness = Utils.hammingWeight(this.engine.black & present);
                var score = weight[closeness];
                newWhiteDisadvantage += score;
            }
            present = present << shift;
            absent = absent << shift;
        }

        var defense = 3.5;

        var whiteScoreAdjustment = (newWhiteAdvantage - defense * newWhiteDisadvantage) - (oldWhiteAdvantage - defense * oldWhiteDisadvantage);
        var blackScoreAdjustment = (newWhiteDisadvantage - defense * newWhiteAdvantage) - (oldWhiteDisadvantage - defense * oldWhiteAdvantage);

        return [whiteScoreAdjustment, -blackScoreAdjustment];
    }

    /**
     * Evaluates the board according to the static patterns in
     * the Pattern class.
     * 
     * @param {number} whiteScore Current score of the white player
     * @param {number} blackScore Current score of the black player
     * @param {number} lastMove The last move done on the board
     * @param {number} lastPlayer The player who made the last move,
     * 1 for white and -1 for black
     * @returns {Array<number>} An array consisting of updated scores
     * for the white and black players
     */
    evaluateBoard(whiteScore, blackScore, lastMove, lastPlayer) {
        var adjustments = [];
        var whiteScoreAdjustment = 0;
        var blackScoreAdjustment = 0;
        for (var i = 0; i < Pattern.row4Patterns.length; i++) {
            var adjustment = this.adjustPatternScores(Pattern.row4Patterns[i], lastMove, lastPlayer);
            whiteScoreAdjustment += adjustment[0];
            blackScoreAdjustment += adjustment[1];
            adjustments.push(adjustment[0]);
        }
        for (var i = 0; i < Pattern.row5Patterns.length; i++) {
            var adjustment = this.adjustPatternScores(Pattern.row5Patterns[i], lastMove, lastPlayer);
            whiteScoreAdjustment += adjustment[0];
            blackScoreAdjustment += adjustment[1];
            adjustments.push(adjustment[0]);
        }

        return [whiteScore + whiteScoreAdjustment, blackScore + blackScoreAdjustment];
    }

    /**
     * Checks if the board has reached a terminal state.
     * 
     * @returns {number} A number indicating the board's state.
     * 0 represents draw, -1 represents black's win, 1 represents
     * white's win, and 2 for none of the above.
     */
    checkWinner() {
        if (this.engine.turn == BOARD_WIDTH * BOARD_WIDTH + 1) {
            return 0;
        }
        if (this.engine.whiteScore == Infinity) {
            return 1;
        } else if (this.engine.whiteScore == -Infinity) {
            return -1;
        }
        return 2;
    }
}

export class Utils {
    static hammingWeight(num) {
        var count = 0;
        while (num != 0n) {
            count += Number(num & 1n)
            num = num >> 1n;
        }
        return count;
    }

    static intToString(num) {
        var i = String.fromCharCode(num % BOARD_WIDTH + 65);
        var j = 19 - ((num - (num % BOARD_WIDTH)) / BOARD_WIDTH);
        j = j.toString();
        return i + j;
    }

    static stringToInt(posString) {
        var j = posString.charCodeAt(0) - 65; 
        posString = posString.slice(1);
        var i = BOARD_WIDTH - parseInt(posString);
        return i * BOARD_WIDTH + j;
    }

    static CoordsToInt(i, j) {
        return i * BOARD_WIDTH + j;
    }

    static getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}