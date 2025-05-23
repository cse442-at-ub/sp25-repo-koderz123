// FlamethrowerTower.ts
import Tower from "./Tower";
import RelaxedGameScene from "../RelaxedGameScene"; // Adjust the path if needed
import IntenseGameScene from "../IntenseGameScene";
import BrutalGameScene from "../BrutalGameScene";


class ShockTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Call base class constructor with flamethrower-specific texture
    super(scene, x, y, "shock-tower");

    this.range = 100;
    this.cost = 150;
    this.upgradeCost = 200;
    this.fireRate = 250; // Faster AOE damage rate
    this.damage = 20; // Base damage

    // Optionally, adjust scale or add visuals for effect
    this.setScale(0.30);
  }

  dealDamage(enemy: Phaser.GameObjects.GameObject) {
    if (enemy.getData("health")) {
      enemy.setData("health", enemy.getData("health") - this.damage);
      console.log(`Shock AOE dealt ${this.damage} damage. Enemy health: ${enemy.getData("health")}`);
    }
  }

  upgrade() {
    super.upgrade(); // Call base class upgrade
    this.damage += 10; // Increase damage by 10
    this.fireRate *= 0.9; // Increase fire rate by 10%
    console.log(`Shock upgraded to level ${this.level}. Damage: ${this.damage}, Fire Rate: ${this.fireRate}`);
  }

  update(time: number) {
    if (!this.isPlaced) return;
  
    const gameScene = this.scene as RelaxedGameScene | IntenseGameScene | BrutalGameScene;
    const enemies = gameScene.enemies.getChildren() as any[];
    
    if (time > this.nextFire){
      enemies.forEach((enemy) => {
        if (enemy.active && Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <= this.range) {
            this.dealDamage(enemy);
            console.log(`Shock AOE dealt damage to enemy at (${enemy.x}, ${enemy.y})`);
            if(enemy.getData('health') <= 0){
              gameScene.resources += enemy.value;
              console.log("Resources now after health <= 0: ", gameScene.resources);
              gameScene.updateResourceText();
              enemy.destroy();
            }

        }
      });
      this.nextFire = time + this.fireRate; // Restore original timing
    }
  }


}

export default ShockTower;