import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { SyncedSearchValuesReturn } from '@/hooks/useSyncedSearchValues';

interface UseOrderedWoodTableColumnProps {
  t: (key: string) => string;
  synced: SyncedSearchValuesReturn;
  sortBy: string | null;
  setSortBy: (value: string) => void;
  sortDirectionParam: 'asc' | 'desc' | null;
  setSortDirectionParam: (value: 'asc' | 'desc') => void;
  sortOptions: string[];
  handleOpenEditModal?: (record: any) => void;
  confirmDelete?: (record: any) => void;
  handleCreateOrder?: (record: any) => void;
  handleStatusChange?: (record: any) => void;
}

export const useOrderedWoodTableColumn = ({
  t,
  synced,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
  handleCreateOrder,
  handleStatusChange,
}: UseOrderedWoodTableColumnProps): ColumnsType<any> => {
  const { searchValues, setSearchValues, apply: handleSearch, clear: clearFilter } =
    synced;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'processing':
        return 'blue';
      case 'closed':
        return 'green';
      default:
        return 'default';
    }
  };

  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('orderDate'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 50,
      render: (record) => <div>{dayjs(record).format('HH:mm')}</div>,
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
          'name',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('dimensions'),
      children: [
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
              false
            ),
          filterIcon: () => <DownOutlined />,
          render: (record) => <div>{record}</div>,
        },

        {
          title: t('woodWidth'),
          dataIndex: 'productWidth',
          key: 'productWidth',
          filterDropdown: () =>
            renderFilterDropdown(
              'width',
              t('width'),
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
              false
            ),
          filterIcon: () => <DownOutlined />,
          render: (record) => <div>{record}</div>,
        },
        {
          title: t('woodLength'),
          dataIndex: 'productLength',
          key: 'productLength',
          filterDropdown: () =>
            renderFilterDropdown(
              'length',
              t('length'),
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
              false
            ),
          filterIcon: () => <DownOutlined />,
          render: (record) => <div>{record}</div>,
        },
      ],
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
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('woodType'),
      dataIndex: 'productWoodType',
      key: 'productWoodType',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodType',
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
          'woodType',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record || '-'}</div>,
    },
    {
      title: t('orderedQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'quantity',
          t('orderedQuantity'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'quantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('warehouseQuantity'),
      dataIndex: 'productQuantity',
      key: 'productQuantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'productQuantity',
          t('warehouseQuantity'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'productQuantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('noSendQuantity'),
      dataIndex: 'noSendQuantity',
      key: 'noSendQuantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'noSendQuantity',
          t('noSendQuantity'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'noSendQuantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
    },
    {
      title: t('woodUnitWide'),
      dataIndex: 'woodUnits',
      key: 'woodUnits',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodUnits',
          t('woodUnitWide'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'woodUnits',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (value) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: t('orderer'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      filterDropdown: () =>
        renderFilterDropdown(
          'createdBy',
          t('orderer'),
          searchValues,
          setSearchValues,
          sortOptions,
          sortDirectionParam,
          setSortBy,
          setSortDirectionParam,
          handleSearch,
          clearFilter,
          t,
          'createdBy',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: '100%', minWidth: 120 }}
          onChange={(newStatus) => {
            handleStatusChange?.({ ...record, status: newStatus });
          }}
          options={[
            {
              value: 'pending',
              label: (
                <Tag color={getStatusColor('pending')}>{t('pending')}</Tag>
              ),
            },
            {
              value: 'processing',
              label: (
                <Tag color={getStatusColor('processing')}>
                  {t('processing')}
                </Tag>
              ),
            },
            {
              value: 'closed',
              label: <Tag color={getStatusColor('closed')}>{t('closed')}</Tag>,
            },
          ]}
        />
      ),
    },
    {
      title: t('action'),
      key: 'actions',
      render: (_: any, record: any) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<PlusCircleFilled />}
            onClick={() => handleCreateOrder?.(record)}
          />
        </div>
      ),
    },
  ];
};
