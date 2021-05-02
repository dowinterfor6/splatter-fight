import "./style.css";
import * as Phaser from "phaser";
// import walkSpriteSheet from "./assets/StickWalkSpriteSheet.png";
import walkRightSpriteSheet from "./assets/WalkRight-141-233.png";
import walkLeftSpriteSheet from "./assets/WalkLeft-141-233.png";
import ground from "./assets/Ground.png";
import cloud from "./assets/Cloud.png";

let sprite;

function preload() {
  console.log("Preload");

  // const spritesheetDetails = {
  //   frameWidth: 153,
  //   frameHeight: 268,
  //   startFrame: 0,
  //   endFrame: 8,
  // };

  const spritesheet2Details = {
    frameWidth: 141,
    frameHeight: 233,
    startFrame: 0,
    endFrame: 5,
  };

  // this.load.spritesheet("walkSprite", walkSpriteSheet, spritesheetDetails);
  this.load.spritesheet(
    "walkRightSprite",
    walkRightSpriteSheet,
    spritesheet2Details
  );
  this.load.spritesheet(
    "walkLeftSprite",
    walkLeftSpriteSheet,
    spritesheet2Details
  );

  this.load.image("ground", ground);
  this.load.image("cloud", cloud);

  // this.load.setBaseURL("http://labs.phaser.io");

  // this.load.image("sky", "assets/skies/space3.png");
  // this.load.image("logo", "assets/sprites/phaser3-logo.png");
  // this.load.image("red", "assets/particles/red.png");
}

function create() {
  console.log("Create");

  this.add.image(400, 150, "cloud");
  this.add.image(0, 0, "cloud").setOrigin(0, 0); // Top left

  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(400, 568, "ground");

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

  this.char.setCollideWorldBounds(true);

  this.physics.add.collider(this.char, this.platforms);

  // this.char.setBounce(0.2);

  // this.add.image(400, 300, "sky");

  // var particles = this.add.particles("red");

  // var emitter = particles.createEmitter({
  //   speed: 100,
  //   scale: { start: 1, end: 0 },
  //   blendMode: "ADD",
  // });

  // var logo = this.physics.add.image(400, 100, "logo");

  // logo.setVelocity(100, 200);
  // logo.setBounce(1, 1);
  // logo.setCollideWorldBounds(true);

  // emitter.startFollow(logo);
}

function update() {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.right.isDown) {
    this.char.setVelocityX(300);
    this.char.anims.play("walkRight", true);
  } else if (cursors.left.isDown) {
    this.char.setVelocityX(-300);
    this.char.anims.play("walkLeft", true);
  } else {
    this.char.setVelocityX(0);
    // this.char.anims.play("idle", false);
    // TODO: Differentiate idle left and right?
    this.char.anims.play("walkRight", false);
    this.char.anims.play("walkLeft", false);
  }

  if (cursors.up.isDown && this.char.body.touching.down) {
    this.char.setVelocityY(-330);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
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
