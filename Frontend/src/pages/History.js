import NavbarBuilder from "../components/NavbarBuilder";
import GameRecord from "../components/GameRecord";
import "./css/GameRecord.scss";
import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import { useNavigate } from "react-router-dom"



export default function History() {
    {/* Require player's username (can fetch from db) to make comparisons in GameRecord.js */}
    const links = [
        {class: "nav-link", url: "/home", text: "Return to main menu"},
    ];
    const cookies = new Cookies()
    const user = cookies.get('user')

    console.log(user)
    const navigate = useNavigate()
    useEffect(()=>{
        if(cookies.get('loggedin') == 'false'){
            navigate("/login", { replace: true })
            alert('You have already logged-out. Please log-in again.')
        }
    }, [])

    const [allhist, setAllhist] = useState([])
    useEffect(() => {
      fetch(`http://localhost:2901/view/gamehist`, {
      'method': 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
    })
    .then(res => res.json())
    .then(res => {
        res = res.filter(e => e.black == user.user.username || e.white == user.user.username)
      // console.log('all gamehist array:  ', typeof res, res)
      setAllhist(res)
    })
  }, [])

    {/* 
        Using number of seconds to denote 'time_elapsed' (for now)
            >> Don't know how to represent 'time_elapsed', 'starting_time', and 'date' properly
            >> Refer to Figma
        TODO: Convert time from seconds to xx:yy format

        For draw, 'winner' is set to ""
            >> Feel free to define another string
            >> Assuming users cannot make usernames using non alphabetic/numeric characters, and cannot have it be empty

        Ratings are given random values in this example
        We don't have to use ratings, can just calculate scores
    */}
    let records
    return (
        <>
            <NavbarBuilder header="Game History" links={links} />
            {allhist.map(e => <GameRecord name={user.user.username} {...e} />)}
        </>
    );
}