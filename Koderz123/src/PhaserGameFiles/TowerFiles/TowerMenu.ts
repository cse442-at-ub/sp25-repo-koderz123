// TowerMenu.ts
import Phaser from "phaser";

class TowerMenu {
  private scene: Phaser.Scene;
  private onTowerSelect: (towerType: string) => void;

  // Containers for UI elements
  private hamburgerContainer!: Phaser.GameObjects.Container;
  private towerMenuContainer!: Phaser.GameObjects.Container;
  private shopContainer!: Phaser.GameObjects.Container;
  private shopMenuContainer!: Phaser.GameObjects.Container;

  // Graphics and text for the hamburger and shop buttons
  private hamburgerBg!: Phaser.GameObjects.Graphics;
  private hamburgerIcon!: Phaser.GameObjects.Text;
  private shopBg!: Phaser.GameObjects.Graphics;
  private shopText!: Phaser.GameObjects.Text;

  // Graphics and buttons for the tower menu
  private towerMenuBg!: Phaser.GameObjects.Graphics;
  private towerButtons: Phaser.GameObjects.Text[] = [];

  // Graphics for the shop menu background
  private shopMenuBg!: Phaser.GameObjects.Graphics;

  // Layout parameters
  private buttonSize = 60;       // Size for hamburger, tower menu (height), and shop button
  private leftPadding = 20;      // Distance from left edge for hamburger
  private bottomPadding = 10;    // Distance from bottom of screen
  private rightPadding = 20;     // Right side padding for tower menu and shop button
  private gapBetween = 5;        // Horizontal gap between hamburger and tower menu
  private shopGap = 5;           // Horizontal gap between tower menu and shop button
  private towerTypes = ["Frost", "Shock", "Bomb", "Fire"];

  // Vertical positions for the tower menu and shop button when closed
  private baselineY: number = 0;
  private towerMenuHiddenY: number = 0;  // Off-screen hidden y (at bottom)

  // Horizontal positions (fixed)
  private towerMenuX: number = 0;
  private shopVisibleX: number = 0;

  // Shop menu parameters
  private shopMenuHeight: number = 150; // Taller shop menu
  private verticalGap: number = 5;      // Vertical gap between tower menu and shop menu

  // State tracking
  private shopOpen: boolean = false; // Tracks whether the shop menu is open
  private open: boolean = false;     // Tracks whether the tower menu (and shop button) are shown

  constructor(scene: Phaser.Scene, onTowerSelect: (towerType: string) => void) {
    this.scene = scene;
    this.onTowerSelect = onTowerSelect;

    const { width, height } = scene.scale;

    // --------------------
    // Create Hamburger Button (always visible)
    // --------------------
    const hamburgerX = this.leftPadding;
    const hamburgerY = height - this.bottomPadding - this.buttonSize;
    // Baseline for tower menu and shop button (aligned with hamburger)
    this.baselineY = hamburgerY;
    // When closed, panels are off-screen at the bottom.
    this.towerMenuHiddenY = height;

    this.hamburgerContainer = scene.add.container(hamburgerX, hamburgerY).setDepth(10);

    // Draw hamburger background (rounded rectangle)
    this.hamburgerBg = scene.add.graphics();
    // Darker blue with 70% opacity
    this.drawHamburgerBg(0x2c3e50, 0.7);

    // Create hamburger icon ("☰")
    this.hamburgerIcon = scene.add.text(
      this.buttonSize / 2,
      this.buttonSize / 2,
      "☰",
      {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      }
    ).setOrigin(0.5);

    // Add background and icon
    this.hamburgerContainer.add([this.hamburgerBg, this.hamburgerIcon]);
    this.hamburgerContainer.setSize(this.buttonSize, this.buttonSize);

    // Add hit area for interactivity on the hamburger
    const hitAreaHamburger = scene.add
      .rectangle(this.buttonSize / 2, this.buttonSize / 2, this.buttonSize, this.buttonSize)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    hitAreaHamburger.on("pointerup", () => this.toggleMenuAndShop());
    this.hamburgerContainer.add(hitAreaHamburger);

    // --------------------
    // Create Tower Menu Container (to the right of the hamburger)
    // --------------------
    // Tower menu starts immediately to the right of the hamburger.
    this.towerMenuX = hamburgerX + this.buttonSize + this.gapBetween;
    // Calculate available space from towerMenuX to the right edge,
    // then reserve space for the shop button (buttonSize) and shopGap.
    const availableWidth = width - this.towerMenuX - this.rightPadding;
    // Set tower menu width to be slightly smaller so the shop button is visible.
    const towerMenuWidth = availableWidth - (this.buttonSize + this.shopGap);
    // Compute shop button x-position as towerMenuX plus towerMenuWidth plus shopGap.
    this.shopVisibleX = this.towerMenuX + towerMenuWidth + this.shopGap;

    // Vertical positions: when closed, both tower menu and shop button are at baselineY.
    this.towerMenuContainer = scene.add
      .container(this.towerMenuX, this.towerMenuHiddenY)
      .setDepth(9);

    // Draw the tower menu background using computed width and fixed height (buttonSize)
    this.towerMenuBg = scene.add.graphics();
    this.drawTowerMenuBg(towerMenuWidth, this.buttonSize, 0x2c3e50, 0.7);
    this.towerMenuContainer.add(this.towerMenuBg);

    // Create tower buttons and distribute them evenly
    const spacing = towerMenuWidth / this.towerTypes.length;
    this.towerTypes.forEach((type, index) => {
      const xPos = spacing * index + spacing / 2;
      const btn = scene.add.text(xPos, this.buttonSize / 2, `🛡️ ${type}`, {
        fontSize: "20px",
        color: "#ffffff",
        backgroundColor: "#555",
        padding: { left: 10, right: 10, top: 6, bottom: 6 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.onTowerSelect(type));

      this.towerMenuContainer.add(btn);
      this.towerButtons.push(btn);
    });
    // Initially keep the tower menu hidden
    this.towerMenuContainer.setVisible(false);

    // --------------------
    // Create Shop Button Container (to the right of the tower menu)
    // --------------------
    this.shopContainer = scene.add
      .container(this.shopVisibleX, this.towerMenuHiddenY)
      .setDepth(9);

    // Draw shop button background (similar style to the hamburger)
    this.shopBg = scene.add.graphics();
    this.drawShopBg(0x2c3e50, 0.7);
    // Create shop text ("Shop")
    this.shopText = scene.add.text(
      this.buttonSize / 2,
      this.buttonSize / 2,
      "Shop",
      {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        fontStyle: "bold",
      }
    ).setOrigin(0.5);

    this.shopContainer.add([this.shopBg, this.shopText]);
    this.shopContainer.setSize(this.buttonSize, this.buttonSize);

    // Add hit area to the shop button—this toggles the shop menu.
    const hitAreaShop = scene.add
      .rectangle(this.buttonSize / 2, this.buttonSize / 2, this.buttonSize, this.buttonSize)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    hitAreaShop.on("pointerup", () => this.toggleShopMenu());
    this.shopContainer.add(hitAreaShop);

    // Initially keep the shop button hidden
    this.shopContainer.setVisible(false);

    // --------------------
    // Create Shop Menu Container (the extra panel that appears when the shop button is clicked)
    // --------------------
    this.shopMenuContainer = scene.add.container(this.towerMenuX, height).setDepth(8);
    this.shopMenuBg = scene.add.graphics();
    // Draw the shop menu background using the same towerMenuWidth and the taller shopMenuHeight.
    this.drawShopMenuBg(towerMenuWidth, this.shopMenuHeight, 0x2c3e50, 0.7);
    this.shopMenuContainer.add(this.shopMenuBg);
    // (Add additional shop content here as needed.)
    // Initially, the shop menu container is hidden (positioned off-screen)
    this.shopMenuContainer.setVisible(false);
  }

  /**
   * Draws the background for the hamburger button.
   */
  private drawHamburgerBg(color: number, alpha: number) {
    this.hamburgerBg.clear();
    this.hamburgerBg.lineStyle(2, 0xffffff, 1);
    this.hamburgerBg.strokeRoundedRect(0, 0, this.buttonSize, this.buttonSize, 10);
    this.hamburgerBg.fillStyle(color, alpha);
    this.hamburgerBg.fillRoundedRect(0, 0, this.buttonSize, this.buttonSize, 10);
  }

  /**
   * Draws the background for the tower menu.
   */
  private drawTowerMenuBg(width: number, height: number, color: number, alpha: number) {
    this.towerMenuBg.clear();
    this.towerMenuBg.fillStyle(color, alpha);
    this.towerMenuBg.lineStyle(2, 0xffffff, 1);
    this.towerMenuBg.strokeRoundedRect(0, 0, width, height, 15);
    this.towerMenuBg.fillRoundedRect(0, 0, width, height, 15);
  }

  /**
   * Draws the background for the shop button.
   */
  private drawShopBg(color: number, alpha: number) {
    this.shopBg.clear();
    this.shopBg.lineStyle(2, 0xffffff, 1);
    this.shopBg.strokeRoundedRect(0, 0, this.buttonSize, this.buttonSize, 10);
    this.shopBg.fillStyle(color, alpha);
    this.shopBg.fillRoundedRect(0, 0, this.buttonSize, this.buttonSize, 10);
  }

  /**
   * Draws the background for the shop menu.
   */
  private drawShopMenuBg(width: number, height: number, color: number, alpha: number) {
    this.shopMenuBg.clear();
    this.shopMenuBg.fillStyle(color, alpha);
    this.shopMenuBg.lineStyle(2, 0xffffff, 1);
    this.shopMenuBg.strokeRoundedRect(0, 0, width, height, 15);
    this.shopMenuBg.fillRoundedRect(0, 0, width, height, 15);
  }

  /**
   * Toggle the tower menu and shop button: slide them vertically from off-screen (bottom)
   * into their visible position (aligned with the hamburger).
   */
  private toggleMenuAndShop() {
    if (!this.open) {
      // Show tower menu and shop button; reset their y to hidden.
      this.towerMenuContainer.setVisible(true);
      this.shopContainer.setVisible(true);
      this.towerMenuContainer.y = this.towerMenuHiddenY;
      this.shopContainer.y = this.towerMenuHiddenY;
      // Animate them upward into the baseline position.
      this.scene.tweens.add({
        targets: this.towerMenuContainer,
        y: this.baselineY,
        duration: 300,
        ease: "Back.easeOut"
      });
      this.scene.tweens.add({
        targets: this.shopContainer,
        y: this.baselineY,
        duration: 300,
        ease: "Back.easeOut"
      });
    } else {
      // If closing, first close the shop menu if it's open.
      if (this.shopOpen) {
        this.toggleShopMenu(); // Close the shop menu and restore positions.
      }
      // Animate tower menu and shop button back down off-screen.
      this.scene.tweens.add({
        targets: this.towerMenuContainer,
        y: this.towerMenuHiddenY,
        duration: 250,
        ease: "Back.easeIn",
        onComplete: () => this.towerMenuContainer.setVisible(false)
      });
      this.scene.tweens.add({
        targets: this.shopContainer,
        y: this.towerMenuHiddenY,
        duration: 250,
        ease: "Back.easeIn",
        onComplete: () => this.shopContainer.setVisible(false)
      });
    }
    this.open = !this.open;
  }

  /**
   * Toggle the extra Shop Menu panel.
   *
   * When opening:
   * - Animate the tower menu upward to make room.
   * - Leave the shop button at its baseline position.
   * - Animate the shop menu from off-screen upward into view (positioned right beneath the tower menu).
   * - Change the shop button text to "Back."
   *
   * When closing:
   * - Animate the tower menu back to the baseline.
   * - Animate the shop menu back off-screen.
   * - Change the shop button text back to "Shop."
   */
  private toggleShopMenu() {
    if (!this.shopOpen) {
      // Open shop menu.
      this.shopMenuContainer.setVisible(true);
      // Calculate new positions:
      const newTowerY = this.baselineY - this.shopMenuHeight - this.verticalGap;
      const newShopMenuY = newTowerY + this.buttonSize + this.verticalGap;
      // Animate tower menu upward.
      this.scene.tweens.add({
        targets: this.towerMenuContainer,
        y: newTowerY,
        duration: 300,
        ease: "Back.easeOut"
      });
      // Animate shop menu upward into view.
      this.scene.tweens.add({
        targets: this.shopMenuContainer,
        y: newShopMenuY,
        duration: 300,
        ease: "Back.easeOut"
      });
      // Change shop button text to "Back."
      this.shopText.setText("Back");
    } else {
      // Close shop menu: animate tower menu back to baseline.
      this.scene.tweens.add({
        targets: this.towerMenuContainer,
        y: this.baselineY,
        duration: 250,
        ease: "Back.easeIn"
      });
      // Animate shop menu off-screen.
      this.scene.tweens.add({
        targets: this.shopMenuContainer,
        y: this.scene.scale.height,
        duration: 250,
        ease: "Back.easeIn",
        onComplete: () => this.shopMenuContainer.setVisible(false)
      });
      // Reset shop button text to "Shop."
      this.shopText.setText("Shop");
    }
    this.shopOpen = !this.shopOpen;
  }

  /**
   * Optionally toggle the visibility of all UI elements.
   */
  public setVisibleAllUI(visible: boolean) {
    this.hamburgerContainer.setVisible(visible);
    this.towerMenuContainer.setVisible(visible);
    this.shopContainer.setVisible(visible);
    this.shopMenuContainer.setVisible(visible);
  }
}

export default TowerMenu;