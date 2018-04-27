export enum Sounds {
  coin = 'sound.coin',
  jump = 'sound.jump',
  powerUp = 'sound.powerUp',
  error = 'sound.error',
  crash = 'sound.crash',
  bank = 'sound.bank',
  musicMoney = 'music.money'
}

export enum Images {
  coin = 'image.coin',
  bank = 'image.bank',
  taxman = 'image.taxman',
  phone = 'image.phone'
}

export enum Sprites {
  dude = 'sprite.dude'
}

export const assets = {
  images: {
    [Images.coin]: require('assets/images/coin.png'),
    [Images.bank]: require('assets/images/bank.png'),
    [Images.taxman]: require('assets/images/taxman.png'),
    [Images.phone]: require('assets/images/phone_x4_160_280.png')
  },
  spritesheets: {
    [Sprites.dude]: {
      src: require('assets/spritesheets/office-dude.png'),
      width: 32,
      height: 32
    }
  },
  audio: {
    // TODO: Add audio
    [Sounds.coin]: require('assets/audio/sfx_coin_double1.wav'),
    [Sounds.jump]: require('assets/audio/sfx_sound_neutral2.wav'),
    [Sounds.powerUp]: require('assets/audio/sfx_sounds_powerup3.wav'),
    [Sounds.error]: require('assets/audio/sfx_sounds_error3.wav'),
    [Sounds.crash]: require('assets/audio/sfx_sounds_negative1.wav'),
    [Sounds.bank]: require('assets/audio/sfx_sounds_fanfare1.wav'),
    [Sounds.musicMoney]: require('assets/audio/MoneyMoneyMoney.mp3')
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
