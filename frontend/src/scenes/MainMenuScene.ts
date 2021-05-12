import { gameHeight, gameWidth } from "..";
import { iSceneImageNames } from "../interfaces/interfaces";

import tempTitle from "../assets/TempTitle2.png";
import singlePlayer from "../assets/SinglePlayer2.png";
import multiPlayer from "../assets/Multiplayer2.png";
import settings from "../assets/Settings2.png";
import help from "../assets/Info.png";
import selector from "../assets/Selector2.png";
import soonTm from "../assets/SoonTm.png";

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
      SOON_TM: "soonTM",
    };
  }

  preload() {
    this.load.image(this.sceneImageNames.TITLE, tempTitle);
    this.load.image(this.sceneImageNames.SINGLE_PLAYER, singlePlayer);
    this.load.image(this.sceneImageNames.MULTI_PLAYER, multiPlayer);
    this.load.image(this.sceneImageNames.SETTINGS, settings);
    this.load.image(this.sceneImageNames.HELP, help);
    this.load.image(this.sceneImageNames.SELECTOR, selector);
    this.load.image(this.sceneImageNames.SOON_TM, soonTm);
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

    this.add.image(
      center.x,
      center.y - 6 * increment.dy,
      this.sceneImageNames.TITLE
    );

    const positions = {
      spButton: {
        x: center.x,
        y: center.y - 1 * increment.dy,
      },
      mpButton: {
        x: center.x,
        y: center.y + 2 * increment.dy,
      },
      settingsButton: {
        x: center.x,
        y: center.y + 5 * increment.dy,
      },
      infoButton: {
        x: center.x,
        y: center.y + 8 * increment.dy,
      },
    };

    const singlePlayerButton = this.add
      .image(
        positions.spButton.x,
        positions.spButton.y,
        this.sceneImageNames.SINGLE_PLAYER
      )
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
      .setInteractive({ useHandCursor: true });

    const mpSoonTm = this.add.image(
      positions.mpButton.x,
      positions.mpButton.y,
      this.sceneImageNames.SOON_TM
    );

    multiPlayerButton.on("pointerover", () => {
      this.moveSelectorTo(positions.mpButton.x, positions.mpButton.y);
    });

    multiPlayerButton.on("pointerout", () => {
      this.selector.setVisible(false);
    });

    multiPlayerButton.on("pointerup", () => {
      console.log("mp click");
    });

    const settingsButton = this.add
      .image(
        positions.settingsButton.x,
        positions.settingsButton.y,
        this.sceneImageNames.SETTINGS
      )
      .setInteractive({ useHandCursor: true });

    const settingsSoonTm = this.add.image(
      positions.settingsButton.x,
      positions.settingsButton.y,
      this.sceneImageNames.SOON_TM
    );

    settingsButton.on("pointerover", () => {
      this.moveSelectorTo(
        positions.settingsButton.x,
        positions.settingsButton.y
      );
    });

    settingsButton.on("pointerout", () => {
      this.selector.setVisible(false);
    });

    settingsButton.on("pointerup", () => {
      console.log("settings click");
    });

    const infoButton = this.add
      .image(
        positions.infoButton.x,
        positions.infoButton.y,
        this.sceneImageNames.HELP
      )
      .setInteractive({ useHandCursor: true });

    const infoSoonTm = this.add.image(
      positions.infoButton.x,
      positions.infoButton.y,
      this.sceneImageNames.SOON_TM
    );

    infoButton.on("pointerover", () => {
      this.moveSelectorTo(positions.infoButton.x, positions.infoButton.y);
    });

    infoButton.on("pointerout", () => {
      this.selector.setVisible(false);
    });

    infoButton.on("pointerup", () => {
      console.log("info click");
    });

    this.selector = this.add
      .image(
        center.x + 1.5 * increment.dx,
        center.y + 7.5 * increment.dy,
        this.sceneImageNames.SELECTOR
      )
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
