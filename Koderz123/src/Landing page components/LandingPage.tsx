import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css";

const LandingPage: React.FC = () => {

    const navigate = useNavigate(); //initialize navigation

    const click = () => { //Used when back button is clicked to navigate back to the main menu
        navigate('/mainmenu');
    };

    return (
        <div id="landingpage" onClick={click}>
            <h1 id="gametitle">Galactic Tower Defense</h1>
            <h2 id="clickprompt">Click anywhere to start</h2>
        </div>
    );
}

export default LandingPage;