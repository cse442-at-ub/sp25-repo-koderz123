import Phaser from "phaser";

class ExitButton {
  // === Config ===
  private readonly width = 100;
  private readonly height = 50;
  private readonly cornerRadius = 10;
  private readonly buttonColor = 0x2d2c2b;
  private readonly hoverColor = 0x1e1e1e;

  // === Scene & UI ===
  private scene: Phaser.Scene;
  private buttonContainer!: Phaser.GameObjects.Container;
  private buttonBg!: Phaser.GameObjects.Graphics;
  private buttonText!: Phaser.GameObjects.Text;
  private popupContainer!: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createExitButton();
  }

  // === Create the main Exit button ===
  private createExitButton() {
    const x = 70;
    const y = 50;

    this.buttonBg = this.scene.add.graphics();
    this.drawButton(this.buttonColor);

    this.buttonText = this.scene.add.text(0, 0, "Exit", {
      fontSize: "20px",
      fontFamily: "Arial",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5).setDepth(1);

    this.buttonContainer = this.scene.add.container(x, y, [this.buttonBg, this.buttonText]);
    this.buttonContainer.setSize(this.width, this.height).setDepth(10);

    const hitArea = this.scene.add.rectangle(0, 0, this.width, this.height).setOrigin(0.5);
    this.buttonContainer.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });

    // Interactivity
    hitArea.on("pointerover", this.onHover, this);
    hitArea.on("pointerout", this.onHoverOut, this);
    hitArea.on("pointerdown", this.onPress, this);
    hitArea.on("pointerup", this.onRelease, this);
  }

  // === Draw button with rounded corners and outline ===
  private drawButton(color: number) {
    this.buttonBg.clear();
    this.buttonBg.lineStyle(2, 0xffffff, 1);
    this.buttonBg.strokeRoundedRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
      this.cornerRadius
    );
    this.buttonBg.fillStyle(color, 1);
    this.buttonBg.fillRoundedRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
      this.cornerRadius
    );
  }

  // === Hover & Press Effects ===
  private onHover() {
    this.drawButton(this.hoverColor);
    this.scene.tweens.add({
      targets: this.buttonContainer,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 100,
    });
  }

  private onHoverOut() {
    this.drawButton(this.buttonColor);
    this.scene.tweens.add({
      targets: this.buttonContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 100,
    });
  }

  private onPress() {
    this.scene.tweens.add({
      targets: this.buttonContainer,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 80,
    });
  }

  private onRelease() {
    this.scene.tweens.add({
      targets: this.buttonContainer,
      scaleX: 1,
      scaleY: 1,
      duration: 80,
    });
    this.showConfirmationPopup();
  }

  // === Show Confirm Popup ===
  private showConfirmationPopup() {
    const { width, height } = this.scene.scale;
    const popupWidth = 300;
    const popupHeight = 150;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x222222, 0.95);
    bg.lineStyle(2, 0xffffff, 1);
    bg.strokeRoundedRect(0, 0, popupWidth, popupHeight, 15);
    bg.fillRoundedRect(0, 0, popupWidth, popupHeight, 15);

    const message = this.scene.add.text(popupWidth / 2, 30, "Are you sure?", {
      fontSize: "20px",
      color: "#ffffff",
    }).setOrigin(0.5);

    const yesButton = this.createPopupButton("Yes", popupWidth / 4, 100, () => {
      window.location.href = "/CSE442/2025-Spring/cse-442p/#/mainmenu";
    });

    const noButton = this.createPopupButton("No", (3 * popupWidth) / 4, 100, () => {
      this.popupContainer.destroy(true);
    });

    this.popupContainer = this.scene.add.container(
      width / 2 - popupWidth / 2,
      height / 2 - popupHeight / 2,
      [bg, message, yesButton, noButton]
    );
    this.popupContainer.setDepth(20);
  }

  // === Create a rounded popup button with label ===
  private createPopupButton(label: string, x: number, y: number, onClick: () => void) {
    const btnWidth = 80;
    const btnHeight = 40;
    const radius = 8;

    const bg = this.scene.add.graphics();
    bg.lineStyle(2, 0xffffff, 1);
    bg.strokeRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, radius);
    bg.fillStyle(this.buttonColor, 1);
    bg.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, radius);

    const text = this.scene.add.text(0, 0, label, {
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    const container = this.scene.add.container(x, y, [bg, text]);
    container.setSize(btnWidth, btnHeight);

    const hitArea = this.scene.add.rectangle(0, 0, btnWidth, btnHeight).setOrigin(0.5);
    container.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });
    hitArea.on("pointerup", onClick);

    return container;
  }
}

export default ExitButton;
