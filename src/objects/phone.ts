import { min, max, reduce } from 'ramda';
import { constants as TIME, monthNames } from '../utils/time';
import { pad, toMoneyFormat } from '../utils/number';
import { Images } from '../states/preloader';
import { AccountsData, FundPerformance } from '../objects/money';

enum COLORS {
  WHITE = '#ffffff',
  GREY = '#666666',
  GREEN = '#00ff00',
  RED = '#ff0000',
  YELLOW = '#ccaa00'
}

type DataPoint = {
  x: number;
  y: number;
};

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
  private lineGraph: Phaser.Graphics;
  private textDebug: Phaser.Text;
  private textDate: Phaser.Text;
  private textCashAmount: Phaser.Text;
  private textFundAmount: Phaser.Text;
  private textFundGrowth: Phaser.Text;
  private sprite: Phaser.Sprite;
  private indicators: { [key: string]: Phaser.Sprite };
  private initialDateTime: Date;
  private accountsData: AccountsData;
  private fundPerformance: FundPerformance;
  private phoneDisplay: {
    offsetFrom: {
      x: number;
      y: number;
    };
    offsetTo: {
      x: number;
    };
    centerX: number;
    width: number;
  };

  public getSprite = (): Phaser.Sprite => this.sprite;

  constructor(game: Phaser.Game) {
    this.game = game;
    this.phoneDisplay = {
      offsetFrom: {
        x: this.game.width - 135,
        y: 25
      },
      offsetTo: {
        x: this.game.width - 25
      },
      centerX: this.game.width - 80,
      width: 110
    };
    this.initialDateTime = new Date();
    this.initSprites();
    this.initText();
    this.resetGrowthIndicator();

    this.lineGraph = this.game.add.graphics();
    this.drawPerformance([]);
  }

  private initSprites(): void {
    this.sprite = this.game.add.sprite(this.game.width - 160, 0, Images.phone);
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.immovable = true;

    this.indicators = {
      increase: this.game.add.sprite(
        this.phoneDisplay.offsetTo.x,
        104,
        this.getTriangle(COLORS.GREEN, true)
      ),
      decrease: this.game.add.sprite(
        this.phoneDisplay.offsetTo.x,
        107,
        this.getTriangle(COLORS.RED, false)
      )
    };

    this.indicators.increase.anchor.set(1, 0);
    this.indicators.decrease.anchor.set(1, 0);
  }

  private initText(): void {
    this.textDate = this.game.add.text(
      this.phoneDisplay.centerX,
      25,
      '22 JAN 95',
      textStyleDateTime
    );
    this.textDate.anchor.set(0.5, 0);

    this.textCashAmount = this.game.add.text(
      this.phoneDisplay.offsetFrom.x,
      55,
      '',
      textStyleCash
    );
    this.textCashAmount.anchor.set(0, 0);

    this.textFundAmount = this.game.add.text(
      this.phoneDisplay.offsetFrom.x,
      105,
      '',
      textStyleFundAmount
    );
    this.textFundAmount.anchor.set(0, 0);

    this.textFundGrowth = this.game.add.text(
      this.phoneDisplay.offsetTo.x - 15,
      105,
      '',
      textStyleFundGrowth
    );
    this.textFundGrowth.anchor.set(1, 0);

    this.textDebug = this.game.add.text(
      this.phoneDisplay.offsetFrom.x,
      35,
      '',
      textStyleMessage
    );
    this.textDebug.anchor.set(0, 0);

    this.game.add
      .text(this.phoneDisplay.centerX, 85, 'Smart Fund', {
        ...textStyleDateTime,
        fontStyle: 'italic',
        fill: COLORS.GREY
      })
      .anchor.set(0.5, 0);
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

  private drawPerformance(fundPerformance: FundPerformance): void {
    const fundValues = fundPerformance.map(datum => datum.value);
    this.drawGraph(
      this.lineGraph,
      130,
      170,
      this.phoneDisplay.offsetFrom.x,
      this.phoneDisplay.offsetTo.x,
      fundValues
    );
  }

  private drawGraph(
    graph: Phaser.Graphics,
    top: number,
    bottom: number,
    left: number,
    right: number,
    values: Array<number>
  ): void {
    graph.clear();

    // draw outline of graph
    graph.lineStyle(1, 0x444444);
    graph.moveTo(left, top);
    graph.lineTo(left, bottom);
    graph.lineTo(right, bottom);

    if (!values.length) {
      return;
    }

    // calculate data points for graph
    const maxValue = Number(reduce(max, 0, values));
    const minValue = Number(reduce(min, Infinity, values));
    const graphWidth = right - left;
    const graphHeight = bottom - top;
    const lineWidth = graphWidth / (values.length - 1);
    const graphPoints = values.map((val: number, index: number): DataPoint => {
      const valPercentage = (val - minValue) / (maxValue - minValue);

      return {
        x: Math.floor(index * lineWidth + left),
        y: Math.floor(bottom - graphHeight * valPercentage)
      };
    });

    // draw data graph here
    graph.lineStyle(1, 0x22ccdd);
    graphPoints.forEach((point: DataPoint, index: number) => {
      if (index === 0) {
        graph.moveTo(point.x, point.y);
        return;
      }
      graph.lineTo(point.x, point.y);
    });
  }

  public updateInvestments(
    lastGrowth: number,
    fundPerformance: FundPerformance
  ): void {
    this.resetGrowthIndicator();
    this.drawPerformance(fundPerformance);
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
