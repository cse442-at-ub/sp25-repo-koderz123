import React from "react";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../MusicContext";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate(); //initialize navigation

  const { playMusic } = useMusic();

  const click = () => {
    //Used when back button is clicked to navigate back to the main menu
    navigate("/login");
    playMusic();
  };

  return (
    <div id="landingpage" onClick={click}>
      <h1 id="gametitle">Galactic Tower Defense</h1>
      <h2 id="clickprompt">Click anywhere to start</h2>
    </div>
  );
};

export default LandingPage;
