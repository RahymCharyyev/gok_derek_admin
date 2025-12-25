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

interface UseOtherShopProductsTableColumnProps {
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
  shopId?: string;
}

export const useOtherShopProductsTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  isShopProducts,
  handleOpenTransferModal,
  handleOpenSaleModal,
  shopId,
}: UseOtherShopProductsTableColumnProps): ColumnsType<any> => {
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
      title: t('name'),
      dataIndex: 'productName',
      key: 'productName',
      filterDropdown: () =>
        renderFilterDropdown(
          'name',
          t('name'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'name'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('productQuantity'),
          resolvedSearchValues,
          resolvedSetSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          resolvedHandleSearch,
          resolvedClearFilter,
          t,
          'quantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('woodUnit'),
      dataIndex: 'productUnits',
      key: 'productUnits',
      filterDropdown: () =>
        renderFilterDropdown(
          'productUnits',
          t('woodUnit'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'productUnits',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (value) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      filterDropdown: () =>
        renderFilterDropdown(
          'price',
          t('price'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'price',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
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
                  navigate(`/warehouse/other/history?productId=${record.id}`)
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
