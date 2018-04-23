export default class Title extends Phaser.State {
  private localFontText: Phaser.Text = null;
  private coinImage: Phaser.Image;
  private dudeSprite: Phaser.Sprite;

  public create(): void {
    this.localFontText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      `Super investor!

      READY PLAYER ONE
      `,
      {
        font: '30px Monospace'
      }
    );
    this.localFontText.anchor.setTo(0.5);

    this.game.camera.flash(0x000000, 1000);

    this.coinImage = this.game.add.image(32, 32, 'coin');
    this.dudeSprite = this.game.add.sprite(64, 32, 'dude');
    this.dudeSprite.animations.add('move');
    this.dudeSprite.animations.play('move', 4, true);

    this.input.onDown.addOnce(this.startGame, this);
  }

  private startGame(): void {
    this.game.state.start('main');
  }
}
