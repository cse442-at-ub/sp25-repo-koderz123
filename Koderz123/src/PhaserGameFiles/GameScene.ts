//@ts-nocheck
import Phaser from "phaser";
import Enemy from "./Enemy"; // Import the Enemy class

class GameScene extends Phaser.Scene {
  private enemies!: Phaser.GameObjects.Group;
  private nextEnemy!: number;
  private WAVE_SIZE = 6;
  private WAVE_NUMBER = 1;
  public path!: Phaser.Curves.Path;
  public ENEMY_SPEED = 1 / 5000; // Adjust speed
  private waveActive = false;
  private enemiesSpawned = 0;
  public enemiesAlive = 0; // Track active enemies
  private startWaveButton!: Phaser.GameObjects.Text;

  preload() {
    this.load.image("background", "assets/GameScreenBackground.png");
    this.load.image("enemy", "assets/enemy.png");
  }

  create() {
    const { width, height } = this.scale;
    const background = this.add.image(width / 2, height / 2, "background");
    background.setOrigin(0.5, 0.5);
    background.setDisplaySize(width, height);
    background.setDepth(-1);

    const graphics = this.add.graphics();
    this.path = new Phaser.Curves.Path(-32, 140);
    this.path.lineTo(-32, 140);
    this.path.lineTo(150, 140);
    this.path.lineTo(150, 265);
    this.path.lineTo(450, 265);
    this.path.lineTo(450, 430);
    this.path.lineTo(760, 430);
    this.path.lineTo(760, 180);
    this.path.lineTo(1000, 180);

    graphics.lineStyle(3, 0xffffff, 1);

    this.startWaveButton = this.add
      .text(150, 475, `Start Wave ${this.WAVE_NUMBER}`, {
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
      this.enemiesAlive = 0;

      this.startWaveButton.setVisible(false);
    }
  }

  enemyDied() {
    this.enemiesAlive--;

    if (this.enemiesAlive === 0) {
      this.waveActive = false;
      this.WAVE_NUMBER += 1;
      this.WAVE_SIZE += 2;

      this.startWaveButton.setText(`Start Wave ${this.WAVE_NUMBER}`);
      this.startWaveButton.setVisible(true);
    }
  }
}

export default GameScene;
