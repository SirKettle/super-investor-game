import { Images, Sprites, Sounds } from '../states/preloader';
import { SoundSystem } from '../types/custom';

export enum RISK_LEVEL {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
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

export type AccountsData = {
  cash: number;
  invested: number;
  dividends: number;
  lastGrowth: number;
  ifLeftInCashAmount: number;
  riskLevel: RISK_LEVEL;
};

export default class Money {
  // private members
  private game: Phaser.Game;
  private cash: number;
  private invested: number;
  private dividends: number;
  private lastGrowth: number;
  private ifLeftInCashAmount: number;
  private riskLevel: RISK_LEVEL;
  private soundSystem: SoundSystem;

  // getters
  public getCash = (): number => this.cash;
  public getInvested = (): number => this.invested;
  public getDividends = (): number => this.dividends;
  public getWealth = (): number => this.cash + this.invested;
  public getLastGrowth = (): number => this.lastGrowth;
  public getIfLeftInCashAmount = (): number => this.ifLeftInCashAmount;
  public getRiskLevel = (): RISK_LEVEL => this.riskLevel;

  public getAccountsData = (): AccountsData => ({
    cash: this.getCash(),
    invested: this.getInvested(),
    dividends: this.getDividends(),
    lastGrowth: this.getLastGrowth(),
    ifLeftInCashAmount: this.getIfLeftInCashAmount(),
    riskLevel: this.getRiskLevel()
  });

  // Initialise

  constructor(
    game: Phaser.Game,
    soundSystem: SoundSystem,
    initialCash: number
  ) {
    this.game = game;
    // set variables
    this.cash = initialCash;
    this.dividends = 0;
    this.invested = 0;
    this.lastGrowth = 0;
    this.ifLeftInCashAmount = this.cash;
    this.riskLevel = RISK_LEVEL.MEDIUM;
  }

  // Public methods

  public getScore(): any {
    return {
      ifLeftInCashAmount: this.getIfLeftInCashAmount(),
      wealth: this.getWealth()
    };
  }

  public updateInvestments(): void {
    if (this.invested <= 0) {
      return;
    }

    const percentageRange = getMinMaxPercentage(this.riskLevel);
    const growthPercentage = Phaser.Math.between(
      percentageRange.min,
      percentageRange.max
    );

    this.lastGrowth = this.invested * growthPercentage / 100;

    const audioKey = this.lastGrowth < 0 ? Sounds.error : Sounds.powerUp;
    this.soundSystem[audioKey].play();

    this.invested += this.lastGrowth;
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
