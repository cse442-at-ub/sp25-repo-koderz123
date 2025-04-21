import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./IntenseButton.css";
import MediumDescription from "../assets/MediumDescription.png"; 

interface IntenseButtonProps {
  onClick: () => void;
}

const IntenseButton: React.FC<IntenseButtonProps> = ({ onClick }) => {  
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="intense-container">
      <button
        className={`button-intense ${isClicked ? "active" : ""}`}
        onClick={() => {
          setIsClicked(!isClicked);
          onClick(); // ✅ Notify parent (DifficultyScreen)
        }}
      >
        Intense
      </button>

      {isClicked && (
        <div className="description-container">
          <img src={MediumDescription} alt="Medium Description" className="i-description-image" />

          <button className="intense-go-button" onClick={() => navigate("/gamescreen")}>
            Go
          </button>
        </div>
      )}
    </div>
  );
};

export default IntenseButton;
