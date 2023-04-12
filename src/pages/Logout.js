import NavLink from "../components/NavLink";
import React, {useEffect} from 'react'
import Cookies from 'universal-cookie'

export default function Logout(props){
    const cookies = new Cookies()
    const user = cookies.get('user')

    useEffect(()=>{
        if(!cookies.get('loggedin')) alert('You have already logged-out.')
        else{
            fetch(`http://localhost:2901/logout`, {
            'method': 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            cookies.set('loggedin', false)
            console.log('loggedin cookie = ', cookies.get('loggedin'))
        }
        }, [])

    return(
        <div>
            <h1>You have successfully logged-out</h1>
            <NavLink  className="back-to-login" url="/login" text="back to log-in page" />
        </div>
    )
}