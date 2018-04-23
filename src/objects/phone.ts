const textStyleDateTime: Phaser.PhaserTextStyle = {
  font: 'Monospace',
  fontSize: 20,
  fill: '#fff'
};
const textStyleMessage: Phaser.PhaserTextStyle = {
  font: 'Monospace',
  fontSize: 10,
  fill: '#000'
};

const toMoneyFormat = (amount: number): string => {
  return `£${amount.toFixed(2)}`;
};

const renderScoreText = (
  cash: number,
  invested: number,
  wealth: number,
  ifLeftInCashAmount: number,
  currentWeek: number,
  riskLevel: string
) => `
Cash: ${toMoneyFormat(cash)}
---
Risk level: ${riskLevel}
Invested: ${toMoneyFormat(invested)}
---
Total wealth: ${toMoneyFormat(wealth)}
---
Week: ${currentWeek}
Investing has saved you ${toMoneyFormat(wealth - ifLeftInCashAmount)}
`;

export default class Phone {
  private game: Phaser.Game;
  private group: Phaser.Group;
  private message: Phaser.Text;
  private dateTime: Phaser.Text;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.group = this.game.add.group();
    this.dateTime = this.game.add.text(500, 10, '', textStyleDateTime);
    this.message = this.game.add.text(500, 70, '', textStyleMessage);
    this.group.add(this.message);
    this.group.add(this.dateTime);
    this.group.fixedToCamera = true;
  }

  public update(
    cash: number,
    invested: number,
    wealth: number,
    ifLeftInCashAmount: number,
    currentWeek: number,
    riskLevel: string
  ): void {
    const scoreText = renderScoreText(
      cash,
      invested,
      wealth,
      ifLeftInCashAmount,
      currentWeek,
      riskLevel
    );
    this.message.setText(scoreText);
  }
}
