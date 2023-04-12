import { useState } from "react";
import NavbarBuilder from "../components/NavbarBuilder";
import UserContainer from "../components/UserContainer";
import "./css/UserSearch.scss";

{/** For searchbar
const getFilteredUsers = (query, users) => {
    if (!query) {
        return users;
    }
    return users.filter(username => username.includes(query));
}
*/}

export default function FriendSearch() {
    const links =[
        {class: "nav-link", url: "/friend", text: "Return to friends list"},
    ];
    const users = [{
        "username": "ameagh0"
      }, {
        "username": "rminards1"
      }, {
        "username": "ymeak2"
      }, {
        "username": "tadamik3"
      }, {
        "username": "srottcher4"
      }, {
        "username": "okirsz5"
      }, {
        "username": "mgrass6"
      }, {
        "username": "dclowsley7"
      }, {
        "username": "cdominiak8"
      }, {
        "username": "kbatch9"
      }, {
        "username": "ahamblinga"
      }, {
        "username": "mbulfootb"
      }, {
        "username": "hhariotc"
      }, {
        "username": "cwindrossd"
      }, {
        "username": "rlaingmaide"
      }, {
        "username": "kloreyf"
      }, {
        "username": "rkiteg"
      }, {
        "username": "sgrassoth"
      }, {
        "username": "mehlerdingi"
      }, {
        "username": "rmcgooganj"
      }, {
        "username": "btrammelk"
      }, {
        "username": "bbettenayl"
      }, {
        "username": "tstogillm"
      }, {
        "username": "douvern"
      }, {
        "username": "tkynetto"
      }, {
        "username": "rsemkenp"
      }, {
        "username": "cmathieq"
      }, {
        "username": "mallewellr"
      }, {
        "username": "tjiruchs"
      }, {
        "username": "mkembryt"
      }];
    {/** For searchbar
    const [query, setQuery] = useState("");
    const filteredUsers = getFilteredUsers(query, users);
    */}

    {/* Need to finish button onclick event, "" is just temporary (cannot be string) */}
    const buttons = [
        {class: "send-request", text: "Send request", onclick: ""},
    ];
    return (
        <>
            <NavbarBuilder header="Find Friends" links={links} />
            {/*
            <UserContainer /> creates a container w/ user information, taking three parameters:
                >> class (class="name")
                >> user (user = {array of objects})
                >> buttons (buttons = {array of objects})
            */}
            {users.map(e => <UserContainer class="user-container" user={e} buttons={buttons} />)}
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