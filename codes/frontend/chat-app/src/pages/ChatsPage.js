import React from "react";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

function Chats() {
  const { authData } = useContext(AuthContext);
  const { setAuthData } = useContext(AuthContext);
  console.log(authData);
  return <div></div>;
}

export default Chats;
