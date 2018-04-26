import { MissionConfig } from '../states/main';
import { callPerSecondProbably } from '../utils/functions';

type BanksConfig = {
  max: number;
  size: number;
};

export default class Banks {
  private missionConfig: MissionConfig;
  private game: Phaser.Game;
  private maxInGame: number;
  private size: number;
  private group: Phaser.Group;

  public getSpriteGroup(): Phaser.Group {
    return this.group;
  }

  constructor(
    game: Phaser.Game,
    config: BanksConfig,
    missionConfig: MissionConfig
  ) {
    this.missionConfig = missionConfig;
    this.game = game;
    this.group = this.game.add.group();
    this.maxInGame = config.max;
    this.size = config.size;
  }

  public spawn(x, y): void {
    if (this.group.length >= this.maxInGame) {
      return;
    }

    this.group.add(this.createBankSprite(x, y));
  }

  update(delta: number): void {
    this.group.children.forEach((sprite: Phaser.Sprite) => {
      if (sprite.y > this.game.height) {
        sprite.destroy();
      }
    });

    if (this.group.children.length < 1) {
      callPerSecondProbably(
        () => {
          this.group.add(
            this.createBankSprite(
              Phaser.Math.between(
                this.size,
                this.missionConfig.arenaWidth - this.size
              ),
              -this.size
            )
          );
        },
        delta,
        1 / 20
      );
    }
  }

  private createBankSprite(x, y): Phaser.Sprite {
    const sprite = this.game.add.sprite(x, y, 'bank');
    this.game.physics.arcade.enable(sprite);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(1, 1);
    sprite.body.gravity.set(0, this.missionConfig.gravity);
    sprite.body.immovable = false;
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.set(0.1);
    sprite.body.collideWorldBounds = false;
    // sprite.animations.add('move');
    // sprite.animations.play('move', 3, true);
    return sprite;
  }
}
