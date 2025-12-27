import { tsr } from '@/api';
import ErrorComponent from '@/components/ErrorComponent';
import Toolbar from '@/components/Toolbar';
import TableLayout from '@/layout/TableLayout';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Tag, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { formatQuantityOrPrice } from '@/utils/formatters';

const ProductionDetail: FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const productionQuery = tsr.production.getOne.useQuery({
    queryKey: ['production', id],
    queryData: { params: { id: id || '' } },
    enabled: !!id,
  });

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: '№',
        dataIndex: 'index',
        key: 'index',
        width: 60,
      },
      {
        title: t('productName'),
        dataIndex: 'productName',
        key: 'productName',
        render: (name: string) => <div className='font-medium'>{name}</div>,
      },
      {
        title: t('type'),
        dataIndex: 'type',
        key: 'type',
        render: (type: 'in' | 'out' | 'waste') => (
          <Tag
            color={type === 'in' ? 'green' : type === 'out' ? 'blue' : 'red'}
          >
            {type === 'in'
              ? 'ulanyldy'
              : type === 'out'
              ? 'öndürildi'
              : 'galyndy'}
          </Tag>
        ),
      },
      {
        title: t('amount'),
        dataIndex: 'amount',
        key: 'amount',
        render: (amount: number) => <div>{amount}</div>,
      },
      {
        title: t('unit'),
        dataIndex: 'unit',
        key: 'unit',
        render: (unit: string) => <div>{t(unit) || '-'}</div>,
      },
      {
        title: t('price'),
        dataIndex: 'price',
        key: 'price',
        render: (price: number | null | undefined) => (
          <div>
            {formatQuantityOrPrice(price)} {t('currencyTMT')}
          </div>
        ),
      },
      {
        title: t('M3'),
        dataIndex: 'cubeMeter',
        key: 'cubeMeter',
        render: (cubeMeter: number | null | undefined) => (
          <div>{formatQuantityOrPrice(cubeMeter)}</div>
        ),
      },
      {
        title: t('woodLength'),
        dataIndex: 'length',
        key: 'length',
        render: (length: number | null | undefined) => (
          <div>{length ? `${length} mm` : '-'}</div>
        ),
      },
      {
        title: t('woodThickness'),
        dataIndex: 'thickness',
        key: 'thickness',
        render: (thickness: number | null | undefined) => (
          <div>{thickness ? `${thickness} mm` : '-'}</div>
        ),
      },
      {
        title: t('woodWidth'),
        dataIndex: 'width',
        key: 'width',
        render: (width: number | null | undefined) => (
          <div>{width ? `${width} mm` : '-'}</div>
        ),
      },
      {
        title: t('woodQuality'),
        dataIndex: 'quality',
        key: 'quality',
        render: (quality: string | null | undefined) => (
          <div>{quality || '-'}</div>
        ),
      },
      {
        title: t('woodType'),
        dataIndex: 'woodType',
        key: 'woodType',
        render: (name: string | null | undefined) => <div>{name || '-'}</div>,
      },
    ],
    [t]
  );

  if (productionQuery.isError) {
    return (
      <ErrorComponent message={productionQuery.error || t('unknownError')} />
    );
  }

  const production = productionQuery.data?.body;

  const itemsData = useMemo(() => {
    if (!production?.items) return [];

    return production.items.map((item: any, index: number) => {
      // Определяем единицу измерения из продукта
      let unit = '-';
      if (item.product?.wood?.units && item.product.wood.units.length > 0) {
        unit = item.product.wood.units[0].unit || '-';
      } else if (item.product?.units && item.product.units.length > 0) {
        unit = item.product.units[0].unit || '-';
      }

      return {
        key: item.id || index,
        index: index + 1,
        productName: item.product?.name || '-',
        type: item.type,
        amount: item.amount || 0,
        unit: unit,
        price: item.product?.price,
        cubeMeter: item.product?.wood?.cubeMeter,
        length: item.product?.wood?.length,
        width: item.product?.wood?.width,
        thickness: item.product?.wood?.thickness,
        quality: item.product?.wood?.quality,
        woodType: item.product?.wood?.woodType?.name,
      };
    });
  }, [production?.items]);

  return (
    <>
      <div className='mb-4'>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className='mb-4'
        >
          {t('back')}
        </Button>
      </div>

      {production && (
        <div className='mb-6'>
          <Descriptions title={t('productionDetails')} bordered column={2}>
            <Descriptions.Item label={t('date')}>
              {dayjs(production.createdAt).format('DD.MM.YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label={t('itemsCount')}>
              {production.items?.length || 0}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}

      <TableLayout
        title={() => (
          <Toolbar
            title={t('products')}
            count={itemsData.length}
            onReset={() => {}}
            resetDisabled={true}
          />
        )}
        loading={productionQuery.isLoading}
        columns={columns}
        data={itemsData}
        pagination={false}
      />
    </>
  );
};

export default ProductionDetail;
