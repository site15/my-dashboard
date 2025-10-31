export const LOCAL_STORAGE =
  typeof localStorage !== 'undefined' ? (localStorage as any) : undefined;
