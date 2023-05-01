import NavbarBuilder from "../components/NavbarBuilder";
import FriendContainer from "../components/FriendContainer";
import "./css/FriendContainer.scss"
import Cookies from 'universal-cookie'
import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"

export default function Friends() {
    const cookies = new Cookies()
    const user = cookies.get('user')
    // console.log('see user  :  ', user)
    const [friendlist, setFriendlist] = useState([])
    const [friendchange, setFriendchange] = useState(true)

    const navigate = useNavigate()
    useEffect(()=>{
        if(cookies.get('loggedin') == 'false'){
            navigate("/login", { replace: true })
            alert('You have already logged-out. Please log-in again.')
        }
    }, [friendchange])

    const links = [
        {class: "nav-link", url: "/friendsearch", text: "Search"},
        {class: "nav-link", url: "/friendrequests", text: "Requests"},
        {class: "nav-link", url: "/home", text: "Return to main menu"},
    ];
    useEffect(()=>{
        fetch(`http://localhost:2901/user/friend/view`, {
            'method': 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(res => res.json())
        .then(res => setFriendlist(res))
    }, [friendchange])
    console.log('friendlist = ', friendlist)
    friendlist.forEach(e => console.log('ee - ', e))
    return (
        <>
            <NavbarBuilder header="Friends" links={links} />
            {friendlist.map(e => <FriendContainer 
                username = {e.username}
                status = {e.status}
                id = {e.id}
                setFriendchange = {setFriendchange}
                friendchange = {friendchange}
            />)}             
        </>
    );
}