// FastFrostTower.ts
import Tower from "./Tower";
import RelaxedGameScene from "../RelaxedGameScene"; // Adjust the path if needed
import IntenseGameScene from "../IntenseGameScene";
import BrutalGameScene from "../BrutalGameScene";

class FastFrostTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "frost-tower");

    this.range = 120;
    this.cost = 200; // Higher cost for upgrade
    this.upgradeCost = 100;
    this.damage = 10; // Lower damage
    this.fireRate = 1500; // Faster fire rate (1.5 seconds)
    this.projectileSpeed = 7; // Faster projectile speed
    this.slowFactor = 0.3; // Less slow effect
    this.slowDuration = 800; // Shorter slow duration

    this.setScale(0.18);
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.isPlaced) return;
  
    const gameScene = this.scene as RelaxedGameScene | IntenseGameScene | BrutalGameScene;
    const enemies = gameScene.enemies.getChildren() as any[];
  
    enemies.forEach((enemy) => {
      if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range) {
        enemy.applySlow?.(this.slowFactor, this.slowDuration);
      }
    });
  }
}

export default FastFrostTower; 