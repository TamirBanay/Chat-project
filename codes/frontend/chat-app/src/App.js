import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatsPage from "./pages/ChatsPage";
import ConversationPage from "./pages/ConversationPage";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <HashRouter>
          <Routes>
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
