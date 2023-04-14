import NavLink from "../components/NavLink";
import React, {useEffect} from 'react'

export default function ChooseGame(){


    return(
        <div> 
            <div>
                <h1>Choose game</h1>
            </div>
            <div>
                <NavLink class ="singleplayer" url = "/choose_diff" text="Singleplayer" />
            </div>
            <div>
                <NavLink className = "boardgame" url = "/board_game_app" text="Multiplayer" />
            </div>
        </div> 
    )
}