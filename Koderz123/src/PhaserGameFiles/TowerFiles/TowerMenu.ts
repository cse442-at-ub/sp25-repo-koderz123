
// TowerMenu.ts
import Phaser from "phaser";

class TowerMenu {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Graphics;
  private open = false;
  private onTowerSelect: (type: string) => void;

  private menuHeight = 60;
  private menuPadding = 20;
  private buttonHeight = 60;
  private bottomPadding = 10;
  private leftPadding = 30;
  private towerTypes = ["Frost", "Flamethrower"];
  private buttonList: Phaser.GameObjects.Text[] = [];

  private hamburgerButton!: Phaser.GameObjects.Container;
  private buttonBg!: Phaser.GameObjects.Graphics;
  private buttonText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onTowerSelect: (type: string) => void) {
    this.scene = scene;
    this.onTowerSelect = onTowerSelect;


    const { width, height } = scene.scale;

    this.background = scene.add.graphics();
    this.drawMenuBackground(width, this.menuHeight);

    this.container = scene.add.container(this.menuPadding, height + this.bottomPadding).setDepth(9).setVisible(false);
    this.container.add(this.background);

    // Tower buttons
    this.towerTypes.forEach((type, index) => {
      const btn = scene.add.text(10 + index * 140, 10, `🛡️ ${type}`, {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#555",
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.onTowerSelect(type);
      });

      this.container.add(btn);
      this.buttonList.push(btn);
    });

    // Hamburger
    const hamburgerX = this.menuPadding + this.leftPadding;
    const hamburgerY = height - this.menuHeight - this.buttonHeight - this.bottomPadding;

    this.buttonBg = scene.add.graphics();
    this.drawButton(0x2d2c2b);

    this.buttonText = scene.add.text(0, 0, "☰", {

      fontSize: "24px",
      fontFamily: "Arial",
      color: "#ffffff",
      fontStyle: "bold",

    }).setOrigin(0.5).setDepth(1);

    this.hamburgerButton = scene.add.container(hamburgerX, hamburgerY, [this.buttonBg, this.buttonText]);
    this.hamburgerButton.setSize(60, 60).setDepth(10);

    const hitArea = scene.add.rectangle(0, 0, 60, 60).setOrigin(0.5);
    this.hamburgerButton.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });
    hitArea.on("pointerup", () => this.toggleMenu());
  }

  private drawMenuBackground(width: number, height: number) {
    const paddedWidth = width - this.menuPadding * 2;
    this.background.clear();
    this.background.fillStyle(0x222222, 0.95);
    this.background.lineStyle(2, 0xffffff, 1);
    this.background.strokeRoundedRect(0, 0, paddedWidth, height, 15);
    this.background.fillRoundedRect(0, 0, paddedWidth, height, 15);
  }

  private drawButton(color: number) {

    this.buttonBg.clear();
    this.buttonBg.lineStyle(2, 0xffffff, 1);
    this.buttonBg.strokeRoundedRect(-30, -30, 60, 60, 10);
    this.buttonBg.fillStyle(color, 1);
    this.buttonBg.fillRoundedRect(-30, -30, 60, 60, 10);
  }


  private toggleMenu() {
    const { height } = this.scene.scale;
    const targetY = height - this.menuHeight - this.bottomPadding;
    const hiddenY = height + this.bottomPadding;

    if (!this.open) {
      this.container.setVisible(true);
      this.container.y = hiddenY;

      this.scene.tweens.add({ targets: this.container, y: targetY, duration: 300, ease: "Back.easeOut" });

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




  public setVisibleAllUI(visible: boolean) {
    this.container.setVisible(visible);
    this.hamburgerButton.setVisible(visible);
  }
  

}

export default TowerMenu;
