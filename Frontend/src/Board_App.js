import "./App.scss";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { useState } from "react";
import JoinGame from "./board_component/JoinGame";
import SignUp from "./board_component/SignUp";
import "./board_component/Board.scss"

function Board_Game_App() {
  const api_key = "2pgm4vaqzc3k"
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  //const token = cookies.set("token", cookies.get("user").user._id);

  const [isAuth, setIsAuth] = useState(false);
  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    //cookies.remove("firstName");
    //cookies.remove("lastName");
    cookies.remove("hashedPassword");
    cookies.remove("channelName");
    cookies.remove("username");
    client.disconnectUser();
    setIsAuth(false);
  };
  /*

  if (token) {
    console.log("check1");
    client.connectUser(
        { 
          id: cookies.get("userId"),
          name: cookies.get("username"),
          firstName: cookies.get("firstName"),
          lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword")
        },
        token
      )
      .then((user) => {
        console.log("check2");
        setIsAuth(true);
      });
      console.log(isAuth);
    }
  */
  console.log("User ID: " + cookies.get("user").user._id)
  console.log("Username:  " + cookies.get("user").user.username)
  console.log("Password:  " + cookies.get("user").user.password)
  console.log("Token: " + cookies.get("token"))

  if (token) {
    client.connectUser(
        { 
          id: cookies.get("userId"),
          name: cookies.get("username"),
          //firstName: cookies.get("firstName"),
          //lastName: cookies.get("lastName"),
          hashedPassword: cookies.get("hashedPassword")
        },
        token
      )
      .then((user) => {
        setIsAuth(true);
      });
      console.log(isAuth);
    }
return (
<div className="App">
      {isAuth ? (
        <Chat client={client}>
          <JoinGame />
          <button class="homenav-link" style={{width: 'fit-content', 'font-family': 'Roboto', 'margin-top': '50px', 'background-color': '#f9f5d7'}} onClick={logOut}> Back to Create game room</button>
        </Chat>
      ) : (
        <>
          <SignUp setIsAuth={setIsAuth} />
        </>
      )}
    </div>
  );
}



export default Board_Game_App