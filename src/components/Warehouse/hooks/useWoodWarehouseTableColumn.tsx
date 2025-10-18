import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import {
  DownOutlined,
  HistoryOutlined,
  SearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface UseWoodWarehouseTableColumnProps {
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
  woodTypes?: Array<{ id: string; name: string }>;
}

export const useWoodWarehouseTableColumn = ({
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
  woodTypes,
}: UseWoodWarehouseTableColumnProps): ColumnsType<any> => {
  const navigate = useNavigate();
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
          'thickness'
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
          'width'
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
          'length'
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
          woodTypes?.map((wt) => ({ label: wt.name, value: wt.id }))
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
          'quality'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
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
      title: t('M3'),
      dataIndex: 'm3',
      key: 'm3',
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (record) => <div>{record}</div>,
    },
    ...(!isShopProducts
      ? [
          {
            title: t('actions'),
            key: 'actions',
            render: (_: any, record: any) => (
              <div className='flex items-center gap-2'>
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
            ),
          },
        ]
      : []),
  ];
};
