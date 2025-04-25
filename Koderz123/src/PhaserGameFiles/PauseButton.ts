// PauseButton.ts
import Phaser from "phaser";

/**
 * Same size / logic as before, but uses the Tower-Menu palette:
 *   • normal fill  = #2c3e50
 *   • hover  fill  = #34495e
 */
export default class PauseButton extends Phaser.GameObjects.Text {
  private sceneRef: Phaser.Scene;
  private tooltip: Phaser.GameObjects.Text | null = null;

  // palette
  private readonly normalBg = "#2c3e50";
  private readonly hoverBg  = "#34495e";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "⏸", {
      fontSize: "32px",
      color: "#ffffff",
      backgroundColor: "#2c3e50",           // << new base color
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    this.sceneRef = scene;

    this.setInteractive({ useHandCursor: true });
    this.on("pointerdown", this.togglePause, this);
    this.on("pointerover", this.onHover, this);
    this.on("pointerout", this.onOut, this);

    scene.add.existing(this);
  }

  private togglePause(): void {
    if (!(this.sceneRef as any).isGamePaused) {
      (this.sceneRef as any).pauseGame();
      this.setText("▶");
    } else {
      (this.sceneRef as any).resumeGame();
      this.setText("⏸");
    }
  }

  private onHover(): void {
    // change fill color
    this.setStyle({ backgroundColor: this.hoverBg });

    // scale animation
    this.sceneRef.tweens.add({
      targets: this,
      scale: 1.1,
      duration: 150,
      ease: "Power2",
    });

    const tipTxt = (!(this.sceneRef as any).isGamePaused) ? "Pause" : "Resume";
    const offsetX = 25;
    const offsetY = 20;
    this.tooltip = this.sceneRef.add
      .text(this.x + offsetX, this.y - offsetY, tipTxt, {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { left: 5, right: 5, top: 2, bottom: 2 },
      })
      .setOrigin(0.5);
  }

  private onOut(): void {
    // revert fill color
    this.setStyle({ backgroundColor: this.normalBg });

    this.sceneRef.tweens.add({
      targets: this,
      scale: 1.0,
      duration: 150,
      ease: "Power2",
    });

    if (this.tooltip) {
      this.tooltip.destroy();
      this.tooltip = null;
    }
  }
}

