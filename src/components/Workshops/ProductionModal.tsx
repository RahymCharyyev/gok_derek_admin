import { tsr } from '@/api';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
const { useForm } = Form;
const { Title } = Typography;

type ProductionItemType = 'in' | 'out' | 'waste';

type UnitType = 'piece' | 'meter' | 'sqMeter';

type WarehouseProduct = {
  id: string;
  name?: string | null;
  type?: 'wood' | 'furniture' | 'other';
  wood?: {
    thickness?: number | null;
    width?: number | null;
    length?: number | null;
  } | null;
  units?: { unit: UnitType }[] | null;
  productQuantity?: number | null;
  availableProductCount?: number | null;
};

type FormRow = {
  productName?: string;
  productId?: string;
  thickness?: number;
  width?: number;
  length?: number;
  unit?: UnitType;
  amount?: number;
};

interface ProductionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any | null;
  loading: boolean;
  storeId: string;
  productType: 'wood' | 'furniture' | 'other';
}

const ProductionModal: FC<ProductionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  loading,
  storeId,
  productType,
}) => {
  const [form] = useForm();
  const { t } = useTranslation();

  const [defaultOptions, setDefaultOptions] = useState<WarehouseProduct[]>([]);
  const [optionsByRow, setOptionsByRow] = useState<
    Record<string, WarehouseProduct[]>
  >({});
  const [variantsByRow, setVariantsByRow] = useState<
    Record<string, WarehouseProduct[]>
  >({});
  const [optionsLoadingByRow, setOptionsLoadingByRow] = useState<
    Record<string, boolean>
  >({});

  const unitOptions = useMemo(
    () => [
      { label: 'Metr', value: 'meter' as const },
      { label: 'Ştuk', value: 'piece' as const },
      { label: 'm²', value: 'sqMeter' as const },
    ],
    []
  );

  // Types are fixed per section:
  // - Ulanylan önümler => in
  // - Öndürilen önümler => out
  const usedType: Extract<ProductionItemType, 'in'> = 'in';
  const producedType: Extract<ProductionItemType, 'out'> = 'out';

  const getRowKey = (listName: 'sentItems' | 'receivedItems', index: number) =>
    `${listName}:${index}`;

  const fetchWarehouseProducts = async (params: {
    text?: string;
    thickness?: number;
    width?: number;
    length?: number;
    amount?: number;
    perPage?: number;
    exactName?: string;
  }): Promise<WarehouseProduct[]> => {
    const res = await tsr.warehouse.getProducts.query({
      query: {
        page: 1,
        perPage: params.perPage ?? 30,
        name: params.exactName ?? params.text ?? '',
        type: productType,
        thickness: params.thickness ?? undefined,
        width: params.width ?? undefined,
        length: params.length ?? undefined,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      },
    });

    if (res.status !== 200) return [];

    const data = (res.body?.data ?? []) as unknown as WarehouseProduct[];
    const qty = params.amount;
    if (!qty) return data;

    return data.filter((p) => {
      const available = p.productQuantity ?? p.availableProductCount ?? 0;
      return available >= qty;
    });
  };

  const uniqNums = (vals: Array<number | null | undefined>) =>
    Array.from(
      new Set(
        vals.filter(
          (v): v is number => typeof v === 'number' && !Number.isNaN(v)
        )
      )
    ).sort((a, b) => a - b);

  const syncProductIdFromRow = (
    listName: 'sentItems' | 'receivedItems',
    index: number,
    next?: Partial<FormRow>
  ) => {
    const rowKey = getRowKey(listName, index);
    const current = (form.getFieldValue([listName, index]) || {}) as FormRow;
    const row = { ...current, ...(next || {}) };
    const variants = variantsByRow[rowKey] || [];

    const qty = row.amount ?? undefined;
    const candidates = variants.filter((p) => {
      const w = p.wood || {};
      if (
        typeof row.thickness === 'number' &&
        (w.thickness ?? undefined) !== row.thickness
      )
        return false;
      if (typeof row.width === 'number' && (w.width ?? undefined) !== row.width)
        return false;
      if (
        typeof row.length === 'number' &&
        (w.length ?? undefined) !== row.length
      )
        return false;
      if (qty) {
        const available = p.productQuantity ?? p.availableProductCount ?? 0;
        if (available < qty) return false;
      }
      return true;
    });

    if (candidates.length === 1) {
      const chosen = candidates[0];
      const firstUnit = chosen.units?.[0]?.unit;
      form.setFieldsValue({
        [listName]: {
          [index]: {
            productId: chosen.id,
            unit: row.unit ?? firstUnit ?? undefined,
          },
        },
      });
    } else {
      // ambiguous (or none): clear productId to force disambiguation
      form.setFieldsValue({
        [listName]: {
          [index]: {
            productId: undefined,
          },
        },
      });
    }
  };

  const handleSearchProducts = async (
    listName: 'sentItems' | 'receivedItems',
    index: number,
    searchText?: string
  ) => {
    const rowKey = getRowKey(listName, index);
    const row = (form.getFieldValue([listName, index]) || {}) as FormRow;

    setOptionsLoadingByRow((s) => ({ ...s, [rowKey]: true }));
    try {
      const products = await fetchWarehouseProducts({
        text: searchText,
        thickness: row.thickness,
        width: row.width,
        length: row.length,
        amount: row.amount,
      });
      setOptionsByRow((s) => ({ ...s, [rowKey]: products }));
    } finally {
      setOptionsLoadingByRow((s) => ({ ...s, [rowKey]: false }));
    }
  };

  const handlePickProduct = (
    listName: 'sentItems' | 'receivedItems',
    index: number,
    productId: string
  ) => {
    const rowKey = getRowKey(listName, index);
    const pool = optionsByRow[rowKey] ?? defaultOptions;
    const p = pool.find((x) => x.id === productId);
    if (!p) return;

    // Auto-fill dimensions/unit from selected product (still editable by user)
    const firstUnit = p.units?.[0]?.unit;
    form.setFieldsValue({
      [listName]: {
        [index]: {
          thickness: p.wood?.thickness ?? undefined,
          width: p.wood?.width ?? undefined,
          length: p.wood?.length ?? undefined,
          unit: firstUnit ?? undefined,
        },
      },
    });
  };

  const handleSearchNames = async (
    listName: 'sentItems' | 'receivedItems',
    index: number,
    searchText?: string
  ) => {
    const rowKey = getRowKey(listName, index);
    setOptionsLoadingByRow((s) => ({ ...s, [rowKey]: true }));
    try {
      const products = await fetchWarehouseProducts({
        text: searchText,
        perPage: 100,
      });
      setOptionsByRow((s) => ({ ...s, [rowKey]: products }));
    } finally {
      setOptionsLoadingByRow((s) => ({ ...s, [rowKey]: false }));
    }
  };

  const handlePickName = async (
    listName: 'sentItems' | 'receivedItems',
    index: number,
    name: string
  ) => {
    const rowKey = getRowKey(listName, index);
    setOptionsLoadingByRow((s) => ({ ...s, [rowKey]: true }));
    try {
      const variants = await fetchWarehouseProducts({
        exactName: name,
        perPage: 100,
      });
      setVariantsByRow((s) => ({ ...s, [rowKey]: variants }));

      // reset dims & productId when name changes; keep type/qty if user already entered
      const row = (form.getFieldValue([listName, index]) || {}) as FormRow;
      form.setFieldsValue({
        [listName]: {
          [index]: {
            ...row,
            productName: name,
            productId: undefined,
            thickness: undefined,
            width: undefined,
            length: undefined,
            unit: undefined,
          },
        },
      });
    } finally {
      setOptionsLoadingByRow((s) => ({ ...s, [rowKey]: false }));
    }
  };

  useEffect(() => {
    if (initialValues) {
      const usedItems =
        (initialValues.items || [])
          .filter((i: any) => i?.type === usedType)
          .map((i: any) => ({
            productId: i.productId,
            amount: i.amount,
          })) || [];

      // Backwards-compat: if backend has old `waste`, treat it as `out` in UI.
      const producedItems =
        (initialValues.items || [])
          .filter((i: any) => i?.type === producedType || i?.type === 'waste')
          .map((i: any) => ({
            productId: i.productId,
            amount: i.amount,
          })) || [];

      form.setFieldsValue({
        ...initialValues,
        sentItems: usedItems.length ? usedItems : [{}],
        receivedItems: producedItems.length ? producedItems : [{}],
      });
    } else {
      form.resetFields();
      form.setFieldValue('storeId', storeId);
    }
  }, [initialValues, storeId, form]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        const products = await fetchWarehouseProducts({});
        if (mounted) setDefaultOptions(products);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [open, productType]);

  const handleFinish = (values: any) => {
    const sent = (values.sentItems || []) as FormRow[];
    const received = (values.receivedItems || []) as FormRow[];

    const all = [
      ...sent.map((item) => ({ ...item, __fixedType: usedType })),
      ...received.map((item) => ({ ...item, __fixedType: producedType })),
    ];

    // Hard validation to avoid sending invalid payload
    const missingProduct = all.find((i) => !i.productId);
    if (missingProduct) {
      // trigger form validation messages (hidden productId has rules)
      form.validateFields();
      return;
    }

    const formattedValues = {
      ...values,
      storeId,
      items: all.map((item) => ({
        productId: item.productId,
        type: item.__fixedType,
        amount: item.amount,
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
      width={1100}
      centered
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ sentItems: [{}], receivedItems: [{}] }}
      >
        <div className='flex flex-col gap-8'>
          {/* Sent products */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <Title level={3} style={{ margin: 0 }}>
                Ulanylan önümler
              </Title>
              <Form.List name='sentItems'>
                {(_, { add }) => (
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => add({})}
                  >
                    Goş
                  </Button>
                )}
              </Form.List>
            </div>

            <Form.List name='sentItems'>
              {(fields, { remove }) => (
                <div className='flex flex-col gap-3'>
                  {fields.map(({ key, name, ...restField }) => {
                    const rowKey = getRowKey('sentItems', name);
                    const rowOptions = optionsByRow[rowKey] ?? defaultOptions;
                    const rowLoading = !!optionsLoadingByRow[rowKey];

                    return (
                      <div key={key} className='flex items-center gap-3'>
                        {productType === 'wood' ? (
                          <Form.Item
                            {...restField}
                            name={[name, 'productName']}
                            className='mb-0'
                            style={{ width: 260 }}
                          >
                            <Select
                              placeholder={t('selectProduct')}
                              showSearch={{
                                filterOption: false,
                                onSearch: (txt) =>
                                  handleSearchNames('sentItems', name, txt),
                              }}
                              allowClear
                              loading={rowLoading}
                              onOpenChange={(visible) => {
                                if (visible)
                                  handleSearchNames('sentItems', name, '');
                              }}
                              onChange={(val) => {
                                if (val) handlePickName('sentItems', name, val);
                              }}
                              options={Array.from(
                                new Set(
                                  rowOptions
                                    .map((p) => p.name)
                                    .filter(Boolean) as string[]
                                )
                              ).map((n) => ({ label: n, value: n }))}
                            />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            {...restField}
                            name={[name, 'productId']}
                            rules={[
                              { required: true, message: t('selectProduct') },
                            ]}
                            className='mb-0'
                            style={{ width: 260 }}
                          >
                            <Select
                              placeholder={t('selectProduct')}
                              showSearch={{
                                filterOption: false,
                                onSearch: (txt) =>
                                  handleSearchProducts('sentItems', name, txt),
                              }}
                              allowClear
                              loading={rowLoading}
                              onOpenChange={(visible) => {
                                if (visible)
                                  handleSearchProducts('sentItems', name, '');
                              }}
                              onChange={(val) => {
                                if (val)
                                  handlePickProduct('sentItems', name, val);
                              }}
                              options={rowOptions.map((p) => ({
                                label: `${p.name ?? p.id} ${
                                  p.wood
                                    ? `(${p.wood?.thickness ?? '-'}×${
                                        p.wood?.width ?? '-'
                                      }×${p.wood?.length ?? '-'})`
                                    : ''
                                }`,
                                value: p.id,
                              }))}
                            />
                          </Form.Item>
                        )}

                        {/* Hidden productId when wood uses name+dimensions */}
                        {productType === 'wood' && (
                          <Form.Item
                            {...restField}
                            name={[name, 'productId']}
                            className='mb-0'
                            hidden
                            rules={[
                              {
                                required: true,
                                message: 'Выберите размеры',
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        )}

                        {productType === 'wood' ? (
                          <Form.Item shouldUpdate className='mb-0' noStyle>
                            {() => {
                              const row = (form.getFieldValue([
                                'sentItems',
                                name,
                              ]) || {}) as FormRow;
                              const rowKey2 = getRowKey('sentItems', name);
                              const variants = variantsByRow[rowKey2] || [];
                              const base = variants.filter(
                                (p) =>
                                  (p.name ?? '') === (row.productName ?? '')
                              );

                              const thicknesses = uniqNums(
                                base.map((p) => p.wood?.thickness)
                              );
                              const widths = uniqNums(
                                base
                                  .filter((p) =>
                                    typeof row.thickness === 'number'
                                      ? (p.wood?.thickness ?? undefined) ===
                                        row.thickness
                                      : true
                                  )
                                  .map((p) => p.wood?.width)
                              );
                              const lengths = uniqNums(
                                base
                                  .filter((p) =>
                                    typeof row.thickness === 'number'
                                      ? (p.wood?.thickness ?? undefined) ===
                                        row.thickness
                                      : true
                                  )
                                  .filter((p) =>
                                    typeof row.width === 'number'
                                      ? (p.wood?.width ?? undefined) ===
                                        row.width
                                      : true
                                  )
                                  .map((p) => p.wood?.length)
                              );

                              return (
                                <>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'thickness']}
                                    className='mb-0'
                                    style={{ width: 130 }}
                                  >
                                    <Select
                                      placeholder='Galyňlyk'
                                      allowClear
                                      options={thicknesses.map((v) => ({
                                        label: String(v),
                                        value: v,
                                      }))}
                                      onChange={(val) => {
                                        form.setFieldsValue({
                                          sentItems: {
                                            [name]: {
                                              width: undefined,
                                              length: undefined,
                                            },
                                          },
                                        });
                                        syncProductIdFromRow(
                                          'sentItems',
                                          name,
                                          { thickness: val }
                                        );
                                      }}
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...restField}
                                    name={[name, 'width']}
                                    className='mb-0'
                                    style={{ width: 130 }}
                                  >
                                    <Select
                                      placeholder='Ini'
                                      allowClear
                                      options={widths.map((v) => ({
                                        label: String(v),
                                        value: v,
                                      }))}
                                      onChange={(val) => {
                                        form.setFieldsValue({
                                          sentItems: {
                                            [name]: { length: undefined },
                                          },
                                        });
                                        syncProductIdFromRow(
                                          'sentItems',
                                          name,
                                          { width: val }
                                        );
                                      }}
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...restField}
                                    name={[name, 'length']}
                                    className='mb-0'
                                    style={{ width: 130 }}
                                  >
                                    <Select
                                      placeholder='Uzynlyk'
                                      allowClear
                                      options={lengths.map((v) => ({
                                        label: String(v),
                                        value: v,
                                      }))}
                                      onChange={(val) =>
                                        syncProductIdFromRow(
                                          'sentItems',
                                          name,
                                          { length: val }
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </>
                              );
                            }}
                          </Form.Item>
                        ) : (
                          <>
                            <Form.Item
                              {...restField}
                              name={[name, 'thickness']}
                              className='mb-0'
                              style={{ width: 130 }}
                            >
                              <InputNumber
                                placeholder='Galyňlyk'
                                className='w-full'
                              />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'width']}
                              className='mb-0'
                              style={{ width: 130 }}
                            >
                              <InputNumber
                                placeholder='Ini'
                                className='w-full'
                              />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'length']}
                              className='mb-0'
                              style={{ width: 130 }}
                            >
                              <InputNumber
                                placeholder='Uzynlyk'
                                className='w-full'
                              />
                            </Form.Item>
                          </>
                        )}

                        <Form.Item
                          {...restField}
                          name={[name, 'unit']}
                          className='mb-0'
                          style={{ width: 150 }}
                        >
                          <Select placeholder='Ölçeg' options={unitOptions} />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          rules={[{ required: true, message: 'Mukdar' }]}
                          className='mb-0'
                          style={{ width: 120 }}
                        >
                          <InputNumber
                            min={1}
                            placeholder='Mukdar'
                            className='w-full'
                            onChange={(val) => {
                              if (productType === 'wood')
                                syncProductIdFromRow('sentItems', name, {
                                  amount: val ?? undefined,
                                });
                            }}
                          />
                        </Form.Item>

                        <Button
                          danger
                          type='primary'
                          icon={<CloseOutlined />}
                          onClick={() => remove(name)}
                          aria-label='remove'
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </div>

          {/* Received products */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <Title level={3} style={{ margin: 0 }}>
                Öndürilen önümler
              </Title>
              <Form.List name='receivedItems'>
                {(_, { add }) => (
                  <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={() => add({})}
                  >
                    Goş
                  </Button>
                )}
              </Form.List>
            </div>

            <Form.List name='receivedItems'>
              {(fields, { remove }) => (
                <div className='flex flex-col gap-3'>
                  {fields.map(({ key, name, ...restField }) => {
                    const rowKey = getRowKey('receivedItems', name);
                    const rowOptions = optionsByRow[rowKey] ?? defaultOptions;
                    const rowLoading = !!optionsLoadingByRow[rowKey];

                    return (
                      <div key={key} className='flex items-center gap-3'>
                        {productType === 'wood' ? (
                          <Form.Item
                            {...restField}
                            name={[name, 'productName']}
                            className='mb-0'
                            style={{ width: 260 }}
                          >
                            <Select
                              placeholder={t('selectProduct')}
                              showSearch={{
                                filterOption: false,
                                onSearch: (txt) =>
                                  handleSearchNames('receivedItems', name, txt),
                              }}
                              allowClear
                              loading={rowLoading}
                              onOpenChange={(visible) => {
                                if (visible)
                                  handleSearchNames('receivedItems', name, '');
                              }}
                              onChange={(val) => {
                                if (val)
                                  handlePickName('receivedItems', name, val);
                              }}
                              options={Array.from(
                                new Set(
                                  rowOptions
                                    .map((p) => p.name)
                                    .filter(Boolean) as string[]
                                )
                              ).map((n) => ({ label: n, value: n }))}
                            />
                          </Form.Item>
                        ) : (
                          <Form.Item
                            {...restField}
                            name={[name, 'productId']}
                            rules={[
                              { required: true, message: t('selectProduct') },
                            ]}
                            className='mb-0'
                            style={{ width: 260 }}
                          >
                            <Select
                              placeholder={t('selectProduct')}
                              showSearch={{
                                filterOption: false,
                                onSearch: (txt) =>
                                  handleSearchProducts(
                                    'receivedItems',
                                    name,
                                    txt
                                  ),
                              }}
                              allowClear
                              loading={rowLoading}
                              onOpenChange={(visible) => {
                                if (visible)
                                  handleSearchProducts(
                                    'receivedItems',
                                    name,
                                    ''
                                  );
                              }}
                              onChange={(val) => {
                                if (val)
                                  handlePickProduct('receivedItems', name, val);
                              }}
                              options={rowOptions.map((p) => ({
                                label: `${p.name ?? p.id} ${
                                  p.wood
                                    ? `(${p.wood?.thickness ?? '-'}×${
                                        p.wood?.width ?? '-'
                                      }×${p.wood?.length ?? '-'})`
                                    : ''
                                }`,
                                value: p.id,
                              }))}
                            />
                          </Form.Item>
                        )}

                        {productType === 'wood' && (
                          <Form.Item
                            {...restField}
                            name={[name, 'productId']}
                            className='mb-0'
                            hidden
                            rules={[
                              {
                                required: true,
                                message: 'Выберите размеры',
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        )}

                        {productType === 'wood' ? (
                          <Form.Item shouldUpdate className='mb-0' noStyle>
                            {() => {
                              const row = (form.getFieldValue([
                                'receivedItems',
                                name,
                              ]) || {}) as FormRow;
                              const rowKey2 = getRowKey('receivedItems', name);
                              const variants = variantsByRow[rowKey2] || [];
                              const base = variants.filter(
                                (p) =>
                                  (p.name ?? '') === (row.productName ?? '')
                              );

                              const thicknesses = uniqNums(
                                base.map((p) => p.wood?.thickness)
                              );
                              const widths = uniqNums(
                                base
                                  .filter((p) =>
                                    typeof row.thickness === 'number'
                                      ? (p.wood?.thickness ?? undefined) ===
                                        row.thickness
                                      : true
                                  )
                                  .map((p) => p.wood?.width)
                              );
                              const lengths = uniqNums(
                                base
                                  .filter((p) =>
                                    typeof row.thickness === 'number'
                                      ? (p.wood?.thickness ?? undefined) ===
                                        row.thickness
                                      : true
                                  )
                                  .filter((p) =>
                                    typeof row.width === 'number'
                                      ? (p.wood?.width ?? undefined) ===
                                        row.width
                                      : true
                                  )
                                  .map((p) => p.wood?.length)
                              );

                              return (
                                <>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'thickness']}
                                    className='mb-0'
                                    style={{ width: 130 }}
                                  >
                                    <Select
                                      placeholder='Galyňlyk'
                                      allowClear
                                      options={thicknesses.map((v) => ({
                                        label: String(v),
                                        value: v,
                                      }))}
                                      onChange={(val) => {
                                        form.setFieldsValue({
                                          receivedItems: {
                                            [name]: {
                                              width: undefined,
                                              length: undefined,
                                            },
                                          },
                                        });
                                        syncProductIdFromRow(
                                          'receivedItems',
                                          name,
                                          { thickness: val }
                                        );
                                      }}
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...restField}
                                    name={[name, 'width']}
                                    className='mb-0'
                                    style={{ width: 130 }}
                                  >
                                    <Select
                                      placeholder='Ini'
                                      allowClear
                                      options={widths.map((v) => ({
                                        label: String(v),
                                        value: v,
                                      }))}
                                      onChange={(val) => {
                                        form.setFieldsValue({
                                          receivedItems: {
                                            [name]: { length: undefined },
                                          },
                                        });
                                        syncProductIdFromRow(
                                          'receivedItems',
                                          name,
                                          { width: val }
                                        );
                                      }}
                                    />
                                  </Form.Item>

                                  <Form.Item
                                    {...restField}
                                    name={[name, 'length']}
                                    className='mb-0'
                                    style={{ width: 130 }}
                                  >
                                    <Select
                                      placeholder='Uzynlyk'
                                      allowClear
                                      options={lengths.map((v) => ({
                                        label: String(v),
                                        value: v,
                                      }))}
                                      onChange={(val) =>
                                        syncProductIdFromRow(
                                          'receivedItems',
                                          name,
                                          { length: val }
                                        )
                                      }
                                    />
                                  </Form.Item>
                                </>
                              );
                            }}
                          </Form.Item>
                        ) : (
                          <>
                            <Form.Item
                              {...restField}
                              name={[name, 'thickness']}
                              className='mb-0'
                              style={{ width: 130 }}
                            >
                              <InputNumber
                                placeholder='Galyňlyk'
                                className='w-full'
                              />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'width']}
                              className='mb-0'
                              style={{ width: 130 }}
                            >
                              <InputNumber
                                placeholder='Ini'
                                className='w-full'
                              />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'length']}
                              className='mb-0'
                              style={{ width: 130 }}
                            >
                              <InputNumber
                                placeholder='Uzynlyk'
                                className='w-full'
                              />
                            </Form.Item>
                          </>
                        )}

                        <Form.Item
                          {...restField}
                          name={[name, 'unit']}
                          className='mb-0'
                          style={{ width: 150 }}
                        >
                          <Select placeholder='Ölçeg' options={unitOptions} />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          rules={[{ required: true, message: 'Mukdar' }]}
                          className='mb-0'
                          style={{ width: 120 }}
                        >
                          <InputNumber
                            min={1}
                            placeholder='Mukdar'
                            className='w-full'
                            onChange={(val) => {
                              if (productType === 'wood')
                                syncProductIdFromRow('receivedItems', name, {
                                  amount: val ?? undefined,
                                });
                            }}
                          />
                        </Form.Item>

                        <Button
                          danger
                          type='primary'
                          icon={<CloseOutlined />}
                          onClick={() => remove(name)}
                          aria-label='remove'
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ProductionModal;
