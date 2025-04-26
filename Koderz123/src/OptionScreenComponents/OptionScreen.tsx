import React, { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoundControl from "./Sound.tsx";
import { useMusic } from "../MusicContext.tsx"; // Import useMusic
import "./OptionScreen.css"; //Option screen css

const OptionScreen: React.FC = () => {
  const navigate = useNavigate(); //initialize navigation
  const { audioRef } = useMusic();
  const initialVolume = audioRef.current ? audioRef.current.volume * 100 : 50;
  const [volumeValue, setVolumeValue] = useState(initialVolume);

  const clickBack = () => {
    //Used when back button is clicked to navigate back to the main menu
    navigate("/mainmenu");
  };

  const hovering = (e: MouseEvent<HTMLElement>) => {
    //function used when mouse is over BACK button specifically
    (e.target as HTMLElement).style.fontSize = "31pt";
    e.currentTarget.style.cursor = "pointer";
  };

  const nothovering = (e: MouseEvent<HTMLElement>) => {
    //function when mouse is anywhere but the BACK button
    (e.target as HTMLElement).style.fontSize = "28pt";
    e.currentTarget.style.cursor = "default";
  };

  return (
    <div id="optionpage">
      <h1>OPTIONS</h1>
      <div id="settings">
        <SoundControl
          volumeValue={volumeValue}
          setVolumeValue={setVolumeValue}
        />
        <div id="explicit">
          <label htmlFor="explicit">Explicit</label>
          <input type="checkbox" id="explicit_checkbox"></input>
        </div>
      </div>
      <div
        id="backbutton"
        onClick={clickBack}
        onMouseEnter={hovering}
        onMouseLeave={nothovering}
      >
        <h2>BACK</h2>
      </div>
    </div>
  );
};

export default OptionScreen;
