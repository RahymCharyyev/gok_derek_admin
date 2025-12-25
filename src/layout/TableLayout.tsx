import { ConfigProvider, Table } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/ui/EmptyState';

interface TableLayoutProps<T> {
  columns: ColumnsType<T> | undefined;
  data: readonly T[] | undefined;
  children?: React.ReactNode;
  title?: () => React.ReactElement;
  pagination?: false | TablePaginationConfig | undefined;
  onRow?: (record: T) => React.HTMLAttributes<HTMLElement>;
  onChange?: TableProps<T>['onChange'];
  loading: boolean;
  expandable?: TableProps<T>['expandable'];
}

const TableLayout = <T extends object>({
  columns,
  data,
  title,
  children,
  pagination,
  onRow,
  onChange,
  loading,
  expandable,
}: TableLayoutProps<T>) => {
  const { t } = useTranslation();
  return (
    <div className='min-h-[360px] rounded-lg'>
      <ConfigProvider renderEmpty={() => <EmptyState />}>
        <Table<T>
          locale={{
            triggerDesc: t('triggerDesc'),
            triggerAsc: t('triggerAsc'),
            cancelSort: t('cancelSort'),
            filterReset: t('filterReset'),
            filterConfirm: t('filterConfirm'),
          }}
          columns={columns}
          dataSource={data}
          title={title}
          bordered
          pagination={{
            ...pagination,
            locale: {
              items_per_page: `${t('quantity')}`,
            },
            hideOnSinglePage: true,
            showSizeChanger: true,
          }}
          scroll={{ x: 'max-content' }}
          sticky
          onRow={onRow}
          onChange={onChange}
          loading={loading}
          expandable={expandable}
        />
        {children}
      </ConfigProvider>
    </div>
  );
};

export default TableLayout;
