import React, { useContext } from "react";
import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatsPage from "./pages/ChatsPage";
import ConversationPage from "./pages/ConversationPage";

function App() {
  const user = localStorage.getItem("user");

  return (
    <div className="App">
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* נווט את המשתמש ל-LoginPage אם הוא לא מחובר */}
            <Route
              path="/"
              element={user ? <ChatsPage /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/chats/:userId" element={<ChatsPage />} />
            <Route
              path="/chats/:userId/:chatId"
              element={<ConversationPage />}
            />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
