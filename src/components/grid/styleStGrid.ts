import { spacingShorthandToClasses } from '../../utils/spacingShorthand';
import type {
  Breakpoint,
  GridClassProps,
  GridSpacing
} from './StGrid.interface';

const toSpacingSuffix = (value: GridSpacing) => `st-${String(value)}`;

const gapClass = (
  axis: 'gap' | 'gap-x' | 'gap-y',
  value: GridSpacing,
  bp?: Breakpoint
) => {
  const prefix = bp ? `${bp}:` : '';
  return `${prefix}${axis}-${toSpacingSuffix(value)}`;
};

const colsClass = (value: GridSpacing, bp?: Breakpoint) => {
  const prefix = bp ? `${bp}:` : '';
  return `${prefix}grid-cols-${String(value)}`;
};

export function buildGridClasses(props: GridClassProps) {
  const {
    cols = 1,
    gap,
    gapX,
    gapY,
    smCols,
    mdCols,
    lgCols,
    padding,
    smPadding,
    mdPadding,
    lgPadding,
    margin,
    smMargin,
    mdMargin,
    lgMargin,
    className
  } = props;

  return [
    'grid',
    colsClass(cols),
    gap ? gapClass('gap', gap) : undefined,
    gapX ? gapClass('gap-x', gapX) : undefined,
    gapY ? gapClass('gap-y', gapY) : undefined,
    smCols ? colsClass(smCols, 'sm') : undefined,
    mdCols ? colsClass(mdCols, 'md') : undefined,
    lgCols ? colsClass(lgCols, 'lg') : undefined,
    ...spacingShorthandToClasses(padding, 'p'),
    ...spacingShorthandToClasses(smPadding, 'p', 'sm'),
    ...spacingShorthandToClasses(mdPadding, 'p', 'md'),
    ...spacingShorthandToClasses(lgPadding, 'p', 'lg'),
    ...spacingShorthandToClasses(margin, 'm'),
    ...spacingShorthandToClasses(smMargin, 'm', 'sm'),
    ...spacingShorthandToClasses(mdMargin, 'm', 'md'),
    ...spacingShorthandToClasses(lgMargin, 'm', 'lg'),
    className
  ]
    .filter(Boolean)
    .join(' ');
}
