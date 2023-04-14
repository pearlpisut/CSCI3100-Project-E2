import React, {useState} from 'react'
import Axios from 'axios'
import Cookies from "universal-cookie";
import NavLink from "../components/NavLink";

function SignUp({setIsAuth}){
    const cookies = new Cookies()
    const [user, setUser] = useState(null)

    // If the input is correct, send a request to signup the user to stream, set all the cookies
    const signUp = () => {
        Axios.post("http://localhost:2901/signup", user).then(res => {
            const{token, userId, username, hashedPassword} = res.data
            // Connect user front end to stream API
            cookies.set("token", token)
            cookies.set("userId", userId)
            //cookies.set("firstName", firstName)
            //cookies.set("lastName", lastName)
            cookies.set("username", username)
            cookies.set("hashedPassword", hashedPassword)
            setIsAuth(true)
        })

    }

    return(
        <div className = "Signup">
            
            <label>Create a game room</label>
            {/*
            <input
                placeholder='First Name'
                onChange = {(event) => 
                    setUser({...user, firstName: event.target.value})}
            />
            <input
                placeholder='Last name'
                onChange = {(event) => 
                    setUser({...user, lastName: event.target.value})}
            />*/}
            <input
                placeholder='Username'
                onChange = {(event) => 
                    setUser({...user, username: event.target.value})}
            />
            <input
                placeholder='Password'
                type= 'password'
                onChange = {(event) => 
                    setUser({...user, password: event.target.value})}
            />
            <button onClick={signUp}>Start a game room </button>
            <NavLink className = "choose_game" url="/choose_game" text="Back to Chose Game" />
        </div>
    )
}
export default SignUp