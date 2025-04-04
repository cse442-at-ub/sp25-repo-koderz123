// SlowFrostTower.ts
import Tower from "./Tower";
import GameScene from "../GameScene";

class SlowFrostTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "frost-tower");

    this.range = 120;
    this.cost = 200; // Higher cost for upgrade
    this.upgradeCost = 100;
    this.damage = 25; // Higher damage
    this.fireRate = 4000; // Slower fire rate (4 seconds)
    this.projectileSpeed = 4; // Slower projectile speed
    this.slowFactor = 0.7; // Stronger slow effect
    this.slowDuration = 1500; // Longer slow duration

    this.setScale(0.18);
  }

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

export default SlowFrostTower; 