export interface StSuperOddsSelection {
  /** Selecao em destaque. Ex.: `Mais de 0.5`. */
  selection?: string;
  /** Mercado, abaixo da selecao. Ex.: `Chutes ao gol - Pedro (FLA)`. */
  market?: string;
}

export interface SuperOddsCardClassProps {
  disabled?: boolean;
  className?: string;
}

/**
 * Os nomes dos campos espelham o tipo `BetCard` usado na plataforma, entao no
 * consumidor o card e alimentado direto com `v-bind="card"`.
 */
export interface StSuperOddsCardProps extends SuperOddsCardClassProps {
  /** Tipo do card, texto livre. Ex.: `Turbinada`. */
  type?: string;
  /** Icone do selo do tipo. */
  typeIcon?: string;
  /** Data ja formatada; tem prioridade sobre `startDate`. */
  date?: string;
  /** Data ISO do evento, formatada pelo componente. */
  startDate?: string;
  /** Icone de destaque a direita do cabecalho. */
  highlightIcon?: string;
  /** Esconde o icone de destaque. */
  hideHighlight?: boolean;

  /** Campeonato exibido acima dos times. */
  competition?: string;
  /** Nome do evento, usado quando nao ha `home` e `away`. */
  eventName?: string;
  /** Time da casa. */
  home?: string;
  /** Time visitante. */
  away?: string;
  /** Escudo do time da casa. */
  homeLogo?: string | null;
  /** Escudo do time visitante. */
  awayLogo?: string | null;
  /** Separador entre os times. */
  versusLabel?: string;

  /** Selecoes da aposta, renderizadas pelo `StStepper`. */
  selections?: StSuperOddsSelection[];

  /** Odd original, exibida riscada quando ha `boostedPrice`. */
  price?: number | string;
  /** Odd turbinada, em destaque no botao. */
  boostedPrice?: number | string;

  /**
   * Aposta ja adicionada ao bilhete. Quem decide e o consumidor, a partir
   * da propria store; o card so reage ao booleano.
   */
  active?: boolean;
  /** Rotulo acessivel do indicador de `active`. */
  activeLabel?: string;

  /** Bloqueia o botao de acao. */
  disabled?: boolean;
  /** Rotulo acessivel do botao de acao. */
  actionAriaLabel?: string;
  /** Rotulo acessivel do card. */
  ariaLabel?: string;
  /** Classes extras no container. */
  className?: string;
}
