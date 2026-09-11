import type {
  AccordionGroupClassProps,
  StAccordionGroupGap,
  StAccordionGroupModelValue
} from './StAccordionGroup.interface';
import type { StAccordionValue } from '../accordion/StAccordion.interface';

/** Converte o `modelValue` recebido na lista interna de itens abertos. */
export const normalizeOpenValues = (
  value: StAccordionGroupModelValue | undefined,
  multiple = false
): StAccordionValue[] => {
  if (value === undefined || value === null) return [];

  const list = Array.isArray(value)
    ? value.filter((item) => item != null)
    : [value];

  return multiple ? [...list] : list.slice(0, 1);
};

/** Abre ou fecha um item respeitando o modo do grupo. */
export const toggleOpenValue = (
  current: StAccordionValue[],
  value: StAccordionValue,
  multiple = false
): StAccordionValue[] => {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  return multiple ? [...current, value] : [value];
};

/** Devolve o payload no mesmo formato aceito pelo `modelValue`. */
export const toModelValue = (
  values: StAccordionValue[],
  multiple = false
): StAccordionGroupModelValue => (multiple ? [...values] : (values[0] ?? null));

const gapClasses: Record<StAccordionGroupGap, string> = {
  0: 'gap-0',
  1: 'gap-st-1',
  2: 'gap-st-2',
  3: 'gap-st-3'
};

export const buildAccordionGroupClasses = (props: AccordionGroupClassProps) => {
  const { gap = 1, className } = props;

  const container = ['flex w-full flex-col', gapClasses[gap], className]
    .filter(Boolean)
    .join(' ');

  return { container };
};
