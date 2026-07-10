import type {
  PaperBorder,
  PaperBorderRadius,
  PaperElevation,
  PaperVariant
} from '../paper/StPaper.interface';
import type { SizeValue } from '../../types';

export interface StModalProps {
  open?: boolean;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  variant?: PaperVariant;
  border?: PaperBorder;
  borderRadius?: PaperBorderRadius;
  elevation?: PaperElevation;
  interactive?: boolean;
  bgImage?: string;
  width?: SizeValue;
  height?: SizeValue;
  padding?: string;
  paddingSm?: string;
  paddingMd?: string;
  paddingLg?: string;
  margin?: string;
  marginSm?: string;
  marginMd?: string;
  marginLg?: string;
  className?: string;
}
