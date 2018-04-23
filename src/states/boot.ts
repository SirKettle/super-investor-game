export default class Boot extends Phaser.State {
  public preload(): void {}

  public create(): void {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    if (this.game.device.desktop) {
      // Any desktop specific stuff here
    } else {
      // Any mobile specific stuff here
      // Force landscape mode on mobile
      this.game.scale.forceOrientation(true, false);
      // this.game.scale.forceOrientation(false, true);
    }

    console.log(
      `DEBUG....................... ${DEBUG}
        \ngame.width.................. ${this.game.width}
        \ngame.height................. ${this.game.height}`
    );

    this.game.state.start('preloader');
  }
}
