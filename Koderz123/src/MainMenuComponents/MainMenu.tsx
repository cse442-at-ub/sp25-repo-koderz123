import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainMenu.css";
import music from "../assets/menu_music.mp3"; 

const MainMenu: React.FC = () => {
    const navigate = useNavigate(); 
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null); 

    // Play music as soon as the page loads
    useEffect(() => {
        const newAudio = new Audio(music);
        newAudio.loop = true; // Loop 
        newAudio.play(); // Start the music
        newAudio.volume = 0.3; // Default start value

        setAudio(newAudio); 

        return () => {
            if (newAudio) {
                newAudio.pause(); // Stop the music
                newAudio.currentTime = 0; // Reset the audio to the start
            }
        };
    }, []);

    const clickNewGame = () => {
        navigate("/levelselect");
    };

    const clickOptions = () => {
        navigate("/options");
    };

    const clickExit = () => {
        navigate("/");
    };

    const hovering = (e: React.MouseEvent<HTMLElement>) => {
        (e.target as HTMLElement).style.fontSize = "38px";
        e.currentTarget.style.cursor = "pointer";
    };

    const notHovering = (e: React.MouseEvent<HTMLElement>) => {
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
