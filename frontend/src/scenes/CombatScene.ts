import runSpritesheet from "../assets/Run.png";
import jumpSpritesheet from "../assets/Jump.png";
import attackSpritesheet from "../assets/Attack.png";

import ground from "../assets/Ground.png";
import cloud from "../assets/Cloud.png";
import {
  iAnimNames,
  iAttackHitbox,
  iChar,
  iSceneTransitionData,
  iSpriteNames,
} from "../interfaces/interfaces";
import CharacterController from "../controllers/CharacterController";
import AnimationController from "../controllers/AnimationController";

import { gameWidth, gameHeight } from "../index";
import CloudController from "../controllers/CloudController";
import EnemyController from "../controllers/EnemyController";

class CombatScene extends Phaser.Scene {
  players: {
    player1?: CharacterController;
    player2?: CharacterController;
  };
  char: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  platforms: Phaser.Physics.Arcade.StaticGroup;

  spriteNames: iSpriteNames;
  animNames: iAnimNames;

  animationController: AnimationController;

  cloudController: CloudController;

  p1HealthDisplay: Phaser.GameObjects.Text;
  p2HealthDisplay: Phaser.GameObjects.Text;

  constructor() {
    super("CombatScene");

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

  // Passing value when switching scene
  init({ gameType }: iSceneTransitionData) {
    console.log(gameType);
  }

  preload() {
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
    this.cloudController = new CloudController(
      this,
      this.spriteNames.CLOUD,
      10,
      0.05,
      1
    );

    this.cloudController.initSpawn();

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, gameHeight, this.spriteNames.GROUND);
    this.platforms.scaleX(2);

    const playerStartingPosXOffset = 100;

    this.players.player1 = new CharacterController(
      this,
      playerStartingPosXOffset,
      200,
      this.spriteNames.RUN,
      "right",
      true,
      this.animNames,
      1,
      500,
      500,
      100,
      10
    );

    this.players.player2 = new EnemyController(
      this,
      gameWidth - playerStartingPosXOffset,
      200,
      this.spriteNames.RUN,
      "left",
      true,
      this.animNames,
      2,
      500,
      500,
      100,
      10,
      true
    );

    this.animationController = new AnimationController(
      this,
      this.animNames,
      this.spriteNames
    );

    this.animationController.registerAnimsToScene();

    this.physics.add.collider(this.players.player1.char, this.platforms);
    this.physics.add.collider(this.players.player2.char, this.platforms);

    const { char: p1Body, attackHitbox: p1AttackBox } = this.players.player1;
    const { char: p2Body, attackHitbox: p2AttackBox } = this.players.player2;

    this.physics.add.overlap(p1AttackBox, p2Body, this.checkOverlap.bind(this));
    this.physics.add.overlap(p2AttackBox, p1Body, this.checkOverlap.bind(this));
    // TODO: Parry
    // this.physics.add.overlap(p1AttackBox, p2AttackBox, this.checkOverlap.bind(this));

    const textPosOffset = 50;

    this.p1HealthDisplay = this.add.text(textPosOffset, textPosOffset, "100%", {
      fontSize: "72px",
      fontFamily: "Helvetica",
      color: "#FFF",
      strokeThickness: 10,
      stroke: "#000",
    });

    this.p2HealthDisplay = this.add
      .text(gameWidth - textPosOffset, textPosOffset, "100%", {
        fontSize: "72px",
        fontFamily: "Helvetica",
        color: "#FFF",
        strokeThickness: 10,
        stroke: "#000",
      })
      .setOrigin(1, 0);
  }

  update() {
    this.cloudController.update();
    this.players.player1.update();
    this.players.player2.update();
    this.p1HealthDisplay.setText(`${this.players.player1.health}%`);
    this.p2HealthDisplay.setText(`${this.players.player2.health}%`);
  }

  checkOverlap(attackBox: iAttackHitbox, char: iChar) {
    const attackingPlayer = attackBox.player;

    if (attackingPlayer === 1) {
      if (this.players.player1.charState.hasHit) return;

      this.players.player1.charState.hasHit = true;
      this.players.player2.takeDamage(this.players.player1.attackDamage);
    }

    if (attackingPlayer === 2) {
      if (this.players.player2.charState.hasHit) return;

      this.players.player2.charState.hasHit = true;
      this.players.player1.takeDamage(this.players.player2.attackDamage);
    }
  }
}

export default CombatScene;
