export const LOCAL_STORAGE =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof localStorage !== 'undefined' ? (localStorage as any) : undefined;
