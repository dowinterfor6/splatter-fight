import * as Phaser from "phaser";

import CombatScene from "./scenes/CombatScene";
import MainMenuScene from "./scenes/MainMenuScene";

export const gameWidth = 800;
export const gameHeight = 600;

const config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 981 },
    },
  },
  backgroundColor: "#f1f1f1",
  scene: [MainMenuScene, CombatScene],
};

const game = new Phaser.Game(config);
