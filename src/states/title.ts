export default class Title extends Phaser.State {
  private localFontText: Phaser.Text = null;

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
  }
}
