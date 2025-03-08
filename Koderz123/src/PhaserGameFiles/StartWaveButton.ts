//@ts-nocheck
import Phaser from "phaser";

class StartWaveButton {
  private scene: Phaser.Scene;
  private buttonBg: Phaser.GameObjects.Graphics; // Button background with outline
  private buttonText: Phaser.GameObjects.Text;
  private onClick: () => void;
  private defaultColor = 0x2d2c2b; // Default grey
  private hoverColor = 0x1e1e1e; // Darker grey for hover effect
  private outlineColor = 0xffffff; // White outline
  private width = 220;
  private height = 60;
  private x: number;
  private y: number;
  private container!: Phaser.GameObjects.Container; // Container to hold both elements

  constructor(scene: Phaser.Scene, x: number, y: number, initialText: string, onClick: () => void) {
    this.scene = scene;
    this.onClick = onClick;
    this.x = x;
    this.y = y;

    // ✅ Create button background with rounded corners and outline
    this.buttonBg = scene.add.graphics();
    this.drawButton(this.defaultColor);

    // ✅ Create text inside the button
    this.buttonText = scene.add.text(0, 0, initialText, {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#fff",
      fontStyle: "bold",
    })
      .setOrigin(0.5) // Center text
      .setDepth(1); // Ensure text appears above the rectangle

    // ✅ Create a container to group both the background and text
    this.container = scene.add.container(x, y, [this.buttonBg, this.buttonText]);
    this.container.setSize(this.width, this.height);
    this.container.setDepth(1);

    // ✅ Create an invisible interactive rectangle to capture clicks (since graphics aren't interactive by default)
    const hitArea = scene.add.rectangle(0, 0, this.width, this.height).setOrigin(0.5);
    this.container.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });

    // ✅ Add interactivity to the hit area
    hitArea.on("pointerover", this.onHover, this);
    hitArea.on("pointerout", this.onHoverOut, this);
    hitArea.on("pointerdown", this.onPress, this);
    hitArea.on("pointerup", this.onRelease, this);
  }

  // ✅ Draws the button background with outline
  private drawButton(color: number) {
    this.buttonBg.clear();

    // Draw outline first
    this.buttonBg.lineStyle(2, this.outlineColor, 1); // Thin white outline
    this.buttonBg.strokeRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, 15);

    // Fill with background color
    this.buttonBg.fillStyle(color, 1);
    this.buttonBg.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, 15);
  }

  // ✅ Hover Effect: Darker background + Grow (1.05x scale)
  private onHover() {
    this.drawButton(this.hoverColor);
    this.scene.tweens.add({
      targets: this.container, // Scale the container so everything stays aligned
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 150,
      ease: "Power1",
    });
  }

  // ✅ Reset to normal state when not hovering
  private onHoverOut() {
    this.drawButton(this.defaultColor);
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      duration: 150,
      ease: "Power1",
    });
  }

  // ✅ Click Effect (slightly shrink)
  private onPress() {
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 100,
      ease: "Power1",
    });
  }

  // ✅ Release Effect (restore size & trigger click function)
  private onRelease() {
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      duration: 100,
      ease: "Power1",
    });
    this.onClick();
  }

  // ✅ Method to update button text dynamically
  setText(newText: string) {
    this.buttonText.setText(newText);
  }

  // ✅ Method to show/hide the button
  setVisible(isVisible: boolean) {
    this.container.setVisible(isVisible);
  }
}

export default StartWaveButton;
