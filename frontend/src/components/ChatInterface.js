import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./css/chatinterface.css"; 

const ChatInterface = ({ user, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem(`chat_${user.id}`)) || [];
    setMessages(savedMessages);

    socketRef.current = io("http://localhost:1337", {
      auth: { token: localStorage.getItem("jwt") },
    });

    socketRef.current.on("message", (message) => {
      setMessages((prev) => {
        const updated = [...prev, message];
        localStorage.setItem(`chat_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    });

    return () => socketRef.current.disconnect();
  }, [user.id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = { text: newMessage, sent: true, timestamp: new Date().toLocaleTimeString() };
    socketRef.current.emit("message", { text: newMessage });

    setMessages((prev) => {
      const updated = [...prev, message];
      localStorage.setItem(`chat_${user.id}`, JSON.stringify(updated));
      return updated;
    });

    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room</h2>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sent ? "message sent" : "message received"}>
            <span className="message-text">{msg.text}</span>
            <span className="message-time">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="chat-form">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatInterface;
