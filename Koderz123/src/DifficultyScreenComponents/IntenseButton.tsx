import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./IntenseButton.css";
import MediumDescription from "../assets/MediumDescription.png"; 

const IntenseButton: React.FC = () => {  
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="intense-container">
      {/* Intense Button */}
      <button
        className={`button-intense ${isClicked ? "active" : ""}`}
        onClick={() => setIsClicked(!isClicked)}
      >
        Intense
      </button>

      {/* Show Medium Description when clicked */}
      {isClicked && (
        <div className="description-container">
          <img src={MediumDescription} alt="Medium Description" className="i-description-image" />

          {/* Yellow 'Go' Button navigates to GameScreen */}
          <button className="intense-go-button" onClick={() => navigate("/gamescreen")}>
            Go
          </button>
        </div>
      )}
    </div>
  );
};

export default IntenseButton;
