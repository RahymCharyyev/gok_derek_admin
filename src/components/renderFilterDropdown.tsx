import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';

export const renderFilterDropdown = (
  key: string,
  _label: string,
  searchValues: { [key: string]: string },
  setSearchValues: (values: { [key: string]: string }) => void,
  sortOptions: string[],
  sortDirectionParam: 'asc' | 'desc' | null,
  setSortBy: (value: string) => void,
  setSortDirectionParam: (value: 'asc' | 'desc') => void,
  handleSearch: () => void,
  clearFilter: (key: string) => void,
  t: (key: string) => string,
  sortField: string,
  showSearch: boolean = true,
  selectOptions?: Array<{ label: string; value: string }>,
  onSort?: (sortBy: string, sortDirection: 'asc' | 'desc') => void
) => {
  return (
    <div className='p-2 space-y-2 w-[220px]'>
      {showSearch && !selectOptions && (
        <Input
          value={searchValues[key]}
          suffix={<SearchOutlined />}
          placeholder={t('search')}
          onChange={(e) =>
            setSearchValues({ ...searchValues, [key]: e.target.value })
          }
          onPressEnter={handleSearch}
        />
      )}
      {selectOptions && (
        <Select
          className='w-[205px]'
          placeholder={t('search')}
          options={selectOptions}
          value={searchValues[key] || undefined}
          onChange={(value) => {
            setSearchValues({ ...searchValues, [key]: value || '' });
          }}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      )}
      <Select
        className='w-[205px]'
        placeholder={t('selectSortDirection')}
        options={sortOptions.map((e) => ({
          value: e,
          label: t(`sortDirection.${e}`),
        }))}
        value={sortDirectionParam || undefined}
        onChange={(value) => {
          if (onSort) {
            onSort(sortField, value);
          } else {
            setSortBy(sortField);
            setSortDirectionParam(value);
          }
        }}
      />
      <div className='flex justify-between'>
        {(showSearch || selectOptions) && (
          <Button size='small' type='primary' onClick={handleSearch}>
            {t('search')}
          </Button>
        )}
        <Button size='small' danger onClick={() => clearFilter(key)}>
          {t('clearFilter')}
        </Button>
      </div>
    </div>
  );
};
