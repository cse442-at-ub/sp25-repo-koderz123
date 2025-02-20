import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameScreenBackground from "../assets/GameScreenBackground.png"
import ExitModal from "./ExitModal";
import "./GameScreen.css";

const GameScreen: React.FC = () => {
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const navigate = useNavigate();  // <-- Initialize navigate

    const handleOpenModal = () => setIsExitModalOpen(true);
    const handleCloseModal = () => setIsExitModalOpen(false);

    const handleConfirmExit = () => {
        navigate("/mainmenu");  // <-- Navigate to /mainmenu
    };

    return (
        <div className="game-screen">
                <img className="game-image"
                src={GameScreenBackground}
                alt="Game Background"
                />

                <button className="exit-button" onClick={handleOpenModal}>
                    Exit
                </button>
  
                {/* Exit Modal Component */}
                <ExitModal 
                    isOpen={isExitModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmExit}
                />   

            
        </div>
    );
};

export default GameScreen;
