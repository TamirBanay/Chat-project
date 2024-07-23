import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

function Chats() {
  const { authData } = useContext(AuthContext);
  const { setAuthData } = useContext(AuthContext);
  console.log(authData);
  return (
    <div>
      <h1>Hello, this is Chats! {authData.user.username}</h1>
    </div>
  );
}

export default Chats;
