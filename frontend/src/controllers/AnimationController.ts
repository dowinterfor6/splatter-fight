import { iAnimNames, iSpriteNames } from "../interfaces/interfaces";

class AnimationController {
  scene: Phaser.Scene;
  animNames: iAnimNames;
  spriteNames: iSpriteNames;

  constructor(
    scene: Phaser.Scene,
    animNames: iAnimNames,
    spriteNames: iSpriteNames
  ) {
    this.scene = scene;
    this.animNames = animNames;
    this.spriteNames = spriteNames;
  }

  registerAnimsToScene() {
    this.scene.anims.create({
      key: this.animNames.RUN,
      frames: this.scene.anims.generateFrameNumbers(this.spriteNames.RUN, {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.scene.anims.create({
      key: this.animNames.IDLE,
      frames: this.scene.anims.generateFrameNumbers(this.spriteNames.RUN, {
        start: 0,
        end: 0,
      }),
      frameRate: 15,
      repeat: 0,
    });

    this.scene.anims.create({
      key: this.animNames.JUMP,
      frames: this.scene.anims.generateFrameNumbers(this.spriteNames.JUMP, {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      repeat: 0,
    });

    this.scene.anims.create({
      key: this.animNames.FALL,
      frames: this.scene.anims.generateFrameNumbers(this.spriteNames.JUMP, {
        start: 7,
        end: 7,
      }),
      frameRate: 10,
      repeat: 0,
    });

    const lastAttackRightFrame = { key: this.spriteNames.ATTACK, frame: 5 };

    this.scene.anims.create({
      key: this.animNames.ATTACK,
      frames: [
        ...this.scene.anims.generateFrameNumbers(this.spriteNames.ATTACK, {
          start: 0,
          end: 5,
        }),
        lastAttackRightFrame,
      ],
      frameRate: 15,
      repeat: 0,
    });
  }
}

export default AnimationController;
