import React, { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";

const MainMenu: React.FC = () => {
    const navigate = useNavigate(); // Initialize navigation

    const clickNewGame = () => {
        navigate("/difficulty");
    };

    const clickOptions = () => {
        navigate("/options");
    };

    const clickExit = () => {
        navigate("/landing");
    };

    const hovering = (e: MouseEvent<HTMLElement>) => {
        (e.target as HTMLElement).style.fontSize = "38px";
        e.currentTarget.style.cursor = "pointer";
    };

    const notHovering = (e: MouseEvent<HTMLElement>) => {
        (e.target as HTMLElement).style.fontSize = "36px";
        e.currentTarget.style.cursor = "default";
    };

    return (
        <div id="MainMenupage">
            <h1>GALACTIC TOWER DEFENSE</h1>
            <div 
                className="menu-item" 
                onClick={clickNewGame} 
                onMouseEnter={hovering} 
                onMouseLeave={notHovering}
            >
                NEW GAME
            </div>
            <div 
                className="menu-item" 
                onClick={clickOptions} 
                onMouseEnter={hovering} 
                onMouseLeave={notHovering}
            >
                OPTIONS
            </div>
            <div 
                className="menu-item" 
                onClick={clickExit} 
                onMouseEnter={hovering} 
                onMouseLeave={notHovering}
            >
                EXIT
            </div>
        </div>
    );
};

export default MainMenu;
