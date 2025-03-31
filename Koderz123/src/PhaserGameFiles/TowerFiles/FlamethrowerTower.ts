// FlamethrowerTower.ts
import Tower from "./Tower";
import GameScene from "../GameScene"; // adjust the path if needed


class FlamethrowerTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Call base class constructor with flamethrower-specific texture
    super(scene, x, y, "flamethrower-tower");

    this.range = 100;
    this.cost = 150;
    this.upgradeCost = 200;
    this.fireRate = 250;

    // Optionally, adjust scale or add visuals for effect
    this.setScale(0.30);
  }

  dealDamage(enemy: Phaser.GameObjects.GameObject) {
    if (enemy.getData("health")) {
      enemy.setData("health", enemy.getData("health") - 20);
      console.log(`Tower dealt 20 damage to enemy.`);
      console.log(`Enemy health after damage: ${enemy.getData("health")}`);
      if(enemy.getData('health') <= 0){
        enemy.destroy();
      }
    }
  }

  // Later: You can override update() for slowing effect
  update(time: number, delta: number) {
    super.update(time, delta);
    if (!this.isPlaced) return;
  
    const gameScene = this.scene as GameScene;
    const enemies = gameScene.enemies.getChildren() as any[];
    
    if (time > this.nextFire){
        enemies.forEach((enemy) => {
            console.log("Checking each enemy!");
        if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range) {
            this.dealDamage(enemy)
        }
        });
        this.nextFire = time + this.fireRate;
    }
  }
}

export default FlamethrowerTower;