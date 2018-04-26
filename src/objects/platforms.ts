// import * as R from 'ramda';
import { MissionConfig } from '../states/main';
import { platform } from 'os';

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

  public update(): void {
    const platformWidth = 75;
    // remove platforms off screen
    this.group.children.forEach((platformSprite: Phaser.Sprite) => {
      if (platformSprite.y > this.game.height) {
        platformSprite.destroy();
      }
    });

    const getMin = (acc: number, cur: number) => Math.min(acc, cur);
    const yPositions = this.group.children.map(
      (sprite: Phaser.Sprite) => sprite.y
    );
    const minY = yPositions.reduce(getMin);

    if (minY > 30) {
      this.group.add(
        this.createPlatformsprite(
          Phaser.Math.between(0, this.missionConfig.arenaWidth - platformWidth),
          -this.missionConfig.platformDepth,
          platformWidth,
          10
        )
      );
    }
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
    sprite.body.checkCollision.down = false;
    sprite.body.checkCollision.left = false;
    sprite.body.checkCollision.right = false;
    sprite.body.velocity.y = 40;
    sprite.body.velocity.x = Phaser.Math.between(-10, 10);
    return sprite;
  }
}
