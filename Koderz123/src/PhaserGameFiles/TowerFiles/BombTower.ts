import Tower from "./Tower";
import GameScene from "../GameScene"; // Adjust the path if needed

class BombTower extends Tower {
  private blinkDuration: number = 1000; // Time for blinking effect (1 second)
  private blinkInterval: number = 200; // Interval between each blink (200ms)

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bomb-tower");

    this.range = 200;
    this.cost = 200;
    this.upgradeCost = 250;
    this.fireRate = 1500; // Slower fire rate due to explosions
    this.damage = 40;

    this.setScale(0.35);
  }

  dealDamage(enemies: Phaser.GameObjects.GameObject[]) {
    enemies.forEach((enemy) => {
      if (enemy.getData("health")) {
        if ((enemy as Phaser.GameObjects.Sprite).setTint) {
          const sprite = enemy as Phaser.GameObjects.Sprite;
          // Start blinking red effect when damage is dealt
          this.blinkRed(sprite);
          
          // Apply damage after the blinking effect
          this.scene.time.delayedCall(this.blinkDuration, () => {
            sprite.clearTint(); // Remove the red tint
            sprite.setData("health", sprite.getData("health") - this.damage); // Deal damage
            console.log(`Bomb exploded! Enemy took ${this.damage} damage.`);
            console.log(`Enemy health after explosion: ${sprite.getData("health")}`);
  
          });
        }
      }
    });
  }

  // Function to make the enemy blink red like a time bomb
  private blinkRed(enemy: Phaser.GameObjects.Sprite) {
    let scene = this.scene;
    let isRed = false;
    const blinkStartTime = scene.time.now;
    
    // Use a timer to toggle the tint on and off
    scene.time.addEvent({
      delay: this.blinkInterval,
      callback: () => {
        if (scene.time.now - blinkStartTime < this.blinkDuration) {
          if (isRed) {
            enemy.clearTint(); // Reset to original color
          } else {
            enemy.setTint(0xff0000); // Red tint
          }
          isRed = !isRed; // Toggle the tint state
        }
      },
      loop: true, // Repeat the blinking until the duration is over
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

        targetEnemies.forEach((enemy) => {
          if (enemy.getData("health") <= 0) {
            gameScene.resources += enemy.getData("value");
            gameScene.updateResourceText();
            enemy.destroy();
          }
        });
      }

      this.nextFire = time + this.fireRate;
    }
  }

  
}

export default BombTower;
