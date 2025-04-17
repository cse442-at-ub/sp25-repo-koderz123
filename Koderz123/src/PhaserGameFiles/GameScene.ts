//@ts-nocheck
import Phaser from "phaser";
import Enemy from "./EnemyFiles/Enemy"; // Import the Enemy class
import SwampEnemy from "./EnemyFiles/SwampEnemy";
import StartWaveButton from "./StartWaveButton"; // ✅ Import new button class
import TowerMenu from "./TowerFiles/TowerMenu";
import ExitButton from "./ExitButton";
import Tower from "./TowerFiles/Tower";
import FrostTower from "./TowerFiles/FrostTower";
import FlamethrowerTower from "./TowerFiles/FlamethrowerTower";
import BombTower from "./TowerFiles/BombTower";
import FireTower from "./TowerFiles/FireTower";

import PauseButton from "./PauseButton"; // Import the PauseButton class
import GameOverScene from "./GameOverScene";

class GameScene extends Phaser.Scene {
  public enemies!: Phaser.GameObjects.Group;
  private nextEnemy!: number;
  private WAVE_SIZE = 6;
  private WAVE_NUMBER = 1;
  private WAVE_ACCUMULATOR = 2;
  public path!: Phaser.Curves.Path;
  public ENEMY_SPEED = 1 / 5000; // Adjust speed
  private const_speed_multiplier = 1.1;
  private multiplier = (1).toFixed(2);
  private MIN_SPEED_MULTIPLIER = 0.5; // Minimum speed multiplier
  private waveActive = false;
  private enemiesSpawned = 0;
  public SPAWN_DELAY = 200;
  private startWaveButton!: StartWaveButton; // ✅ Use StartWaveButton class
  private countdownTimer!: Phaser.Time.TimerEvent; // For countdown timers
  private countdownText!: Phaser.GameObjects.Text;
  private countdownSeconds = 60; // Initial countdown time in seconds
  private towerMenu!: TowerMenu;
  private towersGroup!: Phaser.GameObjects.Group;


  private selectedTowerType: string | null = null;
  private towerPreview?: Tower;
  private placementRadius = 80;
  private justSelectedTower = false;
  private exitButton!: ExitButton;

  private selectedTower: Tower | null = null;
  private upgradeButton: Phaser.GameObjects.Text | null = null;
  private removeButton: Phaser.GameObjects.Text | null = null;
  private towerClicked = false;
  public resources = 1000; // Initialize number of resources
  private resourceText: Phaser.GameObjects.Text;

  private baseHealth = 100; // Add base health
  private baseHealthText: Phaser.GameObjects.Text;

  private normalEnemyBaseSpeed: number = 1; // Store base speed for normal enemy
  private swampEnemyBaseSpeed: number = 0.6; // Store base speed for swamp enemy (adjust as needed)

  private normalEnemySpeedText: Phaser.GameObjects.Text | null = null;
  private swampEnemySpeedText: Phaser.GameObjects.Text | null = null;


  constructor() {
    super({ key: "GameScene" });
    this.isGamePaused = false; // Add pause flag
  }

  preload() {
    console.log('Starting to load assets...');
    
    this.load.image("background", "assets/GameScreenBackground.png");

    //loading enemies
    this.load.image("enemy", "assets/enemies/enemy.png");
    this.load.image("swamp-enemy", "assets/enemies/swamp-enemy.png");

    this.load.image("default-tower", "assets/towers/default-tower.png");
    this.load.image("frost-tower", "assets/towers/frost-tower.png");
    this.load.image("flamethrower-tower", "assets/towers/flame-tower.png")
    this.load.image("bomb-tower", "assets/towers/bomb-tower.png");
    
    // Load projectile textures with error handling
    this.load.image("Frost_Projectile", "assets/projectiles/Frost_Projectile.png")
      .on('complete', () => console.log('Frost projectile loaded successfully'))
      .on('error', (file) => console.error('Error loading Frost projectile:', file));
      
    this.load.image("Flame_Projectile", "assets/projectiles/Flame_Projectile.png")
      .on('complete', () => console.log('Flame projectile loaded successfully'))
      .on('error', (file) => console.error('Error loading Flame projectile:', file));
      
    console.log('Finished loading assets');

  }

  create() {
    console.log('Starting game scene creation...');
    const { width, height } = this.scale;
    const background = this.add.image(width / 2, height / 2, "background");
    background.setOrigin(0.5, 0.5);
    background.setDisplaySize(width, height);
    background.setDepth(-1);
    this.towersGroup = this.add.group();
    console.log('Game scene created successfully');

    this.exitButton = new ExitButton(this);
    this.exitButton.setVisible(true); // ✅ make sure it's visible at start

    

    this.towerMenu = new TowerMenu(this, (type) => {
      this.selectedTowerType = type;
    
      if (this.towerPreview) {
        this.towerPreview.destroy();
      }
    
      // 🔽 Choose the correct tower class and texture
      let previewTexture = "default-tower";
      if (type === "Frost") previewTexture = "frost-tower";
      if (type === "Flamethrower") previewTexture = "flamethrower-tower";
      if (type === "Bomb") previewTexture = "bomb-tower";
      this.towerPreview = new Tower(this, 0, 0, previewTexture);
      this.towerPreview.setAlpha(0.5);
      if(type=="Frost"){
        this.towerPreview.setScale(0.18); // Adjust scale for preview
        this.towerPreview.cost = 125;
      }
      if(type=="Flamethrower"){
        this.towerPreview.setScale(0.30); // Adjust scale for preview
        this.towerPreview.cost = 150;
      }

      if(type=="Bomb"){
        this.towerPreview.setScale(0.10); // Adjust scale for preview
      }
      if(type=="Fire"){
        this.towerPreview.setScale(0.10); // Adjust scale for preview
        this.towerPreview.cost = 200;
      }

      console.log(this.towerPreview);
      this.towerPreview.displayCost(this.towerPreview.x, this.towerPreview.y);

      this.towerMenu.setVisibleAllUI(false);
      this.startWaveButton.setVisible(false);
      this.exitButton.setVisible(false);
      this.justSelectedTower = true;
    });
    
    
    


    this.input.on("pointermove", (pointer) => {
      if (this.towerPreview && !this.towerPreview.isPlaced) {
        this.towerPreview.setPosition(pointer.worldX, pointer.worldY);
        this.towerPreview.displayCost(pointer.worldX, pointer.worldY);
    
        const isValid = this.isValidTowerPlacement(pointer.worldX, pointer.worldY);
        this.towerPreview.setValidPlacement(isValid);
      }
    });
    

    this.input.on("pointerdown", (pointer) => {
      if (this.justSelectedTower) {
        this.justSelectedTower = false;
        return;
      }
    
      if (this.towerPreview && this.selectedTowerType) {
        const isValid = this.isValidTowerPlacement(pointer.worldX, pointer.worldY);
        const enoughMoneyFrost = this.hasEnoughResources(125);
        const enoughMoneyFlame = this.hasEnoughResources(150);
        const enoughMoneyFire = this.hasEnoughResources(150);
        const enoughMoneyBomb = this.hasEnoughResources(200);
        this.towerPreview.costText.destroy();
        this.towerPreview.costText = undefined;
        if (isValid && (enoughMoneyFrost || enoughMoneyFlame || enoughMoneyFire)) {
          let towerToPlace: Tower;

          if (this.selectedTowerType === "Frost" && enoughMoneyFrost) {
            towerToPlace = new FrostTower(this, pointer.worldX, pointer.worldY);
            this.towersGroup.add(towerToPlace); // ✅ Adds to update loop
          } 
          else if (this.selectedTowerType === "Flamethrower" && enoughMoneyFlame) {
            towerToPlace = new FlamethrowerTower(this, pointer.worldX, pointer.worldY);
            this.towersGroup.add(towerToPlace);
          }
          else if (this.selectedTowerType === "Bomb" && enoughMoneyBomb) {
            towerToPlace = new BombTower(this, pointer.worldX, pointer.worldY);
            this.towersGroup.add(towerToPlace); // ✅ Adds to update loop
            towerToPlace.setScale(0.12); //changed size of bombTower image was too big
          }
          else if (this.selectedTowerType === "Fire" && enoughMoneyFire) {
            towerToPlace = new FireTower(this, pointer.worldX, pointer.worldY);
            this.towersGroup.add(towerToPlace);
            towerToPlace.setScale(0.12);
          }
          else {
            towerToPlace = new Tower(this, pointer.worldX, pointer.worldY, "default-tower");
            this.towersGroup.add(towerToPlace); // ✅ Adds to update loop

          }

          

          towerToPlace.place(pointer.worldX, pointer.worldY);
          this.resources -= towerToPlace.cost;
          this.updateResourceText();
          this.towerPreview.destroy(); // destroy the preview
          this.towerPreview = undefined;
          this.selectedTowerType = null;
          this.restoreUI();
        }
        else{
          this.blinkResourceText(this.resourceText, 2000);
          this.towerPreview.destroy();
          this.towerPreview = undefined;
          this.selectedTowerType = null;
          this.restoreUI();
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
    this.resourceText = this.add.text(width - 170,height - 150, `Coins: ${this.resources}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    this.updateResourceText(); // Display initial resources
  
    this.input.on("gameobjectdown", this.handleTowerClick, this); // Listen for tower clicks
    this.input.on("pointerdown", this.handleSceneClick, this); // Listen for other clicks

    this.baseHealthText = this.add.text(width - 150, 300, `HP: ${this.baseHealth}`, {
      fontSize: "24px",
      color: "#ffffff",
    });

    // Create text objects to display enemy speeds in the bottom left
    const speedDisplayY = height - 50;
    const speedDisplayX = 20;
    const speedOffsetY = 20;

    this.normalEnemySpeedText = this.add.text(speedDisplayX, speedDisplayY, " Speed: N/A", {
        fontSize: "16px",
        color: "#ffffff",
    });

    this.swampEnemySpeedText = this.add.text(speedDisplayX, speedDisplayY + speedOffsetY, "Swampo Speed: N/A", {
        fontSize: "16px",
        color: "#ffffff",
    });

    this.updateEnemySpeedDisplay();

    this.pauseButton = new PauseButton(this, 170, 35); //change size for pause button

    window.addEventListener("beforeunload", () => {
      this.saveGameToServer();
    });
    
  }

  pauseGame() {
    this.isGamePaused = true;
    if (this.countdownTimer) {
      this.countdownTimer.paused = true;
    }
    this.pauseButton.setText('Resume');
  }

  resumeGame() {
    this.isGamePaused = false;
    if (this.countdownTimer) {
      this.countdownTimer.paused = false;
    }
    this.pauseButton.setText('Pause');
  }

  private updateEnemySpeedDisplay() {
    if (this.normalEnemySpeedText) {
        const normalSpeed = (this.ENEMY_SPEED * this.normalEnemyBaseSpeed * 5000).toFixed(2);
        this.normalEnemySpeedText.setText(`Fast Enemy Speed: ${normalSpeed}`);
    }
    if (this.swampEnemySpeedText) {
        const swampSpeed = (this.ENEMY_SPEED * this.swampEnemyBaseSpeed * 5000).toFixed(2);
        this.swampEnemySpeedText.setText(`Slow Enemy Speed: ${swampSpeed}`);
    }
}

  update(time: number, delta: number) {
    if (this.isGamePaused) {
      // Skip simulation update while paused.
      return;
    }
    if (
      this.waveActive &&
      this.enemiesSpawned < this.WAVE_SIZE &&
      time > this.nextEnemy
    ) {
      this.spawnEnemy(); // Call a new function to handle enemy spawning
      this.enemiesSpawned++;
      this.nextEnemy = time + this.SPAWN_DELAY;
    }

    // Update all towers and their projectiles
    this.towersGroup.getChildren().forEach((tower: any) => {
      if (tower.update) {
        tower.update(time, delta);
        // Debug log for tower updates
        console.log(`Updating tower of type: ${tower.type}`);
      }
    });

    this.checkEnemyBaseAttacks();
    this.checkWaveEnd();
  }

  spawnEnemy() {
    const enemyType = Phaser.Math.RND.integerInRange(0, 1); // Randomly choose enemy type
    let enemy: Enemy | SwampEnemy;

    switch (enemyType) {
        case 0:
            enemy = new Enemy(this);
            break;
        case 1:
            enemy = new SwampEnemy(this);
            break;
        default:
            enemy = new Enemy(this); // Fallback
            break;
    }

    this.enemies.add(enemy);
    enemy.startOnPath();
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
    if (!this.towerClicked) {
      console.log("Scene clicked!");
  
      if (this.upgradeButton) {
        this.upgradeButton.destroy();
        this.upgradeButton = null;
      }
  
      if (this.removeButton) {
        this.removeButton.destroy();
        this.removeButton = null;
      }
  
      if (this.selectedTower) {
        this.selectedTower.hideRange();
        this.selectedTower = null;
      }
    }
  
    this.towerClicked = false;
  }

  saveGameToServer() {
    const playerID = localStorage.getItem("user_id");
    if (!playerID) return;
  
    // Build tower save data
    const towersToSave = this.towersGroup.getChildren().map((tower: any) => ({
      type: tower.constructor.name, // e.g., FrostTower, BombTower
      x: tower.x,
      y: tower.y
    }));
  
    const saveData = {
      playerID: parseInt(playerID),
      money: this.resources,
      wave: this.WAVE_NUMBER,
      health: this.baseHealth,
      towers: towersToSave
    };
  
    fetch("https://se-prod.cse.buffalo.edu/CSE442/2025-Spring/cse-442p/backend/api.php?action=save-game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saveData),
      keepalive: true // ✅ Ensures the request still completes if the tab closes
    });
  }
  
  

  showUpgradeButton() {
    // Remove existing UI
    if (this.upgradeButton) this.upgradeButton.destroy();
    if (this.removeButton) this.removeButton.destroy();
  
    if (this.selectedTower) {
      this.selectedTower.showRange();
  
      // Upgrade button
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
  
      // Remove button
      this.removeButton = this.add
        .text(this.selectedTower.x, this.selectedTower.y - 20, "Remove", {
          fontSize: "16px",
          color: "#ff8888",
          backgroundColor: "#222",
          padding: { left: 10, right: 10, top: 5, bottom: 5 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", (pointer) => {
          if (this.selectedTower) {
            this.resources += Math.floor(this.selectedTower.cost / 2);
            this.resourceText.setText(`Coins: ${this.resources}`);
            this.selectedTower.hideRange();      // ✅ Hide the range circle
            this.selectedTower.destroy();        // ✅ Destroy the tower image
          }

          this.upgradeButton?.destroy();         // ✅ Remove upgrade button
          this.removeButton?.destroy();          // ✅ Remove remove button

          this.selectedTower = null;
          this.upgradeButton = null;
          this.removeButton = null;

          pointer.event.stopPropagation();       // ✅ Prevent scene click cleanup from overriding
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
              this.blinkResourceText(this.resourceText,2000);
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
    if (this.isGamePaused) {
      return;
    }
    if (!this.waveActive) {
      this.waveActive = true;
      this.enemiesSpawned = 0;

      // ✅ Hide button when wave starts
      this.startWaveButton.setVisible(false);
      this.startCountdown();
    }
  }

  checkWaveEnd() {
    if (this.waveActive && this.enemies.getLength() === 0 && this.enemiesSpawned === this.WAVE_SIZE) {
      this.waveActive = false;
      this.WAVE_NUMBER++;
      this.WAVE_SIZE += this.WAVE_ACCUMULATOR;

      this.ENEMY_SPEED *= this.const_speed_multiplier;
      this.multiplier = (this.multiplier * this.const_speed_multiplier).toFixed(
        2
      );
      this.enemiesSpawned = 0;

      // ✅ Update button text and make it visible again
      this.startWaveButton.setText(`Start Wave ${this.WAVE_NUMBER}`);
      this.startWaveButton.setVisible(true);
      
      this.countdownSeconds = 60;
      this.countdownText.setText(`Time: ${this.countdownSeconds}     x${this.multiplier}`);
      
      // Stop the current timer
      if (this.countdownTimer) {
        this.countdownTimer.remove();
      }

      this.updateEnemySpeedDisplay();
      
      // Don't start a new timer until the next wave begins
    }
  }

  checkEnemyBaseAttacks() {
    this.enemies.getChildren().forEach((enemy) => {
      if (enemy instanceof Enemy && enemy.isAtEnd) {
        this.baseHealth -= enemy.damage;
        this.baseHealthText.setText(`HP: ${Math.max(0, this.baseHealth)}`);
        enemy.destroy();
        this.enemiesAlive--;
        console.log("Base HP: ",this.baseHealth);
        if (this.baseHealth <= 0) {
          this.gameOver();
        }
      }
    });
  }

  gameOver() {
    this.scene.pause();
    this.scene.launch('GameOverScene');
  }

  blinkResourceText(resourceText, duration = 3000) { // Default duration: 3 seconds
    let isRed = false;
    const originalColor = resourceText.style.color; // Store the original color
    let elapsedTime = 0;
  
    function toggleColor(time, delta) {
      elapsedTime += delta;
      if (elapsedTime >= duration) {
        resourceText.setColor(originalColor);
        resourceText.scene.events.off('update', toggleColor); // Remove the listener
        return;
      }
  
      if (elapsedTime % 500 < delta) { // Toggle roughly every 500ms
          if (isRed) {
            resourceText.setColor(originalColor);
          } else {
            resourceText.setColor("#ff0000"); // Red color
          }
          isRed = !isRed;
      }
    }
  
    // Add an 'update' event listener to the scene
    resourceText.scene.events.on('update', toggleColor);
  }

  restoreUI() {
    this.towerMenu.setVisibleAllUI(true);
    this.startWaveButton.setVisible(true);
    this.exitButton.setVisible(true);
  }
}



export default GameScene;