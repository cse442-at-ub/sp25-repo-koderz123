import React, { useState } from "react";

interface LeaderboardItemProps {
  rank: number;
  player: string;
  score: number;
  isCurrentUser?: boolean;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, player, score, isCurrentUser = false, }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getRankClass = () => {
    if (rank === 1) return isSelected ? "top-rank-1-selected" : "top-rank-1";
    if (rank === 2) return isSelected ? "top-rank-2-selected" : "top-rank-2";
    if (rank === 3) return isSelected ? "top-rank-3-selected" : "top-rank-3";
    return "";
  };

  return (
    <div
    className={`leaderboard-item ${getRankClass()} ${isHovered ? "hovered" : ""} ${isSelected ? "selected" : ""} ${isCurrentUser ? "highlighted-user" : ""}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{rank}</span>
      <span>{player}</span>
      <span>{score}</span>
    </div>
  );
};

export default LeaderboardItem;

