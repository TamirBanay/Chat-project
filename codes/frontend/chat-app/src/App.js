import logo from "./logo.svg";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginUser";
import Signup from "./pages/Signup";

function App() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
