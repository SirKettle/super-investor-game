import Player from '../objects/player';
import Coins from '../objects/coins';
import Phone from '../objects/phone';
import { callPerSecondProbably } from '../utils/functions';
import { Keyboard } from 'phaser-ce';

const MINUTE: number = 60 * 1000;
const objectives = {
  time: 10 * MINUTE
};

export type KeyboardControls = {
  [key: string]: Phaser.Key;
};

export type MissionConfig = {
  gravity: number;
  acceleration: number;
  initialCash: number;
  coinValue: number;
};

export default class Main extends Phaser.State {
  // ---------
  // Properties
  // ---------
  private missionConfig: MissionConfig;
  private player: Player;
  private phone: Phone;
  private coins: Coins;
  private timer: Phaser.Timer;
  private timerEvent: Phaser.TimerEvent;
  private keyboardControls: KeyboardControls;

  private delta: number;

  private currentWeek: number = 0;
  private previousWeek: number = 0;

  // ---------
  // INITIALIZING
  // ---------

  public create(): void {
    this.missionConfig = {
      gravity: 1100,
      acceleration: 10000,
      initialCash: 10,
      coinValue: 1
    };

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.world.width, this.world.height);

    this.initTimer();
    this.initInputControls();

    this.player = new Player(
      this.game,
      this.keyboardControls,
      this.missionConfig
    );
    this.phone = new Phone(this.game);
    this.coins = new Coins(this.game, { max: 2 }, this.missionConfig);

    this.keyboardControls.invest.onDown.add(() => {
      this.player.investCash();
    }, this);
    this.keyboardControls.riskLevel.onDown.add(() => {
      this.player.toggleRiskLevel();
    }, this);
  }

  private initTimer(): void {
    this.timer = this.game.time.create();
    this.timerEvent = this.timer.add(objectives.time, this.onTimeUp, this);
    this.timer.start();
  }

  private initInputControls(): void {
    this.keyboardControls = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
      space: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      invest: this.game.input.keyboard.addKey(Phaser.Keyboard.I),
      riskLevel: this.game.input.keyboard.addKey(Phaser.Keyboard.R)
    };
  }

  // ---------
  // UPDATE - game loop
  // ---------

  public update(): void {
    this.delta = this.game.time.physicsElapsed;
    this.currentWeek = Math.floor(this.timer.ms / 1000);

    if (this.currentWeek !== this.previousWeek) {
      this.onNewWeek();

      if (this.currentWeek % 4 === 0) {
        this.onNewMonth();
      }
    }

    this.previousWeek = this.currentWeek;

    this.player.update();

    this.phone.update(
      this.player.getCash(),
      this.player.getInvested(),
      this.player.getWealth(),
      this.player.getIfLeftInCashAmount(),
      this.currentWeek,
      this.player.getRiskLevel()
    );

    this.checkCollisions();

    callPerSecondProbably(
      () => {
        this.coins.spawn(Phaser.Math.between(10, 300), 0);
      },
      this.delta,
      2 / 1
    );
  }

  private checkCollisions(): void {
    this.game.physics.arcade.collide(
      this.player.getSprite(),
      this.phone.getSprite(),
      this.onCollision.bind(this)
    );

    this.game.physics.arcade.collide(
      this.player.getSprite(),
      this.coins.getSpriteGroup(),
      this.player.onCollisionCoins.bind(this.player)
    );
  }

  private onCollision(sprite1: Phaser.Sprite, sprite2: Phaser.Sprite): void {}

  private onNewWeek(): void {}

  private onNewMonth(): void {
    this.player.updateInvestments();
  }

  // ---------
  // HANDLERS
  // ---------

  private onTimeUp(): void {}

  // ---------
  // UTILS
  // ---------

  private getTimeLeft(): number {
    return this.timerEvent.delay - this.timer.ms;
  }
}
