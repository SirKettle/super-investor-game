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

export default class Money {
  // private members
  private cash: number;
  private invested: number;
  private dividends: number;
  private ifLeftInCashAmount: number;
  private riskLevel: RISK_LEVEL;

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

  // Initialise

  constructor(initialCash: number) {
    // set variables
    this.cash = initialCash;
    this.dividends = 0;
    this.invested = 0;
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
