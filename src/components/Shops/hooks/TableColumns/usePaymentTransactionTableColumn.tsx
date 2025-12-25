import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UsePaymentTransactionTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  onCancelSale?: (record: any) => void;
  dateFormat?: string;
}

export const usePaymentTransactionTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  onCancelSale,
  dateFormat = 'HH:mm',
}: UsePaymentTransactionTableColumnProps): ColumnsType<any> => {
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
      title: t('soldTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('soldTime'),
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
      render: (date: string) => dayjs(date).format(dateFormat),
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'productName',
          t('productName'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'productName'
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('dimensions'),
      children: [
        {
          title: t('woodThickness'),
          dataIndex: 'thickness',
          key: 'thickness',
          render: (value: number) => value || '-',
        },
        {
          title: t('woodWidth'),
          dataIndex: 'width',
          key: 'width',
          render: (value: number) => value || '-',
        },
        {
          title: t('woodLength'),
          dataIndex: 'length',
          key: 'length',
          render: (value: number) => value || '-',
        },
      ],
    },
    {
      title: t('woodUnit'),
      dataIndex: 'units',
      key: 'units',
      render: (value: any[]) => {
        if (!Array.isArray(value) || value.length === 0) return '-';
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: number) => (value ? formatQuantityOrPrice(value) : '-'),
    },
    {
      title: t('m2Price'),
      dataIndex: 'm2',
      key: 'm2',
      render: (value: string) => value || '-',
    },
    {
      title: t('oneItemPrice'),
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: number) => (value ? formatQuantityOrPrice(value) : '-'),
    },
    {
      title: t('totalPrice'),
      dataIndex: 'amount',
      key: 'totalAmount',
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
      render: (amount: number) => `${formatQuantityOrPrice(amount)} TMT`,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      filterDropdown: () =>
        renderFilterDropdown(
          'type',
          t('type'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'type'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (type: string) => t(type === 'in' ? 'income' : 'outcome'),
    },
    {
      title: t('saleMethod'),
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => t(method),
    },
    {
      title: t('note'),
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: t('createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: any) =>
        createdBy
          ? `${createdBy.firstName || ''} ${createdBy.lastName || ''}`.trim()
          : '-',
    },
    ...(onCancelSale
      ? [
          {
            title: t('actions'),
            key: 'actions',
            fixed: 'right' as const,
            width: 120,
            render: (_: any, record: any) => (
              <Button
                size='small'
                type='primary'
                danger
                icon={<DeleteOutlined />}
                onClick={() => onCancelSale(record)}
              >
                {t('cancelSale')}
              </Button>
            ),
          },
        ]
      : []),
  ];
};
