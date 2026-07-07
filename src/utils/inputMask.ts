import type { StInputMask } from '../components/form/input/StInput.interface';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const applyPhoneBrMask = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const applyCpfMask = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const applyInputMask = (
  mask: StInputMask | undefined,
  value: string
) => {
  if (!mask) return value;
  if (mask === 'phone-br') return applyPhoneBrMask(value);
  if (mask === 'cpf') return applyCpfMask(value);
  return value;
};
