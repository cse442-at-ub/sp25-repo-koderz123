class IntenseGameOver extends Phaser.Scene {
    constructor() {
      super({ key: "IntenseGameOver" });
    }
  
    create() {
      const { width, height } = this.scale;
  
      // Create a semi-transparent black rectangle to overlay the game scene
      const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7); // Black color, 70% opacity
      overlay.setOrigin(0); // Position it at the top-left corner
  
      //Adding gameOverText
      this.add
        .text(width / 2, height / 2 - 50, "Game Over", {
          fontSize: "48px",
          color: "#ff0000",
          align: "center",
        })
        .setOrigin(0.5);
  
      //Adding restartButton
      this.add
        .text(width / 2, height / 2 + 20, "Restart", {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#444",
          padding: { left: 20, right: 20, top: 10, bottom: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          // Stop current scenes and start GameScene, start with call GameScene create()
          this.scene.start("IntenseGameScene");
        })
        .on("pointerover", () => {
          this.input.setDefaultCursor("pointer");
        })
        .on("pointerout", () => {
          this.input.setDefaultCursor("default");
        });
  
      //Adding mainMenuButton
      this.add
        .text(width / 2, height / 2 + 70, "Main Menu", {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#444",
          padding: { left: 20, right: 20, top: 10, bottom: 10 },
        })
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          const url = "/CSE442/2025-Spring/cse-442p/#/mainmenu";
          console.log(url);
          window.open(url, "_self");
        })
        .on("pointerover", () => {
          this.input.setDefaultCursor("pointer");
        })
        .on("pointerout", () => {
          this.input.setDefaultCursor("default");
        });
    }
  }
  
  export default IntenseGameOver;
  