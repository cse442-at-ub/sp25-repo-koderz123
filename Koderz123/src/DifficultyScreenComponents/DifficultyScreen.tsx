import React from "react";
import "./DifficultyScreen.css";
import SpaceBackground from "../assets/SpaceBackground.png";
import SelectDifficultyTitle from "../assets/SelectDifficultyTitle.png";
import BackButton from "../assets/BackButton.png";
import { useNavigate } from "react-router-dom";
import RelaxedButton from "./RelaxedButton";
import IntenseButton from "./IntenseButton"; 
import BrutalButton from "./BrutalButton"; 




const DifficultyScreen: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation function
  


  const handleBackClick = () => {
    navigate("/"); // Navigate back to the main menu
  };

  

  return (
    <div className="difficulty-screen">
      <div className="game-container">
        {/* Space background inside the container */}
        <img src={SpaceBackground} alt="Background" className="space-background" />
        
        {/* Title Image */}
        <img src={SelectDifficultyTitle} alt="Select Difficulty" className="title-image" />

        <div className="instruction-container">
          <p className="instruction-text">Select the battle style that best suits you</p>
          <p className="choose-text">[ CHOOSE ]</p>
        </div>


        

        <img src={BackButton} alt = "Back" className= "back-button" onClick ={handleBackClick} />

        
        <div className="difficulty-buttons">
          <RelaxedButton />
          <IntenseButton />
          <BrutalButton />
        </div>



      </div>
    </div>
  );
};

export default DifficultyScreen;
