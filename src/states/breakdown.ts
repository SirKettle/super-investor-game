import { Sprites } from './preloader';
import { AccountsData } from '../objects/money';
import { toScore, toMoneyFormat } from '../utils/number';
import * as typography from '../style/typography';

export type ScoreBreakdown = {
  accountsData: AccountsData;
  timeStamp: number;
};

export default class Breakdown extends Phaser.State {
  private scoreBreakdown: ScoreBreakdown;
  private textTitle: Phaser.Text = null;
  private textBreakdown: Phaser.Text = null;

  public init(scoreBreakdown: ScoreBreakdown): void {
    this.scoreBreakdown = scoreBreakdown;
  }

  public create(): void {
    this.game.camera.flash(0x000000, 1000);

    this.textTitle = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      `GAME OVER
\n\n\n
[Hit Space Bar]`,
      typography.menuTitle
    );
    this.textTitle.anchor.setTo(0.5);

    const cashTotal =
      this.scoreBreakdown.accountsData.ifLeftInCashAmount -
      this.scoreBreakdown.accountsData.taxPaid;

    const investmentGain = this.scoreBreakdown.accountsData.wealth - cashTotal;

    const investedText =
      this.scoreBreakdown.accountsData.invested > 0
        ? investmentGain > 0
          ? `If you had not invested any of your money, you would have only made ${toMoneyFormat(
              cashTotal
            )}.
This means your investments made you an extra ${toMoneyFormat(investmentGain)}
WINNER!`
          : `Your investments made a loss of ${toMoneyFormat(
              Math.abs(investmentGain)
            )}.
Unfortunately your investments can go down as well as up! ;)
We recommend you invest for a minimum of 3 years to minimise this risk.`
        : "You didn't manage to invest any money :(";

    this.textBreakdown = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      `You made ${toMoneyFormat(this.scoreBreakdown.accountsData.wealth)}!
You collected ${toMoneyFormat(
        this.scoreBreakdown.accountsData.ifLeftInCashAmount
      )} in cash and paid taxes of ${toMoneyFormat(
        this.scoreBreakdown.accountsData.taxPaid
      )}.
${investedText}`,
      typography.menuContent
    );
    this.textBreakdown.anchor.setTo(0.5);

    const spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.addOnce(this.nextState, this);

    console.log(JSON.stringify(this.scoreBreakdown.accountsData));
  }

  private addDudeSprite(x: number, y: number): void {
    const dudeSprite = this.game.add.sprite(x, y, Sprites.dude);
    dudeSprite.anchor.set(0.5);
    dudeSprite.scale.set(2);
    dudeSprite.animations.add('move');
    dudeSprite.animations.play('move', 4, true);
  }

  private nextState(): void {
    this.game.state.start('gameOver', true, false, this.scoreBreakdown);
  }
}
