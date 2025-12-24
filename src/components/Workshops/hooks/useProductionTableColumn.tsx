import { Button, Tag } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface UseProductionTableColumnProps {
  t: (key: string) => string;
  handleOpenEditModal: (record: any) => void;
  confirmDelete: (options: { id: string }) => void;
}

export const useProductionTableColumn = ({
  t,
  handleOpenEditModal,
  confirmDelete,
}: UseProductionTableColumnProps): ColumnsType<any> => {
  return [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      width: 60,
    },
    {
      title: t('date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD.MM.YYYY HH:mm'),
    },
    {
      title: t('items'),
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <div className='flex flex-col gap-1'>
          {items?.map((item, idx) => (
            <div key={idx} className='flex gap-2 items-center'>
              <span className='font-medium'>{item.product?.name}</span>
              <Tag
                color={
                  item.type === 'in'
                    ? 'green'
                    : item.type === 'out'
                    ? 'blue'
                    : 'red'
                }
              >
                {item.type === 'in'
                  ? 'ulanyldy'
                  : item.type === 'out'
                  ? 'öndürildi'
                  : 'galyndy'}
              </Tag>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <div className='flex items-center gap-2'>
          {/* <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          /> */}
          <Button
            size='small'
            type='primary'
            danger
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete({ id: record.id })}
          />
        </div>
      ),
    },
  ];
};
