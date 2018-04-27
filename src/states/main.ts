import Player from '../objects/player';
import Coins from '../objects/coins';
import Banks from '../objects/banks';
import Platforms from '../objects/platforms';
import Phone from '../objects/phone';
import { callPerSecondProbably } from '../utils/functions';
import { SoundSystem } from '../types/custom';

import { Images, Sprites, Sounds } from './preloader';

const MINUTE: number = 60 * 1000;
const objectives = {
  time: 10 * MINUTE
};

export type KeyboardControls = {
  [key: string]: Phaser.Key;
};

export type PlatformData = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type MissionConfig = {
  gravity: number;
  acceleration: number;
  initialCash: number;
  coinValue: number;
  arenaWidth: number;
  arenaHeight: number;
  platformDepth: number;
  platforms: PlatformData[];
};

const getMissionConfig = (
  arenaWidth: number,
  arenaHeight: number,
  platformDepth: number
) => ({
  arenaWidth,
  arenaHeight,
  platformDepth,
  gravity: 1100,
  acceleration: 10000,
  initialCash: 10,
  coinValue: 1,
  platforms: [
    {
      width: 100,
      height: platformDepth,
      x: 100,
      y: 0
    },
    {
      width: 100,
      height: platformDepth,
      x: 100,
      y: 50
    },
    {
      width: 100,
      height: platformDepth,
      x: 100,
      y: 100
    },
    {
      width: 100,
      height: platformDepth,
      x: 100,
      y: 150
    },
    {
      width: 100,
      height: platformDepth,
      x: 0,
      y: 210
    },
    {
      width: 100,
      height: platformDepth,
      x: arenaWidth - 100,
      y: 210
    },
    {
      width: arenaWidth,
      height: platformDepth,
      x: 0,
      y: arenaHeight - platformDepth
    }
  ]
});

export default class Main extends Phaser.State {
  // ---------
  // Properties
  // ---------
  private missionConfig: MissionConfig;
  private player: Player;
  private phone: Phone;
  private coins: Coins;
  private banks: Banks;
  private platforms: Platforms;
  private timer: Phaser.Timer;
  private timerEvent: Phaser.TimerEvent;
  private keyboardControls: KeyboardControls;
  private soundSystem: SoundSystem;

  private delta: number;

  private currentWeek: number = 0;
  private previousWeek: number = 0;

  // ---------
  // INITIALIZING
  // ---------

  public create(): void {
    this.missionConfig = getMissionConfig(
      this.game.width - 160,
      this.game.height,
      10
    );
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, this.world.width, this.world.height);

    this.soundSystem = {
      [Sounds.coin]: this.game.add.audio(Sounds.coin, 0.75),
      [Sounds.jump]: this.game.add.audio(Sounds.jump, 0.1),
      [Sounds.crash]: this.game.add.audio(Sounds.crash),
      [Sounds.bank]: this.game.add.audio(Sounds.bank)
    };

    this.initTimer();
    this.initInputControls();
    this.platforms = new Platforms(this.game, this.missionConfig);
    this.missionConfig.platforms.forEach((datum: PlatformData) => {
      this.platforms.spawn(datum.x, datum.y, datum.width, datum.height);
    });

    this.player = new Player(
      this.game,
      this.keyboardControls,
      this.missionConfig,
      this.soundSystem
    );
    this.phone = new Phone(this.game);
    this.coins = new Coins(this.game, this.missionConfig, { max: 2, size: 32 });
    this.banks = new Banks(this.game, this.missionConfig, { max: 1, size: 32 });

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
      this.player.getLastGrowth(),
      this.currentWeek,
      this.player.getRiskLevel()
    );

    this.checkCollisions();

    this.platforms.update();
    this.coins.update(this.delta);
    this.banks.update(this.delta);

    // callPerSecondProbably(
    //   () => {
    //     this.coins.spawn(Phaser.Math.between(10, 300), 0);
    //   },
    //   this.delta,
    //   2 / 1
    // );
  }

  private checkCollisions(): void {
    this.game.physics.arcade.collide(
      this.player.getSprite(),
      this.phone.getSprite()
    );
    this.game.physics.arcade.collide(
      this.coins.getSpriteGroup(),
      this.platforms.getSpriteGroup()
    );
    this.game.physics.arcade.collide(
      this.banks.getSpriteGroup(),
      this.platforms.getSpriteGroup()
    );

    // Player collisions
    this.game.physics.arcade.collide(
      this.player.getSprite(),
      this.platforms.getSpriteGroup(),
      this.player.onCollisionPlatform.bind(this.player)
    );
    this.game.physics.arcade.overlap(
      this.player.getSprite(),
      this.coins.getSpriteGroup(),
      this.player.onCollisionCoin.bind(this.player)
    );
    this.game.physics.arcade.overlap(
      this.player.getSprite(),
      this.banks.getSpriteGroup(),
      this.player.onCollisionBank.bind(this.player)
    );
  }

  private onNewWeek(): void {}

  private onNewMonth(): void {
    this.player.updateInvestments();
    this.phone.updateInvestments(this.player.getLastGrowth());
    // this.phone.updateInvestments(this.player.getAccountsData());
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
