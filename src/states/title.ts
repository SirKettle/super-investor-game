import { CENTER } from 'phaser-ce';

export default class Title extends Phaser.State {
  private localFontText: Phaser.Text = null;

  public create(): void {
    this.localFontText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      `Super investor!



READY PLAYER ONE`,
      {
        font: '30px courier',
        align: 'center',
        fill: '#ffddee'
      }
    );
    this.localFontText.anchor.setTo(0.5);

    this.game.camera.flash(0x000000, 1000);

    const coinImage = this.game.add.image(
      this.game.world.centerX + 100,
      this.game.world.centerY,
      'coin'
    );
    coinImage.anchor.set(0.5);

    const coinImage2 = this.game.add.image(
      this.game.world.centerX - 100,
      this.game.world.centerY,
      'coin'
    );
    coinImage2.anchor.set(0.5);

    const dudeSprite = this.game.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      'dude'
    );
    dudeSprite.anchor.set(0.5);
    dudeSprite.scale.set(2);
    dudeSprite.animations.add('move');
    dudeSprite.animations.play('move', 4, true);

    this.input.onDown.addOnce(this.startGame, this);
  }

  private startGame(): void {
    this.game.state.start('main');
  }
}
