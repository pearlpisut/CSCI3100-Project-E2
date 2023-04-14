import React, { useState } from "react";
import Cookies from 'universal-cookie'
import { useNavigate } from "react-router-dom";

export default function LoginForm() {

    const navigate = useNavigate(); 
    const routeChange = () =>{ 
        navigate("/home", { replace: true });
    }

    const cookies = new Cookies()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    
    function login(){
        fetch("http://localhost:2901/login", {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(!res.validated){
                navigate("/login", { replace: true })
                alert(res.message)
                return false
            }
            else{
                alert('Logged-in successfully')
                cookies.set('user', res)
                cookies.set('loggedin', true)
                // setIsAuth(true)
                routeChange()
                return true
            }
        })
    
    }

    return (
        <div className="ls-form-container form">
            {/* <form action="/" method="post"> */}
                <input type="text" placeholder="Username" name="username" 
                onChange = {e => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" name="password" 
                onChange = {e => setPassword(e.target.value)}/>
                <div className="back-to-login" onClick={() => {
                    login()
                    }}>Login</div>
            {/* </form> */}
        </div>
    );
}