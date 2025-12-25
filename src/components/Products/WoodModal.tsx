import {
  productUnitsSchema,
  type ProductSchema,
  type WoodTypeSchema,
} from '@/api/schema';
import { productWoodSchema } from '@/api/schema/product-wood';
import { Form, Input, Select } from 'antd';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseModal } from '@/components/ui/BaseModal';

const { useForm } = Form;

type WoodModalInitialValues = Partial<ProductSchema['Schema']> & {
  woodThickness?: number;
  woodWidth?: number;
  woodLength?: number;
  woodQuality?: string;
  woodUnits?: { unit: string }[];
  woodType?: string;
};

interface WoodModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: ProductSchema['Schema']) => void;
  initialValues?: WoodModalInitialValues | null;
  woodTypes: WoodTypeSchema['Schema'][];
}

const WoodModal: FC<WoodModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  woodTypes,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          price: initialValues.price,
          priceSelection: initialValues.priceSelection,
          wood: {
            thickness: initialValues.woodThickness ?? null,
            width: initialValues.woodWidth ?? null,
            length: initialValues.woodLength ?? null,
            quality: initialValues.woodQuality ?? null,
            units: initialValues.woodUnits?.map((u) => u.unit) ?? [],
            woodTypeId:
              woodTypes.find((w) => w.name === initialValues.woodType)?.id ??
              null,
          },
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ type: 'wood' });
      }
    }
  }, [open, initialValues, woodTypes]);

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={initialValues ? t('editProduct') : t('createProduct')}
      form={form}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onSubmit}
        className='max-h-[70vh] overflow-y-auto'
      >
        <Form.Item
          name='name'
          label={t('name')}
          rules={[{ required: !initialValues, message: t('notEmptyField') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t('woodThickness')} name={['wood', 'thickness']}>
          <Input type='number' />
        </Form.Item>
        <Form.Item label={t('woodWidth')} name={['wood', 'width']}>
          <Input type='number' />
        </Form.Item>
        <Form.Item label={t('woodLength')} name={['wood', 'length']}>
          <Input type='number' />
        </Form.Item>
        <Form.Item label={t('woodQuality')} name={['wood', 'quality']}>
          <Select
            options={productWoodSchema.schema.shape.quality
              .unwrap()
              .unwrap()
              .options.map((e) => ({
                label: t(e),
                value: e,
              }))}
          />
        </Form.Item>
        <Form.Item label={t('woodUnit')} name={['wood', 'units']}>
          <Select
            mode='multiple'
            options={productUnitsSchema?.schema.shape.unit.options.map((e) => ({
              label: t(e),
              value: e,
            }))}
          />
        </Form.Item>

        <Form.Item name='price' label={t('priceM3')}>
          <Input />
        </Form.Item>
        <Form.Item name='priceSelection' label={t('selectionPrice')}>
          <Input />
        </Form.Item>
        <Form.Item label={t('woodType')} name={['wood', 'woodTypeId']}>
          <Select
            options={woodTypes.map((e) => ({
              label: t(e.name),
              value: e.id,
            }))}
          />
        </Form.Item>
        <Form.Item name='type' initialValue='wood' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='code' initialValue={Date.now().toString()} hidden>
          <Input />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default WoodModal;
