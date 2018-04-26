import { MissionConfig } from '../states/main';
import { callPerSecondProbably } from '../utils/functions';

export type GroupConfig = {
  max: number;
  size: number;
  spawnRate?: number;
  imageKey?: string;
};

export default class Group {
  private missionConfig: MissionConfig;
  private game: Phaser.Game;
  private config: GroupConfig;
  private group: Phaser.Group;

  public getSpriteGroup(): Phaser.Group {
    return this.group;
  }

  constructor(
    game: Phaser.Game,
    config: GroupConfig,
    missionConfig: MissionConfig
  ) {
    this.missionConfig = missionConfig;
    this.game = game;
    this.group = this.game.add.group();
    this.config = config;
  }

  public spawn(x, y): void {
    if (this.group.children.length >= this.config.max) {
      return;
    }

    this.group.add(this.createSprite(x, y));
  }

  public update(delta: number): void {
    this.group.children.forEach((sprite: Phaser.Sprite) => {
      if (sprite.y > this.game.height) {
        sprite.destroy();
      }
    });

    if (this.group.children.length < this.config.max) {
      callPerSecondProbably(
        () => {
          this.spawn(
            Phaser.Math.between(
              this.config.size,
              this.missionConfig.arenaWidth - this.config.size
            ),
            -this.config.size
          );
        },
        delta,
        this.config.spawnRate
      );
    }
  }

  private createSprite(x, y): Phaser.Sprite {
    const sprite = this.game.add.sprite(x, y, this.config.imageKey);
    this.game.physics.arcade.enable(sprite);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(1, 1);
    sprite.body.gravity.set(0, this.missionConfig.gravity);
    sprite.body.immovable = false;
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.set(0.1);
    sprite.body.collideWorldBounds = false;
    return sprite;
  }
}
