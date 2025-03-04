import Phaser from "phaser";
import GameComponent from "./InitialGameComponent";
import "./InitialGame.css";

class Example extends Phaser.Scene {
  preload() {
    this.load.setBaseURL("https://labs.phaser.io");
    this.load.atlas("sprites", "assets/spritesheet.png", "assets/spritesheet.json");
    this.load.image("bullet", "assets/bullet.png");
  }

  create() {
    const graphics = this.add.graphics();

    // Path for enemies
    const path = this.add.path(96, -32);
    path.lineTo(96, 164);
    path.lineTo(480, 164);
    path.lineTo(480, 544);

    graphics.lineStyle(3, 0xffffff, 1);
    path.draw(graphics);
  }

  update() {}
}

const InitialGame: React.FC = () => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "phaser-game", // Attach Phaser to this div
    width: 1000,
    height: 512,
    scale: {
      mode: Phaser.Scale.NONE, // No automatic scaling
      autoCenter: Phaser.Scale.CENTER_BOTH, // Center in parent
    },
    scene: Example,
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
