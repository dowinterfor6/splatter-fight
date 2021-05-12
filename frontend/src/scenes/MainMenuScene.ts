import { gameHeight, gameWidth } from "..";
import { iSceneImageNames } from "../interfaces/interfaces";

// import title from "../assets/Title.png";
import tempTitle from "../assets/TempTitle.png";
import singlePlayer from "../assets/SinglePlayer.png";
import multiPlayer from "../assets/Multiplayer.png";
import settings from "../assets/Settings.png";
import help from "../assets/Help.png";
import selector from "../assets/Selector.png";

class MainMenuScene extends Phaser.Scene {
  sceneImageNames: iSceneImageNames;
  selector: Phaser.GameObjects.Image;

  constructor() {
    super("MainMenuScene");

    this.sceneImageNames = {
      TITLE: "title",
      SINGLE_PLAYER: "singlePlayer",
      MULTI_PLAYER: "multiPlayer",
      SETTINGS: "settings",
      HELP: "help",
      SELECTOR: "selector",
    };
  }

  preload() {
    this.load.image(this.sceneImageNames.TITLE, tempTitle);
    this.load.image(this.sceneImageNames.SINGLE_PLAYER, singlePlayer);
    this.load.image(this.sceneImageNames.MULTI_PLAYER, multiPlayer);
    this.load.image(this.sceneImageNames.SETTINGS, settings);
    this.load.image(this.sceneImageNames.HELP, help);
    this.load.image(this.sceneImageNames.SELECTOR, selector);
  }
  create() {
    const center = {
      x: gameWidth / 2,
      y: gameHeight / 2,
    };

    const increment = {
      dx: center.x / 10,
      dy: center.y / 10,
    };

    this.add
      .image(center.x, center.y - 4 * increment.dy, this.sceneImageNames.TITLE)
      .setScale(0.6);

    const positions = {
      spButton: {
        x: center.x,
        y: center.y + 2.5 * increment.dy,
      },
      mpButton: {
        x: center.x,
        y: center.y + 5 * increment.dy,
      },
      settingsButton: {
        x: center.x - 1.5 * increment.dx,
        y: center.y + 7.5 * increment.dy,
      },
      helpButton: {
        x: center.x + 1.5 * increment.dx,
        y: center.y + 7.5 * increment.dy,
      },
    };

    const singlePlayerButton = this.add
      .image(
        positions.spButton.x,
        positions.spButton.y,
        this.sceneImageNames.SINGLE_PLAYER
      )
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    // TODO: I wonder if there's a better way (action creators/function generators?)
    singlePlayerButton.on("pointerover", () => {
      this.moveSelectorTo(positions.spButton.x, positions.spButton.y);
    });

    singlePlayerButton.on("pointerout", () => {
      this.selector.setVisible(false);
    });

    singlePlayerButton.on("pointerup", () => {
      this.scene.start("CombatScene");
    });

    const multiPlayerButton = this.add
      .image(
        positions.mpButton.x,
        positions.mpButton.y,
        this.sceneImageNames.MULTI_PLAYER
      )
      .setScale(0.5)
      .setInteractive({ useHandCursor: true });

    multiPlayerButton.on("pointerover", () => {
      this.moveSelectorTo(positions.mpButton.x, positions.mpButton.y);
    });

    multiPlayerButton.on("pointerout", () => {
      this.selector.setVisible(false);
    });

    multiPlayerButton.on("pointerup", () => {
      console.log("mp click");
    });

    // TODO: Change to text?
    const settingsButton = this.add
      .image(
        positions.settingsButton.x,
        positions.settingsButton.y,
        this.sceneImageNames.SETTINGS
      )
      .setScale(0.2)
      .setInteractive({ useHandCursor: true });

    const helpButton = this.add
      .image(
        positions.helpButton.x,
        positions.helpButton.y,
        this.sceneImageNames.HELP
      )
      .setScale(0.2)
      .setInteractive({ useHandCursor: true });

    this.selector = this.add
      .image(
        center.x + 1.5 * increment.dx,
        center.y + 7.5 * increment.dy,
        this.sceneImageNames.SELECTOR
      )
      .setScale(0.4)
      .setVisible(false);
  }

  moveSelectorTo(x: number, y: number) {
    // TODO: This is very temp
    const dx = gameWidth / 2 - (1.35 * gameWidth) / 10;
    this.selector.setPosition(dx, y).setVisible(true);
  }

  update() {}
}

export default MainMenuScene;
