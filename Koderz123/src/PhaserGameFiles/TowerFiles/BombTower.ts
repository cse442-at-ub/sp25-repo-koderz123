// BombTower.ts
import Tower from "./Tower";
import GameScene from "../GameScene"; // Adjust the path if needed

class BombTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Call base class constructor with bomb tower-specific texture
    super(scene, x, y, "bomb-tower");

    this.range = 120;
    this.cost = 200;
    this.upgradeCost = 250;
    this.fireRate = 1500; // Slower fire rate due to explosions

    // Adjust scale or add explosion effect
    this.setScale(0.35);
  }

  dealDamage(enemies: Phaser.GameObjects.GameObject[]) {
    enemies.forEach((enemy) => {
      if (enemy.getData("health")) {
        enemy.setData("health", enemy.getData("health") - 40);
        console.log(`Bomb exploded! Enemy took 40 damage.`);
        console.log(`Enemy health after explosion: ${enemy.getData("health")}`);
        if (enemy.getData("health") <= 0) {
          enemy.destroy();
        }
      }
    });
  }

  createExplosionEffect(x: number, y: number) {
    const explosion = this.scene.add.circle(x, y, 30, 0xff4500, 0.5);
    this.scene.tweens.add({
      targets: explosion,
      scale: 2,
      alpha: 0,
      duration: 400,
      onComplete: () => explosion.destroy(),
    });
  }

  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.isPlaced) return;

    const gameScene = this.scene as GameScene;
    const enemies = gameScene.enemies.getChildren() as any[];

    if (time > this.nextFire) {
      const targetEnemies = enemies.filter((enemy) =>
        Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range
      );

      if (targetEnemies.length > 0) {
        this.createExplosionEffect(this.x, this.y);
        this.dealDamage(targetEnemies);
      }

      this.nextFire = time + this.fireRate;
    }
  }
}

export default BombTower;
