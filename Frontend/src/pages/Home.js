import MainMenu from "../components/MainMenuButtons";
import NavLink from "../components/NavLink";
import Logo from '../components/Logo'
import "./css/Home.scss";
import Cookies from 'universal-cookie'
import React, {useEffect} from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const cookies = new Cookies()
    const user = cookies.get('user')    

    console.log('user is ', user)
    const navigate = useNavigate()
    useEffect(()=>{
        if(cookies.get('loggedin') == 'false'){
            navigate("/login", { replace: true })
            alert('You have already logged-out. Please log-in again.')
        }
    }, [])

    return (
        <>
            {/* The navbar on home is styled differently --> cannot use NavbarBuilder */}
            <div>
                <div class="home-navbar">
                    <NavLink className="homenav-link" url="/friend" text="Friends" />
                    {/* <NavLink className="homenav-link" url="/chat" text="Chat" /> */}
                    <NavLink className="homenav-link" url="/history" text="History" />
                    <NavLink className="homenav-logout" url="/logout" text="Log out" />
                </div>
                <br />
                <h1>Welcome [ <span style={{color: "#4c9900"}}>{user.user.username}</span> ]</h1>
                <Logo />
                <MainMenu userRole={user.type} />
            </div>
        </>
    );
}