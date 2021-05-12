import CharacterController from "./CharacterController";
import { iAnimNames, iEnemyKeypress, tFacing } from "../interfaces/interfaces";

class EnemyController extends CharacterController {
  keypress: iEnemyKeypress;
  isAi: boolean;

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
    attackDamage: number,
    isAi: true
  ) {
    super(
      scene,
      xPos,
      yPos,
      sprite,
      facing,
      collideWorldBounds,
      animNames,
      player,
      xMoveSpeed,
      yMoveSpeed,
      maxHealth,
      attackDamage
    );

    this.isAi = isAi;

    this.keypress = {
      left: {
        isDown: false,
      },
      right: {
        isDown: false,
      },
      space: {
        isDown: false,
      },
      pointer: {
        isDown: false,
      },
    };

    // TODO: I think i have a memory leak somewhere
    this.initAi();
  }

  // TODO: Can this be refactored, e.g. with factory methods?
  inputLeft(isDown: boolean) {
    this.keypress.left.isDown = isDown;
  }

  inputRight(isDown: boolean) {
    this.keypress.right.isDown = isDown;
  }

  inputSpace(isDown: boolean) {
    this.keypress.space.isDown = isDown;
  }

  inputPointer(isDown: boolean) {
    this.keypress.pointer.isDown = isDown;
  }

  initAi() {
    if (!this.isAi) return;
    setInterval(() => {
      this.inputPointer(true);
    }, 1000);

    setInterval(() => {
      this.inputLeft(true);
      this.inputRight(false);
    }, 1000);
    setTimeout(() => {
      setInterval(() => {
        this.inputRight(true);
        this.inputLeft(false);
      }, 1000);
    }, 500);
  }
}

export default EnemyController;
