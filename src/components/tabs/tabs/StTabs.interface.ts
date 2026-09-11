export type StTabValue = string | number;

export type StTabsVariant = 'underline' | 'pill';

export type StTabsSize = 'small' | 'medium' | 'large';

export type StTabsColor = 'primary' | 'secondary';

export type StTabsAlign = 'start' | 'center' | 'end';

export interface TabsClassProps {
  variant?: StTabsVariant;
  size?: StTabsSize;
  align?: StTabsAlign;
  fullWidth?: boolean;
  className?: string;
  listClassName?: string;
}

export interface StTabsProps extends TabsClassProps {
  /** Aba ativa (`v-model`). */
  modelValue?: StTabValue;
  /** Estilo da lista de abas. */
  variant?: StTabsVariant;
  /** Escala das abas. */
  size?: StTabsSize;
  /** Cor de destaque da aba ativa. */
  color?: StTabsColor;
  /** Alinhamento da lista quando as abas nao ocupam toda a largura. */
  align?: StTabsAlign;
  /** Distribui as abas igualmente na largura disponivel. */
  fullWidth?: boolean;
  /** Bloqueia todas as abas. */
  disabled?: boolean;
  /** Rotulo da lista de abas. */
  ariaLabel?: string;
  /** Classes extras no container. */
  className?: string;
  /** Classes extras na lista de abas. */
  listClassName?: string;
}

export interface TabClassProps {
  variant?: StTabsVariant;
  size?: StTabsSize;
  color?: StTabsColor;
  active?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export interface StTabProps {
  /** Identidade da aba; casa com o `value` do `StTabPanel`. */
  value: StTabValue;
  /** Texto da aba; o slot padrao tem prioridade. */
  label?: string;
  /** Icone opcional a esquerda do texto. */
  icon?: string;
  /** Bloqueia esta aba. */
  disabled?: boolean;
  /** Classes extras na aba. */
  className?: string;
}

export interface StTabPanelProps {
  /** Identidade do painel; casa com o `value` do `StTab`. */
  value: StTabValue;
  /** Mantem o painel montado quando inativo, apenas escondido. */
  keepAlive?: boolean;
  /** Classes extras no painel. */
  className?: string;
}

export interface StTabsContext {
  activeValue: StTabValue | undefined;
  variant: StTabsVariant;
  size: StTabsSize;
  color: StTabsColor;
  fullWidth: boolean;
  disabled: boolean;
  isActive: (value: StTabValue) => boolean;
  select: (value: StTabValue) => void;
  tabId: (value: StTabValue) => string;
  panelId: (value: StTabValue) => string;
}
