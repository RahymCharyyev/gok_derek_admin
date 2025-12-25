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

interface UseWoodWarehouseTableColumnProps {
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
}

export const useWoodWarehouseTableColumn = ({
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
}: UseWoodWarehouseTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
  const resolvedSearchValues = synced.searchValues;
  const resolvedSetSearchValues = synced.setSearchValues;
  const resolvedHandleSearch = synced.apply;
  const resolvedClearFilter = synced.clear;
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
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
      title: t('M3'),
      dataIndex: 'm3',
      key: 'm3',
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        <div className='flex items-center gap-2'>
          {isShopProducts ? (
            <>
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      ),
    },
  ];
};
