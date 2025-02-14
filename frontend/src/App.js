import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";  
import ChatInterface from "./components/ChatInterface";  

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (jwt, userData) => {
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="/" element={<AuthForm onLogin={handleLogin} />} />
        ) : (
          <Route path="/chat" element={<ChatInterface user={user} onLogout={handleLogout} />} />
        )}
        {/* Redirect based on authentication */}
        <Route path="*" element={<Navigate to={user ? "/chat" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
