import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import Chats from "./pages/ChatsPage";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chats/:userId" element={<Chats />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
