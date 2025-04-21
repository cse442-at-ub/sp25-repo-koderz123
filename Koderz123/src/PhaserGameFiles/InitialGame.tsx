import Phaser from "phaser";
import React from "react";
import GameComponent from "./InitialGameComponent";
import GameScene from "./GameScene";
import GameOverScene from "./GameOverScene";
import "./InitialGame.css";

const InitialGame: React.FC = () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "phaser-game",
    width: 1000,
    height: 512,
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [GameScene, GameOverScene],
  };

  return (
    <div className="game-wrapper">
      <div className="game-box">
        <GameComponent config={config} />
      </div>
    </div>
  );
};

export default InitialGame;
