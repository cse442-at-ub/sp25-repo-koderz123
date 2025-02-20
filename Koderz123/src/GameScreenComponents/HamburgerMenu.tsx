import React, { useState } from "react";
import MenuImage from "../assets/GameScreenTowerMenu.png";
import "./HamburgerMenu.css";

const HamburgerMenu: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
