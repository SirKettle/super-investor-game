import { Sprites } from './preloader';
import { AccountsData } from '../objects/money';
import { toScore, toMoneyFormat } from '../utils/number';

const fontStyle: Phaser.PhaserTextStyle = {
  font: '30px courier',
  align: 'center',
  fill: '#ffddee'
};

export type ScoreBreakdown = {
  accountsData: AccountsData;
  timeStamp: number;
};

export default class Breakdown extends Phaser.State {
  private scoreBreakdown: ScoreBreakdown;
  private textBreakdown: Phaser.Text = null;

  public init(scoreBreakdown: ScoreBreakdown): void {
    this.scoreBreakdown = scoreBreakdown;
  }

  public create(): void {
    this.game.camera.flash(0x000000, 1000);

    this.textBreakdown = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      '',
      fontStyle
    );
    this.textBreakdown.anchor.setTo(0.5);

    this.textBreakdown.setText(`GAME OVER
You made ${toMoneyFormat(this.scoreBreakdown.accountsData.wealth)}!

${JSON.stringify(this.scoreBreakdown.accountsData)}

ENTER YOUR NAME
to submit your score`);

    const spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.addOnce(this.nextState, this);
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
