import * as Phaser from "phaser";

import CombatScene from "./scenes/combatScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 981 },
    },
  },
  backgroundColor: "#f1f1f1",
  scene: [CombatScene],
};

const game = new Phaser.Game(config);
