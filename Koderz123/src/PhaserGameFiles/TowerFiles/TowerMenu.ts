// TowerMenu.ts
import Phaser from "phaser";

class TowerMenu {
  private scene: Phaser.Scene;
  private onTowerSelect: (towerType: string) => void;
  private onBuy: (towerType: string) => boolean;

  private hamburgerContainer!: Phaser.GameObjects.Container;
  private towerMenuContainer!: Phaser.GameObjects.Container;
  private shopButtonContainer!: Phaser.GameObjects.Container;
  private shopPanelContainer!: Phaser.GameObjects.Container;

  private hamburgerBg!: Phaser.GameObjects.Graphics;
  private hamburgerIcon!: Phaser.GameObjects.Text;
  private shopButtonBg!: Phaser.GameObjects.Graphics;
  private shopButtonText!: Phaser.GameObjects.Text;
  private towerMenuBg!: Phaser.GameObjects.Graphics;
  private shopPanelBg!: Phaser.GameObjects.Graphics;
  private towerButtons: Phaser.GameObjects.Text[] = [];
  private shopDescText!: Phaser.GameObjects.Text;

  private buttonSize = 60;
  private leftPadding = 20;
  private bottomPadding = 10;
  private rightPadding = 20;
  private gapBetween = 5;
  private shopGap = 5;
  private towerTypes = ["Frost", "Shock", "Bomb", "Fire"];

  // Added mapping of tower costs
  private towerCosts: Record<string, number> = {
    Frost: 100,
    Shock: 150,
    Bomb: 200,
    Fire: 250
  };

  private towerCounts: Record<string, number> = {};
  private baselineY = 0;
  private hiddenY = 0;
  private towerMenuX = 0;
  private open = false;
  private shopOpen = false;

  constructor(
    scene: Phaser.Scene,
    onTowerSelect: (towerType: string) => void,
    onBuy: (towerType: string) => boolean
  ) {
    this.scene = scene;
    this.onTowerSelect = onTowerSelect;
    this.onBuy = onBuy;

    // initialize counts
    this.towerTypes.forEach(type => { this.towerCounts[type] = 0; });

    const { width, height } = scene.scale;
    const hamburgerX = this.leftPadding;
    const hamburgerY = height - this.bottomPadding - this.buttonSize;
    this.baselineY = hamburgerY;
    this.hiddenY = height;

    // Hamburger button
    this.hamburgerContainer = scene.add.container(hamburgerX, hamburgerY).setDepth(10);
    this.hamburgerBg = scene.add.graphics();
    this.drawRoundedBg(this.hamburgerBg, this.buttonSize, this.buttonSize, 10, 0x2c3e50, 0.7);
    this.hamburgerIcon = scene.add.text(
      this.buttonSize / 2,
      this.buttonSize / 2,
      "☰",
      { fontSize: "24px", fontFamily: "Arial", color: "#ffffff", fontStyle: "bold" }
    ).setOrigin(0.5);
    this.hamburgerContainer.add([this.hamburgerBg, this.hamburgerIcon]);
    this.hamburgerContainer.setSize(this.buttonSize, this.buttonSize);
    const hitHamburger = scene.add.rectangle(
      this.buttonSize / 2,
      this.buttonSize / 2,
      this.buttonSize,
      this.buttonSize
    ).setOrigin(0.5).setInteractive({ cursor: "pointer" });
    hitHamburger.on("pointerup", () => this.toggleMenu());
    this.hamburgerContainer.add(hitHamburger);

    // Tower menu container
    this.towerMenuX = hamburgerX + this.buttonSize + this.gapBetween;
    const availableW = width - this.towerMenuX - this.rightPadding;
    const towerMenuW = availableW - (this.buttonSize + this.shopGap);
    this.towerMenuContainer = scene.add.container(this.towerMenuX, this.hiddenY).setDepth(9);
    this.towerMenuBg = scene.add.graphics();
    this.drawRoundedBg(this.towerMenuBg, towerMenuW, this.buttonSize, 15, 0x2c3e50, 0.7);
    this.towerMenuContainer.add(this.towerMenuBg);
    this.towerTypes.forEach((type, i) => {
      const segment = towerMenuW / this.towerTypes.length;
      const xPos = segment * i + segment / 2;
      const btn = scene.add
        .text(
          xPos,
          this.buttonSize / 2,
          `🛡️ ${type}`,
          {
            fontSize: "20px",
            color: "#ffffff",
            backgroundColor: "#555555",
            padding: { left: 10, right: 10, top: 6, bottom: 6 },
          }
        )
        .setOrigin(0.5)
        .setInteractive()
        .on("pointerdown", () => {
          if (this.towerCounts[type] > 0) {
            this.towerCounts[type]--;
            this.updateTowerButtonLabels();
            this.onTowerSelect(type);
          }
        });
      this.towerMenuContainer.add(btn);
      this.towerButtons.push(btn);
    });
    this.updateTowerButtonLabels();
    this.towerMenuContainer.setVisible(false);

    // Shop button container
    const shopX = this.towerMenuX + (width - this.towerMenuX - this.rightPadding - (this.buttonSize + this.shopGap)) + this.shopGap;
    this.shopButtonContainer = scene.add.container(shopX, this.hiddenY).setDepth(9);
    this.shopButtonBg = scene.add.graphics();
    this.drawRoundedBg(this.shopButtonBg, this.buttonSize, this.buttonSize, 10, 0x2c3e50, 0.7);
    this.shopButtonText = scene.add.text(
      this.buttonSize / 2,
      this.buttonSize / 2,
      "Shop",
      { fontSize: "20px", fontFamily: "Arial", color: "#ffffff", fontStyle: "bold" }
    ).setOrigin(0.5);
    this.shopButtonContainer.add([this.shopButtonBg, this.shopButtonText]);
    this.shopButtonContainer.setSize(this.buttonSize, this.buttonSize);
    const hitShop = scene.add.rectangle(
      this.buttonSize / 2,
      this.buttonSize / 2,
      this.buttonSize,
      this.buttonSize
    ).setOrigin(0.5).setInteractive({ cursor: "pointer" });
    hitShop.on("pointerup", () => this.toggleShopPanel());
    this.shopButtonContainer.add(hitShop);
    this.shopButtonContainer.setVisible(false);

    // Shop panel
    const panelW = width * 0.25;
    const panelH = height * 0.65;
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;
    this.shopPanelContainer = scene.add.container(panelX, panelY).setDepth(11);
    this.shopPanelBg = scene.add.graphics();
    this.drawRoundedBg(this.shopPanelBg, panelW, panelH, 15, 0x2c3e50, 0.7);
    this.shopPanelContainer.add(this.shopPanelBg);

    // List towers with Buy buttons and prices
    const itemHeight = 24;
    const itemGap = 10;
    const textX = 20;
    this.towerTypes.forEach((type, i) => {
      const price = this.towerCosts[type];
      const y = 20 + i * (itemHeight + itemGap);
      const row = scene.add.container(textX, y);
      const nameTxt = scene.add
        .text(0, 0, `${type} - ${price}c`, { fontSize: "18px", color: "#ffffff" })
        .setOrigin(0, 0.5)
        .setInteractive()
        .on("pointerup", () => {
          this.shopDescText.setText(this.getDescriptionFor(type));
        });
      const buyBtn = scene.add
        .text(panelW - 30, 0, "Buy", {
          fontSize: "16px",
          color: "#ffffff",
          backgroundColor: "#333",
          padding: { left: 6, right: 6, top: 2, bottom: 2 }
        })
        .setOrigin(1, 0.5)
        .setInteractive({ cursor: "pointer" })
        .on("pointerup", () => this.buyTower(type));
      row.add([nameTxt, buyBtn]);
      this.shopPanelContainer.add(row);
    });

    // Description area
    const descY = 20 + this.towerTypes.length * (itemHeight + itemGap) + 10;
    this.shopDescText = scene.add
      .text(textX, descY, "", { fontSize: "16px", color: "#ffffff", wordWrap: { width: panelW - 40 } });
    this.shopPanelContainer.add(this.shopDescText);

    this.shopPanelContainer.setVisible(false);
  }

  private drawRoundedBg(
    g: Phaser.GameObjects.Graphics,
    w: number,
    h: number,
    radius: number,
    color: number,
    alpha: number
  ) {
    g.clear();
    g.lineStyle(2, 0xffffff, 1);
    g.strokeRoundedRect(0, 0, w, h, radius);
    g.fillStyle(color, alpha);
    g.fillRoundedRect(0, 0, w, h, radius);
  }

  private toggleMenu() {
    if (!this.open) {
      this.towerMenuContainer.setVisible(true);
      this.shopButtonContainer.setVisible(true);
      this.towerMenuContainer.y = this.hiddenY;
      this.shopButtonContainer.y = this.hiddenY;
      this.scene.tweens.add({ targets: this.towerMenuContainer, y: this.baselineY, duration: 300, ease: "Back.easeOut" });
      this.scene.tweens.add({ targets: this.shopButtonContainer, y: this.baselineY, duration: 300, ease: "Back.easeOut" });
    } else {
      if (this.shopOpen) this.toggleShopPanel();
      this.scene.tweens.add({ targets: this.towerMenuContainer, y: this.hiddenY, duration: 250, ease: "Back.easeIn", onComplete: () => this.towerMenuContainer.setVisible(false) });
      this.scene.tweens.add({ targets: this.shopButtonContainer, y: this.hiddenY, duration: 250, ease: "Back.easeIn", onComplete: () => this.shopButtonContainer.setVisible(false) });
    }
    this.open = !this.open;
  }

  private toggleShopPanel() {
    this.shopOpen = !this.shopOpen;
    this.shopPanelContainer.setVisible(this.shopOpen);
    this.shopButtonText.setText(this.shopOpen ? "Back" : "Shop");
  }

  private getDescriptionFor(type: string): string {
    switch (type) {
      case "Frost":
        return "Frost Tower unleashes chilling blasts that slow enemies by 30% for 1.5 seconds, making them easier targets.";
      case "Shock":
        return "Shock Tower emits an electric jolt that arcs between up to 3 enemies, dealing 35 damage each.";
      case "Bomb":
        return "Bomb Tower acts as a timed explosive that detonates after a 1s delay, dealing 80 area damage and stunning enemies for 0.5s.";
      case "Fire":
        return "Fire Tower hurls fireballs every 0.5s, dealing 20 initial damage plus 5 burning damage per second over 3s.";
      default:
        return "";
    }
  }

  private updateTowerButtonLabels() {
    this.towerButtons.forEach((btn, i) => {
      const type = this.towerTypes[i];
      const count = this.towerCounts[type];
      const suffix = count > 0 ? ` (${count})` : "";
      btn.setText(`🛡️ ${type}${suffix}`);
    });
  }

  private buyTower(type: string) {
    // ask GameScene if we can afford it and deduct coins
    if (!this.onBuy(type)) {
      return;
    }
    // only increment count if purchase succeeded
    this.towerCounts[type]++;
    this.updateTowerButtonLabels();
    this.shopDescText.setText(this.getDescriptionFor(type));
  }

  public setVisibleAllUI(visible: boolean) {
    this.hamburgerContainer.setVisible(visible);
    this.towerMenuContainer.setVisible(visible);
    this.shopButtonContainer.setVisible(visible);
    this.shopPanelContainer.setVisible(visible && this.shopOpen);
  }
}

export default TowerMenu;