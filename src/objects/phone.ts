import { constants as TIME, monthNames } from '../utils/time';
import { pad, toMoneyFormat } from '../utils/number';
import { Images } from '../states/preloader';
import { AccountsData } from '../objects/money';

enum COLORS {
  WHITE = '#ffffff',
  GREY = '#666666',
  GREEN = '#00ff00',
  RED = '#ff0000',
  YELLOW = '#ccaa00'
}

const textStyle: Phaser.PhaserTextStyle = {
  font: 'Courier',
  fontSize: 10,
  align: 'center',
  fill: COLORS.WHITE
};

const textStyleDateTime: Phaser.PhaserTextStyle = {
  ...textStyle,
  fontSize: 15
};

const textStyleCash: Phaser.PhaserTextStyle = {
  ...textStyle,
  fill: COLORS.YELLOW,
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

const renderDebugText = (accountsData: AccountsData, currentWeek: number) => `
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
  private textDebug: Phaser.Text;
  private textDate: Phaser.Text;
  private textCashAmount: Phaser.Text;
  private textFundAmount: Phaser.Text;
  private textFundGrowth: Phaser.Text;
  private sprite: Phaser.Sprite;
  private indicators: { [key: string]: Phaser.Sprite };
  private initialDateTime: Date;
  private accountsData: AccountsData;

  public getSprite = (): Phaser.Sprite => this.sprite;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.initialDateTime = new Date();
    this.group = this.game.add.group();
    this.initSprites();
    this.initText();
    this.resetGrowthIndicator();
  }

  private initSprites(): void {
    this.sprite = this.game.add.sprite(this.game.width - 160, 0, Images.phone);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;

    this.indicators = {
      increase: this.game.add.sprite(
        this.game.width - 25,
        104,
        this.getTriangle(COLORS.GREEN, true)
      ),
      decrease: this.game.add.sprite(
        this.game.width - 25,
        107,
        this.getTriangle(COLORS.RED, false)
      )
    };

    this.indicators.increase.anchor.set(1, 0);
    this.indicators.decrease.anchor.set(1, 0);
  }

  private initText(): void {
    this.textDate = this.game.add.text(
      this.game.width - 80,
      25,
      '22 JAN 95',
      textStyleDateTime
    );
    this.textDate.anchor.set(0.5, 0);

    this.textCashAmount = this.game.add.text(
      this.game.width - 135,
      55,
      '',
      textStyleCash
    );
    this.textCashAmount.anchor.set(0, 0);

    this.textFundAmount = this.game.add.text(
      this.game.width - 135,
      105,
      '',
      textStyleFundAmount
    );
    this.textFundAmount.anchor.set(0, 0);

    this.textFundGrowth = this.game.add.text(
      this.game.width - 40,
      105,
      '',
      textStyleFundGrowth
    );
    this.textFundGrowth.anchor.set(1, 0);

    this.textDebug = this.game.add.text(
      this.game.width - 130,
      35,
      '',
      textStyleMessage
    );
    this.textDebug.anchor.set(0, 0);

    this.game.add
      .text(this.game.width - 80, 85, 'Smart Fund', {
        ...textStyleDateTime,
        fontStyle: 'italic',
        fill: COLORS.GREY
      })
      .anchor.set(0.5, 0);

    // this.group.add(this.textDebug);
    // this.group.add(this.textDate);
    // this.group.alpha = 0.7;
    // this.group.fixedToCamera = true;
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

  private resetGrowthIndicator(): void {
    this.indicators.increase.alpha = 0;
    this.indicators.decrease.alpha = 0;
    if (this.accountsData) {
      this.textFundGrowth.setText('');
    }
  }

  public updateInvestments(lastGrowth: number): void {
    this.resetGrowthIndicator();
    if (lastGrowth === 0) {
      return;
    }
    if (lastGrowth > 0) {
      this.indicators.increase.alpha = 1;
      this.textFundGrowth.setStyle({
        ...textStyleFundGrowth,
        fill: COLORS.GREEN
      });
    }
    if (lastGrowth < 0) {
      this.indicators.decrease.alpha = 1;
      this.textFundGrowth.setStyle({
        ...textStyleFundGrowth,
        fill: COLORS.RED
      });
    }
    this.textFundGrowth.setText(`${lastGrowth.toFixed(1)}%`);
    setTimeout(() => {
      this.resetGrowthIndicator();
    }, 1500);
  }

  public update(accountsData: AccountsData, currentWeek: number): void {
    this.accountsData = accountsData;
    // const scoreText = renderDebugText(accountsData, currentWeek);
    // this.textDebug.setText(scoreText);
    const currentDate = new Date(
      this.initialDateTime.getTime() + TIME.DAY * 7 * currentWeek
    );
    const date = currentDate.getUTCDate();
    const month = currentDate.getUTCMonth();
    const year = currentDate.getUTCFullYear();
    this.textDate.setText(
      `${pad(date)} ${monthNames[month]} ${year.toString().slice(2)}`
    );
    this.textCashAmount.setText(toMoneyFormat(accountsData.cash));
    this.textFundAmount.setText(toMoneyFormat(accountsData.invested));
  }
}
