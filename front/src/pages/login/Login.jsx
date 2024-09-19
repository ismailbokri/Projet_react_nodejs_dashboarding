import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.scss";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const token = response.data.token;

      // Store JWT token in local storage
      localStorage.setItem('token', token);

      // Navigate to the dashboard
      navigate('/');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="bodyLogin">
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <div className="input-group">
            <span className="input-group-text">👤</span>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-group">
            <span className="input-group-text">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
