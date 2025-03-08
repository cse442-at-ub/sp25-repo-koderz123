import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./BrutalButton.css";
import HardDescription from "../assets/HardDescription.png"; 

const BrutalButton: React.FC = () => {  
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="brutal-container">
      {/* Brutal Button */}
      <button
        className={`button-brutal ${isClicked ? "active" : ""}`}
        onClick={() => setIsClicked(!isClicked)}
      >
        Brutal
      </button>

      {/* Show Hard Description when clicked */}
      {isClicked && (
        <div className="description-container">
          <img src={HardDescription} alt="Hard Description" className="b-description-image" />

          {/* Red 'Go' Button navigates to GameScreen */}
          <button className="brutal-go-button" onClick={() => navigate("/gamescreen")}>
            Go
          </button>
        </div>
      )}
    </div>
  );
};

export default BrutalButton;


