//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";
import music from "../assets/menu_music.mp3"; 
import { FaTrophy } from "react-icons/fa";


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

  //logout function only removes local storage variables
  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("loggedInUsername");
    navigate("/login");
  };

  return (
    <div id="MainMenupage">
      <h1>GALACTIC TOWER DEFENSE</h1>
      <div
        className="menu-item"
        onClick={clickNewGame}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
        NEW GAME
      </div>
      <div
        className="menu-item"
        onClick={clickOptions}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
        OPTIONS
      </div>
      <div
        className="menu-item"
        onClick={clickTutorial}
        onMouseEnter={hovering}
        onMouseLeave={notHovering}
      >
        TUTORIAL
      </div>
      <div
        id="logout-button"
        onClick={logout}
        onMouseEnter={hoverMouse}
        onMouseLeave={nothoverMouse}
      >
        Logout
      </div>
      <div id="username-text">
        {loggedInUsername ? (
          <p>Logged in as: {loggedInUsername}</p>
        ) : (
          <p>User not logged in.</p>
        )}
      </div>
      <div id="leaderboard-button" 
        onClick={clickLeaderboard}>
        <FaTrophy size={30} color="black" />
      </div>
    </div>
  );
};

export default MainMenu;
