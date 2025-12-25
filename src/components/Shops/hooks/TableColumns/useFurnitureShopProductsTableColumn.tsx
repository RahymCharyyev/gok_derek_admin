import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  HistoryOutlined,
  SearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface UseFurnitureShopProductsTableColumnProps {
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
  isShopProducts?: boolean;
  handleOpenTransferModal?: (record: any) => void;
  handleOpenSaleModal?: (record: any) => void;
  onSort?: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  shopId?: string;
}

export const useFurnitureShopProductsTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
  isShopProducts,
  handleOpenTransferModal,
  handleOpenSaleModal,
  onSort,
  shopId,
}: UseFurnitureShopProductsTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('productCode'),
      dataIndex: 'productCode',
      key: 'productCode',
      filterDropdown: () =>
        renderFilterDropdown(
          'code',
          t('productCode'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'code',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('name'),
      dataIndex: 'productName',
      key: 'productName',
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
          'name',
          true,
          undefined,
          onSort
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('actualPrice'),
      dataIndex: 'actualPrice',
      key: 'actualPrice',
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
    },
    {
      title: t('benefit'),
      dataIndex: 'benefit',
      key: 'benefit',
      render: (value) => <div>{formatQuantityOrPrice(value)}</div>,
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
                  navigate(
                    `/warehouse/furniture/history?productId=${record.id}`
                  )
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
