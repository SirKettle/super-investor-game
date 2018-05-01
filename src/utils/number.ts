export const pad = (num: number): string =>
  (num < 10 ? `0${num}` : num).toString();

const CURRENCY_SYMBOL = '£';

export const toScore = (amount: number): string => {
  const modAmount = Math.round(amount * 1000);
  return `£${modAmount.toLocaleString()}`;
};

export const toMoneyFormat = (amount: number): string => {
  const modAmount = Math.round(amount * 1000);
  if (modAmount > 1000000) {
    return `${CURRENCY_SYMBOL}${(
      Math.floor(modAmount / 100000) / 10
    ).toLocaleString()}M`;
  }
  if (modAmount > 1000) {
    return `${CURRENCY_SYMBOL}${(
      Math.floor(modAmount / 100) / 10
    ).toLocaleString()}K`;
  }

  return `${CURRENCY_SYMBOL}${modAmount.toLocaleString()}`;
};
