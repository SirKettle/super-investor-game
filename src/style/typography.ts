import { COLORS } from './colors';

type TextStyles = {
  [key: string]: Phaser.PhaserTextStyle;
};

export const defaultStyle: Phaser.PhaserTextStyle = {
  font: 'Courier',
  fontSize: 10,
  align: 'center',
  fill: COLORS.WHITE
};

export const phoneDateTime: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fontSize: 15
};

export const phoneCash: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fill: COLORS.YELLOW,
  align: 'left'
};

export const phoneFundTitle: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fontSize: 15,
  fontStyle: 'italic',
  fill: COLORS.GREY
};

export const phoneFundAmount: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  align: 'left'
};

export const phoneFundGrowth: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  align: 'right'
};

export const phoneFundGrowthIncrease: Phaser.PhaserTextStyle = {
  ...phoneFundGrowth,
  fill: COLORS.GREEN
};

export const phoneFundGrowthDecrease: Phaser.PhaserTextStyle = {
  ...phoneFundGrowth,
  fill: COLORS.RED
};

export const phoneMessage: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fontSize: 8,
  wordWrapWidth: 100,
  wordWrap: true
};

export const menuTitle: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fontSize: 30,
  align: 'center',
  fill: COLORS.CREAM
};

export const menuTableContent: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fontSize: 20,
  align: 'center',
  fill: COLORS.CREAM
};

export const menuContent: Phaser.PhaserTextStyle = {
  ...defaultStyle,
  fontSize: 12,
  align: 'center',
  fill: COLORS.CREAM,
  wordWrapWidth: 450,
  wordWrap: true
};
