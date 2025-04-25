//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";
import music from "../assets/menu_music.mp3"; 
import { FaTrophy } from "react-icons/fa";

const API_BASE_URL = "https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/";

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  const loggedInUsername = localStorage.getItem("loggedInUsername");

  /*
    const [, setAudio] = useState<HTMLAudioElement | null>(null); 

    // Play music as soon as the page loads
    
    useEffect(() => {
        const newAudio = new Audio(music);
        newAudio.loop = true; // Loop 
        newAudio.play(); // Start the music
        newAudio.volume = 0.3; // Default start value

        setAudio(newAudio); 

        return () => {
            if (newAudio) {
                newAudio.pause(); // Stop the music
                newAudio.currentTime = 0; // Reset the audio to the start
            }
        };
    }, []);
    */

    const clickLoadGame = () => {
      navigate("/loadgame");
    };
    
  
  const clickNewGame = () => {
    navigate("/levelselect");
  };

  const clickOptions = () => {
    navigate("/options");
  };

  const clickExit = () => {
    navigate("/");
  };

  const clickLogin = () => {
    navigate("/login");
  };

  const clickTutorial = () => {
    navigate("/tutorial");
  };

  const clickLeaderboard = () => {
    navigate("/leaderboard");
  };

  const hovering = (e: React.MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.fontSize = "32px";
    e.currentTarget.style.cursor = "pointer";
  };

  const notHovering = (e: React.MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).style.fontSize = "30px";
    e.currentTarget.style.cursor = "default";
  };

  const hoverMouse = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.cursor = "pointer";
  };

  const nothoverMouse = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.cursor = "default";
  };

  const logout = async () => {
    try {
      // Call server to clear session
      const response = await fetch(`${API_BASE_URL}logout.php`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Logout successful:", data);
      } else {
        console.error("⚠️ Logout failed:", data.message);
        alert("Failed to log out on the server. You have been logged out locally.");
      }
    } catch (error) {
      console.error("⚠️ Network error during logout:", error);
      alert("Network error during logout. You have been logged out locally.");
    } finally {
      // Clear local storage
      localStorage.removeItem("user_id");
      localStorage.removeItem("loggedInUsername");
      
      // Show logout message first
      alert("You have been logged out!");
      
      // Then navigate after the alert is closed
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  return (
    <div id="MainMenupage">
    <div className="sparkle-overlay"></div>
      
      <h1>GALACTIC TOWER DEFENSE</h1>
      <div
        className="menu-item"
        onClick={clickNewGame}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
        <span className="menu-label">NEW GAME</span>
      </div>

      <div
        className="menu-item"
        onClick={clickOptions}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
        <span className="menu-label">OPTIONS</span>
      </div>


      <div
        className="menu-item"
        onClick={clickTutorial}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
        <span className="menu-label">TUTORIAL</span>
      </div>


      <div
        className="menu-item"
        onClick={logout}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
         <span className="menu-label">LOGOUT</span>
      </div>
      <div id="username-text">
        {loggedInUsername ? (
          <p>Logged in as: {loggedInUsername}</p>
        ) : (
          <p>User not logged in.</p>
        )}
      </div>
      
    </div>
  );
};

export default MainMenu;
