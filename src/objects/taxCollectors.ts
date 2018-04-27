import { MissionConfig } from '../states/main';

import Group, { GroupConfig } from './group';
import { Images } from '../states/preloader';

export default class TaxCollectors extends Group {
  constructor(
    game: Phaser.Game,
    missionConfig: MissionConfig,
    config: GroupConfig
  ) {
    super(
      game,
      {
        ...config,
        spawnRate: 1 / 10,
        imageKey: Images.taxman
      },
      missionConfig
    );
  }
}
