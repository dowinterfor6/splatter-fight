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
      hasHit: true,
    };

    // TODO: Wasn't there a shorthand for this
    this.animNames = animNames;
    this.xMoveSpeed = xMoveSpeed;
    this.yMoveSpeed = yMoveSpeed;
    this.player = player;

    // TODO: Very temp, just resize the assets
    this.char.setScale(0.5);
    this.char.setSize(75, 234);

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

  paintSplatter() {
    const splatterSize = 50;
    const splatterColorPalette = [
      0x844a7c,
      0x8158a6,
      0x9e4d74,
      0xe166af,
      0xe96a7d,
      0xf47a6f,
      0xf9ab49,
      0xfaab46,
      0xf3d70a,
      0xf3d14c,
      0xc4da5b,
      0xcbdb30,
      0xa7d266,
      0x6bb956,
      0x67c39c,
      0x1b9bc2,
      0x382e6d,
    ];
    const alpha = 1;

    const randVariation = 20;

    const randIdx = Math.round(
      Math.random() * (splatterColorPalette.length - 1)
    );

    const randColor = splatterColorPalette[randIdx];

    let splatterOrigin;
    if (this.charState.isFacing === "left") {
      splatterOrigin = this.attackHitbox.getLeftCenter();
    } else {
      splatterOrigin = this.attackHitbox.getRightCenter();
    }

    this.scene.add
      .ellipse(
        splatterOrigin.x + (Math.random() * 2 - 1) * randVariation,
        splatterOrigin.y + (Math.random() * 2 - 1) * randVariation,
        splatterSize,
        splatterSize,
        randColor,
        alpha
      )
      .setDepth(-1);

    const randBlobs = Math.round(Math.random() * 5);
    const blobSize = splatterSize / 2;

    for (let i = 0; i < randBlobs; i++) {
      this.scene.add
        .ellipse(
          splatterOrigin.x + Math.random() * randVariation,
          splatterOrigin.y + (Math.random() * 2 - 1) * randVariation,
          blobSize + (Math.random() * 2 - 1) * randVariation,
          blobSize + (Math.random() * 2 - 1) * randVariation,
          randColor,
          alpha
        )
        .setDepth(-1);
    }

    const splatterBlobs = Math.round(Math.random() * 30 - Math.random() * 10);
    const splatterBlobSize = blobSize / 3;
    const xModifier = this.charState.isFacing === "left" ? -1 : 1;
    const splatterBlobXVariation =
      Math.random() * 150 - Math.random() * splatterBlobSize;
    const splatterBlobYVariation = Math.random() * blobSize;
    const splatterBlobSizeVariation = Math.random() * blobSize;

    for (let i = 0; i < splatterBlobs; i++) {
      this.scene.add
        .ellipse(
          splatterOrigin.x + xModifier * Math.random() * splatterBlobXVariation,
          splatterOrigin.y + (Math.random() * 2 - 1) * splatterBlobYVariation,
          splatterBlobSize +
            (Math.random() * 2 - 1) * splatterBlobSizeVariation,
          splatterBlobSize +
            (Math.random() * 2 - 1) * splatterBlobSizeVariation,
          randColor,
          alpha
        )
        .setDepth(-10);
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