import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface UseShopProductHistoryTableColumnProps {
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

export const useShopProductHistoryTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
}: UseShopProductHistoryTableColumnProps): ColumnsType<any> => {
  const typeOptions = [
    { label: t('transfer'), value: 'transfer' },
    { label: t('sale'), value: 'sale' },
    { label: t('production'), value: 'production' },
    { label: t('receipt'), value: 'receipt' },
  ];

  const productTypeOptions = [
    { label: t('wood'), value: 'wood' },
    { label: t('furniture'), value: 'furniture' },
    { label: t('other'), value: 'other' },
  ];

  const qualityOptions = [
    { label: t('regular'), value: '0' },
    { label: t('cheap'), value: '1' },
    { label: t('dryPlaned'), value: '2' },
    { label: t('osina'), value: '3' },
    { label: t('extra'), value: 'extra' },
    { label: t('premium'), value: 'premium' },
  ];

  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('createdAt'),
      dataIndex: 'date',
      key: 'date',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdAt',
          t('createdAt'),
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
      render: (record) => <div>{dayjs(record).format('DD.MM.YYYY HH:mm')}</div>,
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'productName',
          t('productName'),
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
      render: (_: any, record: any) => {
        return record.product?.name || '-';
      },
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('productQuantity'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'quantity'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('woodUnit'),
      dataIndex: 'units',
      key: 'units',
      render: (value) => {
        if (!Array.isArray(value) || value.length === 0) return '-';
        return value.map((e) => t(e.unit)).join(' / ');
      },
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
          'type',
          false,
          typeOptions
        ),
      filterIcon: () => <SearchOutlined />,
      render: (type: string) => {
        // Map transaction types to "geldi" (came) or "satyldy" (sold)
        if (type === 'receipt' || type === 'transfer') {
          return t('geldi');
        } else if (type === 'sale') {
          return t('satyldy');
        }
        return t(type) || type;
      },
    },
  ];
};
