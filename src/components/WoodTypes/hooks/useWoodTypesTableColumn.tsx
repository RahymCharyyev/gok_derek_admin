import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { renderFilterDropdown } from '../../renderFilterDropdown';

interface UseWoodTypesTableColumnProps {
  t: (key: string) => string;
  searchValues: { [key: string]: string };
  setSearchValues: (values: { [key: string]: string }) => void;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  handleSearch: () => void;
  clearFilter: (key: string) => void;
  sortOptions: string[];
  handleOpenEditModal: (record: any) => void;
  confirmDelete: (options: { id: string }) => void;
}

export const useWoodTypesTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
}: UseWoodTypesTableColumnProps): ColumnsType<any> => {
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('name'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'name'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('priceDollar'),
      dataIndex: 'price',
      key: 'price',
      filterDropdown: () =>
        renderFilterDropdown(
          'price',
          t('priceDollar'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'price'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('selectionPriceDollar'),
      dataIndex: 'priceSelection',
      key: 'priceSelection',
      filterDropdown: () =>
        renderFilterDropdown(
          'priceSelection',
          t('selectionPriceDollar'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'priceSelection'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },

    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Button
            size='small'
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete({ id: record.key })}
          />
        </div>
      ),
    },
  ];
};
