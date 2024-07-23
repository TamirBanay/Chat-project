import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Chats.css";
import appImg from "../images/appImg.png";
import serchIcon from "../images/searchicon.png";
import addButton from "../images/addButton.png";

function Chats() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (!authData && !userDetails) {
      navigate("/login");
    }
  }, [authData, navigate]);

  const user = authData?.user || JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chats-main">
      <div className="chats-userNameAndImg">
        <div className="chats-userNameAndImg-img">
          <img src={appImg}></img>
        </div>
        <div className="chats-userNameAndImg-userName">
          {capitalizeFirstLetter(user.username)}
        </div>{" "}
      </div>
      <div className="chats-inputSearchAndAddChats">
        <div className="chats-inputSearchAndAddChats-inputSearch">
          <input
            className="chats-inputSearchAndAddChats-inputSearch-input"
            placeholder="Search..."
          />
          <div className="chats-inputSearchAndAddChats-inputSearch-icon">
            <img src={serchIcon} />
          </div>
        </div>
        <div className="chats-inputSearchAndAddChats-AddChats">
          <img src={addButton}></img>
        </div>
      </div>
      <div className="chats-titleChatrooms">Chatrooms</div>
      <div className="chats-storyImages"></div>
      <div className="chats-chatsList">
        <div className="chats-chatsList-img"></div>
        <div className="chats-chatsList-lastText"></div>
        <div className="chats-chatsList-time"></div>
      </div>
    </div>
  );
}

export default Chats;
