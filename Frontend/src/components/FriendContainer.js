import Cookies from 'universal-cookie'
import React, {useEffect, useState} from "react"

export default function Friend(props) {
    const cookies = new Cookies()
    const user = cookies.get('user')
    console.log('props == ', props)
    function handleRequest(e, response){
        fetch(`http://localhost:2901/user/friend/accept/${response}/${props.id}`, {
            'method': 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
        let setFriendchange = props.setFriendchange
        setFriendchange(!props.friendchange)
        e.disabled = true
        if(response =='yes') alert('Friend request accepted')
        if(response == 'no') alert('Friend request declined')
        window.location.reload();
    }

    if (props.status === "Online") {
        return (
            <div class="friend-container">
                <div>
                    <div class="avatar online"></div>
                    <p class="username">{props.username}</p>
                </div>
                <div class="status">
                    <p>{props.status}</p>
                </div>
                <div class="btn-functions">
                    <button class="invite">Invite to game</button>
                </div>
            </div>
        );
    }
    else if(props.status == 'friend' || props.status == 'outgoing friend req' || props.status == 'incoming friend req') 
    {
        return (
            <div class="friend-container">
                <div>
                    <div class="avatar offline"><i class="fa-solid fa-cat"></i></div>
                    <p class="username">{props.username}</p>
                </div>
                <div class="status">
                    <p>{props.status}</p>
                </div>
                <div class="btn-functions">
                    {props.status == "incoming friend req"?
                    <>
                    <button onClick={(e) => handleRequest(e, 'yes')}>accept</button>
                    <button onClick={(e) => handleRequest(e, 'no')}>decline</button>
                    </>:
                    null}
                </div>
            </div>
        );
    }
}