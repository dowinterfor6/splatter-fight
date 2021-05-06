import {
  iAnimNames,
  iKeypress,
  tFacing,
  iCharState,
  iChar,
  iAttackHitbox,
} from "../interfaces/interfaces";

// interface iContainer extends Phaser.GameObjects.Container {
//   // TODO: I don't even know lol
//   body: any;
// }

class Character extends Phaser.GameObjects.GameObject {
  char: iChar;
  // char: Phaser.GameObjects.Sprite;
  // char: Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
  // sword: Phaser.GameObjects.Sprite;
  // attackHitbox: Phaser.GameObjects.Ellipse;
  attackHitbox: iAttackHitbox;
  // attackHitbox: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  // attackHitbox: any;
  keypress: iKeypress;
  animNames: iAnimNames;
  xMoveSpeed: number;
  yMoveSpeed: number;
  charState: iCharState;
  scene: Phaser.Scene;
  player: 1 | 2;
  health: number;
  attackDamage: number;
  // container: iContainer;

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
    yMoveSpeed: number,
    maxHealth: number,
    attackDamage: number
  ) {
    super(scene, "");
    // TODO: Try this https://phaser.discourse.group/t/solved-posted-with-code-enable-disable-hit-boxes-once-per-animation-frame/8712

    this.char = scene.physics.add.sprite(xPos, yPos, sprite);
    this.char.setCollideWorldBounds(collideWorldBounds);
    // this.char.flipX = facing === "left";
    this.char.setFlipX(facing === "left");
    this.char.player = player;

    this.health = maxHealth;
    this.attackDamage = attackDamage;

    this.scene = scene;
    this.charState = {
      isAttacking: false,
      isFacing: facing,
      isJumping: false,
      hasHit: false,
    };

    // TODO: Wasn't there a shorthand for this
    this.animNames = animNames;
    this.xMoveSpeed = xMoveSpeed;
    this.yMoveSpeed = yMoveSpeed;
    this.player = player;

    // TODO: Very temp, just resize the assets
    this.char.setScale(0.5);
    // TODO: This is just for collision box, input.hitArea needs to be updated for hitbox?
    this.char.setSize(141, 234);

    // this.attackHitbox = scene.physics.add.sprite(140, 0, "");
    this.attackHitbox = scene.add.rectangle(0, 0, 100, 50, 0x010101, 0);
    this.attackHitbox.player = player;
    scene.physics.add.existing(this.attackHitbox);
    // this.createContainer(scene, xPos, yPos, sprite, facing, collideWorldBounds);

    if (player === 1) {
      this.keypress = scene.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      });
    }
  }

  // createContainer(
  //   scene: Phaser.Scene,
  //   xPos: number,
  //   yPos: number,
  //   sprite: string,
  //   facing: tFacing,
  //   collideWorldBounds: boolean
  // ) {
  //   this.container = scene.add.container(xPos, yPos).setSize(141, 234);

  //   // this.char = scene.add.sprite(0, 0, sprite);
  //   // this.char = scene.physics.add.staticSprite(0, 0, sprite);
  //   // this.attackHitbox = scene.add.sprite(100, 0, "");
  //   // this.attackHitbox = scene.add.ellipse(100, 15, 200, 50, 0x010101, 1);
  //   // this.attackHitbox = scene.add.arc(
  //   //   100,
  //   //   -100,
  //   //   130,
  //   //   135,
  //   //   350,
  //   //   true,
  //   //   0x010101,
  //   //   0.1
  //   // );
  //   // this.attackHitbox = scene.add.rectangle(140, 0, 150, 150, 0x010101, 0.1);
  //   // this.attackHitbox = scene.physics.add.staticSprite(140, 0, "");

  //   this.container.add([this.char, this.attackHitbox]);
  //   scene.physics.world.enable(
  //     this.container
  //     // Phaser.Physics.Arcade.DYNAMIC_BODY
  //   );
  //   this.container.body.setCollideWorldBounds(collideWorldBounds);
  //   this.container.setScale(0.5);

  //   // this.char.setCollideWorldBounds(true);
  //   this.container.setSize(141, 234);
  //   // this.char.setCollideWorldBounds(collideWorldBounds);
  //   if (facing === "left") {
  //     // this.container.setScale(-0.5, 0.5);
  //     this.char.setFlipX(true);
  //     this.attackHitbox.setPosition(-140, 0);
  //     this.attackHitbox.setScale(-1, 1);
  //   }

  //   // TODO: Very temp, just resize the assets
  //   // this.char.setScale(0.5);
  //   // TODO: This is just for collision box, input.hitArea needs to be updated for hitbox?
  //   // this.char.setSize(141, 234);
  // }

  updateChar() {
    let movementModifier = 1;

    if (this.player === 1) {
      // TODO: This still feels like it could be refactored tbh
      if (
        this.scene.input.activePointer.isDown &&
        !this.charState.isAttacking
      ) {
        this.charState.isAttacking = true;
        this.charState.hasHit = false;
        this.char.anims.play(this.animNames.ATTACK, true);
        this.char.once("animationcomplete", () => {
          this.charState.isAttacking = false;
          this.charState.isJumping = false;
          this.charState.hasHit = true;
        });
      } else if (this.keypress.space.isDown && this.char.body.touching.down) {
        this.char.body.setVelocityY(-this.yMoveSpeed);
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
        this.char.body.setVelocityX(moveSpeed * movementModifier);
      } else if (this.char.body.touching.down) {
        this.char.body.setVelocityX(0);
        if (!this.charState.isAttacking && !this.charState.isJumping) {
          this.char.anims.play(this.animNames.IDLE, true);
        }
      }

      if (this.charState.isFacing === "left") {
        this.char.setFlipX(true);
        // this.attackHitbox.setPosition(-140, 0);
        // this.attackHitbox.setScale(-1, 1);
      } else {
        this.char.setFlipX(false);
        // this.attackHitbox.setPosition(140, 0);
        // this.attackHitbox.setScale(1);
      }
    }

    // TODO: This is honestly the worst hackiest solution imagineable
    this.attackHitbox.copyPosition(this.char);
    this.attackHitbox.body.velocity.x = this.char.body.velocity.x;
    this.attackHitbox.body.velocity.y = this.char.body.velocity.y;
    this.attackHitbox.y -= 35;
    if (this.charState.isFacing === "left") {
      this.attackHitbox.x -= 65;
    } else {
      this.attackHitbox.x += 65;
    }
  }

  takeDamage(damageTaken: number) {
    this.health -= damageTaken;

    if (this.health <= 0) {
      console.log(`Player ${this.player} died`);
    }
  }
}

export default Character;
