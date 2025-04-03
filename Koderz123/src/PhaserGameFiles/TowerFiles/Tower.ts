//@ts-nocheck
import Phaser from "phaser";
import GameScene from "../GameScene";

class Tower extends Phaser.GameObjects.Image {
  public range: number;
  public cost: number;
  public isPlaced: boolean;
  public upgradeCost: number; // Cost to upgrade the tower
  public fireRate: number; // Added fire rate property
  public nextFire: number; // Time until next fire

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = "default-tower") {
    super(scene, x, y, texture);
    this.scene = scene;
    this.range = 100;
    this.cost = 100;
    this.isPlaced = false;
    this.level = 1; // Initialize level
    this.upgradeCost = 50; // Initialize upgrade cost

    this.setInteractive();

    this.setScale(0.275);

    this.fireRate = 1000; // Initial fire rate (milliseconds per fire)
    this.nextFire = 0;

    scene.add.existing(this);
  }

  place(x: number, y: number) {
    this.setPosition(x, y);
    this.isPlaced = true;
    this.setAlpha(1);
  }


  public setValidPlacement(isValid: boolean) {
    this.setTint(isValid ? 0xffffff : 0xff4444); // red if invalid
  }

  showRange() {
    if (!this.rangeCircle) {
      this.rangeCircle = this.scene.add.graphics();
      this.rangeCircle.fillStyle(0x00ffff, 0.2); // semi-opaque cyan
      this.rangeCircle.fillCircle(this.x, this.y, this.range);
      this.rangeCircle.setDepth(-1); // behind tower
    }
  }

  hideRange() {
    if (this.rangeCircle) {
      this.rangeCircle.destroy();
      this.rangeCircle = undefined;
    }
  }

  upgrade() {
    this.level++;
    this.range += 20; // Example upgrade: increase range
    this.upgradeCost += 50; // Example upgrade: increase upgrade cost

    // Update visual representation (e.g., change texture or add effects)
    console.log(`Tower upgraded to level ${this.level}`);
  }

  update(time: number, delta: number) {
    if (!this.isPlaced) return;
    // Logic for targeting/firing here
  }
}

export default Tower;
