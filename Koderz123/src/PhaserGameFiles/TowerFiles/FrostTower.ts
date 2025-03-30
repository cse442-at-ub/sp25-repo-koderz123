// FrostTower.ts
import Tower from "./Tower";

class FrostTower extends Tower {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Call base class constructor with frost-specific texture
    super(scene, x, y, "frost-tower");

    this.range = 80;
    this.cost = 125;
    this.upgradeCost = 75;

    // Optionally, adjust scale or add visuals for effect
    this.setScale(0.3);
  }

  // Later: You can override update() for slowing effect
  update(time: number, delta: number) {
    super.update(time, delta);

    if (!this.isPlaced) return;

    // Example: slow enemies in range (to be implemented)
  }
}

export default FrostTower;
