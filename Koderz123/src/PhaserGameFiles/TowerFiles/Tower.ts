//@ts-nocheck
import Phaser from "phaser";

class Tower extends Phaser.GameObjects.Image {
  public range: number;
  public cost: number;
  public isPlaced: boolean;
  public upgradeCost: number; // Cost to upgrade the tower
  public fireRate: number; // Added fire rate property
  public nextFire: number; // Time until next fire
  public type: string;
  private projectiles: Phaser.GameObjects.Group;
  private projectileSpeed: number;
  private rangeCircle: Phaser.GameObjects.Graphics | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = "default-tower", type: string = "default") {
    super(scene, x, y, texture);
    this.range = 100;
    this.cost = 100;
    this.isPlaced = false;
    this.level = 1; // Initialize level
    this.upgradeCost = 50; // Initialize upgrade cost
    this.type = type;
    this.projectiles = scene.add.group();

    // Set fire rate and projectile speed based on tower type
    switch(type) {
      case "Frost":
        this.fireRate = 3000; // 3 seconds between shots (slower)
        this.projectileSpeed = 1.5; // Slower projectile speed
        console.log("Created Frost Tower");
        break;
      case "Flamethrower":
        this.fireRate = 300; // 0.3 seconds between shots (faster)
        this.projectileSpeed = 3; // Faster projectile speed
        console.log("Created Flamethrower Tower");
        break;
      default:
        this.fireRate = 1000; // 1 second between shots
        this.projectileSpeed = 2;
        console.log("Created Default Tower");
    }

    this.nextFire = 0;
    this.setInteractive();
    this.setScale(0.275);
    scene.add.existing(this);
  }

  place(x: number, y: number) {
    this.setPosition(x, y);
    this.isPlaced = true;
    this.setAlpha(1);
    console.log(`Tower placed at (${x}, ${y})`);
  }

  public setValidPlacement(isValid: boolean) {
    this.setTint(isValid ? 0xffffff : 0xff4444); // red if invalid
  }

  showRange() {
    if (!this.rangeCircle) {
      this.rangeCircle = this.scene.add.graphics();
      this.rangeCircle.fillStyle(0x00ffff, 0.2); // semi-opaque cyan
      this.rangeCircle.fillCircle(this.x, this.y, this.range);
      this.rangeCircle.setDepth(-1); // behind tower
    }
  }

  hideRange() {
    if (this.rangeCircle) {
      this.rangeCircle.destroy();
      this.rangeCircle = undefined;
    }
  }

  upgrade() {
    this.level++;
    this.range += 20; // Example upgrade: increase range
    this.upgradeCost += 50; // Example upgrade: increase upgrade cost
    this.fireRate *= 0.9; // Increase fire rate by 10% on upgrade
    this.projectileSpeed *= 1.1; // Increase projectile speed by 10% on upgrade

    // Update visual representation (e.g., change texture or add effects)
    console.log(`Tower upgraded to level ${this.level}`);
  }

  update(time: number, delta: number) {
    if (!this.isPlaced) return;

    // Check if enough time has passed since last shot
    if (time - this.nextFire >= this.fireRate) {
      // Fire at target
      this.fire();
      this.nextFire = time;
      console.log(`${this.type} Tower fired at time ${time}`);
    }

    // Update projectiles
    this.projectiles.children.each((projectile: Phaser.GameObjects.Image) => {
      // Move projectile
      projectile.x += projectile.speed * delta;
      projectile.y += projectile.speed * delta;

      // Check if projectile is out of range
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        projectile.x,
        projectile.y
      );

      if (distance > this.range) {
        projectile.destroy();
      }
    });
  }

  private fire() {
    // Create a visual effect based on tower type
    const graphics = this.scene.add.graphics();
    
    switch(this.type) {
      case "Frost":
        graphics.lineStyle(2, 0x00ffff, 0.5); // Cyan color for frost
        graphics.strokeCircle(this.x, this.y, this.range);
        this.createProjectile("frost-projectile", 0x00ffff);
        break;
      case "Flamethrower":
        graphics.lineStyle(2, 0xff6600, 0.5); // Orange color for flamethrower
        graphics.strokeCircle(this.x, this.y, this.range);
        this.createProjectile("flame-projectile", 0xff6600);
        break;
      default:
        graphics.lineStyle(2, 0xffffff, 0.5);
        graphics.strokeCircle(this.x, this.y, this.range);
    }

    graphics.setDepth(-1);
    
    // Remove the effect after a short delay
    this.scene.time.delayedCall(200, () => {
      graphics.destroy();
    });
  }

  private createProjectile(texture: string, tint: number) {
    const projectile = this.scene.add.image(this.x, this.y, texture);
    projectile.setScale(1.0); // Increased scale to make projectiles more visible
    projectile.setTint(tint);
    projectile.speed = this.projectileSpeed;
    projectile.setDepth(2); // Increased depth to ensure visibility
    this.projectiles.add(projectile);
    console.log(`Created ${texture} projectile`);
  }

  destroy() {
    // Clean up projectiles when tower is destroyed
    this.projectiles.clear(true, true);
    if (this.rangeCircle) {
      this.rangeCircle.destroy();
    }
    super.destroy();
  }
}

export default Tower;
