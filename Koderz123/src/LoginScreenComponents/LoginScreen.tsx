import React, {MouseEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginScreen.css";

const LoginScreen: React.FC = () => {

        const navigate = useNavigate();
    
        const clickBack = () => { //Used when back button is clicked to navigate back to the main menu
            navigate('/mainmenu');
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

        <div id = "background">
            <div id = "login">
                <h1>LOGIN</h1>
                <div id = "frame">
                    <form id = "form">
                        <div className="input">
                            <label htmlFor="username">Username:&nbsp;</label>
                            <input type="text" id="username" required ></input>
                        </div>
                        <div className="input">
                            <label htmlFor="password">Password:&nbsp;</label>
                            <input type="text" id="password" required></input>
                        </div>
                        <div id = "submit-button">
                        <button type="submit">Sign in</button>
                        </div>
                    </form>
                </div>
                <div id = "backbutton" onClick={clickBack} onMouseEnter={hovering} onMouseLeave = {nothovering}>
                <h2>BACK</h2>
            </div>
            </div>
        </div>
    )
};

export default LoginScreen;