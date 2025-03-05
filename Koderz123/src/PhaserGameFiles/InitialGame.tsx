//@ts-nocheck
import Phaser from "phaser";
import GameComponent from "./InitialGameComponent";
import "./InitialGame.css";

class Example extends Phaser.Scene {
  private enemies!: Phaser.GameObjects.Group;
  private nextEnemy!: number;
  private path!: Phaser.Curves.Path;
  private ENEMY_SPEED = 1 / 5000; // Adjust speed

  preload() {
    this.load.setBaseURL("https://labs.phaser.io");
    this.load.atlas("sprites", "assets/spritesheet.png", "assets/spritesheet.json");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("enemy", "assets/enemy.png"); // Ensure enemy image is loaded
  }

  create() {
    const graphics = this.add.graphics();
    this.path = new Phaser.Curves.Path(125, -32);
    this.path.lineTo(125, 200);
    this.path.lineTo(850, 200);
    this.path.lineTo(850, 544);

    graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(graphics);

    // Create Enemy class properly
    class Enemy extends Phaser.GameObjects.Image {
      follower: { t: number; vec: Phaser.Math.Vector2 };
      scene: Example;

      constructor(scene: Example) {
        super(scene, 0, 0, "enemy");
        this.scene = scene;
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        scene.add.existing(this);
      }

      update(time: number, delta: number) {
        if (this.follower.t < 1) {
          this.follower.t += this.scene.ENEMY_SPEED * delta;
          this.scene.path.getPoint(this.follower.t, this.follower.vec);
          this.setPosition(this.follower.vec.x, this.follower.vec.y);
        } else {
          this.setActive(false);
          this.setVisible(false);
        }
      }

      startOnPath() {
        this.follower.t = 0;
        this.scene.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.setActive(true);
        this.setVisible(true);
      }
    }

    // Create enemies group
    this.enemies = this.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;
  }

  update(time: number, delta: number) {
    if (time > this.nextEnemy) {
      const enemy = this.enemies.get() as Enemy;
      if (enemy) {
        enemy.startOnPath();
        this.nextEnemy = time + 2000; // Spawn next enemy after 2 seconds
      }
    }
  }
}

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
