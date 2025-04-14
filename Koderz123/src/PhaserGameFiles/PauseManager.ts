export class PauseManager {
    private scene: Phaser.Scene;
    private pauseButton: Phaser.GameObjects.Container | null = null;
    private isPaused: boolean = false;
    private startWaveButton: Phaser.GameObjects.Text;
    private towerMenu: Phaser.GameObjects.Container;
    private exitButton: Phaser.GameObjects.Container;
  
    constructor(scene: Phaser.Scene, startWaveButton: Phaser.GameObjects.Text, towerMenu: Phaser.GameObjects.Container, exitButton: Phaser.GameObjects.Container) {
      this.scene = scene;
      this.startWaveButton = startWaveButton;
      this.towerMenu = towerMenu;
      this.exitButton = exitButton;
      this.createPauseButton();
    }
  
    private createPauseButton() {
      const x = 150;
      const y = 50;
  
      // Create a basic Pause button here (You can adjust this to your design)
      const buttonBg = this.scene.add.graphics();
      buttonBg.fillStyle(0x2d2c2b, 1);
      buttonBg.fillRoundedRect(-50, -25, 100, 50, 10);
      
      const buttonText = this.scene.add.text(0, 0, "Pause", {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      }).setOrigin(0.5);
  
      this.pauseButton = this.scene.add.container(x, y, [buttonBg, buttonText]);
      this.pauseButton.setSize(100, 50);
  
      const hitArea = this.scene.add.rectangle(0, 0, 100, 50).setOrigin(0.5);
      this.pauseButton.add(hitArea);
      hitArea.setInteractive({ cursor: "pointer" });
  
      // Pause button interactions
      hitArea.on("pointerdown", this.togglePause, this);
    }
  
    private togglePause() {
      if (this.isPaused) {
        // Resume the game
        this.scene.scene.resume();  
        this.startWaveButton.setVisible(true);  // Show Start Wave button
        this.isPaused = false;
        this.scene.events.emit('game-resumed');  // Emit custom event for resume
      } else {
        // Pause the game
        this.scene.scene.pause();
        this.startWaveButton.setVisible(false);  // Hide Start Wave button when paused
        this.isPaused = true;
        this.scene.events.emit('game-paused');  // Emit custom event for pause
      }
  
      // Toggle visibility of UI elements
      this.toggleUIVisibility();
    }
  
    private toggleUIVisibility() {
      // Toggle visibility based on whether the game is paused
      this.startWaveButton.setVisible(!this.isPaused);
      this.towerMenu.setVisible(!this.isPaused);
      this.exitButton.setVisible(true);  // Keep Exit Button visible
    }
  
    public setPauseButtonVisibility(visible: boolean) {
      if (this.pauseButton) {
        this.pauseButton.setVisible(visible);
      }
    }
  }
  