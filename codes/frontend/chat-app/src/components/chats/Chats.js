import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Chats.css";
import appImg from "../images/appImg.png";
import serchIcon from "../images/searchicon.png";
import addButton from "../images/addButton.png";
import Avatar from "../images/Avatar.png";

import axios from "axios";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { _theCurrentChat } from "../../services/atom";
function Chats() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lastChats, setLastChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [activeChatId, setActiveChatId] = useState(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [selectedChat, setSelectedChat] = useRecoilState(_theCurrentChat); // משתנה לשמירת פרטי הצ'אט הנבחר
  const { chatId, userId } = useParams();

  const handleNavigateToProfile = () => {
    navigate(`/profile/${userId}`);
  };
  const handleCreateChatByPhoneNumber = () => {
    const userIdPhoneNumber1 = userDetails.phonNumber;
    const userIdPhoneNumber2 = prompt(
      "Enter the phone number to create a chat with:"
    );
    if (userIdPhoneNumber2) {
      axios
        .post(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"
          }/api/chats/addChatByPhoneNumber`,
          {
            userIdPhoneNumber1,
            userIdPhoneNumber2,
          }
        )
        .then((response) => {
          console.log("Chat created:", response.data);
          navigate(`/chats/${userDetails.id}/${response.data.chatId}`);
        })
        .catch((error) => {
          console.error(
            "Error creating chat:",
            error.response ? error.response.data : error.message
          );
          alert("Failed to create chat. Please try again.");
        });
    }
  };

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
      return "Yesterday";
    }

    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    if (date.toDateString() === twoDaysAgo.toDateString()) {
      return date.toLocaleDateString("en-US", options);
      // ` ${date.toLocaleTimeString([], {
      //   hour: "2-digit",
      //   minute: "2-digit",
      // })}`
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const fetchLastChats = async () => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"
        }/api/chats/getChatByUserId/${userDetails.id}`
      );
      setLastChats(response.data);
      setFilteredChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [searchQuery, lastChats]);

  const handleSearch = () => {
    const filtered = lastChats.filter(
      (chat) =>
        chat.messages.some((message) =>
          message.message.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        chat.userId1Details.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        chat.userId2Details.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  useEffect(() => {
    if (authData?.user) {
      fetchLastChats(authData.user.userid);
    } else if (userDetails) {
      fetchLastChats(userDetails.userid);
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

    const chat = filteredChats.find((chat) => chat.chatId === chatId);
    if (chat) {
      setSelectedChat(chat);
    }
    localStorage.setItem("theCurrentChat", JSON.stringify(selectedChat));
  };
  return (
    <div className="chats-main">
      <div className="chats-userNameAndImg">
        <div
          className="chats-userNameAndImg-img"
          onClick={handleNavigateToProfile}
        >
          <img src={user.profileImage} alt="User" />
        </div>
        <div className="chats-userNameAndImg-userName">
          {capitalizeFirstLetter(user.username)}
        </div>
      </div>
      <div className="chats-inputSearchAndAddChats">
        <div className="chats-inputSearchAndAddChats-inputSearch">
          <input
            type="text"
            className="chats-inputSearchAndAddChats-inputSearch-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="chats-inputSearchAndAddChats-inputSearch-icon">
            <img src={serchIcon} alt="Search" />
          </div>
        </div>
        <div
          className="chats-inputSearchAndAddChats-AddChats"
          onClick={handleCreateChatByPhoneNumber}
        >
          <img src={addButton} alt="Add" />
        </div>
      </div>
      <div className="chats-titleChatrooms">Chatrooms</div>
      <div className="chats-storyImages"></div>
      <div className="chats-chatsList-main">
        {filteredChats
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
                  src={chat.userId2Details.profileImage}
                  alt="Avatar"
                />
              </div>
              <div className="chats-chatsList-nameAndText">
                <div className="chats-chatsList-name">
                  {chat.userId2Details.username}
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
