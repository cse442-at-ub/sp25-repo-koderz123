import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoadGameScreen.css";

const API_URL = "https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/api.php";

const LoadGameScreen: React.FC = () => {
  const [saves, setSaves] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const playerID = localStorage.getItem("user_id");
    if (!playerID) return;

    fetch(`${API_URL}?action=get-all-saves&playerID=${playerID}`)
      .then((res) => res.json())
      .then((data) => {
        setSaves(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch saves:", err);
      });
  }, []);

  const loadSelectedSave = (save: any) => {
    localStorage.setItem("load_save_id", save.id); // Store save ID for GameScene
    navigate("/gamescreen"); // Navigate to game and load it there
  };

  return (
    <div className="load-screen">
      <h1>Select a Save</h1>
      {saves.length === 0 ? (
        <p>No saves found.</p>
      ) : (
        <ul className="save-list">
          {saves.map((save) => (
            <li key={save.id} onClick={() => loadSelectedSave(save)}>
              Wave {save.wave} – {save.money} Coins – HP {save.health} – {new Date(save.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
      <button className="back-button" onClick={() => navigate("/mainmenu")}>
        Back
      </button>
    </div>
  );
};

export default LoadGameScreen;
