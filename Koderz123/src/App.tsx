import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LevelSelect from './DifficultyScreenComponents/DifficultyScreen'
import OptionScreen from './OptionScreenComponents/OptionScreen';
import MainMenu from './MainMenuComponents/MainMenu';
import LandingPage from './Landing page components/LandingPage';
import LoginScreen from './LoginScreenComponents/LoginScreen';
import { MusicProvider } from './MusicContext';
import PhaserHelloWorld from './PhaserHelloWorld/PhaserHelloWorldComponent';
import InitialGame from './PhaserGameFiles/InitialGame';
import TutorialScreen from './TutorialScreenComponents/TutorialScreen';

const App: React.FC = () => {
    return (
        <MusicProvider>
            <Router basename=''>
                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<LandingPage/>} /> {/* replace the html code with landing page component*/}
                        <Route path="/levelselect" element={<LevelSelect/>} /> {/* replace the html code with difficulty page component */}
                        <Route path="/mainmenu" element={<MainMenu/>} /> {/*replace the html code with main menu component*/}
                        <Route path="/gamescreen" element={<InitialGame/>} /> {/* replace the html code with gamescreen component */}
                        <Route path="/options" element={<OptionScreen/>} /> {/* replace the html code with options component */}
                        <Route path="/login" element={<LoginScreen/>} />
                        <Route path="/PhaserHelloWorld" element={<PhaserHelloWorld/>} />
                        <Route path="/tutorial" element={<TutorialScreen />} />
                        <Route path="*" element={<div>404 - Not Found</div>} /> {/* the star represents a catch all so anything that we havent routed out goes to 404 page */}
                    </Routes>
                </div>
            </Router>
        </MusicProvider>
    );
};

export default App;
