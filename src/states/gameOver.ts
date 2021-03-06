import { Sprites } from './preloader';
import { ScoreBreakdown } from './breakdown';
import { AccountsData } from '../objects/money';
import {
  Score,
  HighScoreTable,
  getHighScoreTable,
  setHighScore
} from '../services/highScore';
import { toScore, toMoneyFormat } from '../utils/number';
import { toFixedLength } from '../utils/string';
import * as typography from '../style/typography';

export default class GameOver extends Phaser.State {
  private scoreBreakdown: ScoreBreakdown;
  private highScoreTable: HighScoreTable;
  private textTitle: Phaser.Text = null;
  private textHighScore: Phaser.Text = null;
  private nameInput: HTMLInputElement;
  private scoreForm: HTMLFormElement;

  public init(scoreBreakdown: ScoreBreakdown): void {
    this.scoreBreakdown = scoreBreakdown;
  }

  public shutdown(): void {
    this.removeForm();
  }

  private removeForm(): void {
    if (this.nameInput && this.scoreForm) {
      this.nameInput.remove();
      delete this.nameInput;
      this.scoreForm.remove();
      delete this.scoreForm;
    }
  }

  public create(): void {
    this.initTextElements();
    this.showForm();
  }

  private initTextElements(): void {
    this.textTitle = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      '',
      typography.menuTitle
    );
    this.textHighScore = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      '',
      typography.menuTableContent
    );
    this.textTitle.anchor.setTo(0.5);
    this.textHighScore.anchor.setTo(0.5);
  }

  private showForm(): void {
    this.game.camera.flash(0x000000, 1000);
    this.textTitle.setText(`GAME OVER
You made ${toMoneyFormat(this.scoreBreakdown.accountsData.wealth)}!


ENTER YOUR NAME
to submit your score`);

    this.scoreForm = document.createElement('form');

    // this.nameInput = new HTMLInputElement(); //document.getElementById('playerName');
    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.className = 'name';
    this.nameInput.value = 'Plyr1';

    this.scoreForm.appendChild(this.nameInput);
    document.body.appendChild(this.scoreForm);

    this.nameInput.focus();
    this.nameInput.select();

    this.scoreForm.onsubmit = (ev: Event): any => {
      ev.preventDefault();
      this.submitScore();
      return false;
    };
  }

  private showHighScoreTable(): void {
    this.game.camera.flash(0x000000, 1000);
    this.highScoreTable = getHighScoreTable();

    const topFive = this.highScoreTable
      .sort((a: Score, b: Score) => {
        return a.score < b.score ? 1 : -1;
      })
      .slice(0, 5);

    const highScoresText = topFive
      .map(
        (score: Score) =>
          `${toFixedLength(toScore(score.score), 10)}..${toFixedLength(
            score.name,
            8
          )}`
      )
      .join('\n');

    this.textHighScore.setText(highScoresText);

    this.textTitle.setText(`HIGH SCORES
\n\n\n
[Hit Space Bar]`);

    this.game.camera.flash(0x000000, 1000);

    this.addDudeSprite(this.game.world.centerX - 165, this.game.world.centerY);
    this.addDudeSprite(this.game.world.centerX + 165, this.game.world.centerY);

    const spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.addOnce(this.startGame, this);
  }

  private addDudeSprite(x: number, y: number): void {
    const dudeSprite = this.game.add.sprite(x, y, Sprites.dude);
    dudeSprite.anchor.set(0.5);
    dudeSprite.scale.set(2);
    dudeSprite.animations.add('move');
    dudeSprite.animations.play('move', 4, true);
  }

  private submitScore(): void {
    const score = {
      name: this.nameInput.value,
      score: this.scoreBreakdown.accountsData.wealth,
      timeStamp: this.scoreBreakdown.timeStamp
    };

    setHighScore(score);
    this.showHighScoreTable();
    this.removeForm();
  }

  private startGame(): void {
    this.game.state.start('main');
  }
}
