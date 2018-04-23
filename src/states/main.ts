import Player from '../objects/player';
import Phone from '../objects/phone';
import { Keyboard } from 'phaser-ce';

const MINUTE: number = 60 * 1000;
const objectives = {
  time: 10 * MINUTE
};

export type KeyboardControls = {
  [key: string]: Phaser.Key;
};

export default class Main extends Phaser.State {
  // ---------
  // Properties
  // ---------

  private player: Player;
  private phone: Phone;
  private timer: Phaser.Timer;
  private timerEvent: Phaser.TimerEvent;
  private keyboardControls: KeyboardControls;

  private currentWeek: number = 0;
  private previousWeek: number = 0;
  // private localFontText: Phaser.Text = null;
  // private coinImage: Phaser.Image;
  // private dudeSprite: Phaser.Sprite;

  // ---------
  // INITIALIZING
  // ---------

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.world.width, this.world.height);

    this.initTimer();
    this.initInputControls();

    // this.coinImage = this.game.add.image(32, 32, 'coin');
    // this.dudeSprite = this.game.add.sprite(64, 32, 'dude');
    // this.dudeSprite.animations.add('move');
    // this.dudeSprite.animations.play('move', 4, true);
    // this.dudeSprite.physicsEnabled = true;

    this.player = new Player(this.game, this.keyboardControls);
    this.phone = new Phone(this.game);

    this.keyboardControls.invest.onDown.add(() => {
      this.player.investCash();
    }, this);
    this.keyboardControls.riskLevel.onDown.add(
      this.player.toggleRiskLevel,
      this
    );
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
  }

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
