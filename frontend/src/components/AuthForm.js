import { useState } from "react";
import axios from "axios";

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/local" : "/auth/local/register";
    try {
      const { data } = await axios.post(
        `http://localhost:1337/api${endpoint}`,
        {
          identifier: email,
          email,
          password,
          username: email.split("@")[0],
        }
      );
      onLogin(data.jwt, data.user);
    } catch (error) {
      alert("Error authenticating");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full border border-white/20">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          {isLogin ? "Welcome Back!" : "Join Us"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-white transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-white transition-all"
          />
          <button
            type="submit"
            className="w-full py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-200 transition-all"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
