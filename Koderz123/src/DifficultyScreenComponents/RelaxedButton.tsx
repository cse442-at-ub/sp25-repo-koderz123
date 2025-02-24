import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./RelaxedButton.css";
import EasyDescription from "../assets/EasyDescription.png"; 

const RelaxedButton: React.FC = () => {  
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate(); 

  return (
    <div className="button-container">
      {/* Reflect Button */}
      <button
        className={`button-relaxed ${isClicked ? "active" : ""}`}
        onClick={() => setIsClicked(!isClicked)}
      >
        Relaxed
      </button>

      {/* Show Essay Description when clicked */}
      {isClicked && (
        <div className="description-container">
          <img src={EasyDescription} alt="Easy Description" className="r-description-image" />

          {/* Green 'Go' Button navigates to Game Menu */}
          <button className="relaxed-go-button" onClick={() => navigate("/gamescreen")}>
            Go
          </button>
        </div>
      )}
    </div>
  );
};

export default RelaxedButton;


