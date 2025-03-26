import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import { FaHome } from "react-icons/fa";
import { IconButton } from "@mui/material";


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
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (data.accessToken) {
        
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("username", data.username);
        console.log("Login successful!");

        

        navigate("/");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error("Error:", err);
    }
  };



  return (
    <div className="auth-container">

      <div className="auth-background"></div>
      <div className="auth-card">
      <IconButton
        className="btn-back"
        onClick={() => navigate(-1)} 
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