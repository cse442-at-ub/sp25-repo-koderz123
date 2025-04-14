// TankEnemy.ts
//@ts-nocheck
import Enemy from "./Enemy";
import GameScene from "../GameScene";

class SwampEnemy extends Enemy {
    constructor(scene: GameScene) {
        super(scene);
        this.setTexture("swamp-enemy"); // You might want a different texture
        this.setScale(0.06); // Adjust scale to make it look bigger
        this.health = 300; // Higher health value
        this.damage = 10; //Higher damage to base
        this.value = 30; // Higher resource value for killing (normal is +15)
        this.baseSpeed = 0.6; // Example: Slower than normal
        this.setData("health", this.health);
    }

    update(time: number, delta: number) {
        if (this.slowDuration > 0) {
            this.slowDuration -= delta;
            if (this.slowDuration <= 0) {
                this.slowFactor = 1;
            }
        }

        if (this.follower.t < 1) {
            const effectiveSpeed = this.scene.ENEMY_SPEED * this.baseSpeed * this.slowFactor; // Apply base speed
            this.follower.t += effectiveSpeed * delta;

            this.scene.path.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

            this.healthText.setPosition(this.x, this.y - this.height * this.scaleY * 0.6);
            const currentHealth = this.getData("health");
            this.healthText.setText(`${currentHealth}`);
            if (this.getData("health") <= 0) {
                this.scene.resources += this.value;
                this.scene.updateResourceText();
                this.scene.checkWaveEnd();
                this.destroy();
            }
        } else {
            this.setActive(false);
            this.setVisible(false);
            this.scene.checkWaveEnd();
            this.healthText.destroy();
            this.isAtEnd = true;
        }
    }

    startOnPath() {
        this.follower.t = 0;
        this.scene.path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.setActive(true);
        this.setVisible(true);
        this.scene.enemiesAlive++;
        this.setData("health", this.health);
        this.isAtEnd = false;
        this.healthText.setText(`${this.getData("health")}`);
    }
}

export default SwampEnemy;