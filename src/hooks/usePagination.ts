import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 10;

  // смена страницы в таблице
  const handleTableChange = useCallback(
    (page: number, pageSize: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      params.set('perPage', pageSize.toString());
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // установка фильтра с авто-сбросом страницы
  const setFilter = useCallback(
    (key: string, value: string | number | null) => {
      const params = new URLSearchParams(searchParams);
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      params.set('page', '1'); // 🔑 всегда сбрасываем на первую страницу
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // очистка конкретного фильтра
  const clearFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      params.set('page', '1');
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // сброс всех фильтров
  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('perPage', perPage.toString());
    setSearchParams(params);
  }, [perPage, setSearchParams]);

  return {
    page,
    perPage,
    handleTableChange,
    setFilter,
    clearFilter,
    resetFilters,
    searchParams,
    setSearchParams,
  };
};
