import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = users.find((user: any) => user.email === email);

    if (emailExists) {
      setError("Email already exists. Please use a different email.");
      return;
    }

    
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
    };

    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    
    localStorage.setItem("token", "no-token");
    localStorage.setItem("username", username);
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleRegister} className="auth-form">
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
            <label className="auth-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Register
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Register;