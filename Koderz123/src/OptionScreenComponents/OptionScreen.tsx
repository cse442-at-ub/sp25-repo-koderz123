import { useState , ChangeEvent , MouseEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import "./OptionScreen.css";

export default function OptionScreen() {
    const [volumeValue, setVolumeValue] = useState(50); //Middling number between 0 and 100

    const navigate = useNavigate(); //initialize navigation

    const clickBack = () => { //Used when back button is clicked to navigate back to the main menu
        navigate('/mainmenu');
    };

    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => { //function changes sound value whenever slider moves
        setVolumeValue(e.target.valueAsNumber); 
    };

    const hovering = (e: MouseEvent<HTMLElement>) => { //function used when mouse is over BACK button specifically
        (e.target as HTMLElement).style.fontSize = '31pt';
        e.currentTarget.style.cursor = 'pointer';
    }

    const nothovering = (e: MouseEvent<HTMLElement>) => { //function when mouse is anywhere but the BACK button
        (e.target as HTMLElement).style.fontSize = '28pt';
        e.currentTarget.style.cursor = 'default';
    }

    return (
        <div id = "optionpage">
            <h1>OPTIONS</h1>
            <div id = "settings">
                <div id = "sound">
                    <label htmlFor="volume">Sound</label>
                    <input type="range" id="volume" name="volume" min="0" max="100" value={volumeValue} onChange={handleVolumeChange}/>
                    <output id="newvol" name="newvol" htmlFor="volume">{volumeValue}</output>
                </div>
                <div id = "explicit">
                    <label htmlFor="explicit">Explicit</label>
                    <input type="checkbox" id="explicit_checkbox"></input>
                </div>
            </div>
            <div id = "backbutton" onClick={clickBack} onMouseEnter={hovering} onMouseLeave = {nothovering}>
                <h2>BACK</h2>
            </div>
        </div>
    );
}