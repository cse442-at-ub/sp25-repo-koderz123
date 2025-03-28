//@ts-nocheck
import Phaser from "phaser";

class Tower extends Phaser.GameObjects.Image {
  public range: number;
  public cost: number;
  public isPlaced: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = "default-tower") {
    super(scene, x, y, texture);
    this.range = 100;
    this.cost = 100;
    this.isPlaced = false;

    this.setInteractive();
    this.setScale(0.5);
    scene.add.existing(this);
  }

  place(x: number, y: number) {
    this.setPosition(x, y);
    this.isPlaced = true;
    this.setAlpha(1);
  }

  showRange() {
    const g = this.scene.add.graphics();
    g.lineStyle(2, 0x00ff00, 0.5);
    g.strokeCircle(this.x, this.y, this.range);
    g.setDepth(-1);
  }

  update(time: number, delta: number) {
    if (!this.isPlaced) return;
    // Logic for targeting/firing here
  }
}

export default Tower;
