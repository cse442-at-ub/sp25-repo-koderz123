//@ts-nocheck
import Phaser from "phaser";

class StartWaveButton {
  private scene: Phaser.Scene;
  private buttonBg: Phaser.GameObjects.Rectangle;
  private buttonText: Phaser.GameObjects.Text;
  private onClick: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, initialText: string, onClick: () => void) {
    this.scene = scene;
    this.onClick = onClick;

    // ✅ Create background for the button
    this.buttonBg = scene.add.rectangle(x, y, 220, 60, 0x2d2c2b, 0.8)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });

    // ✅ Create text inside the button
    this.buttonText = scene.add.text(x, y, initialText, {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#fff",
      fontStyle: "bold",
    })
      .setOrigin(0.5)
      .setDepth(1); // Ensure text appears above the rectangle

    // ✅ Add animations for hover and click
    this.buttonBg.on("pointerover", () => {
      scene.tweens.add({
        targets: [this.buttonBg, this.buttonText],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 150,
        ease: "Power1",
      });
    });

    this.buttonBg.on("pointerout", () => {
      scene.tweens.add({
        targets: [this.buttonBg, this.buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: "Power1",
      });
    });

    this.buttonBg.on("pointerdown", () => {
      scene.tweens.add({
        targets: [this.buttonBg, this.buttonText],
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 100,
        ease: "Power1",
      });
    });

    this.buttonBg.on("pointerup", () => {
      scene.tweens.add({
        targets: [this.buttonBg, this.buttonText],
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Power1",
      });
      this.onClick(); // Call the click function
    });
  }

  // ✅ Method to update button text
  setText(newText: string) {
    this.buttonText.setText(newText);
  }

  // ✅ Method to show/hide the button
  setVisible(isVisible: boolean) {
    this.buttonBg.setVisible(isVisible);
    this.buttonText.setVisible(isVisible);
  }
}

export default StartWaveButton;
