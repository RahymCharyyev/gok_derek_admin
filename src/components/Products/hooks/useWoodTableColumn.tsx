import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { renderFilterDropdown } from '../renderFilterDropdown';

interface UseWoodTableColumnProps {
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
}

export const useWoodTableColumn = ({
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
}: UseWoodTableColumnProps): ColumnsType<any> => {
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
    },
    {
      title: t('productName'),
      dataIndex: 'name',
      key: 'name',
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
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('woodType'),
      dataIndex: 'woodType',
      key: 'woodType',
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
          'woodType'
        ),
      filterIcon: () => <DownOutlined />,
      render: (value) => <div>{t(value)}</div>,
    },
    {
      title: t('woodThickness'),
      dataIndex: 'woodThickness',
      key: 'woodThickness',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodThickness',
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
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('woodWidth'),
      dataIndex: 'woodWidth',
      key: 'woodWidth',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodWidth',
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
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('woodLength'),
      dataIndex: 'woodLength',
      key: 'woodLength',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodLength',
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
      filterIcon: () => <DownOutlined />,
    },
    {
      title: t('woodQuality'),
      dataIndex: 'woodQuality',
      key: 'woodQuality',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodQuality',
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
      filterIcon: () => <DownOutlined />,
      render: (value) => t(value),
    },
    {
      title: t('woodUnit'),
      dataIndex: 'woodUnits',
      key: 'woodUnits',
      filterDropdown: () =>
        renderFilterDropdown(
          'woodUnits',
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
          'unit'
        ),
      filterIcon: () => <DownOutlined />,
      render: (value) => {
        if (!Array.isArray(value)) return null;
        return value.map((e) => t(e.unit)).join(' / ');
      },
    },
    {
      title: 'Ştuk/metr nyrhy (man)',
      children: [
        {
          title: t('actual'),
          dataIndex: 'price',
          key: 'price',
        },
        {
          title: t('priceSelection'),
          dataIndex: 'priceSelection',
          key: 'priceSelection',
        },
      ],
    },
    {
      title: 'Peýda (man)',
      children: [
        {
          title: t('actual'),
        },
        {
          title: t('priceSelection'),
        },
      ],
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
};
