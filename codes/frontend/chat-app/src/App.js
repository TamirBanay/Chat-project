import "./App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Chats from "./pages/ChatsPage";
import ConversationPage from "./pages/ConversationPage";

function App() {
  const user = localStorage.getItem("user");

  return (
    <div className="App">
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={user ? <Chats /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chats/:userId" element={<Chats />} />
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
