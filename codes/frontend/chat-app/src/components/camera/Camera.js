import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

const socket = io(
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"
);

function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { chatId, userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
      });
  };

  const takePicture = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const image = canvasRef.current.toDataURL("image/png");

    socket.emit("sendMessage", { chatId, message: image, userId });

    setMessages((prevMessages) => [
      ...prevMessages,
      { userId, message: image },
    ]);

    navigate(`/chats/${userId}/${chatId}`);
  };

  return (
    <div className="camera-main">
      <div>
        <video ref={videoRef} autoPlay className="camera-video"></video>
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ display: "none" }}
        ></canvas>
      </div>
      <button onClick={takePicture}>Take Picture</button>
    </div>
  );
}
export default Camera;
