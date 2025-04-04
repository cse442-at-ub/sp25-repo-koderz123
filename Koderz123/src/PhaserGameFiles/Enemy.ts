//@ts-nocheck
import Phaser from "phaser";
import GameScene from "./GameScene"; // Updated import

class Enemy extends Phaser.GameObjects.Image {
  follower: { t: number; vec: Phaser.Math.Vector2 };
  scene: GameScene;
  public slowFactor: number = 1; // 1 = normal speed
  private slowDuration: number = 0; // ms remaining
  public baseSpeed: number = 1; // your original speed setting (optional)

  private health: number;
  damage: number;
  value: number;
  isAtEnd: boolean;
  healthText: Phaser.GameObjects.Text;


  constructor(scene: GameScene) {
    super(scene, 0, 0, "enemy");
    this.scene = scene;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.health = 100;
    this.damage = 5;
    this.value = 15;
    this.isAtEnd = false;
    scene.add.existing(this);

    this.setData("isEnemy", true); // Identify as enemy for tower targeting
    this.setData("health", this.health);

    this.healthText = scene.add.text(0, 0, `${this.health}`, {
      fontSize: "16px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 2,
    });
    this.healthText.setOrigin(0.5, 3.5); // Position above the enemy
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
      
      // Update health text position
      this.healthText.setPosition(this.x, this.y);
      const currentHealth = this.getData("health");
      this.healthText.setText(`${currentHealth}`);
      console.log(`Enemy health text updated: ${currentHealth}`);
      if (this.getData("health") <= 0) {
        this.scene.resources += this.value;
        this.scene.updateResourceText();
        this.destroy();
        this.scene.checkWaveEnd();
      }
    } else {
      this.setActive(false);
      this.setVisible(false);
      this.scene.checkWaveEnd();
      this.healthText.destroy();
      this.isAtEnd = true;
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
    this.setData("health", this.health); // Reset health when starting
    this.isAtEnd = false; // Reset isAtEnd when starting.
    this.healthText.setText(`${this.getData("health")}`);
  }

  destroy() {
    this.healthText.destroy(); // Destroy health text when enemy is destroyed
    super.destroy();
  }
}

export default Enemy;
