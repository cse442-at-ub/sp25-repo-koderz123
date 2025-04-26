// src/components/DifficultyScreen.tsx
//@ts-nocheck
import React from "react";
import { useNavigate } from "react-router-dom";
import "./DifficultyScreen.css";
import SelectDifficultyTitle from "../assets/SelectDifficultyTitle.png";
import BackButton from "../assets/BackButton.png";
import RelaxedButton from "./RelaxedButton";
import IntenseButton from "./IntenseButton";
import BrutalButton from "./BrutalButton";

const DifficultyScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleBackClick = () => navigate("/mainmenu");

  return (
    <div className="difficulty-screen">
      {/* Sparkle overlay identical to MainMenu */}
      <div className="sparkle-overlay" />

      <div className="difficulty-container">
        {/* Title Image */}
        <img
          src={SelectDifficultyTitle}
          alt="Select Difficulty"
          className="title-image"
        />

        <div className="instruction-container">
          <p className="instruction-text">
            Select the battle style that best suits you
          </p>
          <p className="choose-text">[ CHOOSE ]</p>
        </div>

        {/* Difficulty buttons */}
        <div className="difficulty-buttons">
          <RelaxedButton />
          <IntenseButton />
          <BrutalButton />
        </div>

        {/* Back Button */}
        <img
          src={BackButton}
          alt="Back"
          className="back-button"
          onClick={handleBackClick}
        />
      </div>
    </div>
  );
};

export default DifficultyScreen;

