// EnemyPathScene.ts
import Phaser from "phaser";
import Enemy from "./Enemy";
import Tower from "./TowerFiles/Tower.ts"; // optional, for targeting
// or just use basic tower sprites if logic isn't in Tower.ts yet

export default class EnemyPathScene extends Phaser.Scene {
  private towerGroup!: Phaser.GameObjects.Group;
  private enemy!: Enemy;
  private path!: Phaser.Curves.Path;

  preload() {
    this.load.image("enemy", "assets/particles/red.png");
    this.load.image("tower", "assets/particles/blue.png");
  }

  create() {
    const graphics = this.add.graphics();

    // Define path
    this.path = this.add.path(100, 0)
      .lineTo(100, 200)
      .lineTo(800, 200)
      .lineTo(800, 500);

    graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(graphics);

    // Setup tower group and place towers on click
    this.towerGroup = this.add.group();

    this.input.on("pointerdown", (pointer) => {
      const tower = this.add.sprite(pointer.x, pointer.y, "tower");
      this.physics.add.existing(tower);
      this.towerGroup.add(tower);
    });

    // Add an enemy that tracks towers
    this.enemy = new Enemy(this, this.path, this.towerGroup);
    this.events.on("update", () => {
      this.enemy.update();
    });
  }
}
