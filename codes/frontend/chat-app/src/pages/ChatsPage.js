import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function ChatsPage() {
  const { authData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (!authData && !userDetails) {
      navigate("/login");
    }
  }, [authData, navigate]);

  const user = authData?.user || JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div>Loading...</div>; // או אפשר לנתב לדף התחברות אם המשתמש לא מחובר
  }

  return (
    <div>
      <h1>Hello, this is Chats! {user.username}</h1>
    </div>
  );
}

export default ChatsPage;
