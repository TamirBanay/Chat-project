// frontend/chat-app/src/components/conversation/Conversation.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import "./Conversation.css";
const socket = io("http://localhost:4000");

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { chatId } = useParams();

  useEffect(() => {
    // Join the chat room
    socket.emit("joinChat", chatId);

    // Fetch the chat history when joining
    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage");
      socket.off("chatHistory");
    };
  }, [chatId]);

  const handleSendMessage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;

    if (userId) {
      socket.emit("sendMessage", { chatId, message: newMessage, userId });
      setNewMessage("");
    } else {
      console.error("User ID not found in localStorage");
    }
  };
  console.log(messages);
  return (
    <div className="conversation-main">
      <div className="Conversation-profileImgs-and-usernames"></div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.userId}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        className="conversation-input"
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Conversation;
