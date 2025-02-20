import React, { useState } from "react";
import GameScreenBackground from "../assets/GameScreenBackground.png"
import "./GameScreen.css";

const GameScreen: React.FC = () => {
    // State for controlling modals
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

    return (
        <div className="game-screen">
            <img className="game-image"
            src={GameScreenBackground}
            alt="Game Background"
            >
                



            </img>    

            
        </div>
    );
};

export default GameScreen;
