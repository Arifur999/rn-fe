// searchParams arrive as string | string[] | undefined; pages want plain strings.
export type SearchParams = Record<string, string | string[] | undefined>;

export const param = (params: SearchParams, key: string): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

export const pageNumber = (params: SearchParams): number => {
  const n = Number(param(params, "page"));
  return Number.isInteger(n) && n > 0 ? n : 1;
};
