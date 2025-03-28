import React from "react";
import { useNavigate } from "react-router-dom";
import "./Leaderboard.css";
import SpaceBackground from "../assets/menu-background-image.png";
import BackButtonImage from "../assets/BackButton.png";
import LeaderboardItem from "./LeaderboardItem";
import "./LeaderboardStyles.css"

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();

  const leaderboardData = [
    { rank: 1, player: "No Player Yet...", score: 0 },
    { rank: 2, player: "No Player Yet...", score: 0 },
    { rank: 3, player: "No Player Yet...", score: 0 },
    { rank: 4, player: "No Player Yet...", score: 0 },
    { rank: 5, player: "No Player Yet...", score: 0 },
    { rank: 6, player: "No Player Yet...", score: 0 },
    { rank: 7, player: "No Player Yet...", score: 0 },
    { rank: 8, player: "No Player Yet...", score: 0 },
    { rank: 9, player: "No Player Yet...", score: 0 },
    { rank: 10, player: "No Player Yet...", score: 0 },
    { rank: 11, player: "No Player Yet...", score: 0 },
    { rank: 12, player: "No Player Yet...", score: 0 },
    { rank: 13, player: "No Player Yet...", score: 0 },
    { rank: 14, player: "No Player Yet...", score: 0 },
    { rank: 15, player: "No Player Yet...", score: 0 },
    { rank: 16, player: "No Player Yet...", score: 0 },
    { rank: 17, player: "No Player Yet...", score: 0 },
    { rank: 18, player: "No Player Yet...", score: 0 },
    { rank: 19, player: "No Player Yet...", score: 0 },
    { rank: 20, player: "No Player Yet...", score: 0 },
  ];

  const displayedData = leaderboardData.length
    ? leaderboardData
    : Array(20).fill({ rank: "No Data", player: "No Player Yet...", score: 0 });

  const myRank = 0;
  const myUsername = "username";
  const myScore = 0;

  return (
    <div className="leaderboard-screen">
      <div className="game-container">
        {/* Space Background */}
        <img src={SpaceBackground} alt="Background" className="space-background" />

        {/* Title */}
        <h1 className="leaderboard-title">Leaderboard</h1>

        {/* Leaderboard header */}
        <div className="leaderboard-header">
          <span>RANK</span>
          <span>PLAYER</span>
          <span>SCORE</span>
        </div>

        {/* Leaderboard list */}
        <div className="leaderboard-list-container">
          {displayedData.map((entry, index) => (
            <LeaderboardItem
              key={index}
              rank={entry.rank}
              player={entry.player}
              score={entry.score}
            />
          ))}
        </div>

        {/* My Rank Section */}
        <div className="my-rank-container">
          <span>MY RANK: {myRank}</span>
          <span>USERNAME: {myUsername}</span>
          <span>SCORE: {myScore}</span>
        </div>

        {/* Back Button */}
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