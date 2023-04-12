import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import './user_list.scss'

function Buttons(props) {
    const class_name = props.class;
    const text = props.text;
    // const onclick = props.onclick;
    return (
        <button className={class_name} onClick={onclick}>{text}</button>
    );
}

export default function UserContainer(props) {

    const class_name = props.class;
    // const user = props.user
    // const username = props.user.username;

    const cookies = new Cookies()
    const admin = cookies.get('user')
    const admin_username = admin.user.username
    const user = props.user
    // console.log('prop is ', props)

    function deleteUser(id){
        fetch(`http://localhost:2901/main/admin/delete/${id}`, {
            'method': 'DELETE',
            headers: {
                'Authorization': `Bearer ${admin.token}`
            }
        })
        console.log('delete btn clicked')
        // console.log('admin token: ', admin.us)
        let setHavechange = props.setHavechange
        setHavechange(new Date())
    }

    
    return (
        <div id='user-card'>
            <div className={class_name} id="user-card-sub">
                <div>
                    <div class="avatar"></div>
                    <p class="username">{user.username}</p>
                </div>
                <div class="status">
                </div>
                <div class="btn-functions">
                    {/* {props.buttons.map(e => <Buttons {...e}/>)} */}
                    <button className="delete" onClick={() => deleteUser(user._id)}>Delete</button>
                    {/* <button className="view-info">View info</button> */}
                </div>
            </div>
            <div className="all-info">
                <div>id: {user._id}</div>
                <div>rating: {user.rating}</div>
                <div>friends: {user.friends}</div>                
            </div>
        </div>
    );
}