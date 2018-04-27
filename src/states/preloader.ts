export const assets = {
  images: {
    coin: require('assets/images/coin.png'),
    bank: require('assets/images/bank.png'),
    phone: require('assets/images/phone_x4_160_280.png')
  },
  spritesheets: {
    dude: {
      src: require('assets/spritesheets/office-dude.png'),
      width: 32,
      height: 32
    }
  },
  audio: {
    // TODO: Add audio
    coin: require('assets/audio/sfx_coin_double1.wav'),
    jump: require('assets/audio/sfx_sound_neutral2.wav'),
    powerUp: require('assets/audio/sfx_sounds_powerup3.wav'),
    error: require('assets/audio/sfx_sounds_error3.wav'),
    crash: require('assets/audio/sfx_sounds_negative1.wav'),
    bank: require('assets/audio/sfx_sounds_fanfare1.wav')
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
