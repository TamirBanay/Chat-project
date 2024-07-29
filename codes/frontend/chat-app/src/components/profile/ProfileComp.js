import React from "react";
import "./Profile.css";
import arrow from ".././images/arrow-left.png";
import { useNavigate, useParams } from "react-router-dom";
import bell from ".././images/bell.png";

function Profile() {
  const navigate = useNavigate();
  const { chatId, userId } = useParams();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const handleBackClick = () => {
    navigate(`/chats/${userId}`);
  };

  return (
    <div className="profile-main">
      <div className="profile-header">
        <div className="profile-header-backbutton" onClick={handleBackClick}>
          <img src={arrow} />
        </div>
        <div className="profile-headr-title">Profile</div>
        <div className="profile-headr-bell">
          {" "}
          <img src={bell} />
        </div>
      </div>
      <div className="profile-img">
        <img src={userDetails.profileImage} />
      </div>

      <div className="profile-personalDetails">
        <div className="profile-name">
          <span>User Name:</span> {userDetails.username}
        </div>
        <div className="profile-phoneNumber">
          <span> Phone Number: </span>
          {userDetails.phonNumber}
        </div>
        <div className="profile-email">
          <span> Email: </span>
          {userDetails.email}
        </div>
        <div className="profile-gender">
          <span>Gender: </span>
          {userDetails.gender}
        </div>
      </div>
    </div>
  );
}

export default Profile;
