import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import appImg from "../images/appImg.png";
import Avatar from "../images/Avatar.png";
import "./Conversation.css";
import sendIcon from "../images/sendIcon.png";
import backgroundIcon from "../images/backgroundIcon.png";
import cameraIcon from "../images/cameraIcon.png";

const socket = io("http://localhost:4000");

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const { chatId, userId } = useParams();
  console.log(userId);
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
  console.log(messages);
  return (
    <div className="conversation-main">
      <div className="conversation-profileImgs-and-usernames">
        <div className="conversation-profileImgs-and-usernames-usernames">
          <div className="conversation-names">{user1}</div>
          <div className="conversation-names">{user2}</div>
        </div>

        <div className="conversation-profileImgs-and-usernames-imgs">
          <img className="conversation-img" src={appImg} />
          <img className="conversation-img" src={Avatar} />
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
      </div>
      <div className="conversation-input-and-cameraIcon">
        <input
          className="conversation-input"
          type="text"
          value={newMessage}
          placeholder="Write"
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="conversation-button" onClick={handleSendMessage}>
          <img className="conversation-sendIconImg" src={sendIcon} />
        </button>
        <div className="conversation-cameraIcons">
          <img className="conversation-backgroundIcon" src={backgroundIcon} />
          <img className="conversation-camera" src={cameraIcon} />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
