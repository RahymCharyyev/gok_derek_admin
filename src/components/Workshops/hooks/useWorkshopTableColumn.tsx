import { renderFilterDropdown } from '@/components/renderFilterDropdown';
import { formatQuantityOrPrice } from '@/utils/formatters';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface UseWorkshopTableColumnProps {
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
  handleOpenEditModal: (record: any) => void;
  confirmDelete: (options: { id: string }) => void;
  visibleColumns?: string[];
}

interface UseWorkshopTableColumnProps {
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
  handleOpenEditModal: (record: any) => void;
  confirmDelete: (options: { id: string }) => void;
  visibleColumns?: string[];
  isFurniture?: boolean;
}

export const useWorkshopTableColumn = ({
  t,
  searchValues,
  setSearchValues,
  setSortBy,
  sortDirectionParam,
  setSortDirectionParam,
  handleSearch,
  clearFilter,
  sortOptions,
  handleOpenEditModal,
  confirmDelete,
  visibleColumns,
  isFurniture,
}: UseWorkshopTableColumnProps): ColumnsType<any> => {
  const columns: ColumnsType<any> = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('productCode'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('inOutProduct'),
      dataIndex: 'gelen',
      key: 'gelen',
      render: () => <div>Gelen</div>,
    },
    {
      title: isFurniture ? t('name') : t('productGoods'),
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
          'productName'
        ),
      filterIcon: () => <SearchOutlined />,
      render: (record) => <div>{record}</div>,
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
              'productThickness',
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
              'productThickness'
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
              'productWidth',
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
              'productWidth'
            ),
          filterIcon: () => <SearchOutlined />,
        },
        {
          title: t('woodLength'),
          dataIndex: 'productLength',
          key: 'productLength',
          filterDropdown: () =>
            renderFilterDropdown(
              'productLength',
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
              'productLength',
              false
            ),
          filterIcon: () => <DownOutlined />,
        },
      ],
    },

    {
      title: t('woodQuality'),
      dataIndex: 'productQuality',
      key: 'productQuality',
      filterDropdown: () =>
        renderFilterDropdown(
          'productQuality',
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
          'productQuality',
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
          'productWoodType',
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
          'productWoodType',
          false
        ),
      filterIcon: () => <DownOutlined />,
      render: (record) => <div>{record}</div>,
    },
    {
      title: t('productQuantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (record) => <div>{formatQuantityOrPrice(record)}</div>,
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
          'quantity',
          false
        ),
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('woodUnitWide'),
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
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          <Button
            size='small'
            type='primary'
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Button
            size='small'
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete({ id: record.key })}
          />
        </div>
      ),
    },
  ];
  return visibleColumns
    ? columns.filter(
        (col) => col.key && visibleColumns.includes(col.key.toString())
      )
    : columns;
};
