export const pad = (num: number): string =>
  (num < 10 ? `0${num}` : num).toString();

export const toMoneyFormat = (amount: number): string => {
  return `£${Math.round(amount * 1000).toLocaleString()}`;
};
