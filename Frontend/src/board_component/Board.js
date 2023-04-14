import React, {useEffect, useState} from 'react'
import Square from './Square'
import {useChannelStateContext, useChatContext} from 'stream-chat-react'
import {New_Board} from "../board_logic/New_Board"

var new_board = new New_Board(1)
new_board.startGame();
function Board({result, setResult}) {
    const [board, setBoard] = useState(
        ["","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","","",
        "","","","","","","","","","","","","","","","","","",""])

        const [player, setPlayer] = useState("X")
        const [turn, setTurn] = useState("X")

        const {channel} = useChannelStateContext()
        const {client} = useChatContext() 

        

        //Get Username (For jsx)
        //const [playerName, setPlayerName] = useState('');

        // Check if win
        useEffect(() => {      
            if (new_board.checkWinner() == 1) {
                new_board.resetBoard()
                setResult({
                    winner: "O",
                    state: "won"
                })
            } else if (new_board.checkWinner() == -1) {
                new_board.resetBoard()
                setResult({
                    winner: "X",
                    state: "won"
                })
            }
            else{
                console.log("No winner yet")
            }
            checkIfTie()
        }, [board])
    
        const chooseSquare = async (square) => {
            console.log(square)
            // Change player turno

            if (turn === player && board[square] === "") {

                // Convert to Thant syntax:
                var row = 19 - Math.floor(square / 19);
                var col = square % 19;
                col =  (col + 10).toString(36).toUpperCase();
                var position = col + row.toString()

                console.log(position)
                // Passing move to the engine
                new_board.doMove(position);
                console.log(new_board.exportBoardData().boardArray)
                console.log(new_board.engine.moveHistory)
                // End Thant syntax

                // Switch Player
                setTurn(player === "X" ? "O" : "X");

                await channel.sendEvent({
                    type: "game-move",
                    data: {square, player}
                })
    
                setBoard(board.map((val, id) => {
                        if (id === square && val === "") {
                        return player;
                    }
                    return val;
                }))
            }
        }
    
        // Check if win
        /*
        const checkWin = () => {
            Patterns.forEach((currPattern) => {
                const firstPlayer = board[currPattern[0]];
                if (firstPlayer === "") return;
                let foundWinningPattern = true;
                // loop pattern, check if it can win or not
                currPattern.forEach((id) => {
                    if (board[id] !== firstPlayer) {
                        foundWinningPattern = false;
                    }
                })
                if (foundWinningPattern) {
                    setResult({
                        winner: board[currPattern[0]],
                        state: "won"})
                }
            })
        }*/
    
        // Check if it is tie
        const checkIfTie = () => {
            let filled = true;
            // Check does the board already filled
            board.forEach((square) => {
                if (square === "") {
                    filled = false;
                }
            })
            if (filled) {
                setResult({
                    winner: "none",
                    state: "tie"
                })
            }
            // It is completely filled
            if (filled){
                setResult({
                    winner: "none", 
                    state: "tie"})
            }
        }
    
        // Also make response to also self player
        channel.on((event) => {
            if (event.type === "game-move" && event.user.id !== client.userID) {

                // Convert to Thant syntax:
                var row = 19 - Math.floor(event.data.square / 19);
                var col = event.data.square % 19;
                col =  (col + 10).toString(36).toUpperCase();
                var position = col + row.toString()
                // Passing move to the engine
                new_board.doMove(position);

                console.log(position)

                // Swap player
                const currentPlayer = event.data.player === "X" ? "O" : "X";
                setPlayer(currentPlayer)
                setTurn(currentPlayer)
    
                setBoard(board.map((val, id) => {
                    if (id === event.data.square && val === "") {
                        return event.data.player;
                    }
                    return val;
                }))
        }
    })
    
    //Retract_move
    const retractMove = async () => {
        console.log("Retracting move --> sender")
        await channel.sendEvent({
                type: "retract-move",
        })
        
    }
    channel.on((event) => {
        if (event.type === "retract-move" && event.user.id !== client.userID) {
            console.log("Retracting move --> receiver")
            let retract = prompt("Opponent request to retract move? (Y/N)", "Y/N")
            if (retract === "Y"){
                console.log("Retracting move --> accept")            
                // Retract move (useState)
                var movehistory = new_board.engine.moveHistory
                var temp = movehistory[movehistory.length - 1]
                var remove_index = board[temp[0]]

                 // Retract move (board class)
                 new_board.undoMove()
            }
            else{
                console.log("Retracting move --> reject")
            }
        }
    })

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
    <div className = "board">
        <div className="meta-container">
            <div className="time-container">
                <div>Start Time: {startTime.toLocaleTimeString('en-GB')}</div>
                <div>'s Turn</div>
            </div>
            <div className="game-info-container">
                <div>Time Elapsed: {formatTime(seconds)}</div>
                <div>Stone Type: {turn}</div>
            </div>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(0);}} val={board[0]} class_name="t-l corner" />
            <Square chooseSquare = {() => {chooseSquare(1);}} val={board[1]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(2);}} val={board[2]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(3);}} val={board[3]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(4);}} val={board[4]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(5);}} val={board[5]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(6);}} val={board[6]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(7);}} val={board[7]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(8);}} val={board[8]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(9);}} val={board[9]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(10);}} val={board[10]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(11);}} val={board[11]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(12);}} val={board[12]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(13);}} val={board[13]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(14);}} val={board[14]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(15);}} val={board[15]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(16);}} val={board[16]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(17);}} val={board[17]} class_name="top edge"/>
            <Square chooseSquare = {() => {chooseSquare(18);}} val={board[18]} class_name="t-r corner"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(19);}} val={board[19]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(20);}} val={board[20]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(21);}} val={board[21]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(22);}} val={board[22]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(23);}} val={board[23]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(24);}} val={board[24]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(25);}} val={board[25]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(26);}} val={board[26]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(27);}} val={board[27]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(28);}} val={board[28]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(29);}} val={board[29]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(30);}} val={board[30]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(31);}} val={board[31]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(32);}} val={board[32]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(33);}} val={board[33]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(34);}} val={board[34]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(35);}} val={board[35]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(36);}} val={board[36]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(37);}} val={board[37]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(38);}} val={board[38]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(39);}} val={board[39]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(40);}} val={board[40]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(41);}} val={board[41]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(42);}} val={board[42]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(43);}} val={board[43]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(44);}} val={board[44]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(45);}} val={board[45]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(46);}} val={board[46]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(47);}} val={board[47]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(48);}} val={board[48]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(49);}} val={board[49]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(50);}} val={board[50]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(51);}} val={board[51]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(52);}} val={board[52]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(53);}} val={board[53]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(54);}} val={board[54]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(55);}} val={board[55]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(56);}} val={board[56]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(57);}} val={board[57]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(58);}} val={board[58]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(59);}} val={board[59]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(60);}} val={board[60]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(61);}} val={board[61]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(62);}} val={board[62]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(63);}} val={board[63]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(64);}} val={board[64]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(65);}} val={board[65]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(66);}} val={board[66]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(67);}} val={board[67]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(68);}} val={board[68]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(69);}} val={board[69]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(70);}} val={board[70]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(71);}} val={board[71]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(72);}} val={board[72]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(73);}} val={board[73]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(74);}} val={board[74]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(75);}} val={board[75]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(76);}} val={board[76]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(77);}} val={board[77]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(78);}} val={board[78]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(79);}} val={board[79]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(80);}} val={board[80]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(81);}} val={board[81]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(82);}} val={board[82]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(83);}} val={board[83]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(84);}} val={board[84]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(85);}} val={board[85]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(86);}} val={board[86]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(87);}} val={board[87]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(88);}} val={board[88]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(89);}} val={board[89]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(90);}} val={board[90]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(91);}} val={board[91]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(92);}} val={board[92]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(93);}} val={board[93]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(94);}} val={board[94]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(95);}} val={board[95]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(96);}} val={board[96]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(97);}} val={board[97]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(98);}} val={board[98]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(99);}} val={board[99]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(100);}} val={board[100]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(101);}} val={board[101]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(102);}} val={board[102]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(103);}} val={board[103]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(104);}} val={board[104]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(105);}} val={board[105]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(106);}} val={board[106]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(107);}} val={board[107]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(108);}} val={board[108]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(109);}} val={board[109]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(110);}} val={board[110]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(111);}} val={board[111]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(112);}} val={board[112]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(113);}} val={board[113]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(114);}} val={board[114]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(115);}} val={board[115]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(116);}} val={board[116]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(117);}} val={board[117]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(118);}} val={board[118]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(119);}} val={board[119]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(120);}} val={board[120]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(121);}} val={board[121]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(122);}} val={board[122]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(123);}} val={board[123]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(124);}} val={board[124]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(125);}} val={board[125]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(126);}} val={board[126]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(127);}} val={board[127]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(128);}} val={board[128]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(129);}} val={board[129]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(130);}} val={board[130]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(131);}} val={board[131]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(132);}} val={board[132]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(133);}} val={board[133]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(134);}} val={board[134]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(135);}} val={board[135]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(136);}} val={board[136]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(137);}} val={board[137]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(138);}} val={board[138]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(139);}} val={board[139]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(140);}} val={board[140]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(141);}} val={board[141]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(142);}} val={board[142]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(143);}} val={board[143]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(144);}} val={board[144]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(145);}} val={board[145]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(146);}} val={board[146]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(147);}} val={board[147]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(148);}} val={board[148]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(149);}} val={board[149]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(150);}} val={board[150]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(151);}} val={board[151]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(152);}} val={board[152]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(153);}} val={board[153]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(154);}} val={board[154]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(155);}} val={board[155]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(156);}} val={board[156]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(157);}} val={board[157]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(158);}} val={board[158]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(159);}} val={board[159]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(160);}} val={board[160]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(161);}} val={board[161]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(162);}} val={board[162]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(163);}} val={board[163]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(164);}} val={board[164]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(165);}} val={board[165]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(166);}} val={board[166]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(167);}} val={board[167]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(168);}} val={board[168]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(169);}} val={board[169]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(170);}} val={board[170]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(171);}} val={board[171]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(172);}} val={board[172]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(173);}} val={board[173]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(174);}} val={board[174]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(175);}} val={board[175]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(176);}} val={board[176]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(177);}} val={board[177]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(178);}} val={board[178]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(179);}} val={board[179]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(180);}} val={board[180]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(181);}} val={board[181]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(182);}} val={board[182]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(183);}} val={board[183]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(184);}} val={board[184]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(185);}} val={board[185]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(186);}} val={board[186]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(187);}} val={board[187]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(188);}} val={board[188]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(189);}} val={board[189]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(190);}} val={board[190]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(191);}} val={board[191]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(192);}} val={board[192]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(193);}} val={board[193]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(194);}} val={board[194]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(195);}} val={board[195]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(196);}} val={board[196]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(197);}} val={board[197]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(198);}} val={board[198]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(199);}} val={board[199]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(200);}} val={board[200]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(201);}} val={board[201]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(202);}} val={board[202]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(203);}} val={board[203]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(204);}} val={board[204]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(205);}} val={board[205]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(206);}} val={board[206]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(207);}} val={board[207]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(208);}} val={board[208]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(209);}} val={board[209]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(210);}} val={board[210]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(211);}} val={board[211]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(212);}} val={board[212]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(213);}} val={board[213]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(214);}} val={board[214]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(215);}} val={board[215]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(216);}} val={board[216]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(217);}} val={board[217]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(218);}} val={board[218]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(219);}} val={board[219]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(220);}} val={board[220]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(221);}} val={board[221]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(222);}} val={board[222]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(223);}} val={board[223]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(224);}} val={board[224]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(225);}} val={board[225]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(226);}} val={board[226]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(227);}} val={board[227]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(228);}} val={board[228]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(229);}} val={board[229]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(230);}} val={board[230]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(231);}} val={board[231]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(232);}} val={board[232]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(233);}} val={board[233]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(234);}} val={board[234]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(235);}} val={board[235]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(236);}} val={board[236]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(237);}} val={board[237]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(238);}} val={board[238]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(239);}} val={board[239]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(240);}} val={board[240]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(241);}} val={board[241]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(242);}} val={board[242]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(243);}} val={board[243]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(244);}} val={board[244]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(245);}} val={board[245]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(246);}} val={board[246]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(247);}} val={board[247]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(248);}} val={board[248]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(249);}} val={board[249]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(250);}} val={board[250]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(251);}} val={board[251]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(252);}} val={board[252]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(253);}} val={board[253]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(254);}} val={board[254]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(255);}} val={board[255]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(256);}} val={board[256]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(257);}} val={board[257]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(258);}} val={board[258]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(259);}} val={board[259]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(260);}} val={board[260]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(261);}} val={board[261]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(262);}} val={board[262]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(263);}} val={board[263]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(264);}} val={board[264]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(265);}} val={board[265]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(266);}} val={board[266]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(267);}} val={board[267]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(268);}} val={board[268]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(269);}} val={board[269]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(270);}} val={board[270]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(271);}} val={board[271]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(272);}} val={board[272]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(273);}} val={board[273]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(274);}} val={board[274]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(275);}} val={board[275]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(276);}} val={board[276]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(277);}} val={board[277]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(278);}} val={board[278]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(279);}} val={board[279]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(280);}} val={board[280]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(281);}} val={board[281]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(282);}} val={board[282]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(283);}} val={board[283]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(284);}} val={board[284]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(285);}} val={board[285]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(286);}} val={board[286]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(287);}} val={board[287]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(288);}} val={board[288]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(289);}} val={board[289]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(290);}} val={board[290]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(291);}} val={board[291]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(292);}} val={board[292]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(293);}} val={board[293]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(294);}} val={board[294]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(295);}} val={board[295]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(296);}} val={board[296]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(297);}} val={board[297]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(298);}} val={board[298]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(299);}} val={board[299]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(300);}} val={board[300]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(301);}} val={board[301]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(302);}} val={board[302]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(303);}} val={board[303]} class_name="right edge"/>

        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(304);}} val={board[304]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(305);}} val={board[305]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(306);}} val={board[306]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(307);}} val={board[307]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(308);}} val={board[308]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(309);}} val={board[309]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(310);}} val={board[310]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(311);}} val={board[311]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(312);}} val={board[312]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(313);}} val={board[313]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(314);}} val={board[314]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(315);}} val={board[315]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(316);}} val={board[316]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(317);}} val={board[317]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(318);}} val={board[318]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(319);}} val={board[319]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(320);}} val={board[320]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(321);}} val={board[321]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(322);}} val={board[322]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(323);}} val={board[323]} class_name="left edge"/>
            <Square chooseSquare = {() => {chooseSquare(324);}} val={board[324]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(325);}} val={board[325]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(326);}} val={board[326]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(327);}} val={board[327]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(328);}} val={board[328]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(329);}} val={board[329]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(330);}} val={board[330]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(331);}} val={board[331]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(332);}} val={board[332]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(333);}} val={board[333]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(334);}} val={board[334]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(335);}} val={board[335]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(336);}} val={board[336]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(337);}} val={board[337]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(338);}} val={board[338]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(339);}} val={board[339]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(340);}} val={board[340]} class_name="cross"/>
            <Square chooseSquare = {() => {chooseSquare(341);}} val={board[341]} class_name="right edge"/>
        </div>
        <div className = "row"> 
            <Square chooseSquare = {() => {chooseSquare(342);}} val={board[342]} class_name="b-l corner"/>
            <Square chooseSquare = {() => {chooseSquare(343);}} val={board[343]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(344);}} val={board[344]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(345);}} val={board[345]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(346);}} val={board[346]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(347);}} val={board[347]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(348);}} val={board[348]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(349);}} val={board[349]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(350);}} val={board[350]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(351);}} val={board[351]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(352);}} val={board[352]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(353);}} val={board[353]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(354);}} val={board[354]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(355);}} val={board[355]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(356);}} val={board[356]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(357);}} val={board[357]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(358);}} val={board[358]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(359);}} val={board[359]} class_name="bot edge"/>
            <Square chooseSquare = {() => {chooseSquare(360);}} val={board[360]} class_name="b-r corner"/>
        </div>
        <div>
            <button onClick = {retractMove}>Request Retraction</button> 
        </div>
    </div>
    )
}


export default Board