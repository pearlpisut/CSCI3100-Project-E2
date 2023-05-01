import NavLink from "../components/NavLink";
import React, {useEffect} from 'react'
import './choosegame.scss'

export default function ChooseGame(){


    return(
        <div> 
            <div class="home-navbar">
                <NavLink className ="nav-link" url = "/home" text = "Return to main menu"></NavLink>
            </div>
            <div>
                <h1 style={{'font-size': "50px"}}>Choose game mode</h1>
            </div>
            <div>
                <NavLink className ="singleplayer options gamemode one" url = "/choose_diff" text="Singleplayer" />
            </div>
            <div>
                <NavLink className = "boardgame options gamemode two" style="width: 200px" url = "/board_game_app" text="Multiplayer" />
            </div>
        </div> 
    )
}