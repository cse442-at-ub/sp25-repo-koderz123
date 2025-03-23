import React from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";
import SpaceBackground from "../assets/menu-background-image.png";
import BackButtonImage from "../assets/BackButton.png"; // Ensure this image exists in assets

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="leaderboard-screen">
      <div className="game-container">
        {/* Space Background */}
        <img src={SpaceBackground} alt="Background" className="space-background" />
        
        {/* Title */}
        <h1 className="leaderboard-title">Leaderboard</h1>
        
        {/* Empty Leaderboard List */}
        <div className="leaderboard-list">
          <p className="placeholder-text">No players yet...</p>
        </div>

        {/* Back Button */}
        <img
          src={BackButtonImage}
          alt="Back"
          className="back-button"
          onClick={() => navigate("/mainmenu")} // Navigate to menu when clicked
        />
      </div>
    </div>
  );
};

export default Leaderboard;


