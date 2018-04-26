import { MissionConfig } from '../states/main';

export default class Platforms {
  private missionConfig: MissionConfig;
  private game: Phaser.Game;
  private group: Phaser.Group;
  private color: string;

  public getSpriteGroup(): Phaser.Group {
    return this.group;
  }

  constructor(game: Phaser.Game, missionConfig: MissionConfig) {
    this.missionConfig = missionConfig;
    this.game = game;
    this.group = this.game.add.group();
    this.color = '#FFDD00';
  }

  public spawn(x: number, y: number, width: number, height: number): void {
    this.group.add(this.createPlatformsprite(x, y, width, height));
  }

  private createPlatformsprite(
    x: number,
    y: number,
    width: number,
    height: number
  ): Phaser.Sprite {
    const graphic = new Phaser.Graphics(this.game)
      .beginFill(Phaser.Color.hexToRGB(this.color), 1)
      .drawRect(0, 0, width, height);
    const texture = graphic.generateTexture();
    const sprite = this.game.add.sprite(x, y, texture);

    this.game.physics.arcade.enable(sprite);
    sprite.body.immovable = true;
    return sprite;
  }
}
