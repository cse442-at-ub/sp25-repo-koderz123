// TowerButton.ts
import Phaser from "phaser";

class TowerButton {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private bg: Phaser.GameObjects.Graphics;
  private icon: Phaser.GameObjects.Image;
  private onClick: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, iconKey: string, onClick: () => void) {
    this.scene = scene;
    this.onClick = onClick;

    this.bg = scene.add.graphics();
    this.drawButton(0x2d2c2b);

    this.icon = scene.add.image(0, 0, iconKey).setScale(0.4).setDepth(1);

    this.container = scene.add.container(x, y, [this.bg, this.icon]);
    this.container.setSize(60, 60).setDepth(10);

    const hitArea = scene.add.rectangle(0, 0, 60, 60).setOrigin(0.5);
    this.container.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });

    hitArea.on("pointerover", this.onHover, this);
    hitArea.on("pointerout", this.onHoverOut, this);
    hitArea.on("pointerdown", this.onPress, this);
    hitArea.on("pointerup", this.onRelease, this);
  }

  private drawButton(color: number) {
    this.bg.clear();
    this.bg.lineStyle(2, 0xffffff, 1);
    this.bg.strokeRoundedRect(-30, -30, 60, 60, 10);
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(-30, -30, 60, 60, 10);
  }

  private onHover() {
    this.drawButton(0x1e1e1e);
    this.scene.tweens.add({ targets: this.container, scaleX: 1.05, scaleY: 1.05, duration: 100 });
  }

  private onHoverOut() {
    this.drawButton(0x2d2c2b);
    this.scene.tweens.add({ targets: this.container, scaleX: 1, scaleY: 1, duration: 100 });
  }

  private onPress() {
    this.scene.tweens.add({ targets: this.container, scaleX: 0.9, scaleY: 0.9, duration: 80 });
  }

  private onRelease() {
    this.scene.tweens.add({ targets: this.container, scaleX: 1, scaleY: 1, duration: 80 });
    this.onClick();
  }

  public destroy() {
    this.container.destroy(true);
  }
}

export default TowerButton;
