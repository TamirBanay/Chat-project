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
import { _theCurrentChat } from "../../services/atom";
const socket = io("http://localhost:4000");
const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const { chatId, userId } = useParams();
  const [stream, setStream] = useState(null);
  const textAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [selectedChat, setSelectedChat] = useRecoilState(_theCurrentChat);
  const storedChat = JSON.parse(localStorage.getItem("theCurrentChat")) || {};

  const user1ProfileImage = storedChat?.userId1Details?.profileImage || "";
  const user2ProfileImage = storedChat?.userId2Details?.profileImage || "";

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
    const userId = JSON.parse(localStorage.getItem("user")).id;
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
  return (
    <div className="conversation-main">
      <div className="conversation-profileImgs-and-usernames">
        <div className="conversation-profileImgs-and-usernames-usernames">
          <div className="conversation-names">{user1}</div>
          <div className="conversation-names">{user2}</div>
        </div>

        <div className="conversation-profileImgs-and-usernames-imgs">
          <img
            className="conversation-img"
            src={storedChat?.userId1Details?.profileImage || ""}
            alt="User 1"
          />
          <img
            className="conversation-img"
            src={storedChat?.userId2Details?.profileImage || ""}
            alt="User 2"
          />
        </div>
      </div>
      <div className="conversation-all-massage-container">
        <br />
        {messages.map((msg, index) => (
          <div key={index} className="conversation-massage">
            {msg.userId == userId ? (
              <div className="conversation-massage-from-user1">
                {msg.message}
              </div>
            ) : (
              <div className="conversation-massage-from-user2">
                {msg.message}
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
        <div className="conversation-cameraIcons">
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
        </div>
      </div>
      <video
        id="videoElement"
        width="400"
        height="300"
        style={{ display: "none" }}
        autoPlay
      ></video>
      <canvas
        id="canvasElement"
        width="400"
        height="300"
        style={{ display: "none" }}
      ></canvas>
    </div>
  );
};

export default Conversation;
