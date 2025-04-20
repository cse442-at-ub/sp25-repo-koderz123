import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./BrutalButton.css";
import HardDescription from "../assets/HardDescription.png"; 

interface BrutalButtonProps {
  onClick: () => void;
}

const BrutalButton: React.FC<BrutalButtonProps> = ({ onClick }) => {  
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="brutal-container">
      <button
        className={`button-brutal ${isClicked ? "active" : ""}`}
        onClick={() => {
          setIsClicked(!isClicked);
          onClick(); // ✅ Call parent handler
        }}
      >
        Brutal
      </button>

      {isClicked && (
        <div className="description-container">
          <img src={HardDescription} alt="Hard Description" className="b-description-image" />

          <button className="brutal-go-button" onClick={() => navigate("/gamescreen/brutal")}>
            Go
          </button>
        </div>
      )}
    </div>
  );
};

export default BrutalButton;
