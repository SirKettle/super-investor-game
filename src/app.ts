import 'p2';
import 'pixi';
import 'phaser';

import Boot from './states/boot';
import Preloader from './states/preloader';
import Title from './states/title';

class App extends Phaser.Game {
  constructor(config: Phaser.IGameConfig) {
    super(config);

    this.state.add('boot', Boot);
    this.state.add('preloader', Preloader);
    this.state.add('title', Title);
    this.state.start('boot');
  }
}

function startApp(): void {
  const gameConfig: Phaser.IGameConfig = {
    width: 650,
    height: 375,
    renderer: Phaser.CANVAS,
    parent: '',
    resolution: 1
  };

  gameConfig.backgroundColor = '#20bb99';

  new App(gameConfig);
}

window.onload = () => {
  startApp();
};
