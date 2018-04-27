import { MissionConfig } from '../states/main';

import Group, { GroupConfig } from './group';
import { Images } from '../states/preloader';

export default class Banks extends Group {
  constructor(
    game: Phaser.Game,
    missionConfig: MissionConfig,
    config: GroupConfig
  ) {
    super(
      game,
      {
        ...config,
        spawnRate: 1 / 20,
        imageKey: Images.bank
      },
      missionConfig
    );
  }
}
