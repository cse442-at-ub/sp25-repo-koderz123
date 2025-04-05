//@ts-nocheck
import React, { useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginScreen.css";

const API_BASE_URL = 
  "https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/"; 

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  const clickBack = () => {
    navigate("/");
  };

  const hovering = (e: MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.fontSize = "31pt";
    e.currentTarget.style.cursor = "pointer";
  };

  const nothovering = (e: MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.fontSize = "28pt";
    e.currentTarget.style.cursor = "default";
  };

  const nothoverMouse = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.cursor = "default";
  };

  // Handle login or signup form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 11) {
      setError("⚠️ Password must be at least 11 characters long.");
      return;
    }

    try {
      // ✅ Use PHP API for login/signup
      const endpoint = isLogin
        ? `${API_BASE_URL}login.php`
        : `${API_BASE_URL}signup.php`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Ensures cookies are sent/received
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || (isLogin ? "⚠️ Login failed" : "⚠️ Signup failed")
        );
      } else {
        console.log(`✅ ${isLogin ? "Login" : "Signup"} successful!`, data);

        if (isLogin) {
          localStorage.setItem("user_id", data.user_id); // ✅ Store user ID
          localStorage.setItem("loggedInUsername", username);
          navigate("/mainmenu");
        } else {
          setIsLogin(true);
          setError("✅ Account created! You can now log in.");
        }
      }
    } catch (error) {
      setError("⚠️ Network error. Please try again.");
    }
  };

  return (
    <div id="background">
      <div id="login">
        <h1>{isLogin ? "LOGIN" : "SIGN UP"}</h1>
        <div id="frame">
          <form id="form" onSubmit={handleSubmit}>
            <div className="input">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div id="submit-button">
              <button type="submit">{isLogin ? "Sign in" : "Sign up"}</button>
            </div>
          </form>
        </div>

        {/* Toggle between Login and Signup */}
        <p
          style={{
            cursor: "pointer",
            color: "lightblue",
            textAlign: "center",
            marginTop: "10px",
          }}
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </p>

        <div
          id="backbutton"
          onClick={clickBack}
          onMouseEnter={hovering}
          onMouseLeave={nothovering}
        >
          <h2>BACK</h2>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
