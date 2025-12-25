import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import type { FC } from 'react';
import { useDebounce } from 'use-debounce';
import { useEffect, useMemo, useState } from 'react';

type Props = Omit<InputProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
};

export const SearchInput: FC<Props> = ({
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 350,
  allowClear = true,
  ...props
}) => {
  const [inner, setInner] = useState(value ?? '');
  const [debounced] = useDebounce(inner, debounceMs);

  useEffect(() => {
    setInner(value ?? '');
  }, [value]);

  useEffect(() => {
    if (!onDebouncedChange) return;
    onDebouncedChange(debounced);
  }, [debounced, onDebouncedChange]);

  const suffix = useMemo(() => <SearchOutlined />, []);

  return (
    <Input
      {...props}
      value={inner}
      allowClear={allowClear}
      suffix={suffix}
      onChange={(e) => {
        const next = e.target.value;
        setInner(next);
        onChange?.(next);
      }}
    />
  );
};
