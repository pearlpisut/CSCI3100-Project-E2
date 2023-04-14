import NavbarBuilder from "../components/NavbarBuilder";
import UserContainer from "../components/UserContainer";
import "./css/AdminSearch.scss";
import React, {useState, useEffect} from 'react'
import Cookies from 'universal-cookie'

export default function AdminPanel() {
    const links =[
        {class: "nav-link", url: "/home", text: "Return to home"},
    ];
    
    const cookies = new Cookies()
    const user = cookies.get('user')
    const [alluser, setAlluser] = useState([])
    const [havechange, setHavechange] = useState(0)
    useEffect(() => {
      fetch(`http://localhost:2901/main/admin`, {
      'method': 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
    })
    .then(res => res.json())
    .then(res => {
      console.log('all user array:  ', typeof res, res)
      setAlluser(res)
    })
  }, [havechange])
    

    {/** For searchbar
    const [query, setQuery] = useState("");
    const filteredUsers = getFilteredUsers(query, users);
    */}

    {/* Need to finish button onclick event, "" is just temporary (cannot be string) */}
    const buttons = [
        {class: "delete", text: "Delete", onclick: ""},
        {class: "view-info", text: "View information", onclick: ""},
    ];
    return (
        <>
            <NavbarBuilder header="User Management" links={links} />
            {/*
            <UserContainer /> creates a container w/ user information, taking three parameters:
                >> class (class="name")
                >> user (user = {array of objects})
                >> buttons (buttons = {array of objects})
            */}
            {alluser.map(e => <UserContainer class="manage-user-container" user={e} buttons={buttons} 
                          setHavechange={setHavechange}/>)}
            {/** For searchbar
            <div class="search-form-container">
                <form>
                    <input type="text" placeholder="Username" />
                    <div><button type="submit" onClick={onclick}><i class="fa-sharp fa-solid fa-paper-plane"></i></button></div>
                </form>
            </div>
             * {filteredUsers.map(e => <UserContainer class="user-container" user={e} buttons={buttons} />)}
             */}
            
        </>
    );
}