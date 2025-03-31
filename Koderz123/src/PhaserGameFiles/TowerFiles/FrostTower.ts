// FrostTower.ts
import Tower from "./Tower";
import GameScene from "../GameScene"; // adjust the path if needed


class FrostTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Call base class constructor with frost-specific texture
    super(scene, x, y, "frost-tower");

    this.range = 120;
    this.cost = 125;
    this.upgradeCost = 75;

    // Optionally, adjust scale or add visuals for effect
    this.setScale(0.18);
  }

  // Later: You can override update() for slowing effect
  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.isPlaced) return;
  
    const gameScene = this.scene as GameScene;
    const enemies = gameScene.enemies.getChildren() as any[];
  
    enemies.forEach((enemy) => {
      if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range) {
        enemy.applySlow?.(0.5, 1000); // slow to 50% for 1s
      }
    });
  }
}

export default FrostTower;
