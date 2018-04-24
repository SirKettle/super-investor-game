import { MissionConfig } from '../states/main';

type CoinsConfig = {
  max: number;
};

export default class Coins {
  private missionConfig: MissionConfig;
  private game: Phaser.Game;
  private maxInGame: number;
  private group: Phaser.Group;

  constructor(
    game: Phaser.Game,
    config: CoinsConfig,
    missionConfig: MissionConfig
  ) {
    this.missionConfig = missionConfig;
    this.game = game;
    this.group = this.game.add.group();
    this.maxInGame = config.max;
  }

  public spawn(x, y) {
    if (this.group.length >= this.maxInGame) {
      return;
    }

    this.group.add(this.createCoinSprite(x, y));
  }

  private createCoinSprite(x, y) {
    const sprite = this.game.add.sprite(x, y, 'coin');
    this.game.physics.arcade.enable(sprite);
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(1, 1);
    sprite.body.gravity.set(0, this.missionConfig.gravity);
    sprite.body.immovable = false;
    sprite.body.collideWorldBounds = true;
    sprite.body.bounce.set(0.25);
    // sprite.animations.add('move');
    // sprite.animations.play('move', 3, true);
    return sprite;
  }
}
