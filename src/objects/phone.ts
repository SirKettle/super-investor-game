import { constants as TIME, monthNames } from '../utils/time';
import { pad, toMoneyFormat } from '../utils/number';
import { Images } from '../states/preloader';
import { AccountsData } from '../objects/money';

const textStyle: Phaser.PhaserTextStyle = {
  font: 'Courier',
  fontSize: 12,
  align: 'center',
  fill: '#ffffff'
};

const textStyleDateTime: Phaser.PhaserTextStyle = {
  ...textStyle,
  fontSize: 15
};

const textStyleCash: Phaser.PhaserTextStyle = {
  ...textStyle,
  fill: '#aaaa00',
  align: 'left'
};

const textStyleFundAmount: Phaser.PhaserTextStyle = {
  ...textStyle,
  align: 'left'
};

const textStyleFundGrowth: Phaser.PhaserTextStyle = {
  ...textStyle,
  align: 'right'
};

const textStyleMessage: Phaser.PhaserTextStyle = {
  ...textStyle,
  fontSize: 8,
  wordWrapWidth: 100,
  wordWrap: true
};

const renderScoreText = (accountsData: AccountsData, currentWeek: number) => `
Cash: ${toMoneyFormat(accountsData.cash)}
---
Invested: ${toMoneyFormat(accountsData.invested)}
Tax paid: ${toMoneyFormat(accountsData.taxPaid)}
Risk level: ${accountsData.riskLevel}
---
Total wealth: ${toMoneyFormat(accountsData.wealth)}
---
Week: ${currentWeek}
Investing has definitely really saved you ${toMoneyFormat(
  accountsData.wealth - accountsData.ifLeftInCashAmount
)}
`;

export default class Phone {
  private game: Phaser.Game;
  private group: Phaser.Group;
  private message: Phaser.Text;
  private textDate: Phaser.Text;
  private textCashAmount: Phaser.Text;
  private textFundAmount: Phaser.Text;
  private textFundGrowth: Phaser.Text;
  private investmentsText: Phaser.Text;
  private sprite: Phaser.Sprite;
  private indicators: { [key: string]: Phaser.Sprite };
  private initialDateTime: Date;
  private accountsData: AccountsData;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.sprite = this.game.add.sprite(this.game.width - 160, 0, Images.phone);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;

    this.initText();

    this.message = this.game.add.text(
      this.game.width - 130,
      35,
      '',
      textStyleMessage
    );
    this.message.anchor.set(0, 0);

    this.group = this.game.add.group();
    this.group.add(this.message);
    this.group.add(this.textDate);
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

  private initText(): void {
    this.textDate = this.game.add.text(
      this.game.width - 80,
      25,
      '',
      textStyleDateTime
    );
    this.textDate.anchor.set(0.5, 0);

    this.textCashAmount = this.game.add.text(
      this.game.width - 135,
      40,
      '',
      textStyleCash
    );
    this.textCashAmount.anchor.set(0, 0);

    this.textFundAmount = this.game.add.text(
      this.game.width - 135,
      70,
      '',
      textStyleFundAmount
    );
    this.textFundAmount.anchor.set(0, 0);

    this.textFundGrowth = this.game.add.text(
      this.game.width - 25,
      70,
      '',
      textStyleFundAmount
    );
    this.textFundAmount.anchor.set(1, 0);
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

    if (this.accountsData) {
      // this.investmentsText.setText(toMoneyFormat(this.accountsData.wealth));
    }
  }

  public updateInvestments(lastGrowth: number): void {
    this.resetGrowthIndicator();

    if (lastGrowth === 0) {
      return;
    }
    if (lastGrowth > 0) {
      this.indicators.increase.alpha = 1;
    }
    if (lastGrowth < 0) {
      this.indicators.decrease.alpha = 1;
    }

    // this.investmentsText.setText(toMoneyFormat(lastGrowth));

    this.textFundGrowth.setText(toMoneyFormat(lastGrowth));

    setTimeout(() => {
      this.resetGrowthIndicator();
    }, 1500);
  }

  public update(accountsData: AccountsData, currentWeek: number): void {
    this.accountsData = accountsData;

    const scoreText = renderScoreText(accountsData, currentWeek);
    this.message.setText(scoreText);

    const currentDate = new Date(
      this.initialDateTime.getTime() + TIME.DAY * 7 * currentWeek
    );

    const date = currentDate.getUTCDate();
    const month = currentDate.getUTCMonth();
    const year = currentDate.getUTCFullYear();

    this.textDate.setText(
      `${pad(date)} ${monthNames[month]} ${year.toString().slice(2)}`
    );
  }
}
