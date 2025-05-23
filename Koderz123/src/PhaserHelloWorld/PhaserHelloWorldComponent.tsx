
import Phaser from "phaser";
import GameComponent from "./GameComponent";

class Example extends Phaser.Scene {
    preload() {
      this.load.setBaseURL("https://labs.phaser.io");
  
      this.load.image("sky", "assets/skies/space3.png");
      this.load.image("logo", "assets/sprites/phaser3-logo.png");
      this.load.image("red", "assets/particles/red.png");
    }
  
    create() {
      this.add.image(400, 300, "sky");
  
      const particles = this.add.particles(0, 0, "red", {
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: "ADD",
      });
  
      const logo = this.physics.add.image(400, 100, "logo");
  
      logo.setVelocity(100, 200);
      logo.setBounce(1, 1);
      logo.setCollideWorldBounds(true);
  
      particles.startFollow(logo);
    }
  }
  
  const PhaserHelloWorld = () => {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: 800,
      height: 600,
      scene: Example,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
        },
      },
    };
  
    return <div>
      <GameComponent config={config} />
    </div>;
  };
  
  export default PhaserHelloWorld;