import React, { useState, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginScreen.css";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();

  const specialCharregex = /[!@#$%^&*(),.?":{}|<>]/;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup

  const clickBack = () => {
    navigate("/mainmenu");
  };

  const hovering = (e: MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.fontSize = "31pt";
    e.currentTarget.style.cursor = "pointer";
  };

  const nothovering = (e: MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.fontSize = "28pt";
    e.currentTarget.style.cursor = "default";
  };

  // Handle login or signup form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 11) {
      setError("Password must be at least 11 characters long.");
      return;
    }

    try {
      const endpoint = isLogin
        ? "http://localhost:3100/login"
        : "http://localhost:3100/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (isLogin ? "Login failed" : "Signup failed"));
      } else {
        console.log(`✅ ${isLogin ? "Login" : "Signup"} successful!`, data);
        if (isLogin) {
          navigate("/mainmenu");
        } else {
          setIsLogin(true); // Switch back to login after successful signup
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
              <label htmlFor="username">Username:&nbsp;</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input">
              <label htmlFor="password">Password:&nbsp;</label>
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
