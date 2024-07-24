import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:4000");

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId, chatId } = useParams();

  useEffect(() => {
    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const handleSendMessage = () => {
    const userId = JSON.parse(localStorage.getItem("user")).id;
    socket.emit("sendMessage", { chatId, message: newMessage, userId });
    setNewMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.userId}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Conversation;
