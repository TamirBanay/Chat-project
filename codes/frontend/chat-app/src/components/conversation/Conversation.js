import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import appImg from "../images/appImg.png";
import Avatar from "../images/Avatar.png";
import "./Conversation.css";
import sendIcon from "../images/sendIcon.png";
import backgroundIcon from "../images/backgroundIcon.png";
import cameraIcon from "../images/cameraIcon.png";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { useNavigate } from "react-router-dom";

import { _theCurrentChat } from "../../services/atom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const socket = io(
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"
);
const Conversation = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const { chatId, userId } = useParams();
  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [selectedChat, setSelectedChat] = useRecoilState(_theCurrentChat);
  const storedChat = JSON.parse(localStorage.getItem("theCurrentChat")) || {};
  const user = JSON.parse(localStorage.getItem("user"));

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = reader.result;

        // שליחת התמונה בסוקט
        socket.emit("sendMessage", { chatId, message: image, userId });

        // עדכון ההודעות כדי להוסיף את ההודעה עם התמונה
        setMessages((prevMessages) => [
          ...prevMessages,
          { userId, message: image },
        ]);

        navigate(`/chats/${userId}/${chatId}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNavigateToCameraPage = () => {
    navigate(`/camera/${userId}/${chatId}`);
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const header = document.querySelector(".fixed-header");
    if (header) {
      const newHeight = window.innerHeight;
      header.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    socket.emit("joinChat", chatId);
    socket.on("chatHistory", (data) => {
      setMessages(data.messages);
      setUser1(data.user1);
      setUser2(data.user2);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage");
      socket.off("chatHistory");
    };
  }, [chatId]);

  const handleSendMessage = () => {
    const userId = user.id;
    socket.emit("sendMessage", { chatId, message: newMessage, userId });
    setNewMessage("");
  };

  const handleTextAreaChange = (e) => {
    setNewMessage(e.target.value);
    autoResizeTextArea(e.target);
  };

  const autoResizeTextArea = (element) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackClick = () => {
    navigate(`/chats/${userId}/`);
    localStorage.removeItem("theCurrentChat");
  };

  // Function to send image data
  const handleSendImage = (imageData) => {
    const userId = user.id;
    socket.emit("sendMessage", { chatId, message: imageData, userId });
  };

  return (
    <div className="conversation-main">
      <div
        className={
          isScrolled ? "fixed-header" : "conversation-profileImgs-and-usernames"
        }
      >
        <div className="conversation-back-button" onClick={handleBackClick}>
          <ArrowForwardIosIcon sx={{ color: "#fff" }} />
        </div>
        <div className="conversation-profileImgs-and-usernames-usernames">
          <div className="conversation-names">{user1}</div>
          <div className="conversation-names">{user2}</div>
        </div>
        <div className="conversation-profileImgs-and-usernames-imgs">
          <img
            className="conversation-img"
            src={user.profileImage}
            alt="User 2"
          />
          <img
            className="conversation-img"
            src={selectedChat.userId2Details.profileImage}
            alt="User 1"
          />
        </div>
      </div>
      <div className="conversation-all-massage-container">
        <br />
        {messages.map((msg, index) => (
          <div key={index} className="conversation-massage">
            {msg.userId == userId ? (
              <div className="conversation-massage-from-user1">
                {msg.message.startsWith("data:image") ? (
                  <img
                    className="conversation-img-send"
                    src={msg.message}
                    alt="Image"
                  />
                ) : (
                  msg.message
                )}
              </div>
            ) : (
              <div className="conversation-massage-from-user2">
                {msg.message.startsWith("data:image") ? (
                  <img
                    className="conversation-img-send"
                    src={msg.message}
                    alt="Image"
                  />
                ) : (
                  msg.message
                )}
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
      <div className="conversation-input-and-cameraIcon">
        <textarea
          ref={textAreaRef}
          className="conversation-input"
          value={newMessage}
          placeholder="Write"
          onChange={handleTextAreaChange}
          rows="1"
        />
        <button className="conversation-button" onClick={handleSendMessage}>
          <img className="conversation-sendIconImg" src={sendIcon} />
        </button>

        <div className="custom-file-input">
          <label htmlFor="picture">
            {" "}
            <img
              className="conversation-backgroundIcon"
              src={backgroundIcon}
              alt="Open Camera"
            />
            <img
              className="conversation-camera"
              src={cameraIcon}
              alt="Take Photo"
            />
          </label>
          <input
            type="file"
            id="picture"
            name="picture"
            accept="image/*"
            capture="environment"
            onChange={handlePictureChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
