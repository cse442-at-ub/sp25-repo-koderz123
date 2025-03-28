import Phaser from "phaser";

class TowerMenu {
  // === Config ===
  private readonly menuHeight = 60;
  private readonly menuPadding = 20;
  private readonly bottomPadding = 10;
  private readonly leftPadding = 20;
  private readonly buttonSize = 60;
  private readonly towerSpacing = 140;

  // === Towers ===
  private readonly towerTypes = ["Frost", "Flamethrower"];

  // === State ===
  private open = false;

  // === Scene + UI ===
  private scene: Phaser.Scene;
  private onTowerSelect: (type: string) => void;
  private container!: Phaser.GameObjects.Container;
  private background!: Phaser.GameObjects.Graphics;
  private hamburgerButton!: Phaser.GameObjects.Container;
  private buttonBg!: Phaser.GameObjects.Graphics;
  private buttonText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onTowerSelect: (type: string) => void) {
    this.scene = scene;
    this.onTowerSelect = onTowerSelect;

    this.createHotbar();
    this.createTowerButtons();
    this.createHamburgerButton();
  }

  // === UI Creation ===

  private createHotbar() {
    const { width, height } = this.scene.scale;

    this.background = this.scene.add.graphics();
    this.drawHotbarBackground(width);

    this.container = this.scene.add
      .container(this.menuPadding, height + this.bottomPadding)
      .setDepth(9)
      .setVisible(false);

    this.container.add(this.background);
  }

  private createTowerButtons() {
    this.towerTypes.forEach((type, index) => {
      const btn = this.scene.add.text(
        10 + index * this.towerSpacing,
        10,
        `* ${type}`,
        {
          fontSize: "20px",
          color: "#ffffff",
          backgroundColor: "#555",
          padding: { left: 10, right: 10, top: 6, bottom: 6 },
        }
      )
        .setInteractive()
        .on("pointerdown", () => this.selectTower(type));

      this.container.add(btn);
    });
  }

  private createHamburgerButton() {
    const { height } = this.scene.scale;
    const x = this.menuPadding + this.leftPadding;
    const y = height - this.menuHeight - this.buttonSize - this.bottomPadding;

    this.buttonBg = this.scene.add.graphics();
    this.drawHamburgerBackground(0x2d2c2b);

    this.buttonText = this.scene.add.text(0, 0, "☰", {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#ffffff",
      fontStyle: "bold",
    })
      .setOrigin(0.5)
      .setDepth(1);

    this.hamburgerButton = this.scene.add
      .container(x, y, [this.buttonBg, this.buttonText])
      .setSize(this.buttonSize, this.buttonSize)
      .setDepth(10);

    const hitArea = this.scene.add.rectangle(0, 0, this.buttonSize, this.buttonSize).setOrigin(0.5);
    this.hamburgerButton.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });

    hitArea.on("pointerover", this.onHover, this);
    hitArea.on("pointerout", this.onHoverOut, this);
    hitArea.on("pointerdown", this.onPress, this);
    hitArea.on("pointerup", this.onRelease, this);
  }

  // === Drawing ===

  private drawHotbarBackground(screenWidth: number) {
    const paddedWidth = screenWidth - this.menuPadding * 2;
    this.background.clear();
    this.background.fillStyle(0x222222, 0.95);
    this.background.lineStyle(2, 0xffffff, 1);
    this.background.strokeRoundedRect(0, 0, paddedWidth, this.menuHeight, 15);
    this.background.fillRoundedRect(0, 0, paddedWidth, this.menuHeight, 15);
  }

  private drawHamburgerBackground(color: number) {
    this.buttonBg.clear();
    this.buttonBg.lineStyle(2, 0xffffff, 1);
    this.buttonBg.strokeRoundedRect(-30, -30, 60, 60, 10);
    this.buttonBg.fillStyle(color, 1);
    this.buttonBg.fillRoundedRect(-30, -30, 60, 60, 10);
  }

  // === Animations & Effects ===

  private onHover() {
    this.drawHamburgerBackground(0x1e1e1e);
    this.scene.tweens.add({
      targets: this.hamburgerButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 100,
    });
  }

  private onHoverOut() {
    this.drawHamburgerBackground(0x2d2c2b);
    this.scene.tweens.add({
      targets: this.hamburgerButton,
      scaleX: 1,
      scaleY: 1,
      duration: 100,
    });
  }

  private onPress() {
    this.scene.tweens.add({
      targets: this.hamburgerButton,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 80,
    });
  }

  private onRelease() {
    this.scene.tweens.add({
      targets: this.hamburgerButton,
      scaleX: 1,
      scaleY: 1,
      duration: 80,
    });
    this.toggleMenu();
  }

  // === Menu Open/Close ===

  private toggleMenu() {
    const { height } = this.scene.scale;
    const targetY = height - this.menuHeight - this.bottomPadding;
    const hiddenY = height + this.bottomPadding;

    if (!this.open) {
      this.container.setVisible(true);
      this.container.y = hiddenY;
      this.scene.tweens.add({
        targets: this.container,
        y: targetY,
        duration: 300,
        ease: "Back.easeOut",
      });
    } else {
      this.scene.tweens.add({
        targets: this.container,
        y: hiddenY,
        duration: 250,
        ease: "Back.easeIn",
        onComplete: () => this.container.setVisible(false),
      });
    }

    this.open = !this.open;
  }

  private selectTower(type: string) {
    this.onTowerSelect(type);
    this.open = false;

    const { height } = this.scene.scale;
    const hiddenY = height + this.bottomPadding;

    this.scene.tweens.add({
      targets: this.container,
      y: hiddenY,
      duration: 200,
      ease: "Back.easeIn",
      onComplete: () => this.container.setVisible(false),
    });
  }
}

export default TowerMenu;
