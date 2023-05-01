import React, {useState} from 'react'
import Board from './Board'
import {Window, MessageList, MessageInput} from 'stream-chat-react'
import "./Chat.scss"

function Game({channel, setChannel}) {
    const [playersJoined, setPlayersJoined] = useState(
        channel.state.watcher_count === 2
        )

    const [result, setResult] = useState({winner: "none", state: "none"})

    // Listen to the channel
    // Both side channel on AT SAME TIME when both entered the opponent name
    channel.on('user.watching.start', (event) => {
        setPlayersJoined(event.watcher_count === 2)
    })
    if(!playersJoined){
        return <div>Waiting for other player to join...</div>
    }

    return ( 
    <div className = "gameContainer">
        <Board result={result} setResult={setResult}/>
        <Window>
            <MessageList 
                disableDateSeparator 
                closeReactionSelectorOnClick 
                hideDeletedMessages 
                messageActions={["react"]}/>
            <MessageInput noFiles/>
        </Window>
        <button className="exit-game" onClick = {async () => {
            await channel.stopWatching()
            setChannel(null)
        }}> Leave Game
        </button>
        {result.state === "won" && <div className="endgame-msg"> {result.winner} Won the Game </div> }
        {result.state === "tie" && <div className="endgame-msg">  Tie Game </div> } 
    </div> 
    )
}

//export {new_board}
export default Game
