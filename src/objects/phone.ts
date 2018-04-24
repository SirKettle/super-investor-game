const textStyleDateTime: Phaser.PhaserTextStyle = {
  font: 'Monospace',
  fontSize: 20,
  fill: '#fff'
};
const textStyleMessage: Phaser.PhaserTextStyle = {
  font: 'Monospace',
  fontSize: 10,
  fill: '#fff'
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
  private sprite: Phaser.Sprite;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.sprite = this.game.add.sprite(this.game.width - 160, 0, 'phone');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;
    this.group = this.game.add.group();
    this.dateTime = this.game.add.text(500, 10, '', textStyleDateTime);
    this.message = this.game.add.text(500, 70, '', textStyleMessage);
    this.group.add(this.message);
    this.group.add(this.dateTime);
    this.group.fixedToCamera = true;
  }

  public getSprite(): Phaser.Sprite {
    return this.sprite;
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
