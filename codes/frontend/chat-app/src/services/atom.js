import { atom } from "recoil";

const storedChat = localStorage.getItem("theCurrentChat");
let defaultChatData = {
  userId1Details: {},
  userId2Details: {},
  messages: [],
};

if (storedChat) {
  try {
    const parsedChat = JSON.parse(storedChat);
    defaultChatData = {
      userId1Details: parsedChat.userId1Details,
      userId2Details: parsedChat.userId2Details,
      messages: parsedChat.messages,
    };
  } catch (error) {
    console.error("Error parsing stored chat data:", error);
  }
}

export const _theCurrentChat = atom({
  key: "_theCurrentChat",
  default: defaultChatData,
});
