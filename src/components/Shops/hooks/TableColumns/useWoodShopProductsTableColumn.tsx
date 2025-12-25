import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DownOutlined,
  HistoryOutlined,
  SearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseWoodShopProductsTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  isShopProducts?: boolean;
  handleOpenTransferModal?: (record: any) => void;
  handleOpenSaleModal?: (record: any) => void;
  woodTypes?: Array<{ id: string; name: string }>;
  onSort?: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  shopId?: string;
}

export const useWoodShopProductsTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  isShopProducts,
  handleOpenTransferModal,
  handleOpenSaleModal,
  woodTypes,
  onSort,
  shopId,
}: UseWoodShopProductsTableColumnProps): ColumnsType<any> => {
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
    },
    {
      title: t('productName'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
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
          'name',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('woodThickness'),
      dataIndex: 'productThickness',
      key: 'productThickness',
      filterDropdown: () =>
        renderFilterDropdown(
          'thickness',
          t('woodThickness'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'thickness',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{t(record)}</div>,
    },
    {
      title: t('woodWidth'),
      dataIndex: 'productWidth',
      key: 'productWidth',
      filterDropdown: () =>
        renderFilterDropdown(
          'width',
          t('woodWidth'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'width',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('woodLength'),
      dataIndex: 'productLength',
      key: 'productLength',
      filterDropdown: () =>
        renderFilterDropdown(
          'length',
          t('woodLength'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'length',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
    },
    {
      title: t('woodType'),
      dataIndex: 'productWoodType',
      key: 'productWoodType',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodTypeId',
          t('woodType'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'woodTypeId',
          false,
          woodTypes?.map((wt) => ({ label: wt.name, value: wt.id })),
          onSort
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('woodQuality'),
      dataIndex: 'productQuality',
      key: 'productQuality',
      filterDropdown: () =>
        renderFilterDropdown(
          'quality',
          t('woodQuality'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'quality',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      render: (value) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('oneItemPrice'),
      children: [
        {
          title: t('actual'),
          dataIndex: 'price',
          key: 'price',
          render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
        },
        {
          title: t('priceSelection'),
          dataIndex: 'priceSelection',
          key: 'priceSelection',
          render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
        },
      ],
    },
    {
      title: t('m2Price'),
      children: [
        {
          title: t('actual'),
          render: () => <div>-</div>,
          // dataIndex: 'price',
          // key: 'price',
          // render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
        },
        {
          title: t('priceSelection'),
          render: () => <div>-</div>,
          // dataIndex: 'priceSelection',
          // key: 'priceSelection',
          // render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
        },
      ],
    },
    {
      title: t('productQuantity'),
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <div className='flex items-center gap-2'>
          {isShopProducts ? (
            <div className='flex flex-col gap-4'>
              <Button
                size='small'
                type='primary'
                icon={<TransactionOutlined />}
                onClick={() => handleOpenTransferModal?.(record)}
              >
                {t('transferProduct')}
              </Button>
              <Button
                size='small'
                type='primary'
                icon={<TransactionOutlined />}
                onClick={() => handleOpenSaleModal?.(record)}
              >
                {t('saleProduct')}
              </Button>
              <Button
                size='small'
                type='primary'
                icon={<HistoryOutlined />}
                onClick={() =>
                  navigate(
                    `/shops/${shopId}/products/history?productId=${record.productId}`
                  )
                }
              >
                {t('history')}
              </Button>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <Button
                size='small'
                type='primary'
                icon={<TransactionOutlined />}
                onClick={() => handleOpenTransferModal?.(record)}
              >
                {t('sendProduct')}
              </Button>
              <Button
                size='small'
                type='primary'
                icon={<HistoryOutlined />}
                onClick={() =>
                  navigate(`/warehouse/wood/history?productId=${record.id}`)
                }
              >
                {t('history')}
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];
};
