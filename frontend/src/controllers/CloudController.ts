import { gameHeight, gameWidth } from "..";

const NEAR = "NEAR";
const MID = "MID";
const FAR = "FAR";

const DISTANCES = [NEAR, MID, FAR];

// TODO: Hacky fix
// TODO: This can be refactored
const DISTANCE_MODIFIER: any = {
  [NEAR]: 0.3,
  [MID]: 0.2,
  [FAR]: 0.1,
};

const DEPTH_MODIFIER: any = {
  [NEAR]: -1,
  [MID]: -2,
  [FAR]: -3,
};

const GAME_HEIGHT_VARIATION = 300;

const RENDER_FREQ_MODIFIER = 60;

const APPROX_CLOUD_SIZE = 717;

interface iCloud extends Phaser.GameObjects.Image {
  distance?: string;
}

class CloudController {
  pool: iCloud[];
  active: iCloud[];
  spawnChance: number;
  cloudSpeed: number;

  constructor(
    scene: Phaser.Scene,
    sprite: string,
    poolSize: number,
    spawnChance: number,
    cloudSpeed: number
  ) {
    this.pool = [];
    this.active = [];
    this.spawnChance = spawnChance / RENDER_FREQ_MODIFIER;
    this.cloudSpeed = cloudSpeed;
    this.fillUpPool(poolSize, scene, sprite);
  }

  fillUpPool(poolSize: number, scene: Phaser.Scene, sprite: string) {
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(
        scene.add.image(0, 0, sprite).setScale(0.3).setVisible(false)
      );
    }
  }

  initSpawn() {
    for (let i = 0; i < this.pool.length; i++) {
      const willSpawn =
        Math.random() <= this.spawnChance * 10 * RENDER_FREQ_MODIFIER;

      if (!willSpawn) continue;

      const currCloud = this.pool.shift();
      const randDistanceIdx = Math.round(
        Math.random() * (DISTANCES.length - 1)
      );

      currCloud.distance = DISTANCES[randDistanceIdx];

      currCloud.setPosition(
        Math.random() * gameWidth,
        Math.random() * (gameHeight - GAME_HEIGHT_VARIATION)
      );
      currCloud.setVisible(true);

      currCloud.setScale(DISTANCE_MODIFIER[currCloud.distance]);
      currCloud.setDepth(DEPTH_MODIFIER[currCloud.distance]);
      this.active.push(currCloud);
    }
  }

  spawnCloud() {
    if (this.pool.length === 0) return;

    for (let i = 0; i < this.pool.length; i++) {
      const willSpawn = Math.random() <= this.spawnChance;

      if (!willSpawn) continue;

      const currCloud = this.pool.shift();
      const randDistanceIdx = Math.round(
        Math.random() * (DISTANCES.length - 1)
      );

      currCloud.distance = DISTANCES[randDistanceIdx];

      const xSpawnPos =
        gameWidth + APPROX_CLOUD_SIZE * DISTANCE_MODIFIER[currCloud.distance];
      const ySpawnPos = Math.random() * (gameHeight - GAME_HEIGHT_VARIATION);

      currCloud.setPosition(xSpawnPos, ySpawnPos);
      currCloud.setVisible(true);

      currCloud.setScale(DISTANCE_MODIFIER[currCloud.distance]);
      currCloud.setDepth(DEPTH_MODIFIER[currCloud.distance]);
      this.active.push(currCloud);
    }
  }

  animateClouds() {
    for (let i = 0; i < this.active.length; i++) {
      const currCloud = this.active[i];
      currCloud.x -= DISTANCE_MODIFIER[currCloud.distance] * this.cloudSpeed;

      if (
        currCloud.x <
        -(APPROX_CLOUD_SIZE * DISTANCE_MODIFIER[currCloud.distance])
      ) {
        this.active.splice(i, 1);
        currCloud.setVisible(false);
        this.pool.push(currCloud);
      }
    }
  }

  update() {
    this.spawnCloud();
    this.animateClouds();
  }
}

export default CloudController;
