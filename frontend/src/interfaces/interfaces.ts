export interface iCharState {
  isAttacking: Boolean;
  isFacing: "left" | "right";
  isJumping: Boolean;
}

interface iKeypressState {
  isDown: Boolean;
}

export interface iKeypress {
  left?: iKeypressState;
  right?: iKeypressState;
  space?: iKeypressState;
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
