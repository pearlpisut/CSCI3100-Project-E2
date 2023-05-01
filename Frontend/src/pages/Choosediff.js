import NavLink from "../components/NavLink";
import React, {useEffect, useState} from 'react'
import './choosegame.scss'

export default function ChooseDiff(){
    const [Diff, setDifficulty] = useState(1);

    return(
        <div> 
            <div className = "home-navbar">
                <NavLink className = "return nav-link" url="/home" text="Return to Menu" />
            </div>
            {/*
            <div>
                <h1>Choose Difficulty</h1>
                <input type = "radio" name = "test" value = "1" onClick={() => setDifficulty(1)}/>Easy
                <input type = "radio" name = "test" value = "2" onClick={() => setDifficulty(2)}/>Medium
                <input type = "radio" name = "test" value = "3" onClick={() => setDifficulty(3)}/>Hard
                <button Diff={Diff} type = "button" url = "/Gomoku" >Submit</button>
             </div>*/}
             <div className="alldifflevel">
                <div>
                    <NavLink className = "Submit nav-link easy difflevel" url="/Gomoku" text="Easy" />
                </div>
                <div>
                    <NavLink className = "Submit2 nav-link medium difflevel" url="/Gomoku2" text="Medium" />
                </div>
                <div>
                    <NavLink className = "Submit3 nav-link hard difflevel" url="/Gomoku3" text="Hard" />
                </div>
             </div>
        </div> 
    )
}