//@ts-nocheck
import Phaser from "phaser";
import GameScene from "./GameScene"; // Updated import

class Enemy extends Phaser.GameObjects.Image {
  follower: { t: number; vec: Phaser.Math.Vector2 };
  scene: GameScene;

  constructor(scene: GameScene) {
    super(scene, 0, 0, "enemy");
    this.scene = scene;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    scene.add.existing(this);
  }

  update(time: number, delta: number) {
    if (this.follower.t < 1) {
      this.follower.t += this.scene.ENEMY_SPEED * delta;
      this.scene.path.getPoint(this.follower.t, this.follower.vec);
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
    } else {
      this.setActive(false);
      this.setVisible(false);
      this.scene.enemyDied(); // Notify scene that an enemy died
    }
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
