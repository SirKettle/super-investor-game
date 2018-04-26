import { KeyboardControls, MissionConfig } from '../states/main';
import { IGameConfig } from 'phaser-ce';
import Money, { RISK_LEVEL } from './money';

enum KEYBOARD_EVENTS {
  INVEST = 'keydown_I',
  TOGGLE_RISK = 'keydown_T',
  UP = 'keydown_UP',
  DOWN = 'keydown_DOWN',
  LEFT = 'keydown_LEFT',
  RIGHT = 'keydown_RIGHT'
}

export default class Player {
  // private members
  private missionConfig: MissionConfig;
  private game: Phaser.Game;
  private keyboardControls: KeyboardControls;
  private cursors: any;
  private inputKeys: any;
  private sprite: Phaser.Sprite;

  private isAirbourne: boolean = true;

  private money: Money;

  // getters
  public getSprite = (): Phaser.Sprite => this.sprite;
  public getCash = (): number => this.money.getCash();
  public getInvested = (): number => this.money.getInvested();
  public getWealth = (): number => this.money.getWealth();
  public getIfLeftInCashAmount = (): number =>
    this.money.getIfLeftInCashAmount();
  public getRiskLevel = (): RISK_LEVEL => this.money.getRiskLevel();

  // Initialise

  constructor(
    game: Phaser.Game,
    keyboardControls: KeyboardControls,
    missionConfig: MissionConfig
  ) {
    this.game = game;
    this.missionConfig = missionConfig;
    this.keyboardControls = keyboardControls;

    this.money = new Money(this.missionConfig.initialCash);

    this.renderPlayerSprite();
  }

  private renderPlayerSprite(): void {
    this.sprite = this.game.add.sprite(50, 0, 'dude');

    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.set(0, this.missionConfig.gravity);
    // this.sprite.body.bounce.set(0.25);
    this.sprite.body.collideWorldBounds = false;
    this.sprite.animations.add('shuffle');
  }

  // Update methods

  public update(): void {
    this.isAirbourne =
      this.sprite.centerY < this.game.height - this.sprite.height / 2 - 2;

    const isMoving = Boolean(
      this.keyboardControls.left.isDown ||
        this.keyboardControls.right.isDown ||
        this.keyboardControls.up.isDown ||
        this.keyboardControls.down.isDown
    );

    this.sprite.body.acceleration.x = 0;
    this.sprite.body.velocity.x = 0;
    if (this.keyboardControls.left.isDown) {
      this.moveLeft();
    }
    if (this.keyboardControls.right.isDown) {
      this.moveRight();
    }

    if (this.keyboardControls.down.isDown) {
      this.moveDown();
    }

    if (isMoving) {
      this.sprite.animations.play('shuffle', 20, false);
    }

    if (this.sprite.centerY > this.missionConfig.arenaHeight) {
      this.gameOver();
    }
  }

  // Private methods

  private jump(): void {
    this.sprite.body.velocity.y = -400;
  }

  private moveDown(): void {
    // this.updatePosition(0, this.velocity);
  }

  private moveLeft(): void {
    this.sprite.body.acceleration.x = -this.missionConfig.acceleration;
  }

  private moveRight(): void {
    this.sprite.body.acceleration.x = this.missionConfig.acceleration;
  }

  public onCollisionCoin(
    playerSprite: Phaser.Sprite,
    sprite: Phaser.Sprite
  ): void {
    sprite.destroy();
    this.addCoin();
  }

  public onCollisionBank(
    playerSprite: Phaser.Sprite,
    sprite: Phaser.Sprite
  ): void {
    sprite.destroy();
    this.investCash();
  }

  public onCollisionPlatform(
    playerSprite: Phaser.Sprite,
    sprite: Phaser.Sprite
  ): void {
    if (this.keyboardControls.up.isDown && this.sprite.body.touching.down) {
      this.jump();
    }
  }

  // Public methods

  public updateInvestments(): void {
    this.money.updateInvestments();
  }

  public investCash(): void {
    this.money.investCash();
  }

  public toggleRiskLevel(): void {
    this.money.toggleRiskLevel();
  }

  public addCoin(): void {
    this.money.addCoin();
  }

  public gameOver(): void {
    console.log('GAME OVER', this.money.getScore());
    this.game.state.start('title');
  }
}
