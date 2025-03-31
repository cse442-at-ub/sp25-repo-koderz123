//@ts-nocheck
import Phaser from "phaser";
import GameScene from "./GameScene"; // Updated import

class Enemy extends Phaser.GameObjects.Image {
  follower: { t: number; vec: Phaser.Math.Vector2 };
  scene: GameScene;
  public slowFactor: number = 1; // 1 = normal speed
  private slowDuration: number = 0; // ms remaining
  public baseSpeed: number = 1; // your original speed setting (optional)


  constructor(scene: GameScene) {
    super(scene, 0, 0, "enemy");
    this.scene = scene;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    scene.add.existing(this);
  }

  update(time: number, delta: number) {
    if (this.slowDuration > 0) {
      this.slowDuration -= delta;
      if (this.slowDuration <= 0) {
        this.slowFactor = 1;
        this.clearTint(); // remove blue tint if any
      }
    }
  
    if (this.follower.t < 1) {
      const effectiveSpeed = this.scene.ENEMY_SPEED * this.slowFactor;
      this.follower.t += effectiveSpeed * delta;
  
      this.scene.path.getPoint(this.follower.t, this.follower.vec);
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
    } else {
      this.setActive(false);
      this.setVisible(false);
      this.scene.enemyDied();
    }
  }

  applySlow(factor: number, duration: number) {
    this.slowFactor = factor;
    this.slowDuration = duration;
  }
  

  startOnPath() {
    this.follower.t = 0;
    this.scene.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    this.setActive(true);
    this.setVisible(true);
    this.setScale(0.175); // Scale down the enemy
    this.scene.enemiesAlive++; // Track number of alive enemies
  }
}

export default Enemy;
