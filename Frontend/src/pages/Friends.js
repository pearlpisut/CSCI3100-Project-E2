import NavbarBuilder from "../components/NavbarBuilder";
import FriendContainer from "../components/FriendContainer";
import "./css/FriendContainer.scss"
import Cookies from 'universal-cookie'
import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"

export default function Friends() {
    const cookies = new Cookies()
    const user = cookies.get('user')
    const [friendlist, setFriendlist] = useState([])

    const navigate = useNavigate()
    useEffect(()=>{
        if(cookies.get('loggedin') == 'false'){
            navigate("/login", { replace: true })
            alert('You have already logged-out. Please log-in again.')
        }
    }, [])

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
    }, [])
    console.log(friendlist)
    const friends = [
        {username: "Thant", status: "Offline", userid: "1" },
        {username: "Max", status: "Online", userid: "2"},
        {username: "Jeff", status: "Offline", userid: "3"},
        {username: "Pearl", status: "Online", userid: "4"},
        {username: "Oranuch", status: "Offline", userid: "5"},
        {username: "csci3100", status: "Online", userid: "6"},
        {username: "csci2100", status: "Online", userid: "7"},
        {username: "ceng3420", status: "Online", userid: "8"},
        {username: "csci1130", status: "Offline", userid: "9"},
    ];
    return (
        <>
            <NavbarBuilder header="Friends" links={links} />
            {friendlist.map(e => <FriendContainer {...e}/>)} 
        </>
    );
}