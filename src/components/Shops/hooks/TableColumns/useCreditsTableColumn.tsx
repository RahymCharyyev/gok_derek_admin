import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import {
  SearchOutlined,
  ShoppingOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseCreditsTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  onGotBackMoney: (record: any) => void;
}

export const useCreditsTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  onGotBackMoney,
}: UseCreditsTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
  const resolvedSearchValues = synced.searchValues;
  const resolvedSetSearchValues = synced.setSearchValues;
  const resolvedHandleSearch = synced.apply;
  const resolvedClearFilter = synced.clear;
  const searchValues = resolvedSearchValues;
  const setSearchValues = resolvedSetSearchValues;
  const handleSearch = resolvedHandleSearch;
  const clearFilter = resolvedClearFilter;
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 70,
    },
    {
      title: t('dateTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('dateTime'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'createdAt'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (date: string) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: t('buyer'),
      dataIndex: 'buyer',
      key: 'buyer',
      filterDropdown: () =>
        renderFilterDropdown(
          'buyer',
          t('buyer'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'buyer'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('amountMan'),
      dataIndex: 'amount',
      key: 'amount',
      filterDropdown: () =>
        renderFilterDropdown(
          'amount',
          t('amount'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'amount'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (amount: number) => `${amount} ${t('currencyTMT')}`,
    },
    {
      title: t('actions'),
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: any, record: any) => (
        <div className='flex gap-2'>
          <Button
            size='small'
            type='primary'
            onClick={() => onGotBackMoney(record)}
          >
            {t('gotBackMoney')}
          </Button>
          <Button
            size='small'
            type='default'
            icon={<ShoppingOutlined />}
            onClick={() => navigate(`/clients/${record.id}/products`)}
          >
            {t('products')}
          </Button>
          <Button
            size='small'
            type='default'
            icon={<TransactionOutlined />}
            onClick={() => navigate(`/clients/${record.id}/payments`)}
          >
            {t('history')}
          </Button>
        </div>
      ),
    },
  ];
};
