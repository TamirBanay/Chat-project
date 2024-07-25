import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Chats.css";
import appImg from "../images/appImg.png";
import serchIcon from "../images/searchicon.png";
import addButton from "../images/addButton.png";
import Avatar from "../images/Avatar.png";
import axios from "axios";

function Chats() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [activeChatId, setActiveChatId] = useState(null);
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    const options = { weekday: "short" };

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return date.toLocaleDateString("en-US", options);
    }

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    if (date.toDateString() === twoDaysAgo.toDateString()) {
      return (
        date.toLocaleDateString("en-US", options) +
        ` ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/chats/getChatByUserId/${userDetails.id}`
      );
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  useEffect(() => {
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

  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
    navigate(`/chats/${userDetails.id}/${chatId}`);
  };
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
      <div className="chats-chatsList-main">
        {chats
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .map((chat) => (
            <div
              key={chat._id}
              className="chats-chatsList"
              onClick={() => handleChatClick(chat.chatId)}
            >
              <div className="chats-chatsList-img">
                <img
                  className="chats-chatsList-img-img"
                  src={Avatar}
                  alt="Avatar"
                />
              </div>
              <div className="chats-chatsList-nameAndText">
                <div className="chats-chatsList-name">
                  {capitalizeFirstLetter(chat.userId2Details.username)}
                </div>
                <div className="chats-chatsList-lastText">
                  {chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].message
                    : ""}
                </div>
              </div>
              <div className="chats-chatsList-time">
                {formatDate(chat.timestamp)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Chats;
