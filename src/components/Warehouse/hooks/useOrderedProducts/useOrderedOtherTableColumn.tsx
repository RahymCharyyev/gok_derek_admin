import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { DownOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface UseOrderedOtherTableColumnProps {
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
  handleCreateOrder?: (record: any) => void;
}

export const useOrderedOtherTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
  handleCreateOrder,
}: UseOrderedOtherTableColumnProps): ColumnsType<any> => {
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
          'productName',
          false
        ),
      filterIcon: () => <DownOutlined />,
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
    },
    {
      title: t('warehouseQuantity'),
      dataIndex: 'warehouseQuantity',
      key: 'warehouseQuantity',
      filterDropdown: () =>
        renderFilterDropdown(
          'warehouseQuantity',
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
          'warehouseQuantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
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
