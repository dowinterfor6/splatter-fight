import {
  iAnimNames,
  iKeypress,
  tFacing,
  iCharState,
} from "../interfaces/interfaces";

class Character {
  char: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  keypress: iKeypress;
  animNames: iAnimNames;
  xMoveSpeed: number;
  yMoveSpeed: number;
  charState: iCharState;
  scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    xPos: number,
    yPos: number,
    sprite: string,
    facing: tFacing,
    collideWorldBounds: boolean,
    animNames: iAnimNames,
    player: 1 | 2,
    xMoveSpeed: number,
    yMoveSpeed: number
  ) {
    this.char = scene.physics.add.sprite(xPos, yPos, sprite);
    this.char.setCollideWorldBounds(collideWorldBounds);
    this.char.flipX = facing === "left";

    this.scene = scene;
    this.charState = {
      isAttacking: false,
      isFacing: facing,
      isJumping: false,
    };

    // TODO: Wasn't there a shorthand for this
    this.animNames = animNames;
    this.xMoveSpeed = xMoveSpeed;
    this.yMoveSpeed = yMoveSpeed;

    // TODO: Very temp, just resize the assets
    this.char.setScale(0.5);
    // TODO: This is just for collision box, input.hitArea needs to be updated for hitbox?
    this.char.setSize(141, 234);

    if (player === 1) {
      this.keypress = scene.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      });
    }
  }

  updateChar() {
    let movementModifier = 1;

    // TODO: This still feels like it could be refactored tbh
    if (this.scene.input.activePointer.isDown && !this.charState.isAttacking) {
      this.charState.isAttacking = true;
      this.char.anims.play(this.animNames.ATTACK, true);
      this.char.once("animationcomplete", () => {
        this.charState.isAttacking = false;
        this.charState.isJumping = false;
      });
    } else if (this.keypress.space.isDown && this.char.body.touching.down) {
      this.char.setVelocityY(-this.yMoveSpeed);
      if (!this.charState.isAttacking) {
        this.char.anims.play(this.animNames.JUMP, true);
        this.char.once("animationcomplete", () => {
          this.charState.isJumping = false;
        });
      }
      this.charState.isJumping = true;
    } else if (
      !this.char.body.touching.down &&
      !this.charState.isJumping &&
      !this.charState.isAttacking
    ) {
      this.char.anims.play(this.animNames.FALL, true);
    }

    if (this.keypress.left.isDown || this.keypress.right.isDown) {
      this.charState.isFacing = this.keypress.right.isDown ? "right" : "left";
      if (!this.charState.isAttacking && !this.charState.isJumping) {
        this.char.anims.play(this.animNames.RUN, true);
      }
      const moveSpeed = this.keypress.right.isDown
        ? this.xMoveSpeed
        : -this.xMoveSpeed;
      this.char.setVelocityX(moveSpeed * movementModifier);
    } else if (this.char.body.touching.down) {
      this.char.setVelocityX(0);
      if (!this.charState.isAttacking && !this.charState.isJumping) {
        this.char.anims.play(this.animNames.IDLE, true);
      }
    }

    this.char.flipX = this.charState.isFacing === "left";
  }
}

export default Character;
