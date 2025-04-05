// FrostTower.ts
import Tower from "./Tower";
import GameScene from "../GameScene"; // adjust the path if needed
import FastFrostTower from "./FastFrostTower";
import SlowFrostTower from "./SlowFrostTower";


class FrostTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Call base class constructor with frost-specific texture
    super(scene, x, y, "frost-tower");

    this.range = 120;
    this.cost = 125;
    this.upgradeCost = 75;
    this.damage = 15; // Base damage for Frost Tower
    this.slowFactor = 0.5;
    this.slowDuration = 1000;

    // Optionally, adjust scale or add visuals for effect
    this.setScale(0.18);
  }

  upgrade() {
    // Instead of normal upgrade, show upgrade options
    const gameScene = this.scene as GameScene;
    gameScene.showUpgradeButton();
  }

  // Method to upgrade to Fast Frost Tower
  upgradeToFast() {
    const gameScene = this.scene as GameScene;
    const newTower = new FastFrostTower(gameScene, this.x, this.y);
    newTower.place(this.x, this.y);
    this.destroy();
  }

  // Method to upgrade to Slow Frost Tower
  upgradeToSlow() {
    const gameScene = this.scene as GameScene;
    const newTower = new SlowFrostTower(gameScene, this.x, this.y);
    newTower.place(this.x, this.y);
    this.destroy();
  }

  // Later: You can override update() for slowing effect
  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.isPlaced) return;
  
    const gameScene = this.scene as GameScene;
    const enemies = gameScene.enemies.getChildren() as any[];
  
    enemies.forEach((enemy) => {
      if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range) {
        enemy.applySlow?.(this.slowFactor, this.slowDuration);
      }
    });
  }
}

export default FrostTower;
