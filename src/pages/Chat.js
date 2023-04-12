import NavbarBuilder from "../components/NavbarBuilder";
import ChatLog from "../components/ChatLog";
import "./css/Chat.scss";

export default function Chat() {
    const links = [
        {class: "nav-link", url: "/home", text: "Return to main menu"},
    ];
    const chat = [
        {user: "Max", msg: "Hey VSauce, Michael here"},
        {user: "Jeff", msg: "Yo guys today we're going play a game"},
        {user: "Ryan", msg: "What do you want to play?"},
        {user: "Player", msg: "Anything"},
        {user: "WXYZ", msg: "Where are your fingers?"},
        {user: "csci3100", msg: "Where are your fingers?"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "testuser", msg: "🥧 🥕 💈 🍖 🍊 ✂️ 🦎 🐄 🤐 🥝 🎂 🦁"},
        {user: "admin", msg: "Long message Long message Long message Long message Long message Long message Long message Long message Long message Long message "},
    ];
    return (
        <>
            <NavbarBuilder header="Chat" links={links} />
            <div class="chat-container">
                <div class="chat">
                    {chat.map(e => <ChatLog {...e}/>)}
                </div>
                <div class="chat-form-container">
                    {/* sendMessage() does nothing for now */}
                    <form>
                        <input type="text" placeholder="Type here..." />
                        <div><button type="submit" onClick={onclick}><i class="fa-sharp fa-solid fa-paper-plane"></i></button></div>
                    </form>
                </div>
            </div>
        </>
    );
}