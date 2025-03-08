import React from "react";
import MenuImage from "../assets/GameScreenTowerMenu.png";
import "./HamMenu.css"; // Make sure your CSS is imported

interface HamburgerMenuProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isMenuOpen, toggleMenu }) => {
    return (
        <div className="hamburger-menu">
            {/* Hamburger Icon */}
            <button className="hamburger-button" onClick={toggleMenu}>
                ☰
            </button>

            {/* Bottom Image Modal */}
            <div className={`menu-image-container ${isMenuOpen ? "open" : ""}`}>
                <img src={MenuImage} alt="Menu" className="menu-image" />
            </div>
        </div>
    );
};

export default HamburgerMenu;
