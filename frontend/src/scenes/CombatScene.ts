import runSpritesheet from "../assets/Run.png";
import jumpSpritesheet from "../assets/Jump.png";
import attackSpritesheet from "../assets/Attack.png";

import ground from "../assets/Ground.png";
import cloud from "../assets/Cloud.png";
import { iAnimNames, iSpriteNames } from "../interfaces/interfaces";
import Character from "../controllers/CharacterController";
import AnimationController from "../controllers/AnimationController";

class CombatScene extends Phaser.Scene {
  players: {
    player1?: Character;
    player2?: Character;
  };
  char: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  platforms: Phaser.Physics.Arcade.StaticGroup;

  spriteNames: iSpriteNames;
  animNames: iAnimNames;

  animationController: AnimationController;

  constructor() {
    super({});

    this.spriteNames = {
      RUN: "RUN",
      JUMP: "JUMP",
      ATTACK: "ATTACK",
      GROUND: "GROUND",
      CLOUD: "CLOUD",
    };

    this.animNames = {
      RUN: "RUN",
      JUMP: "JUMP",
      ATTACK: "ATTACK",
      IDLE: "IDLE",
      FALL: "FALL",
    };

    this.players = {};
  }

  preload() {
    console.log("Preload");

    const runSpritesheetDetails = {
      frameWidth: 470,
      frameHeight: 234,
      startFrame: 0,
      endFrame: 5,
    };

    const jumpSpritesheetDetails = {
      frameWidth: 470,
      frameHeight: 234,
      startFrame: 0,
      endFrame: 7,
    };

    const attackSpritesheetDetails = {
      frameWidth: 470,
      frameHeight: 234,
      startFrame: 0,
      endFrame: 5,
    };

    this.load.spritesheet(
      this.spriteNames.RUN,
      runSpritesheet,
      runSpritesheetDetails
    );

    this.load.spritesheet(
      this.spriteNames.JUMP,
      jumpSpritesheet,
      jumpSpritesheetDetails
    );

    this.load.spritesheet(
      this.spriteNames.ATTACK,
      attackSpritesheet,
      attackSpritesheetDetails
    );

    this.load.image(this.spriteNames.GROUND, ground);
    this.load.image(this.spriteNames.CLOUD, cloud);
  }

  create() {
    console.log("Create");

    this.add.image(750, 150, this.spriteNames.CLOUD).setScale(0.3);
    this.add
      .image(-20, 40, this.spriteNames.CLOUD)
      .setScale(0.3)
      .setOrigin(0, 0);
    this.add
      .image(250, 150, this.spriteNames.CLOUD)
      .setScale(0.3)
      .setOrigin(0, 0);
    this.add
      .image(400, 10, this.spriteNames.CLOUD)
      .setScale(0.3)
      .setOrigin(0, 0);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, 585, this.spriteNames.GROUND);

    this.players.player1 = new Character(
      this,
      200,
      200,
      this.spriteNames.RUN,
      "right",
      true,
      this.animNames,
      1,
      500,
      500
    );

    this.players.player2 = new Character(
      this,
      600,
      200,
      this.spriteNames.RUN,
      "left",
      true,
      this.animNames,
      2,
      500,
      500
    );

    this.animationController = new AnimationController(
      this,
      this.animNames,
      this.spriteNames
    );
    
    this.animationController.registerAnimsToScene();

    this.physics.add.collider(this.players.player1.char, this.platforms);
    this.physics.add.collider(this.players.player2.char, this.platforms);
  }

  update() {
    this.players.player1.updateChar();
  }
}

export default CombatScene;
