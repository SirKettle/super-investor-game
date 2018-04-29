import { getTable, hasTable, setTable } from '../utils/store';

export type Score = {
  name: string;
  score: number;
  timeStamp: number;
};

export type HighScoreTable = Array<Score>;

const TABLE_KEY = 'highScore';

export const setHighScoreTable = (table: HighScoreTable): void => {
  setTable(TABLE_KEY, table);
};

export const getHighScoreTable = (): HighScoreTable => {
  if (!hasTable(TABLE_KEY)) {
    setHighScoreTable([]);
  }

  return getTable(TABLE_KEY);
};

export const setHighScore = (score: Score): void => {
  const table = getHighScoreTable();
  table.push(score);
  setHighScoreTable(table);
};
