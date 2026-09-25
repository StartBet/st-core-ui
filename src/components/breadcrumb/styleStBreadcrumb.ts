import type {
  BreadcrumbClassProps,
  StBreadcrumbItem,
  StBreadcrumbSchemaOptions
} from './StBreadcrumb.interface';

export const ST_BREADCRUMB_DEFAULT_MIN_ITEMS = 2;

/**
 * Um unico nivel nao e caminho nenhum: por padrao o breadcrumb so aparece a
 * partir de dois, como no breadcrumb da plataforma.
 */
export const shouldShowBreadcrumb = (
  items: StBreadcrumbItem[],
  minItems = ST_BREADCRUMB_DEFAULT_MIN_ITEMS
) => items.length >= Math.max(1, minItems);

/** O ultimo nivel e a pagina atual, com ou sem `href`. */
export const isBreadcrumbCurrent = (index: number, total: number) =>
  index === total - 1;

/**
 * JSON-LD `BreadcrumbList` do schema.org, para a aplicacao injetar no `head`.
 * Niveis sem `href` apontam para a pagina atual.
 */
export const buildBreadcrumbSchema = (
  items: StBreadcrumbItem[],
  { origin, currentPath }: StBreadcrumbSchemaOptions
) => {
  const base = origin.replace(/\/+$/, '');

  const absolute = (path: string) =>
    /^https?:\/\//.test(path) ? path : `${base}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absolute(item.href || currentPath)
    }))
  };
};

export const buildBreadcrumbClasses = (props: BreadcrumbClassProps) => {
  /**
   * Caminhos longos rolam na horizontal, sem barra visivel, em vez de quebrar
   * em varias linhas.
   */
  const nav = [
    'w-full overflow-x-auto font-st-body',
    '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    props.className
  ]
    .filter(Boolean)
    .join(' ');

  const list =
    'm-0 flex min-w-max list-none items-center gap-st-1 p-0 text-st-xs font-medium md:text-st-sm';

  const item = 'flex items-center gap-st-1';

  const link = [
    'max-w-[10rem] truncate rounded-st-1 text-st-content-ghost no-underline sm:max-w-[14rem]',
    'transition-colors duration-200 ease-out hover:text-st-content-primary hover:underline',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-st-focus'
  ].join(' ');

  const text = 'max-w-[10rem] truncate text-st-content-ghost sm:max-w-[14rem]';

  const current =
    'max-w-[10rem] truncate font-semibold text-st-content-primary sm:max-w-[16rem]';

  const separator = 'shrink-0 text-st-content-ghost opacity-70';

  return { nav, list, item, link, text, current, separator };
};
