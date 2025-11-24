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

interface UseCreditsTableColumnProps {
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
  onGotBackMoney: (record: any) => void;
}

export const useCreditsTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
  onGotBackMoney,
}: UseCreditsTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
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
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
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
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
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
