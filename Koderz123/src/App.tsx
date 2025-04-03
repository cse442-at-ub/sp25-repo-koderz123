import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LevelSelect from "./DifficultyScreenComponents/DifficultyScreen";
import OptionScreen from "./OptionScreenComponents/OptionScreen";
import MainMenu from "./MainMenuComponents/MainMenu";
import LandingPage from "./Landing page components/LandingPage";
import LoginScreen from "./LoginScreenComponents/LoginScreen";
import { MusicProvider } from "./MusicContext";
import PhaserHelloWorld from "./PhaserHelloWorld/PhaserHelloWorldComponent";
import InitialGame from "./PhaserGameFiles/InitialGame";
import TutorialScreen from "./TutorialScreenComponents/TutorialScreen";
import Leaderboard from "./LeaderboardComponents/Leaderboard";
import ProtectedRoute from "./ProtectedRoute.tsx";
import Login from "./components/Login";
import Game from "./components/Game";
import Navbar from "./components/Navbar";
import "./App.css";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <MusicProvider>
      <Router basename="">
        <div className="container mx-auto p-4">
          <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/game" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/game"
              element={
                isLoggedIn ? (
                  <Game username={username} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/leaderboard"
              element={
                isLoggedIn ? (
                  <Leaderboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/levelselect" element={<LevelSelect />} />
            <Route path="/mainmenu" element={<MainMenu />} />
            <Route path="/gamescreen" element={<InitialGame />} />
            <Route path="/options" element={<OptionScreen />} />
            <Route path="/PhaserHelloWorld" element={<PhaserHelloWorld />} />
            <Route path="/tutorial" element={<TutorialScreen />} />
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </MusicProvider>
  );
};

export default App;
