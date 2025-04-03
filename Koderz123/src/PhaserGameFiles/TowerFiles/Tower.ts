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
  public damage: number; // Base damage for the tower
  public level: number; // Tower level
  public slowFactor: number;
  public slowDuration: number;
  public projectileSpeed: number;
  private projectiles: Phaser.GameObjects.Group;
  private rangeCircle: Phaser.GameObjects.Graphics | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = "default-tower", type: string = "default") {
    super(scene, x, y, texture);
    this.range = 100;
    this.cost = 100;
    this.isPlaced = false;
    this.level = 1;
    this.upgradeCost = 50;
    this.type = type;
    this.damage = 25;
    this.slowFactor = 0.5;
    this.slowDuration = 1000;
    
    // Create projectiles group with explicit scene reference
    this.projectiles = scene.add.group({
      classType: Phaser.GameObjects.Image,
      maxSize: 30,
      runChildUpdate: true
    });
    console.log(`Created projectiles group for ${type} tower`);

    // Set fire rate and projectile speed based on tower type
    switch(type) {
      case "Frost":
        this.fireRate = 3000;
        this.projectileSpeed = 10; // Increased speed significantly
        console.log("Created Frost Tower with speed", this.projectileSpeed);
        break;
      case "Flamethrower":
        this.fireRate = 300;
        this.projectileSpeed = 12;
        console.log("Created Flamethrower Tower with speed", this.projectileSpeed);
        break;
      default:
        this.fireRate = 1000;
        this.projectileSpeed = 8;
        console.log("Created Default Tower with speed", this.projectileSpeed);
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
      const target = this.findTarget();
      if (target) {
        console.log(`${this.type} Tower found target at (${target.x}, ${target.y})`);
        this.fire();
        this.nextFire = time;
      }
    }

    // Update projectiles
    this.projectiles.children.each((projectile: any) => {
      if (!projectile.active) return;

      // Move projectile in straight line
      projectile.x += projectile.dx;
      projectile.y += projectile.dy;

      // Debug log projectile position
      console.log(`Projectile at (${projectile.x}, ${projectile.y})`);

      // Check for collisions with enemies
      const enemies = (this.scene as any).enemies.getChildren();
      enemies.forEach((enemy: any) => {
        if (enemy.active && enemy.getData("isEnemy")) {
          const distance = Phaser.Math.Distance.Between(
            projectile.x,
            projectile.y,
            enemy.x,
            enemy.y
          );
          
          if (distance < 30) {
            if (this.type === "Frost") {
              enemy.applySlow(this.slowFactor, this.slowDuration);
              console.log("Frost projectile hit enemy");
            }
            
            projectile.destroy();
            console.log(`Projectile hit enemy at (${projectile.x}, ${projectile.y})`);
          }
        }
      });

      // Check if projectile is out of range
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        projectile.x,
        projectile.y
      );

      if (distance > this.range) {
        projectile.destroy();
        console.log(`Projectile went out of range at (${projectile.x}, ${projectile.y})`);
      }
    });
  }

  private createProjectile(texture: string, color: number) {
    console.log(`Creating projectile with texture: ${texture}`);
    
    // Create a new projectile directly
    const projectile = this.scene.add.image(this.x, this.y, texture);
    
    if (!projectile) {
      console.error('Failed to create projectile!');
      return;
    }

    // Set projectile properties
    projectile.setScale(0.3); // Further reduced scale for better size
    projectile.setAlpha(1);
    projectile.setBlendMode(Phaser.BlendModes.NORMAL);
    projectile.setDepth(1);
    
    // Calculate initial angle to target
    const target = this.findTarget();
    if (target) {
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        target.x,
        target.y
      );
      
      projectile.setRotation(angle);
      projectile.speed = this.projectileSpeed;
      projectile.dx = Math.cos(angle) * projectile.speed;
      projectile.dy = Math.sin(angle) * projectile.speed;
      
      // Add to projectiles group
      this.projectiles.add(projectile);
      
      console.log(`Created ${this.type} projectile at (${this.x}, ${this.y}) with speed ${projectile.speed}`);
      console.log(`Projectile direction: dx=${projectile.dx}, dy=${projectile.dy}`);
    }
  }

  private fire() {
    console.log(`${this.type} Tower firing at time ${this.scene.time.now}`);
    
    // Create a visual effect based on tower type
    const graphics = this.scene.add.graphics();
    
    switch(this.type) {
      case "Frost":
        graphics.lineStyle(2, 0x00ffff, 0.5);
        graphics.strokeCircle(this.x, this.y, this.range);
        this.createProjectile("Frost_Projectile", 0x00ffff);
        break;
      case "Flamethrower":
        graphics.lineStyle(2, 0xff6600, 0.5);
        graphics.strokeCircle(this.x, this.y, this.range);
        break;
      default:
        graphics.lineStyle(2, 0xffffff, 0.5);
        graphics.strokeCircle(this.x, this.y, this.range);
        this.createProjectile("Frost_Projectile", 0xffffff); // Add projectile for default tower
    }

    graphics.setDepth(-1);
    
    this.scene.time.delayedCall(200, () => {
      graphics.destroy();
    });
  }

  private findTarget() {
    const enemies = (this.scene as any).enemies.getChildren();
    let closestEnemy = null;
    let closestDistance = this.range;

    enemies.forEach((enemy: any) => {
      if (enemy.active && enemy.getData("isEnemy")) {
        const distance = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          enemy.x,
          enemy.y
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }
    });

    return closestEnemy;
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
