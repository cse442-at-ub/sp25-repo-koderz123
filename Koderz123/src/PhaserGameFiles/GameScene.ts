//@ts-nocheck
import Phaser from "phaser";
import Enemy from "./Enemy"; // Import the Enemy class
import StartWaveButton from "./StartWaveButton"; // ✅ Import new button class
import TowerMenu from "./TowerFiles/TowerMenu";
import ExitButton from "./ExitButton";
import Tower from "./TowerFiles/Tower";


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

  private selectedTowerType: string | null = null;
  private towerPreview?: Tower;
  private placementRadius = 80;
  private justSelectedTower = false;
  private exitButton!: ExitButton;

  private selectedTower: Tower | null = null;
  private upgradeButton: Phaser.GameObjects.Text | null = null;
  private towerClicked = false;
  private resources = 1000; // Initialize number of resources
  private resourceText: Phaser.GameObjects.Text;

  


  preload() {
    this.load.image("background", "assets/GameScreenBackground.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("default-tower", "assets/towers/default-tower.png");

  }

  create() {
    const { width, height } = this.scale;
    const background = this.add.image(width / 2, height / 2, "background");
    background.setOrigin(0.5, 0.5);
    background.setDisplaySize(width, height);
    background.setDepth(-1);

    this.exitButton = new ExitButton(this);
    this.exitButton.setVisible(true); // ✅ make sure it's visible at start

    

    this.towerMenu = new TowerMenu(this, (type) => {
      this.selectedTowerType = type;
    
      if (this.towerPreview) {
        this.towerPreview.destroy();
      }
    
      this.towerPreview = new Tower(this, 0, 0, "default-tower");
      this.towerPreview.setAlpha(0.5);
    
      this.towerMenu.setVisibleAllUI(false);   // 🔻 Hide menu + hamburger
      this.startWaveButton.setVisible(false);  // 🔻 Hide start wave
      this.exitButton.setVisible(false);       // 🔻 Hide exit
      this.justSelectedTower = true;
    });
    
    


    this.input.on("pointermove", (pointer) => {
      if (this.towerPreview && !this.towerPreview.isPlaced) {
        this.towerPreview.setPosition(pointer.worldX, pointer.worldY);
    
        const isValid = this.isValidTowerPlacement(pointer.worldX, pointer.worldY);
        this.towerPreview.setValidPlacement(isValid);
      }
    });
    

    this.input.on("pointerdown", (pointer) => {
      if (this.justSelectedTower) {
        this.justSelectedTower = false; // 🚫 Consume the first click
        return;
      }
    
      if (this.towerPreview && this.selectedTowerType) {
        const isValid = this.isValidTowerPlacement(pointer.worldX, pointer.worldY);
        if (isValid) {
          this.towerPreview.place(pointer.worldX, pointer.worldY);
          this.towerPreview = undefined;
          this.selectedTowerType = null;
          this.restoreUI(); // ✅ restore buttons
        }
      }
    });

    this.input.keyboard.on("keydown-ESC", () => {
      if (this.towerPreview) {
        this.towerPreview.destroy();
        this.towerPreview = undefined;
        this.selectedTowerType = null;
        this.restoreUI(); // ✅ restore buttons
      }
    });
    

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
    this.startWaveButton.setVisible(true);

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

    // Create resource text
    this.resourceText = this.add.text(width - 200,height - 50, `Coins: ${this.resources}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.updateResourceText(); // Display initial resources
  
    this.input.on("gameobjectdown", this.handleTowerClick, this); // Listen for tower clicks
    this.input.on("pointerdown", this.handleSceneClick, this); // Listen for other clicks
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

  handleTowerClick(pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) {
    if (gameObject instanceof Tower && gameObject.isPlaced) {
      console.log("Tower clicked!");
        this.selectedTower = gameObject;
        this.showUpgradeButton();
        this.towerClicked = true;
    }
  }

  handleSceneClick(pointer: Phaser.Input.Pointer) {

    if (!this.towerClicked){
      console.log("Scene clicked!");
      if(this.upgradeButton){
        this.upgradeButton.destroy();
        this.upgradeButton = null;
        this.selectedTower = null;
      }
    }
    this.towerClicked = false;
}

  showUpgradeButton() {
      if (this.upgradeButton) {
          this.upgradeButton.destroy();
      }

      if (this.selectedTower) {
          this.upgradeButton = this.add
              .text(this.selectedTower.x, this.selectedTower.y - 50, `Upgrade (${this.selectedTower.upgradeCost})`, {
                  fontSize: "16px",
                  color: "#ffffff",
                  backgroundColor: "#555",
                  padding: { left: 10, right: 10, top: 5, bottom: 5 },
              })
              .setOrigin(0.5)
              .setInteractive()
              .on("pointerdown", () => {
                  this.upgradeSelectedTower();
              });
      }
  }

  upgradeSelectedTower() {
      if (this.selectedTower) {
          if (this.hasEnoughResources(this.selectedTower.upgradeCost)) {
              this.removeResources(this.selectedTower.upgradeCost);
              this.selectedTower.upgrade();
              this.showUpgradeButton();
              this.updateResourceText();
          } else {
              console.log("Not enough resources to upgrade.");
          }
      }
  }

  hasEnoughResources(cost: number): boolean {
    return this.resources >= cost;
  }

  removeResources(cost: number) {
      this.resources -= cost;
      console.log(`Removed ${cost} resources.`);
  }

  updateResourceText() {
    this.resourceText.setText(`Coins: ${this.resources}`);
  }

  private isValidTowerPlacement(x: number, y: number): boolean {
    const precision = 50;
    for (let t = 0; t <= 1; t += 1 / precision) {
      const point = new Phaser.Math.Vector2();
      this.path.getPoint(t, point);
      const dist = Phaser.Math.Distance.Between(x, y, point.x, point.y);
      if (dist < this.placementRadius) {
        return false;
      }
    }
    return true;
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

  restoreUI() {
    this.towerMenu.setVisibleAllUI(true);
    this.startWaveButton.setVisible(true);
    this.exitButton.setVisible(true);
  }
}



export default GameScene;
