import React, { useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

const socket = io(
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"
);

function Camera() {
  const { chatId, userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

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

  return (
    <div className="camera-main">
      <label htmlFor="picture">Take a picture using back facing camera:</label>
      <input
        type="file"
        id="picture"
        name="picture"
        accept="image/*"
        capture="environment"
        onChange={handlePictureChange}
      />
    </div>
  );
}

export default Camera;
