import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameScreenBackground from "../assets/GameScreenBackground.png";
import ExitModal from "../GameScreenComponents/ExitModal"; // Import from your partner's folder
import HamburgerMenu from "./HamMenu"; // Import your friend's HamburgerMenu
import "./TutorialScreen.css";

const TutorialScreen: React.FC = () => {
    const navigate = useNavigate();
    const [tutorialStep, setTutorialStep] = useState(0);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false); // State for modal visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu visibility

    const handleExit = () => {
        if (tutorialStep === 3) {
            setIsExitModalOpen(true); // Open the modal for confirmation
        } else {
            setTutorialStep(tutorialStep + 1); // Move to the next step
        }
    };

    const handleConfirmExit = () => {
        navigate("/mainmenu"); // Navigate to the main menu
    };

    const handleCloseModal = () => {
        setIsExitModalOpen(false); // Close the modal
    };

    const handleClick = () => {
        if ([0, 1, 3, 5].includes(tutorialStep)) {
            setTutorialStep(tutorialStep + 1); 
        }
    };

    const handleStartGame = () => {
        navigate("/gamescreen"); 
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (tutorialStep === 4 && !isMenuOpen) {
            setTutorialStep(tutorialStep + 1);
        }
    };

    return (
        <div className="tutorial-screen" onClick={tutorialStep === 2 ? undefined : handleClick}>
            <img className="game-image" src={GameScreenBackground} alt="Tutorial Background" />
            <div className="tutorial-content">
                {tutorialStep === 0 && (
                    <>
                        <h1>Tutorial</h1>
                        <p>Welcome to the tutorial! Click anywhere to continue...</p>
                    </>
                )}
                {tutorialStep === 1 && (
                    <>
                        <h1>How to Play</h1>
                        <p>Your goal is to prevent enemies from moving further.</p>
                        <p>1. Place towers strategically to stop enemy waves.</p>
                        <p>2. Upgrade your towers for better defense.</p>
                        <p>3. Manage resources wisely to build stronger defenses.</p>
                        <p>4. Survive all waves to win the game!</p>
                        <p>Click anywhere to continue...</p>
                    </>
                )}
                {tutorialStep === 2 && (
                    <>
                        <h1>Exit Button</h1>
                        <p>To exit the game, click the exit button in the upper left corner.</p>
                        <p>Click the exit button now to proceed.</p>
                    </>
                )}
                {tutorialStep === 3 && (
                    <>
                        <h1>Great Job!</h1>
                        <p>You now know where the exit button is.</p>
                        <p>Next time you click this button, you will return to the main menu.</p>
                        <p>Click anywhere to continue...</p>
                    </>
                )}
                {tutorialStep === 4 && (
                    <>
                        <h1>Inventory Menu</h1>
                        <p>Now to access your inventory, locate the button on the bottom left of the screen.</p>
                        <p>To continue, click the hamburger menu to open it.</p>
                    </>
                )}
                {tutorialStep === 5 && (
                    <>
                        <h1>Great Job!</h1>
                        <p>You now know how to access your inventory.</p>
                        <p>Your inventory is where you can select and drag components onto the battlefield.</p>
                        <p>Click anywhere to continue...</p>
                    </>
                )}
                {tutorialStep === 6 && (
                    <>
                        <h1>You're Ready!</h1>
                        <p>Now you’re ready to begin your journey!</p>
                        <p>Click the **Start** button below to enter the game.</p>
                        <button className="start-button" onClick={handleStartGame}>Start</button>
                    </>
                )}
            </div>

            
            {tutorialStep >= 2 && tutorialStep <= 6 && (
                <button className="exit-button" onClick={handleExit}>Exit</button>
            )}

            
            {tutorialStep >= 4 && (
                <HamburgerMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            )}

            
            <ExitModal
                isOpen={isExitModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmExit}
            />
        </div>
    );
};

export default TutorialScreen;
