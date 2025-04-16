import Phaser from "phaser";

class ShopMenu {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private shopBackground: Phaser.GameObjects.Graphics;

  // Dimensions and layout.
  private panelWidth: number;
  private panelHeight: number;
  private bottomPadding: number;

  // Callback for when the shop panel is closed via its back button.
  private onCloseCallback: () => void;

  constructor(
    scene: Phaser.Scene,
    panelWidth: number,
    panelHeight: number,
    bottomPadding: number,
    onCloseCallback: () => void
  ) {
    this.scene = scene;
    this.panelWidth = panelWidth;
    this.panelHeight = panelHeight;
    this.bottomPadding = bottomPadding;
    this.onCloseCallback = onCloseCallback;
    const { height } = scene.scale;
    const yHidden = height + bottomPadding;

    // Create shop background graphics.
    this.shopBackground = scene.add.graphics();
    this.drawMenuBackground(this.shopBackground, panelWidth, panelHeight);

    // Create the container; using horizontal padding of 20.
    this.container = scene.add.container(20, yHidden).setDepth(9).setVisible(false);
    this.container.add(this.shopBackground);

    // Add placeholder shop content.
    const shopText = scene.add.text(20, 20, "Shop Page - Coming Soon", {
      fontSize: "20px",
      color: "#ffffff",
    });
    this.container.add(shopText);

    // Add a "Back" button that triggers closing the shop panel.
    const backButton = scene.add.text(10, panelHeight - 30, "← Back", {
      fontSize: "16px",
      backgroundColor: "#333",
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
      color: "#fff",
    })
      .setInteractive()
      .on("pointerdown", () => {
        this.close(() => {
          this.onCloseCallback();
        });
      });
    this.container.add(backButton);
  }

  // Helper: draw a rounded rectangle background.
  private drawMenuBackground(target: Phaser.GameObjects.Graphics, panelWidth: number, panelHeight: number) {
    target.clear();
    target.fillStyle(0x222222, 0.95);
    target.lineStyle(2, 0xffffff, 1);
    target.strokeRoundedRect(0, 0, panelWidth, panelHeight, 15);
    target.fillRoundedRect(0, 0, panelWidth, panelHeight, 15);
  }

  // Open the shop panel at a specified y position.
  public open(y: number, duration: number = 300) {
    this.container.setVisible(true);
    this.scene.tweens.add({
      targets: this.container,
      y: y,
      duration: duration,
      ease: "Back.easeOut"
    });
  }

  // Close the shop panel (animate off-screen) with an optional callback.
  public close(callback?: () => void, duration: number = 250) {
    const { height } = this.scene.scale;
    const yHidden = height + this.bottomPadding;
    this.scene.tweens.add({
      targets: this.container,
      y: yHidden,
      duration: duration,
      ease: "Back.easeIn",
      onComplete: () => {
        this.container.setVisible(false);
        if (callback) callback();
      }
    });
  }

  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }
}

export default ShopMenu;