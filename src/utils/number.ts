export const pad = (num: number): string =>
  (num < 10 ? `0${num}` : num).toString();
