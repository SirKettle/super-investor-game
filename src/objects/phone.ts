import { constants as TIME, monthNames } from '../utils/time';
import { pad } from '../utils/number';

const textStyle: Phaser.PhaserTextStyle = {
  font: 'monospace',
  fontSize: 12,
  align: 'center',
  fill: '#fff'
};

const textStyleDateTime: Phaser.PhaserTextStyle = {
  ...textStyle,
  fontSize: 15
};

const textStyleMessage: Phaser.PhaserTextStyle = {
  ...textStyle,
  fontSize: 8,
  wordWrapWidth: 100,
  wordWrap: true
};

const toMoneyFormat = (amount: number): string => {
  return `£${(amount * 1000).toFixed(2)}`;
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
Investing has definitely really saved you ${toMoneyFormat(
  wealth - ifLeftInCashAmount
)}
`;

export default class Phone {
  private game: Phaser.Game;
  private group: Phaser.Group;
  private message: Phaser.Text;
  private dateTime: Phaser.Text;
  private investmentsText: Phaser.Text;
  private sprite: Phaser.Sprite;
  private indicators: { [key: string]: Phaser.Sprite };
  private initialDateTime: Date;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.sprite = this.game.add.sprite(this.game.width - 160, 0, 'phone');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;

    this.dateTime = this.game.add.text(
      this.game.width - 80,
      25,
      '',
      textStyleDateTime
    );
    this.dateTime.anchor.set(0.5, 0);

    this.message = this.game.add.text(
      this.game.width - 130,
      35,
      '',
      textStyleMessage
    );
    this.message.anchor.set(0, 0);

    this.group = this.game.add.group();
    this.group.add(this.message);
    this.group.add(this.dateTime);
    this.group.alpha = 0.7;
    this.group.fixedToCamera = true;

    this.initialDateTime = new Date();

    this.investmentsText = this.game.add.text(
      this.game.width - 120,
      147,
      '',
      textStyleDateTime
    );
    this.investmentsText.anchor.set(0, 0);

    this.indicators = {
      increase: this.game.add.sprite(
        this.game.width - 135,
        150,
        this.getTriangle('#00ff00', true)
      ),
      decrease: this.game.add.sprite(
        this.game.width - 135,
        150,
        this.getTriangle('#ff0000', false)
      )
    };

    this.resetGrowthIndicator();
  }

  private getTriangle(color: string, up: boolean): Phaser.RenderTexture {
    const points = up
      ? [
          new Phaser.Point(0, 10),
          new Phaser.Point(5, 0),
          new Phaser.Point(10, 10)
        ]
      : [
          new Phaser.Point(0, 0),
          new Phaser.Point(5, 10),
          new Phaser.Point(10, 0)
        ];
    const graphic: Phaser.Graphics = new Phaser.Graphics(this.game);
    graphic.beginFill(Phaser.Color.hexToRGB(color), 1).drawTriangle(points);
    return graphic.generateTexture();
  }

  public getSprite(): Phaser.Sprite {
    return this.sprite;
  }

  private resetGrowthIndicator(): void {
    this.indicators.increase.alpha = 0;
    this.indicators.decrease.alpha = 0;
    this.investmentsText.setText('');
  }

  public updateInvestments(lastGrowth: number): void {
    this.resetGrowthIndicator();

    if (lastGrowth > 0) {
      this.indicators.increase.alpha = 1;
    }
    if (lastGrowth < 0) {
      this.indicators.decrease.alpha = 1;
    }

    this.investmentsText.setText(toMoneyFormat(lastGrowth));

    setTimeout(() => {
      this.resetGrowthIndicator();
    }, 1500);
  }

  public update(
    cash: number,
    invested: number,
    wealth: number,
    ifLeftInCashAmount: number,
    lastGrowth: number,
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

    const currentDate = new Date(
      this.initialDateTime.getTime() + TIME.DAY * 7 * currentWeek
    );

    const date = currentDate.getUTCDate();
    const month = currentDate.getUTCMonth();
    const year = currentDate.getUTCFullYear();

    this.dateTime.setText(
      `${pad(date)} ${monthNames[month]} ${year.toString().slice(2)}`
    );
  }
}
