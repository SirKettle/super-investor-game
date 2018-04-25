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
    this.sprite = this.game.add.sprite(
      this.game.width / 2,
      this.game.height / 2,
      'dude'
    );

    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.set(0, this.missionConfig.gravity);
    this.sprite.body.bounce.set(0.25);
    this.sprite.body.collideWorldBounds = true;
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

    if (this.keyboardControls.up.isDown && !this.isAirbourne) {
      this.jump();
    }

    if (this.keyboardControls.down.isDown) {
      this.moveDown();
    }

    if (isMoving) {
      this.sprite.animations.play('shuffle', 20, false);
    }
  }

  // Private methods

  private jump(): void {
    this.sprite.body.velocity.y = -500;
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

  public onCollisionCoins(
    playerSprite: Phaser.Sprite,
    coinSprite: Phaser.Sprite
  ): void {
    coinSprite.destroy();
    this.addCoin();
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
}
