import React, { memo, forwardRef, ForwardedRef } from 'react';
import styled from 'styled-components/macro';

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

const InputField = styled.input`
  border: 1px solid rgb(148, 148, 148);
  border-radius: 8px;
  margin-top: 0.5rem;
  padding: 0.75rem;
`;

interface InputProps {
  label: string;
  type: string;
}

const Input = forwardRef((props: InputProps, ref: ForwardedRef<HTMLInputElement>) => (
  <Label>
    <span>{props.label}</span>
    <InputField ref={ref} {...props} />
  </Label>
));

export default memo(Input);

// export default function Input(props: InputProps) {
//   const { label, type, onChange } = props;
//   return (
//     <Label>
//       <span>{label}</span>
//       <input type={type} onChange={onChange} />
//     </Label>
//   );
// }

interface NumberInputProps {
  label: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NumberInput({ label, min, max, value, onChange }: NumberInputProps) {
  return (
    <Label>
      <span>{label}</span>
      <InputField type="number" min={min} max={max} value={value} onChange={onChange} />
    </Label>
  );
}

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

interface RangeInputProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RangeInput({ label, min, max, value, onChange }: RangeInputProps) {
  return (
    <Label>
      <span>
        {label}: {value}
      </span>
      <Slider type="range" min={min} max={max} value={value} onChange={onChange} />
    </Label>
  );
}

const CheckboxLabel = styled.label`
  display: flex;
  align-items: baseline;

  & > span {
    margin-left: 0.25rem;
  }
`;

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <CheckboxLabel>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </CheckboxLabel>
  );
}
