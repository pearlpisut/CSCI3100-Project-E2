import NavbarBuilder from "../components/NavbarBuilder";
import UserContainer from "../components/UserContainer";
import "./css/FriendRequests.scss";

export default function FriendRequests() {
    const links = [
        {class: "nav-link", url: "/friend", text: "Return to friends list"},
    ];
    const temp = [
        {class: "hidden", url: "", text: ""},
    ];
    const incomingUsers = [{
        "username": "bsiddons0"
      }, {
        "username": "avolkers1"
      }, {
        "username": "nloughren2"
      }, {
        "username": "bboult3"
      }, {
        "username": "ldebold4"
      }, {
        "username": "craise5"
      }, {
        "username": "lbullus6"
      }, {
        "username": "nsalaman7"
      }];
      const outgoingUsers = [{
        "username": "wlamport0"
      }, {
        "username": "rrubinsztein1"
      }, {
        "username": "csiret2"
      }, {
        "username": "hdytham3"
      }, {
        "username": "eabela4"
      }, {
        "username": "hwagnerin5"
      }, {
        "username": "vfurminger6"
      }, {
        "username": "shawthorn7"
      }];
    const incomingButtons = [
        {class: "accept", text: "Accept", onclick: "1"},
        {class: "reject", text: "Reject", onclick: "1"},
    ];
    const outgoingButtons = [
        {class: "revoke", text: "Revoke", onclick: "1"},
    ];
    return (
        <>
            <NavbarBuilder header="Incoming Requests" links={links} />
            {incomingUsers.map(e => <UserContainer class="request-user-container" user={e} buttons={incomingButtons} />)}
            <br /><br />
            <NavbarBuilder header="Outgoing Requests" links={temp}/>
            {outgoingUsers.map(e => <UserContainer class="request-user-container" user={e} buttons={outgoingButtons} />)}
        </>
    );
}