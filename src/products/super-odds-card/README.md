# StSuperOddsCard

Card de odd turbinada da plataforma. Faz parte da secao **Products** da lib: componentes de produto, prontos para uso, montados em cima dos componentes base.

Internamente reusa [`StAvatar`](../../components/avatars/avatar/README.md) nos escudos, [`StStepper`](../../components/stepper/README.md) nas selecoes e [`StButton`](../../components/buttons/button/README.md) na acao.

## Import

```ts
import { StSuperOddsCard } from '@startbet/st-core-ui';
```

## Alimentacao

Os nomes das props espelham o tipo `BetCard` que a plataforma ja monta em
`betCards.ts`, entao o consumo e direto:

```vue
<StSuperOddsCard
  v-for="card in cards"
  :key="card.id"
  v-bind="card"
  type="Turbinada"
  @select="irParaBilhete(card)"
/>
```

`competition`, `eventName`, `home`, `away`, `homeLogo`, `awayLogo`, `startDate`, `selections`, `price` e `boostedPrice` chegam com o mesmo nome que tem no `BetCard`. Os campos que nao existem no card (`type`, `typeIcon`) sao informados a parte.

## Props

| Prop              | Tipo                     | Default      | Descricao                                            |
| ----------------- | ------------------------ | ------------ | ---------------------------------------------------- |
| `type`            | `string`                 | `''`         | Tipo do card, texto livre. Ex.: `Turbinada`.         |
| `typeIcon`        | `string`                 | `bolt`       | Icone do selo do tipo.                               |
| `date`            | `string`                 | `''`         | Data ja formatada; tem prioridade sobre `startDate`. |
| `startDate`       | `string`                 | `''`         | Data ISO do evento, formatada pelo componente.       |
| `highlightIcon`   | `string`                 | `fire`       | Icone de destaque a direita do cabecalho.            |
| `hideHighlight`   | `boolean`                | `false`      | Esconde o icone de destaque.                         |
| `competition`     | `string`                 | `''`         | Campeonato, acima dos times.                         |
| `eventName`       | `string`                 | `''`         | Nome do evento, usado quando nao ha `home` e `away`. |
| `home`            | `string`                 | `''`         | Time da casa.                                        |
| `away`            | `string`                 | `''`         | Time visitante.                                      |
| `homeLogo`        | `string \| null`         | `null`       | Escudo do time da casa.                              |
| `awayLogo`        | `string \| null`         | `null`       | Escudo do time visitante.                            |
| `versusLabel`     | `string`                 | `X`          | Separador entre os times.                            |
| `selections`      | `StSuperOddsSelection[]` | `[]`         | Selecoes da aposta.                                  |
| `price`           | `number \| string`       | `undefined`  | Odd original, riscada quando ha `boostedPrice`.      |
| `boostedPrice`    | `number \| string`       | `undefined`  | Odd turbinada, em destaque.                          |
| `active`          | `boolean`                | `false`      | Aposta ja adicionada ao bilhete.                     |
| `activeLabel`     | `string`                 | `No bilhete` | Rotulo acessivel do indicador de `active`.           |
| `disabled`        | `boolean`                | `false`      | Bloqueia o botao de acao.                            |
| `actionAriaLabel` | `string`                 | `''`         | Rotulo acessivel do botao.                           |
| `ariaLabel`       | `string`                 | `''`         | Rotulo do card; por padrao `home x away`.            |
| `className`       | `string`                 | `''`         | Classes extras no container.                         |

### StSuperOddsSelection

| Campo       | Tipo     | Descricao                                         |
| ----------- | -------- | ------------------------------------------------- |
| `selection` | `string` | Selecao em destaque. Ex.: `Mais de 0.5`.          |
| `market`    | `string` | Mercado, abaixo da selecao. Ex.: `Chutes ao gol`. |

## Eventos

| Evento   | Payload | Quando                  |
| -------- | ------- | ----------------------- |
| `select` | —       | Clique no botao da odd. |

## Slots

| Slot     | Descricao                                                           |
| -------- | ------------------------------------------------------------------- |
| `type`   | Substitui o conteudo do selo, mantendo o corte diagonal.            |
| `action` | Substitui o botao inteiro — use para um `NuxtLink` ou `RouterLink`. |

Como a plataforma navega por link, o caminho normal e trocar o botao pelo slot:

```vue
<StSuperOddsCard v-bind="card">
  <template #action>
    <NuxtLink :to="betslipLink(card)" class="...">
      {{ formatBetCardOdd(card.boostedPrice) }}
    </NuxtLink>
  </template>
</StSuperOddsCard>
```

## Helpers exportados

| Funcao                  | Descricao                                                              |
| ----------------------- | ---------------------------------------------------------------------- |
| `formatSuperOddsDate`   | ISO para `10/09 • 22:00`; vazio para data ausente, zerada ou invalida. |
| `formatSuperOddsOdd`    | Numero para duas casas; strings ja formatadas passam direto.           |
| `resolveSuperOddsSteps` | Converte `selections` nos passos do `StStepper`.                       |

O componente ja aplica os dois formatadores, entao a plataforma pode passar
`startDate` e `price` crus e aposentar os proprios helpers.

## Composicao

| Area     | Componente base | Configuracao                                                                           |
| -------- | --------------- | -------------------------------------------------------------------------------------- |
| Escudos  | `StAvatar`      | `size="small"` com `fit="contain"`, porque escudos sao vazados.                        |
| Selecoes | `StStepper`     | `orientation="vertical"`, `size="small"`, `variant="positive"` e `interactive` falso.  |
| Acao     | `StButton`      | `full-width`, alternando entre `outline`/`primary` e `solid`/`secondary` por `active`. |

Sem `homeLogo`/`awayLogo` o `StAvatar` cai nas iniciais do time, com a cor fixa
por letra — nao fica buraco no lugar do escudo.

## Estado no bilhete

A decisao e do consumidor, a partir da propria store; o card so reage ao
booleano:

```vue
<StSuperOddsCard
  v-bind="card"
  :active="betslip.isActive(betCardMatchIds(card))"
/>
```

| Elemento     | Fora do bilhete      | No bilhete                    |
| ------------ | -------------------- | ----------------------------- |
| Botao da odd | `primary` contornado | `secondary` solido            |
| Indicador    | nao aparece          | `StBadge` positivo em `pulse` |

O indicador e um `StBadge` sem `value` — ou seja, um ponto de 10px com
`animate-ping` — colocado antes da data. Como nao tem texto, ele carrega
`role="img"` com o `activeLabel` em `aria-label`, entao o estado chega a quem
usa leitor de tela sem ocupar espaco no cabecalho.

## Fallbacks

1. Sem `type`, o selo nao e renderizado.
2. Sem `date` nem `startDate` valido, o cabecalho mostra so o icone de destaque.
3. Sem `home` e `away`, o card usa o `eventName` em uma linha.
4. Sem `selections`, o bloco do stepper e o divisor somem.
5. Sem `boostedPrice`, o botao mostra apenas o `price`, sem a odd riscada.

## Dimensoes

O card ocupa `100%` da largura disponivel — quem define a largura e o container
(no carrossel da plataforma, o slide). Na referencia de design ele tem 347px, que
e a largura usada nas stories.

Os nomes dos times dividem a largura em partes iguais, o que mantem os escudos e
o `X` centrados no card, e truncam com reticencias quando nao cabem.

## Altura igual entre cards

Cards lado a lado com quantidades diferentes de selecoes precisam terminar na
mesma altura, para a fileira nao quebrar. A responsabilidade e dividida:

- **O container define a altura.** So ele sabe qual e o card mais alto. Em
  `flex` e `grid` isso ja e o padrao (`align-items: stretch`); no carrossel,
  passe `slide-class-name="flex"` para o slide esticar o card.
- **O card distribui a altura recebida.** O corpo usa `flex-1` e o divisor final
  usa `mt-auto`, entao a sobra fica entre as selecoes e o rodape e o botao
  encosta na base.

```vue
<div class="flex items-stretch gap-st-3">
  <StSuperOddsCard v-for="card in cards" :key="card.id" v-bind="card" />
</div>
```

O card **nao** declara altura propria — nem `h-full`, nem altura fixa. Em
flexbox o `align-items: stretch` so estica itens com altura `auto`: bastaria um
`h-full` na raiz para o card sair do stretch e voltar a ter a altura do proprio
conteudo. Altura fixa tambem esta fora de cogitacao, porque quebraria com mais
selecoes, nomes maiores ou outro idioma.

## Tokens usados

- Card: `bg-st-surface-0` com borda `st-border-2` e raio `rounded-st-2`.
- Cabecalho: faixa em `bg-st-surface-1`, selo em `bg-st-primary` com texto `st-content-bright` e corte diagonal por `clip-path`.
- Data em `st-content-primary`, icone de destaque em `st-content-warning`.
- Times em `st-content-default`, campeonato e `X` em `st-content-ghost`.
- Divisores em `st-border-2`.

## Acessibilidade

- O card e um `article` rotulado por `home x away`, ou pelo `ariaLabel` informado.
- Icones do selo e do destaque sao `aria-hidden`; a informacao esta no texto.
- O botao aceita `actionAriaLabel` quando o texto da odd nao for suficiente.
- `data-st-super-odds-card`, `-type`, `-date`, `-highlight`, `-competition`, `-teams`, `-event`, `-selections` e `-action` estao disponiveis para testes e QA.

## Observacoes

- Os icones `bolt`, `fire` e `angles-right` ja vem registrados. Um `typeIcon` ou `highlightIcon` diferente precisa ser registrado na `library` do Font Awesome pelo projeto consumidor.
