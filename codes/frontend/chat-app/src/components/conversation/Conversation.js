import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:4000");

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const { chatId } = useParams();

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

  return (
    <div className="conversation-main">
      <div className="Conversation-profileImgs-and-usernames">
        <span>{user1}</span> & <span>{user2}</span>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
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
