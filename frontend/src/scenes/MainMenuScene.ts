import { gameHeight, gameWidth } from "..";
import title from "../assets/Title.png";
import { iSpriteNames } from "../interfaces/interfaces";

class MainMenuScene extends Phaser.Scene {
  spriteNames: iSpriteNames;
  vsAiButton: Phaser.GameObjects.Text;
  vsPlayerButton: Phaser.GameObjects.Text;

  constructor() {
    super("MainMenuScene");

    this.spriteNames = {
      TITLE: "title",
    };
  }

  preload() {
    this.load.image(this.spriteNames.TITLE, title);
  }
  create() {
    // Title
    this.add
      .image(gameWidth / 2, gameHeight / 4, this.spriteNames.TITLE)
      .setScale(0.5);

    // Buttons
    const textConfig = {
      fontSize: "36px",
      fontFamily: "Helvetica",
      color: "#FFF",
      strokeThickness: 10,
      stroke: "#000",
    };

    // TODO: Using setOrigin makes it blurry, probably use icon or something
    this.vsAiButton = this.add
      .text(gameWidth / 2, (2 * gameHeight) / 4, "vs AI", textConfig)
      .setInteractive();

    this.vsAiButton.on("pointerover", () => {
      this.vsAiButton.style.stroke = "#505050";
      this.vsAiButton.style.update(true);
    });

    this.vsAiButton.on("pointerout", () => {
      this.vsAiButton.style.stroke = "#000";
      this.vsAiButton.style.update(true);
    });

    this.vsAiButton.on("pointerup", () => {
      // TODO: Make a const file with scene names
      // TODO: Make a const file with game types, or just use interface?
      this.scene.start("CombatScene", { gameType: "AI" });
    });
  }
  update() {}
}

export default MainMenuScene;
