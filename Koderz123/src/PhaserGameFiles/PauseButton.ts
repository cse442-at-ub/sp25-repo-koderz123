// PauseButton.ts
import Phaser from "phaser";

export default class PauseButton extends Phaser.GameObjects.Text {
  private sceneRef: Phaser.Scene;
  private tooltip: Phaser.GameObjects.Text | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Set the default text to the pause symbol because the game starts running.
    super(scene, x, y, "⏸", {
      fontSize: "32px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    });
    this.sceneRef = scene;

    // Enable interactivity and add events.
    this.setInteractive({ useHandCursor: true });
    this.on("pointerdown", this.togglePause, this);
    this.on("pointerover", this.onHover, this);
    this.on("pointerout", this.onOut, this);

    scene.add.existing(this);
  }

  private togglePause(): void {
    // Delegate pause/resume to GameScene's methods.
    if (!(this.sceneRef as any).isGamePaused) {
      (this.sceneRef as any).pauseGame();
      // When paused, show the play/resume symbol.
      this.setText("▶");
    } else {
      (this.sceneRef as any).resumeGame();
      // When running, show the pause symbol.
      this.setText("⏸");
    }
  }

  // Hover animation: slightly increase scale when hovered.
  private onHover(): void {
    this.sceneRef.tweens.add({
      targets: this,
      scale: 1.1,
      duration: 150,
      ease: "Power2"
    });
    // Determine tooltip text based on game state.
    const tooltipText = (!(this.sceneRef as any).isGamePaused) ? "Pause" : "Resume";
    // Add an x offset if the tooltip is leaning too far right.
    const offsetX = 25; // Horizontal offset
    const offsetY = 20; // Lower the tooltip less (i.e., closer to the button)
    this.tooltip = this.sceneRef.add.text(this.x + offsetX, this.y - offsetY, tooltipText, {
      fontSize: "16px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { left: 5, right: 5, top: 2, bottom: 2 },
      align: "center"
    }).setOrigin(0.5);
  }

  // When the pointer leaves, scale back to normal and remove the tooltip.
  private onOut(): void {
    this.sceneRef.tweens.add({
      targets: this,
      scale: 1.0,
      duration: 150,
      ease: "Power2"
    });
    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }
}

