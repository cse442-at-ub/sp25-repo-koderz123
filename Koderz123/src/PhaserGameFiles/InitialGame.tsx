//@ts-nocheck
import Phaser from "phaser";
import React from "react";
import GameComponent from "./InitialGameComponent";
import "./InitialGame.css";
 // Number of enemies per wave

class Example extends Phaser.Scene {
  private enemies!: Phaser.GameObjects.Group;
  private nextEnemy!: number;
  private WAVE_SIZE = 6;
  private WAVE_NUMBER=1;
  private path!: Phaser.Curves.Path;
  private ENEMY_SPEED = 1 / 5000; // Adjust speed
  private waveActive = false;
  private enemiesSpawned = 0;
  private enemiesAlive = 0; // Track active enemies
  private startWaveButton!: Phaser.GameObjects.Text;

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

    // Create the "Start Wave" button inside Phaser
    this.startWaveButton = this.add
      .text(500, 400, `Start Wave ${this.WAVE_NUMBER}`, {
        fontSize: "24px",
        backgroundColor: "#2d2c2b",
        color: "#fff",
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setInteractive();

    this.startWaveButton.on("pointerdown", () => {
      this.startWave();
    });

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
          this.scene.enemyDied(); // Notify scene that an enemy died
        }
      }

      startOnPath() {
        this.follower.t = 0;
        this.scene.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.setActive(true);
        this.setVisible(true);
        this.scene.enemiesAlive++; // Track number of alive enemies
      }
    }

    // Create enemies group
    this.enemies = this.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;
  }

  update(time: number, delta: number) {
    if (this.waveActive && this.enemiesSpawned < this.WAVE_SIZE && time > this.nextEnemy) {
      const enemy = this.enemies.get() as Enemy;
      if (enemy) {
        enemy.startOnPath();
        this.enemiesSpawned++;
        this.nextEnemy = time + 2000; // Spawn next enemy every 2 seconds
      }
    }
  }

  startWave() {
    if (!this.waveActive) {
      this.waveActive = true;
      this.enemiesSpawned = 0;
      this.enemiesAlive = 0; // Reset alive enemies count

      // Hide the "Start Wave" button
      this.startWaveButton.setText(`Wave ${this.WAVE_NUMBER} in Progress`);
      this.startWaveButton.setVisible(false);
    }
  }

  enemyDied() {
    this.enemiesAlive--; // Reduce count when an enemy dies
  
    if (this.enemiesAlive === 0) {
      this.waveActive = false; // Allow new wave to start
  
      // Increment wave variables
      this.WAVE_NUMBER += 1;
      this.WAVE_SIZE += 2;
  
      // **Update button text before making it visible**
      this.startWaveButton.setText(`Start Wave ${this.WAVE_NUMBER}`);
      this.startWaveButton.setVisible(true); // Show the button again
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
