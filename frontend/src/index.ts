import * as Phaser from "phaser";

import walkRightSpriteSheet from "./assets/WalkRight2-141-233.png";
import walkLeftSpriteSheet from "./assets/WalkLeft2-141-233.png";
import jumpRightSpriteSheet from "./assets/JumpRight2-141-233.png";
import jumpLeftSpriteSheet from "./assets/JumpLeft2-141-233.png";
import attackLeftSpriteSheet from "./assets/AttackLeft-470-234.png";
import attackRightSpriteSheet from "./assets/AttackRight-470-234.png";

import ground from "./assets/Ground2.png";
import cloud from "./assets/Cloud2.png";

function preload() {
  console.log("Preload");

  // Spritesheet configs
  const walkSpriteSheetDetails = {
    frameWidth: 141,
    frameHeight: 233,
    startFrame: 0,
    endFrame: 5,
  };

  const jumpSpriteSheetDetails = {
    frameWidth: 141,
    frameHeight: 233,
    startFrame: 0,
    endFrame: 9,
  };

  const attackSpriteSheetDetails = {
    frameWidth: 470,
    frameHeight: 234,
    startFrame: 0,
    endFrame: 5,
  };

  // Load spritesheets
  this.load.spritesheet(
    "walkRightSprite",
    walkRightSpriteSheet,
    walkSpriteSheetDetails
  );

  this.load.spritesheet(
    "walkLeftSprite",
    walkLeftSpriteSheet,
    walkSpriteSheetDetails
  );

  this.load.spritesheet(
    "jumpRightSprite",
    jumpRightSpriteSheet,
    jumpSpriteSheetDetails
  );

  this.load.spritesheet(
    "jumpLeftSprite",
    jumpLeftSpriteSheet,
    jumpSpriteSheetDetails
  );

  this.load.spritesheet(
    "attackLeftSprite",
    attackLeftSpriteSheet,
    attackSpriteSheetDetails
  );

  this.load.spritesheet(
    "attackRightSprite",
    attackRightSpriteSheet,
    attackSpriteSheetDetails
  );

  // Load images
  this.load.image("ground", ground);
  this.load.image("cloud", cloud);
}

function create() {
  console.log("Create");

  // TODO: Create a namespace to organize stuff

  this.add.image(750, 150, "cloud").setScale(0.3);
  this.add.image(-20, 40, "cloud").setScale(0.3).setOrigin(0, 0);
  this.add.image(250, 150, "cloud").setScale(0.3).setOrigin(0, 0);
  this.add.image(400, 10, "cloud").setScale(0.3).setOrigin(0, 0);

  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400, 575, "ground");
  this.platforms.create(150, 575, "ground");
  this.platforms.create(650, 575, "ground");

  // Main sprite
  // TODO: Handle player 2 sprite
  this.char = this.physics.add.sprite(300, 200, "walkRightSprite");
  this.char.setCollideWorldBounds(true);

  // Sprite animations
  this.anims.create({
    key: "walkRight",
    frames: this.anims.generateFrameNumbers("walkRightSprite", {
      start: 0,
      end: 5,
    }),
    frameRate: 15,
    repeat: -1,
  });

  this.anims.create({
    key: "walkLeft",
    frames: this.anims.generateFrameNumbers("walkLeftSprite", {
      start: 0,
      end: 5,
    }),
    frameRate: 15,
    repeat: -1,
  });

  this.anims.create({
    key: "idleLeft",
    frames: this.anims.generateFrameNumbers("walkLeftSprite", {
      start: 0,
      end: 0,
    }),
    frameRate: 15,
    repeat: 0,
  });

  this.anims.create({
    key: "idleRight",
    frames: this.anims.generateFrameNumbers("walkRightSprite", {
      start: 0,
      end: 0,
    }),
    frameRate: 15,
    repeat: 0,
  });

  this.anims.create({
    key: "jumpRight",
    frames: this.anims.generateFrameNumbers("jumpRightSprite", {
      start: 0,
      end: 7,
    }),
    frameRate: 15,
    repeat: 0,
  });

  this.anims.create({
    key: "jumpLeft",
    frames: this.anims.generateFrameNumbers("jumpLeftSprite", {
      start: 0,
      end: 7,
    }),
    frameRate: 15,
    repeat: 0,
  });

  this.anims.create({
    key: "fallLeft",
    frames: this.anims.generateFrameNumbers("jumpLeftSprite", {
      start: 7,
      end: 7,
    }),
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: "fallRight",
    frames: this.anims.generateFrameNumbers("jumpRightSprite", {
      start: 7,
      end: 7,
    }),
    frameRate: 10,
    repeat: 0,
  });

  const lastAttackRightFrame = { key: "attackRightSprite", frame: 5 };
  const lastAttackLeftFrame = { key: "attackLeftSprite", frame: 5 };

  this.anims.create({
    key: "attackRight",
    frames: [
      ...this.anims.generateFrameNumbers("attackRightSprite", {
        start: 0,
        end: 5,
      }),
      lastAttackRightFrame,
    ],
    frameRate: 15,
    repeat: 0,
  });

  this.anims.create({
    key: "attackLeft",
    frames: [
      ...this.anims.generateFrameNumbers("attackLeftSprite", {
        start: 0,
        end: 5,
      }),
      lastAttackLeftFrame,
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

function update() {
  // TODO: Very temp
  if (this.char.isAttacking) return;

  // TODO: This definitely needs refactoring
  // TODO: Potentially need debouncing of some sorts
  if (this.input.activePointer.isDown && !this.char.isAttacking) {
    this.char.setVelocityX(0);
    this.char.isAttacking = true;
    if (this.char.facing === "left") {
      this.char.anims.play("attackLeft", true);
    } else {
      this.char.anims.play("attackRight", true);
    }
    this.char.once("animationcomplete", () => {
      this.char.isAttacking = false;
    });
  } else if (this.cursors.right.isDown) {
    if (!this.char.isInJumpingAnimation) {
      this.char.setVelocityX(500);
    }
    if (this.char.body.touching.down) {
      this.char.anims.play("walkRight", true);
    }
    this.char.facing = "right";
  } else if (this.cursors.left.isDown) {
    if (!this.char.isInJumpingAnimation) {
      this.char.setVelocityX(-500);
    }
    if (this.char.body.touching.down) {
      this.char.anims.play("walkLeft", true);
    }
    this.char.facing = "left";
  } else {
    this.char.setVelocityX(0);
    if (this.char.body.touching.down) {
      if (this.char.facing === "left") {
        this.char.anims.play("idleLeft", true);
      } else {
        this.char.anims.play("idleRight", true);
      }
    }
  }

  // TODO: Not sure if first check is needed
  if (!this.char.body.touching.down && !this.char.isInJumpingAnimation) {
    if (this.char.facing === "left") {
      this.char.anims.play("fallLeft", true);
    } else {
      this.char.anims.play("fallRight", true);
    }
  }

  if (this.cursors.space.isDown && this.char.body.touching.down) {
    this.char.setVelocityY(-500);
    this.char.isInJumpingAnimation = true;

    this.char.once("animationcomplete", () => {
      this.char.isInJumpingAnimation = false;
    });

    if (this.char.facing === "left") {
      this.char.anims.play("jumpLeft", true);
    } else {
      this.char.anims.play("jumpRight", true);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 981 },
    },
  },
  backgroundColor: "#f1f1f1",
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);
