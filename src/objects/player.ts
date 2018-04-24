import { KeyboardControls } from '../states/main';

enum RISK_LEVEL {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

enum KEYBOARD_EVENTS {
  INVEST = 'keydown_I',
  TOGGLE_RISK = 'keydown_T',
  UP = 'keydown_UP',
  DOWN = 'keydown_DOWN',
  LEFT = 'keydown_LEFT',
  RIGHT = 'keydown_RIGHT'
}

type MinMax = {
  min: number;
  max: number;
};

function getMinMaxPercentage(riskLevel: RISK_LEVEL): MinMax {
  if (riskLevel === RISK_LEVEL.HIGH) {
    return {
      min: -15,
      max: 25
    };
  }

  if (riskLevel === RISK_LEVEL.MEDIUM) {
    return {
      min: -10,
      max: 15
    };
  }

  return {
    min: -5,
    max: 10
  };
}

export default class Player {
  // private members
  private game: Phaser.Game;
  private keyboardControls: KeyboardControls;
  private cash: number;
  private invested: number;
  private dividends: number;
  private ifLeftInCashAmount: number;
  private riskLevel: RISK_LEVEL;
  private cursors: any;
  private inputKeys: any;
  private sprite: Phaser.Sprite;
  private acceleration: number;

  private isAirbourne: boolean = true;

  // getters
  public getCash(): number {
    return this.cash;
  }
  public getInvested(): number {
    return this.invested;
  }
  public getWealth(): number {
    return this.cash + this.invested;
  }
  public getIfLeftInCashAmount(): number {
    return this.ifLeftInCashAmount;
  }
  public getRiskLevel(): RISK_LEVEL {
    return this.riskLevel;
  }
  public getSprite(): Phaser.Sprite {
    return this.sprite;
  }

  // Initialise

  constructor(game: Phaser.Game, keyboardControls: KeyboardControls) {
    this.game = game;
    this.keyboardControls = keyboardControls;
    // set variables
    this.cash = 10;
    this.dividends = 0;
    this.invested = 0;
    this.ifLeftInCashAmount = this.cash;
    this.riskLevel = RISK_LEVEL.MEDIUM;

    this.acceleration = 10000;

    // input events
    // scene.input.keyboard.on(KEYBOARD_EVENTS.UP, this.moveUp, this);
    // scene.input.keyboard.on(KEYBOARD_EVENTS.DOWN, this.moveDown, this);
    // scene.input.keyboard.on(KEYBOARD_EVENTS.LEFT, this.moveLeft, this);
    // scene.input.keyboard.on(KEYBOARD_EVENTS.RIGHT, this.moveRight, this);

    // scene.input.keyboard.on(KEYBOARD_EVENTS.INVEST, this.investCash, this);
    // scene.input.keyboard.on(
    //   KEYBOARD_EVENTS.TOGGLE_RISK,
    //   this.toggleRiskLevel,
    //   this
    // );

    this.renderPlayerSprite();
  }

  private renderPlayerSprite(): void {
    this.sprite = this.game.add.sprite(
      this.game.width / 2,
      this.game.height / 2,
      'dude'
    );
    this.sprite.animations.add('walk');

    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.gravity.set(0, 1100);
    this.sprite.body.bounce.set(0, 0.25);
    this.sprite.body.collideWorldBounds = true;
    // sprite2.body.bounce.y = 0.2;
    // sprite2.body.gravity.y = 200;

    // this.sprite.animations.play('walk', 4, true);
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
      this.sprite.animations.play('walk', 20, false);
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
    this.sprite.body.acceleration.x = -this.acceleration;
  }

  private moveRight(): void {
    this.sprite.body.acceleration.x = this.acceleration;
  }

  private updatePosition(x: number, y: number): void {
    this.sprite.x += x;
    this.sprite.y += y;
  }

  private updateAcceleration(x: number, y: number): void {
    this.sprite.body.acceleration.x += x;
    this.sprite.body.acceleration.y += y;
  }

  // Public methods

  public updateInvestments(): void {
    if (this.invested <= 0) {
      return;
    }

    const percentageRange = getMinMaxPercentage(this.riskLevel);
    const growthPercentage = Phaser.Math.between(
      percentageRange.min,
      percentageRange.max
    );

    const growth = this.invested * growthPercentage / 100;

    this.invested += growth;
  }

  public investCash(): void {
    this.invested += this.cash;
    this.cash = 0;
  }

  public toggleRiskLevel(): void {
    switch (this.riskLevel) {
      case RISK_LEVEL.LOW:
        this.riskLevel = RISK_LEVEL.MEDIUM;
        break;
      case RISK_LEVEL.MEDIUM:
        this.riskLevel = RISK_LEVEL.HIGH;
        break;
      case RISK_LEVEL.HIGH:
        this.riskLevel = RISK_LEVEL.LOW;
        break;
    }
  }

  public addCoin(): void {
    this.cash++;
    this.ifLeftInCashAmount++;
  }
}
