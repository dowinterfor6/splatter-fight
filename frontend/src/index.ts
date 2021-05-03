import * as Phaser from "phaser";
import walkRightSpriteSheet from "./assets/WalkRight-141-233.png";
import walkLeftSpriteSheet from "./assets/WalkLeft-141-233.png";
import jumpRightSpriteSheet from "./assets/JumpRight-141-233.png";
import jumpLeftSpriteSheet from "./assets/JumpLeft-141-233.png";

import ground from "./assets/Ground.png";
import cloud from "./assets/Cloud.png";

function preload() {
  console.log("Preload");

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

  this.load.image("ground", ground);
  this.load.image("cloud", cloud);
}

function create() {
  console.log("Create");

  this.add.image(400, 150, "cloud");
  this.add.image(0, 0, "cloud").setOrigin(0, 0); // Top left

  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400, 575, "ground");
  this.platforms.create(150, 575, "ground");
  this.platforms.create(650, 575, "ground");

  this.char = this.physics.add.sprite(300, 200, "walkRightSprite");

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

  this.char.setCollideWorldBounds(true);

  this.physics.add.collider(this.char, this.platforms);
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.right.isDown) {
    this.char.setVelocityX(300);
    if (this.char.body.touching.down) {
      this.char.anims.play("walkRight", true);
    }
    this.char.facing = "right";
  } else if (cursors.left.isDown) {
    this.char.setVelocityX(-300);
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

  if (cursors.up.isDown && this.char.body.touching.down) {
    this.char.setVelocityY(-600);
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
