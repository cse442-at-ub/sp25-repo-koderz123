//@ts-nocheck
import Phaser from "phaser";

/**
 * StartWaveButton
 * • Base = #4b2f4e  • Hover = #3d263f  • White outline
 * • Offset  (+30 px right, –20 px up) applied automatically
 */
class StartWaveButton {
  private scene: Phaser.Scene;
  private buttonBg: Phaser.GameObjects.Graphics;
  private buttonText: Phaser.GameObjects.Text;
  private onClick: () => void;

  // colour palette
  private defaultColor = 0x2f4f36;
  private hoverColor   = 0x253c2a;
  private outlineColor = 0xffffff;

  // size
  private width = 220;
  private height = 60;

  // position offsets  ← tweak here
  private readonly offsetX = 25;   // move right
  private readonly offsetY = -15;  // move up

  private container!: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialText: string,
    onClick: () => void
  ) {
    this.scene   = scene;
    this.onClick = onClick;

    /* background */
    this.buttonBg = scene.add.graphics();
    this.drawButton(this.defaultColor);

    /* label */
    this.buttonText = scene.add.text(0, 0, initialText, {
      fontSize: "24px",
      fontFamily: "Arial",
      color: "#ffffff",
      fontStyle: "bold",
    })
    .setOrigin(0.5)
    .setDepth(1);

    /* container (apply offsets) */
    this.container = scene.add.container(
      x + this.offsetX,
      y + this.offsetY,
      [this.buttonBg, this.buttonText]
    );
    this.container.setSize(this.width, this.height).setDepth(1);

    /* hit-area */
    const hitArea = scene.add.rectangle(0, 0, this.width, this.height).setOrigin(0.5);
    this.container.add(hitArea);
    hitArea.setInteractive({ cursor: "pointer" });
    hitArea.on("pointerover", this.onHover,  this);
    hitArea.on("pointerout",  this.onHoverOut, this);
    hitArea.on("pointerdown", this.onPress,  this);
    hitArea.on("pointerup",   this.onRelease, this);
  }

  /* -------------------------------------------------- */
  private drawButton(color: number) {
    this.buttonBg.clear();
    this.buttonBg.lineStyle(2, this.outlineColor, 1);
    this.buttonBg.strokeRoundedRect(-this.width/2, -this.height/2, this.width, this.height, 15);
    this.buttonBg.fillStyle(color, 1);
    this.buttonBg.fillRoundedRect(-this.width/2, -this.height/2, this.width, this.height, 15);
  }

  private onHover() {
    this.drawButton(this.hoverColor);
    this.scene.tweens.add({ targets: this.container, scale: 1.05, duration: 150 });
  }

  private onHoverOut() {
    this.drawButton(this.defaultColor);
    this.scene.tweens.add({ targets: this.container, scale: 1, duration: 150 });
  }

  private onPress() {
    this.scene.tweens.add({ targets: this.container, scale: 0.9, duration: 100 });
  }

  private onRelease() {
    this.scene.tweens.add({ targets: this.container, scale: 1, duration: 100 });
    this.onClick();
  }

  /* helpers */
  public setText(txt: string)       { this.buttonText.setText(txt); }
  public setVisible(v: boolean)     { this.container.setVisible(v); }
  public setPosition(nx: number, ny: number) {
    this.container.setPosition(nx + this.offsetX, ny + this.offsetY);
  }
}

export default StartWaveButton;

