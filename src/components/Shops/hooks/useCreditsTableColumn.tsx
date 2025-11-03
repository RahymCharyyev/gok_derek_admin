import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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
}: UseCreditsTableColumnProps): ColumnsType<any> => {
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
      render: (item: any) => {
        // Buyer is the person who created/received the credit
        // Try createdBy first, then check if there's a store with user info
        if (item?.createdBy) {
          const name = `${item.createdBy.firstName || ''} ${item.createdBy.lastName || ''}`.trim();
          if (name) return name;
        }
        if (item?.store?.user) {
          const name = `${item.store.user.firstName || ''} ${item.store.user.lastName || ''}`.trim();
          if (name) return name;
        }
        return '-';
      },
    },
    {
      title: t('amount'),
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
      title: t('deducted'),
      dataIndex: 'deducted',
      key: 'deducted',
      render: (deducted: number | null) =>
        deducted !== null && deducted !== undefined ? `${deducted} ${t('currencyTMT')}` : '-',
    },
    {
      title: t('added'),
      dataIndex: 'added',
      key: 'added',
      render: (added: number | null) =>
        added !== null && added !== undefined ? `${added} ${t('currencyTMT')}` : '-',
    },
  ];
};

