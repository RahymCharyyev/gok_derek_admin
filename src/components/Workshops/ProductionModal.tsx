import { Form, Modal, Select, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductSchema } from '@/api/schema';

const { useForm } = Form;

interface ProductionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any | null;
  products: ProductSchema['Schema'][];
  loading: boolean;
  storeId: string;
}

const ProductionModal: FC<ProductionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  products,
  loading,
  storeId,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        items: initialValues.items || [],
      });
    } else {
      form.resetFields();
      form.setFieldValue('storeId', storeId);
    }
  }, [initialValues, storeId, form]);

  const handleFinish = (values: any) => {
    const formattedValues = {
      ...values,
      storeId,
      items: values.items?.map((item: any) => ({
        ...item,
        productId: item.productId,
        type: item.type,
      })),
    };
    onSubmit(formattedValues);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('save')}
      cancelText={t('cancel')}
      title={initialValues ? t('editProduction') : t('createProduction')}
      width={800}
      centered
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ items: [{}] }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'productId']}
                    rules={[{ required: true, message: t('selectProduct') }]}
                    style={{ width: 300 }}
                  >
                    <Select
                      placeholder={t('selectProduct')}
                      loading={loading}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={products.map((product) => ({
                        label: product.name,
                        value: product.id,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'type']}
                    rules={[{ required: true, message: t('selectType') }]}
                    style={{ width: 150 }}
                  >
                    <Select
                      placeholder={t('selectType')}
                      options={[
                        { label: t('in'), value: 'in' },
                        { label: t('out'), value: 'out' },
                        { label: t('waste'), value: 'waste' },
                      ]}
                    />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  {t('addItem')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ProductionModal;
