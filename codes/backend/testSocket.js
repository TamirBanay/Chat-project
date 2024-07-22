const io = require("socket.io-client");

// התחברות לשרת
const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected to server");

  // הצטרפות לצ'אט
  console.log("Joining chat...");
  socket.emit("joinChat", "1");

  // שליחת הודעה
  console.log("Sending message...");
  socket.emit("sendMessage", {
    chatId: "1",
    message: "Hello, World!",
    userId: "669e5c48003b6a19270739ff",
  });
});

socket.on("receiveMessage", (message) => {
  console.log("New message:", message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
