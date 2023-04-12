import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {

    const navigate = useNavigate(); 
    const routeChange = () =>{ 
        navigate("/login", { replace: true });
    }

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function register(){
        fetch("http://localhost:2901/register", {
            'method': 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
    })
    .then(res => res.json())
    .then(res => {
        if(res.status == 'ok'){
            alert('successfully registered new user')
            routeChange()
        } 
        else alert('registration failed')
    })
    }

    return (
        <div class="ls-form-container form">
            {/* <form action="/signup" method = "post"> */}
                <input type="text" placeholder="Enter Username" name="username" required 
                onChange = {e => setUsername(e.target.value)}/>
                <input type="password" placeholder="Enter Password" name="password" required 
                onChange = {e => setPassword(e.target.value)}/>
                <div className="back-to-login" onClick={() => {
                    register()
                }}>Register</div>
            {/* </form> */}
        </div>
    );
}