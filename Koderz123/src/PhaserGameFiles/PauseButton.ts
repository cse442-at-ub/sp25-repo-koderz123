// PauseButton.ts
import Phaser from "phaser";

export default class PauseButton extends Phaser.GameObjects.Text {
  // We'll track the pause state both here and update the scene accordingly.
  public isGamePaused: boolean = false;
  private sceneRef: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "Pause", {
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });

    this.sceneRef = scene;
    this.setInteractive({ useHandCursor: true });
    this.on("pointerdown", this.togglePause, this);
    scene.add.existing(this);
  }

  // Toggle between pausing and resuming the game.
  private togglePause(): void {
    if (!this.isGamePaused) {
      this.pauseGame();
    } else {
      this.resumeGame();
    }
  }

  // Pause the game: update the button text, pause timers and tweens,
  // and set the scene's pause flag.
  public pauseGame() {
    this.isGamePaused = true;

    // Access and pause the scene's countdown timer if it exists.
    if ((this.sceneRef as any).countdownTimer) {
      ((this.sceneRef as any).countdownTimer).paused = true;
    }
    // Pause any tweens running in the scene.
    this.sceneRef.tweens.pauseAll();
    this.setText("Resume");

    // Also update a global pause flag on the scene so that enemy updates, etc., can check it.
    (this.sceneRef as any).isGamePaused = true;
  }

  // Resume the game: update the button text, resume timers and tweens,
  // and reset the scene's pause flag.
  public resumeGame() {
    this.isGamePaused = false;

    if ((this.sceneRef as any).countdownTimer) {
      ((this.sceneRef as any).countdownTimer).paused = false;
    }
    this.sceneRef.tweens.resumeAll();
    this.setText("Pause");

    (this.sceneRef as any).isGamePaused = false;
  }
}
