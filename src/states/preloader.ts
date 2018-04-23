export const assets = {
  images: {
    // bg: 'assets/images/blood_bg.jpg',
  },
  spritesheets: {
    //   gamepad: {
    //     src: 'assets/spritesheets/gamepad.png',
    //     width: 50,
    //     height: 50
    //   }
  },
  audio: {
    // TODO: Add audio
    // myAudio: 'assets/audio/my-audio.wav'
  }
};

export default class Preloader extends Phaser.State {
  public preload(): void {
    Object.keys(assets.images).forEach(key => {
      this.game.load.image(key, assets.images[key]);
    });

    Object.keys(assets.spritesheets).forEach(key => {
      const { src, width, height } = assets.spritesheets[key];
      this.game.load.spritesheet(key, src, width, height);
    });

    Object.keys(assets.audio).forEach(key => {
      this.game.load.audio(key, assets.audio[key]);
    });
  }

  public create(): void {
    this.game.camera.onFadeComplete.addOnce(this.loadTitle, this);
    this.game.camera.fade(0x000000, 1000);
  }

  private loadTitle(): void {
    this.game.state.start('title');
  }
}
