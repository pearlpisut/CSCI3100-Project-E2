import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Friends from "./pages/Friends";
import FriendSearch from "./pages/FriendSearch";
import FriendRequests from "./pages/FriendRequests";
import History from "./pages/History";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import TestBoard from "./pages/TestBoard";
import ViewBoard from "./pages/ViewBoard";
import Logout from "./pages/Logout"
import React, {useState} from "react"

export default function App() {
  const [cookie, setCookie] = useState({})
  return (
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/friend" element={<Friends />} />
          <Route path="/friendsearch" element={<FriendSearch />} />
          <Route path="/friendrequests" element={<FriendRequests />} />
          <Route path="/history" element={<History />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/manage-users" element={<AdminPanel />} />
          <Route path="/view-board" element={<ViewBoard />} />
          <Route path="/test-board" element={<TestBoard />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/logout" element = {<Logout />} />
        </Routes>
      </BrowserRouter>
  );
}