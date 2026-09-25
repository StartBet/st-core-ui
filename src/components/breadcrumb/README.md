# StBreadcrumb

Trilha de navegacao da pagina atual. Recebe os niveis prontos, do mais amplo para a pagina atual, e cuida da marcacao acessivel, dos links, dos separadores e do corte de rotulos longos.

O componente nao le a rota: montar os niveis a partir da URL e papel da aplicacao, que conhece as rotas e os rotulos de cada area. Veja [Uso no Nuxt](#uso-no-nuxt).

## Import

```ts
import { StBreadcrumb, buildBreadcrumbSchema } from '@startbet/st-core-ui';
```

## Props

| Prop        | Tipo                  | Default      | Descricao                                               |
| ----------- | --------------------- | ------------ | ------------------------------------------------------- |
| `items`     | `StBreadcrumbItem[]`  | —            | Niveis do caminho, do mais amplo para a pagina atual.   |
| `linkAs`    | `string \| Component` | `'a'`        | Componente dos links; passe `NuxtLink` no Nuxt.         |
| `minItems`  | `number`              | `2`          | Quantidade minima de niveis para o breadcrumb aparecer. |
| `ariaLabel` | `string`              | `Breadcrumb` | Rotulo do `nav`.                                        |
| `className` | `string`              | `''`         | Classes extras no `nav`.                                |

```ts
interface StBreadcrumbItem {
  label: string;
  href?: string | null;
}
```

## Slots

| Slot        | Descricao                                            |
| ----------- | ---------------------------------------------------- |
| `separator` | Separador entre os niveis. Default: `chevron-right`. |

## Exemplo basico

```vue
<script setup lang="ts">
import { StBreadcrumb } from '@startbet/st-core-ui';

const items = [
  { label: 'Inicio', href: '/' },
  { label: 'Cassino', href: '/casino' },
  { label: 'Gates of Olympus' }
];
</script>

<template>
  <StBreadcrumb :items="items" />
</template>
```

## Uso no Nuxt

A aplicacao monta os niveis a partir da rota e entrega o `NuxtLink`. O JSON-LD de SEO sai do `buildBreadcrumbSchema`, com os mesmos niveis.

```vue
<script setup lang="ts">
import { StBreadcrumb, buildBreadcrumbSchema } from '@startbet/st-core-ui';

const route = useRoute();
const url = useRequestURL();

// Regras de cada area da plataforma (cassino, esportes, provedores...).
const items = computed(() => resolveBreadcrumbItems(route));

useHead(() => ({
  script:
    items.value.length > 1
      ? [
          {
            type: 'application/ld+json',
            key: 'breadcrumb',
            textContent: JSON.stringify(
              buildBreadcrumbSchema(items.value, {
                origin: url.origin,
                currentPath: route.path
              })
            )
          }
        ]
      : []
}));
</script>

<template>
  <StBreadcrumb :items="items" :link-as="resolveComponent('NuxtLink')" />
</template>
```

## Regras internas

- O ultimo nivel e sempre a pagina atual: vira texto com `aria-current="page"`, mesmo que tenha `href`.
- Niveis intermediarios sem `href` viram texto simples, sem link.
- Abaixo de `minItems` niveis o componente nao renderiza nada — um nivel so nao e caminho.
- `buildBreadcrumbSchema` gera o `BreadcrumbList` do schema.org. Niveis sem `href` apontam para `currentPath`; destinos relativos ganham o `origin`, absolutos ficam como estao.

## Dimensoes

- Rotulos com corte e reticencias: ate `10rem` no mobile e `14rem` a partir de `sm`; a pagina atual vai ate `16rem`. O texto completo fica no `title`.
- Caminhos que nao cabem rolam na horizontal, com a barra de rolagem escondida.
- Sem margens proprias: o espacamento em volta fica com quem usa, por `className`.

## Tokens usados

- Tipografia: `font-st-body`, `text-st-xs` no mobile e `text-st-sm` a partir de `md`, peso medio.
- Links e niveis intermediarios em `text-st-content-ghost`; hover em `text-st-content-primary` com sublinhado.
- Pagina atual em `text-st-content-primary`, semibold.
- Separador `chevron-right` de 12px em `text-st-content-ghost` com `opacity-70`.
- Foco: `ring-st-focus` nos links.

## Acessibilidade

- `nav` com `aria-label` e lista ordenada (`ol`), no padrao de breadcrumb do WAI-ARIA.
- Pagina atual com `aria-current="page"`.
- Separadores com `aria-hidden`, fora da leitura.
- `data-st-breadcrumb-item`, `data-st-breadcrumb-link`, `data-st-breadcrumb-text` e `data-st-breadcrumb-separator` estao disponiveis para testes e QA.
