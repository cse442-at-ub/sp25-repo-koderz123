//@ts-nocheck
import Phaser from "phaser";
import Enemy from "./Enemy"; // Import the Enemy class
import StartWaveButton from "./StartWaveButton"; // ✅ Import new button class
import TowerMenu from "./TowerFiles/TowerMenu";
import ExitButton from "./ExitButton";

class GameScene extends Phaser.Scene {
  private enemies!: Phaser.GameObjects.Group;
  private nextEnemy!: number;
  private WAVE_SIZE = 6;
  private WAVE_NUMBER = 1;
  private WAVE_ACCUMULATOR = 2;
  public path!: Phaser.Curves.Path;
  public ENEMY_SPEED = 1 / 5000; // Adjust speed
  private const_speed_multiplier = 1.1;
  private multiplier = (1).toFixed(2);
  private waveActive = false;
  private enemiesSpawned = 0;
  public SPAWN_DELAY = 200;
  public enemiesAlive = 0; // Track active enemies
  private startWaveButton!: StartWaveButton; // ✅ Use StartWaveButton class
  private countdownTimer!: Phaser.Time.TimerEvent; // For countdown timers
  private countdownText!: Phaser.GameObjects.Text;
  private countdownSeconds = 60; // Initial countdown time in seconds
  private towerMenu!: TowerMenu;

  


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

    this.towerMenu = new TowerMenu(this, (type) => {
      this.selectedTowerType = type;
      console.log("Selected tower type:", type);
    });
    
    const exitButton = new ExitButton(this);

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
   // this.path.draw(graphics);
    //this.path.setDepth(1);

    // ✅ Create the "Start Wave" button using StartWaveButton class
    this.startWaveButton = new StartWaveButton(
      this,
      850,
      75,
      `Start Wave ${this.WAVE_NUMBER}`,
      () => {
        this.startWave();
      }
    );

    // Create the timer text
    this.countdownText = this.add.text(
      width / 2,
      20,
      `Time: ${this.countdownSeconds}     x${this.multiplier}`,
      {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      }
    );
    this.countdownText.setOrigin(0.5, 0);
    this.countdownText.setDepth(1); // Ensure it's on top

    // Create enemies group
    this.enemies = this.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;
  }

  update(time: number, delta: number) {
    if (
      this.waveActive &&
      this.enemiesSpawned < this.WAVE_SIZE &&
      time > this.nextEnemy
    ) {
      const enemy = this.enemies.get() as Enemy;
      if (enemy) {
        enemy.startOnPath();
        this.enemiesSpawned++;
        this.nextEnemy = time + this.SPAWN_DELAY; // Spawn next enemy based on delay
      }
    }
  }

  endCountDown() {
    this.countdownTimer.remove(); // Stop the timer
    this.waveActive = false; // End the wave

    // Handle what happens when the timer runs out (e.g., wave failure)
    this.countdownText.setText("Time's up!");
    this.startWaveButton.setVisible(true); // Show the start wave button again

    this.enemies.clear(true, true); // Destroy remaining enemies
  }

  updateCountdown() {
    this.countdownSeconds--;

    if (this.countdownSeconds <= 0) {
      this.endCountDown();
      return;
    }

    this.countdownText.setText(
      `Time: ${this.countdownSeconds}     x${this.multiplier}`
    );
  }

  startCountdown() {
    this.countdownSeconds = 60; // Reset the countdown

    // Update the text immediately
    this.countdownText.setText(
      `Time: ${this.countdownSeconds}     x${this.multiplier}`
    );

    this.countdownTimer = this.time.addEvent({
      delay: 1000, // 1 second
      callback: this.updateCountdown,
      callbackScope: this,
      loop: true,
    });
  }

  startWave() {
    if (!this.waveActive) {
      this.waveActive = true;
      this.enemiesSpawned = 0;
      this.enemiesAlive = 0;

      // ✅ Hide button when wave starts
      this.startWaveButton.setVisible(false);
      this.startCountdown();
    }
  }

  enemyDied() {
    this.enemiesAlive--;

    if (this.enemiesAlive === 0) {
      this.waveActive = false;
      this.WAVE_NUMBER += 1;
      this.WAVE_SIZE += this.WAVE_ACCUMULATOR;
      this.ENEMY_SPEED *= this.const_speed_multiplier;
      this.multiplier = (this.multiplier * this.const_speed_multiplier).toFixed(
        2
      );

      // ✅ Update button text and make it visible again
      this.startWaveButton.setText(`Start Wave ${this.WAVE_NUMBER}`);
      this.startWaveButton.setVisible(true);
      this.endCountDown();
    }
  }
}

export default GameScene;
