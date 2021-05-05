import * as Phaser from "phaser";

import runSpritesheet from "../assets/Run.png";
import jumpSpritesheet from "../assets/Jump.png";
import attackSpritesheet from "../assets/Attack.png";

import ground from "../assets/Ground.png";
import cloud from "../assets/Cloud.png";

interface iCharState {
  isAttacking: Boolean;
  isFacing: "left" | "right";
  isJumping: Boolean;
}

interface iCursorState {
  isDown: Boolean;
}

interface iCursor {
  left?: iCursorState;
  right?: iCursorState;
  space?: iCursorState;
}

class CombatScene extends Phaser.Scene {
  char: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  cursors: iCursor;
  charState: iCharState;

  spriteNames: {
    RUN: string;
    JUMP: string;
    ATTACK: string;
    GROUND: string;
    CLOUD: string;
  };
  animNames: {
    RUN: string;
    JUMP: string;
    ATTACK: string;
    IDLE: string;
    FALL: string;
  };

  constructor(isFacing: "right" | "left" = "right") {
    super({});
    this.charState = {
      isAttacking: false,
      isFacing,
      isJumping: false,
    };

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

    // Main sprite
    // TODO: Handle player 2 sprite
    this.char = this.physics.add.sprite(300, 200, this.spriteNames.RUN);
    this.char.setCollideWorldBounds(true);
    // TODO: Very temp, just resize the assets
    this.char.setScale(0.5);
    // TODO: This is just for collision box, input.hitArea needs to be updated for hitbox?
    this.char.setSize(141, 234);

    // Sprite animations
    this.anims.create({
      key: this.animNames.RUN,
      frames: this.anims.generateFrameNumbers(this.spriteNames.RUN, {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: this.animNames.IDLE,
      frames: this.anims.generateFrameNumbers(this.spriteNames.RUN, {
        start: 0,
        end: 0,
      }),
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: this.animNames.JUMP,
      frames: this.anims.generateFrameNumbers(this.spriteNames.JUMP, {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });

    this.anims.create({
      key: this.animNames.FALL,
      frames: this.anims.generateFrameNumbers(this.spriteNames.JUMP, {
        start: 7,
        end: 7,
      }),
      frameRate: 10,
      repeat: 0,
    });

    const lastAttackRightFrame = { key: this.spriteNames.ATTACK, frame: 5 };

    this.anims.create({
      key: this.animNames.ATTACK,
      frames: [
        ...this.anims.generateFrameNumbers(this.spriteNames.ATTACK, {
          start: 0,
          end: 5,
        }),
        lastAttackRightFrame,
      ],
      frameRate: 15,
      repeat: 0,
    });

    this.physics.add.collider(this.char, this.platforms);

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
  }

  update() {
    // TODO: Very temp
    if (this.charState.isAttacking) return;

    // TODO: This definitely needs refactoring
    // TODO: Potentially need debouncing of some sorts
    if (this.input.activePointer.isDown && !this.charState.isAttacking) {
      this.char.setVelocityX(0);
      this.charState.isAttacking = true;
      if (this.charState.isFacing === "left") {
        // TODO: This assignment doesn't need to be made every time if checked properly
        this.char.flipX = true;
        this.char.anims.play(this.animNames.ATTACK, true);
      } else {
        this.char.anims.play(this.animNames.ATTACK, true);
      }
      this.char.once("animationcomplete", () => {
        this.charState.isAttacking = false;
      });
    } else if (this.cursors.right.isDown) {
      if (!this.charState.isJumping) {
        this.char.setVelocityX(500);
      }
      if (this.char.body.touching.down) {
        this.char.flipX = false;
        this.char.anims.play(this.animNames.RUN, true);
      }
      this.charState.isFacing = "right";
    } else if (this.cursors.left.isDown) {
      if (!this.charState.isJumping) {
        this.char.setVelocityX(-500);
      }
      if (this.char.body.touching.down) {
        this.char.flipX = true;
        this.char.anims.play(this.animNames.RUN, true);
      }
      this.charState.isFacing = "left";
    } else {
      this.char.setVelocityX(0);
      if (this.char.body.touching.down) {
        if (this.charState.isFacing === "left") {
          this.char.flipX = true;
        } else {
          this.char.flipX = false;
        }
        this.char.anims.play(this.animNames.IDLE, true);
      }
    }

    // TODO: Not sure if first check is needed
    if (!this.char.body.touching.down && !this.charState.isJumping) {
      if (this.charState.isFacing === "left") {
        this.char.flipX = true;
      } else {
        this.char.flipX = false;
      }
      this.char.anims.play(this.animNames.FALL, true);
    }

    if (this.cursors.space.isDown && this.char.body.touching.down) {
      this.char.setVelocityY(-500);
      this.charState.isJumping = true;

      this.char.once("animationcomplete", () => {
        this.charState.isJumping = false;
      });

      if (this.charState.isFacing === "left") {
        this.char.flipX = true;
      } else {
      }
      this.char.anims.play(this.animNames.JUMP, true);
    }
  }
}

export default CombatScene;
