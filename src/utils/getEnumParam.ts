export function getEnumParam<T extends string>(
  searchParams: URLSearchParams,
  key: string,
  allowed: readonly T[],
  fallback: T
): T {
  const value = searchParams.get(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}
