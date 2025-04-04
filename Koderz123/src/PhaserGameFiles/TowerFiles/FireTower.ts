import Tower from "./Tower";

class FireTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "default-tower");

    this.range = 100;
    this.cost = 150;
    this.upgradeCost = 200;
    this.fireRate = 1000 / 2; // 1 second between shots
    this.damage = 20; // Damage dealt per hit

    this.setScale(0.275);
  }

  protected createProjectile() {
    const projectile = this.scene.add.image(this.x, this.y, "Flame_Projectile") as Phaser.GameObjects.Image & { speed: number; dx: number; dy: number };
    projectile.setScale(0.21);
    projectile.setAlpha(1);
    projectile.setBlendMode(Phaser.BlendModes.NORMAL);
    projectile.setDepth(1);

    const target = this.findTarget();
    if (target) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
      projectile.setRotation(angle);
      projectile.speed = this.projectileSpeed;
      projectile.dx = Math.cos(angle) * projectile.speed;
      projectile.dy = Math.sin(angle) * projectile.speed;

      this.projectiles.add(projectile);

      console.log(`Created FireTower projectile at (${this.x}, ${this.y}) with speed ${projectile.speed}`);
    }
  }

  update(time: number) {
    if (!this.isPlaced) return;

    if (time > this.nextFire) {
      const target = this.findTarget();
      if (target) {
        console.log(`FireTower firing at time ${this.scene.time.now}`);
        this.createProjectile();
        this.nextFire = time + this.fireRate;
      }
    }

    this.projectiles.children.each((projectile: any) => {
      if (!projectile.active) return null;

      projectile.x += projectile.dx;
      projectile.y += projectile.dy;

      const enemies = (this.scene as any).enemies.getChildren();
      enemies.forEach((enemy: any) => {
        if (enemy.active && enemy.getData("isEnemy")) {
          const distance = Phaser.Math.Distance.Between(projectile.x, projectile.y, enemy.x, enemy.y);

          if (distance < 30) {
            enemy.setData("health", enemy.getData("health") - this.damage);
            console.log(`FireTower projectile dealt ${this.damage} damage. Enemy health: ${enemy.getData("health")}`);
            projectile.destroy();
          }
        }
      });

      const distance = Phaser.Math.Distance.Between(this.x, this.y, projectile.x, projectile.y);
      if (distance > this.range) {
        projectile.destroy();
      }

      return null;
    });
  }
}

export default FireTower; 