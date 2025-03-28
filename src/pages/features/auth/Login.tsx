import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { FaHome } from "react-icons/fa";
import { IconButton } from "@mui/material";
import { api } from "../../../utils/HTTP";


const Login = () => {
  useEffect(() => {
    document.title = "Login Page";
  }, []);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await api.post<{
        accessToken: string;
        username: string;
      }>('/auth/login', {
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 60, 
      });
  
      const data = response.data;
      console.log("API Response:", data);
  
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("username", data.username);
        console.log("Login successful!");
        navigate("/");
      } else {
        setError("Invalid username or password.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError("Login failed. Please try again.");
      console.error("Error:", error);
    }
  };



  return (
    <div className="auth-container">

      <div className="auth-background"></div>
      <div className="auth-card">
      <IconButton
        className="btn-back"
        onClick={() => navigate("/")} 
      >
              <FaHome />
      </IconButton>
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <div className="auth-input-group">
            <label className="auth-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </div>
    </div>
  );
};

export default Login;