export interface iCharState {
  isAttacking: Boolean;
  isFacing: "left" | "right";
  isJumping: Boolean;
  hasHit: Boolean;
}

interface iKeypressState {
  isDown: Boolean;
}

export interface iKeypress {
  left?: iKeypressState;
  right?: iKeypressState;
  space?: iKeypressState;
  pointer?: {
    isDown: boolean;
  };
}

export interface iSpriteNames {
  RUN: string;
  JUMP: string;
  ATTACK: string;
  GROUND: string;
  CLOUD: string;
}

export interface iAnimNames {
  RUN: string;
  JUMP: string;
  ATTACK: string;
  IDLE: string;
  FALL: string;
}

export type tFacing = "right" | "left";

export interface iAttackHitbox extends Phaser.GameObjects.Rectangle {
  player?: 1 | 2;
}

export interface iChar
  extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
  player?: 1 | 2;
}

export interface iEnemyKeypress {
  left: {
    isDown: boolean;
  };
  right: {
    isDown: boolean;
  };
  space: {
    isDown: boolean;
  };
  pointer: {
    isDown: boolean;
  };
}
