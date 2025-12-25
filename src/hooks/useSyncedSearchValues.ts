import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

type Values = Record<string, string>;

export function useSyncedSearchValues(options: {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
  keys: string[];
  initialValues: Values;
}) {
  const { searchParams, setSearchParams, keys, initialValues } = options;
  const [searchValues, setSearchValues] = useState<Values>(initialValues);

  useEffect(() => {
    const next: Values = { ...initialValues };
    for (const k of keys) {
      next[k] = searchParams.get(k) || '';
    }
    setSearchValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const apply = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    for (const k of keys) {
      const v = searchValues[k];
      if (v === null || v === undefined || v === '') params.delete(k);
      else params.set(k, String(v));
    }
    params.set('page', '1');
    setSearchParams(params);
  }, [keys, searchParams, searchValues, setSearchParams]);

  const clear = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      params.set('page', '1');
      setSearchParams(params);
      setSearchValues((prev) => ({ ...prev, [key]: '' }));
    },
    [searchParams, setSearchParams]
  );

  const reset = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    for (const k of keys) params.delete(k);
    params.set('page', '1');
    setSearchParams(params);
    setSearchValues(initialValues);
  }, [initialValues, keys, searchParams, setSearchParams]);

  const isEmpty = useMemo(
    () => keys.every((k) => !searchValues[k]),
    [keys, searchValues]
  );

  return {
    searchValues,
    setSearchValues: setSearchValues as Dispatch<SetStateAction<Values>>,
    apply,
    clear,
    reset,
    isEmpty,
  };
}

export type SyncedSearchValuesReturn = ReturnType<typeof useSyncedSearchValues>;
