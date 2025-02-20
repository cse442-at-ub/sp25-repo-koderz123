import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameScreen from './GameScreenComponents/GameScreen';

const App: React.FC = () => {
    return (
        <Router>
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<div>Home</div>} /> {/* replace the html code with landing page component*/}
                    <Route path="/mainmenu" element={<div>main menu</div>} /> {/*replace the html code with main menu component*/}
                    <Route path="/levelselect" element={<div>Levelselect</div>} /> {/* replace the html code with difficulty page component */}
                    <Route path="/gamescreen" element={<GameScreen/>} /> {/* replace the html code with gamescreen component */}
                    <Route path="/options" element={<div>options</div>} /> {/* replace the html code with options component */}
                    <Route path="*" element={<div>404 - Not Found</div>} /> {/* the star represents a catch all so anything that we havent routed out goes to 404 page */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
