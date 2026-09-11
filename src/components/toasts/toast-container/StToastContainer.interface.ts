export type StToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type StToastContainerGap = 1 | 2 | 3;

export interface ToastContainerClassProps {
  position?: StToastPosition;
  gap?: StToastContainerGap;
  className?: string;
}

export interface StToastContainerProps extends ToastContainerClassProps {
  /** Canto da tela onde a pilha aparece. */
  position?: StToastPosition;
  /** Espaco entre os toasts, na escala `st-*`. */
  gap?: StToastContainerGap;
  /** Congela a contagem enquanto o ponteiro esta sobre a pilha. */
  pauseOnHover?: boolean;
  /** Destino do `Teleport`; `false` renderiza no lugar. */
  to?: string | false;
  /** Rotulo da regiao de avisos. */
  ariaLabel?: string;
  /** Classes extras no container. */
  className?: string;
}
