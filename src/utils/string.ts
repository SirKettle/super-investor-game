import { times } from 'ramda';

export const toFixedLength = (
  str: string,
  length: number,
  fillChar: string = '.'
): string => {
  if (str.length === length) {
    return str;
  }
  if (str.length > length) {
    return str.substr(0, length);
  }
  return `${str}${times(() => fillChar, length - str.length).join('')}`;
};
