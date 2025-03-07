import React, { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginScreen.css";

const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const clickBack = () => { // Navigate back to the main menu
        navigate('/mainmenu');
    };

    const hovering = (e: MouseEvent<HTMLElement>) => { // Mouse over BACK button
        (e.target as HTMLElement).style.fontSize = '31pt';
        e.currentTarget.style.cursor = 'pointer';
    };

    const nothovering = (e: MouseEvent<HTMLElement>) => { // Mouse leaves BACK button
        (e.target as HTMLElement).style.fontSize = '28pt';
        e.currentTarget.style.cursor = 'default';
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevents page refresh
        
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        // TODO: Send login request to backend
        console.log("Logging in with:", { username, password });
    };

    return (
        <div id="background">
            <div id="login">
                <h1>LOGIN</h1>
                <div id="frame">
                    <form id="form" onSubmit={handleSubmit}>
                        <div className="input">
                            <label htmlFor="username">Username:&nbsp;</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input">
                            <label htmlFor="password">Password:&nbsp;</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div id="submit-button">
                            <button type="submit">Sign in</button>
                        </div>
                    </form>
                </div>
                <div id="backbutton" onClick={clickBack} onMouseEnter={hovering} onMouseLeave={nothovering}>
                    <h2>BACK</h2>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
