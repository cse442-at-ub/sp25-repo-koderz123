import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";
import "./LeaderboardStyles.css";
import SpaceBackground from "../assets/menu-background-image.png";
import BackButtonImage from "../assets/BackButton.png";
import LeaderboardItem from "./LeaderboardItem";


const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [myUsername, setMyUsername] = useState<string | null>(null);
  const [myRank, setMyRank] = useState<number>(0);
  const [myScore, setMyScore] = useState<number>(0);

  useEffect(() => {
    // First, get the logged-in username from backend
    fetch("https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/get_current_user.php", {
      credentials: "include", // Required to include cookies with session
    })
      .then((res) => res.json())
      .then((userData) => {
        if (userData.username) {
          setMyUsername(userData.username);

          // Now fetch leaderboard after knowing the user
          fetch("https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/get_leaderboard.php")
            .then((res) => res.json())
            .then((data) => {
              setLeaderboardData(data);
              const myEntry = data.find((entry: any) => entry.player === userData.username);
              if (myEntry) {
                setMyRank(myEntry.rank);
                setMyScore(myEntry.score);
              }
            });
        }
      })
      .catch((err) => console.error("Error loading user or leaderboard", err));
  }, []);

  return (
    <div className="leaderboard-screen">
      <div className="game-container">
        <img src={SpaceBackground} alt="Background" className="space-background" />
        <h1 className="leaderboard-title">Leaderboard</h1>

        <div className="leaderboard-header">
          <span>RANK</span>
          <span>PLAYER</span>
          <span>SCORE</span>
        </div>

        <div className="leaderboard-list-container">
          {leaderboardData.map((entry, index) => (
            <LeaderboardItem
              key={index}
              rank={entry.rank}
              player={entry.player}
              score={entry.score}
              isCurrentUser={entry.player === myUsername}
            />
          ))}
        </div>

        <div className="my-rank-container">
          <span>MY RANK: {myRank || "—"}</span>
          <span>USERNAME: {myUsername || "Not logged in"}</span>
          <span>SCORE: {myScore || "—"}</span>
        </div>

        <img
          src={BackButtonImage}
          alt="Back"
          className="back-button"
          onClick={() => navigate("/mainmenu")}
        />
      </div>
    </div>
  );
};

export default Leaderboard;
