export const hasTable = (key: string): boolean => {
  return !!window.localStorage.getItem(key);
};

export const getTable = (key: string): any => {
  return JSON.parse(window.localStorage.getItem(key));
};

export const setTable = (key: string, table: any) => {
  window.localStorage.setItem(key, JSON.stringify(table));
};
