import React from 'react'
import { useState } from 'react'
import {useChatContext, Channel} from 'stream-chat-react'
import Game from './Game'
import CustomInput from './CustomInput'

// Create game and wait the opponent to join
function JoinGame() {
    const [rivalUsername, setRivalUsername] = useState('')
    const { client } = useChatContext()

    // For holding the channel
    const [channel, setChannel] = useState(null)

    //create a channel
    const createChannel = async () => {
        // Wait for rival response
        const response = await client.queryUsers({
            name: {$eq: rivalUsername}
        })
        if (response.users.length === 0){
            alert("User not found")
            return 
        }

        // If rival exists, create a channel between both users
        const newChannel = await client.channel('messaging', {
            members: [client.userID, response.users[0].id],
            })
        // Listening to the channel
        await newChannel.watch()
        setChannel(newChannel)
    }
    return (
        <>
        {channel ? ( 
            // If channel is created, render the game
            <Channel channel={channel} Input = {CustomInput}>
                <Game channel = {channel} setChannel={setChannel}/>
            </Channel>  
        ) : (
            <div className='joinGame'>
                <h4>Create Game</h4>
                <input 
                placeholder="Username of the rival..."
                onChange = {(event) => {
                    setRivalUsername(event.target.value)
                }}
            />
            <button onClick={createChannel}>Join/ Start Game</button>
            </div>
        )}
        </>
    )
}

export default JoinGame

/*
TODO

*/ 
