import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Chats.css";
import appImg from "../images/appImg.png";
import serchIcon from "../images/searchicon.png";
import addButton from "../images/addButton.png";
import axios from "axios";

function Chats() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user"));

  const fetchChats = async () => {
    try {
      console.log(`Fetching chats for userId: ${userDetails.id}`);
      const response = await axios.get(
        `http://localhost:4000/api/chats/getChatByUserId/${userDetails.id}`
      );
      console.log("Chats fetched:", response.data);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (authData?.user) {
      fetchChats(authData.user.userid);
    } else if (userDetails) {
      fetchChats(userDetails.userid);
    } else {
      navigate("/login");
    }
  }, [authData, navigate]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const user = authData?.user || JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chats-main">
      <div className="chats-userNameAndImg">
        <div className="chats-userNameAndImg-img">
          <img src={appImg} alt="User" />
        </div>
        <div className="chats-userNameAndImg-userName">
          {capitalizeFirstLetter(user.username)}
        </div>
      </div>
      <div className="chats-inputSearchAndAddChats">
        <div className="chats-inputSearchAndAddChats-inputSearch">
          <input
            className="chats-inputSearchAndAddChats-inputSearch-input"
            placeholder="Search..."
          />
          <div className="chats-inputSearchAndAddChats-inputSearch-icon">
            <img src={serchIcon} alt="Search" />
          </div>
        </div>
        <div className="chats-inputSearchAndAddChats-AddChats">
          <img src={addButton} alt="Add" />
        </div>
      </div>
      <div className="chats-titleChatrooms">Chatrooms</div>
      <div className="chats-storyImages"></div>
      <div className="chats-chatsList">
        {/* {chats.map((chat) => (
          <div key={chat._id} className="chats-chatsList-item">
            <div className="chats-chatsList-img"></div>
            <div className="chats-chatsList-lastText">
              Chat between {chat.userId1.username} and {chat.userId2.username}
            </div>
            <div className="chats-chatsList-time"></div>
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default Chats;
