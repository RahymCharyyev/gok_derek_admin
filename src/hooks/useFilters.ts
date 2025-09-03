export const useFilters = (
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void
) => {
  const updateFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilter = (key: string) => updateFilter(key);

  const resetAllFilters = () => setSearchParams(new URLSearchParams());

  return { updateFilter, clearFilter, resetAllFilters };
};
