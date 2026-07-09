import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import type { Meta, StoryObj } from '@storybook/vue3';

import StListItem from './list-item/StListItem.vue';
import StOrderedList from './ordered-list/StOrderedList.vue';
import StUnorderedList from './unordered-list/StUnorderedList.vue';

library.add(faChevronDown, faChevronUp);

const orientationOptions = ['vertical', 'horizontal'] as const;

const meta = {
  title: 'Components/StList',
  tags: ['autodocs'],
  render: () => ({
    components: {
      StListItem,
      StOrderedList,
      StUnorderedList
    },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-3">
        <StUnorderedList>
          <StListItem clickable>Painel</StListItem>
          <StListItem clickable>Apostas</StListItem>
          <StListItem clickable>Promoções</StListItem>
        </StUnorderedList>
      </div>
    `
  })
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => ({
    components: {
      StListItem,
      StUnorderedList
    },
    data() {
      return {
        orientationOptions,
        orientation: 'vertical' as (typeof orientationOptions)[number],
        dense: false
      };
    },
    template: `
      <div class="flex flex-col gap-st-3">
        <div class="flex items-center gap-st-2">
          <label class="text-st-body-small text-st-content-default">
            Orientation
            <select v-model="orientation" class="ml-st-1 rounded-st-1 border border-st-border-2 bg-st-surface-0 px-st-1 py-[4px] text-st-body-small text-st-content-default">
              <option v-for="item in orientationOptions" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </label>

          <label class="inline-flex items-center gap-st-1 text-st-body-small text-st-content-default">
            <input v-model="dense" type="checkbox" />
            dense
          </label>
        </div>

        <StUnorderedList
          :orientation="orientation"
          :dense="dense"
        >
          <StListItem clickable>Painel</StListItem>
          <StListItem clickable>Apostas</StListItem>
          <StListItem clickable>Promoções</StListItem>
        </StUnorderedList>
      </div>
    `
  })
};

export const UnorderedNavigation: Story = {
  render: () => ({
    components: {
      StListItem,
      StUnorderedList
    },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-3">
        <StUnorderedList>
          <StListItem clickable selected>
            <template #startAdornment>
              <span class="text-st-body-small text-st-content-default">D</span>
            </template>
            Dashboard
          </StListItem>

          <StListItem clickable divider>
            <template #startAdornment>
              <span class="text-st-body-small text-st-content-default">B</span>
            </template>
            Bilhetes
            <template #endAdornment>
              <span class="text-st-body-small text-st-content-ghost">12</span>
            </template>
          </StListItem>

          <StListItem clickable disabled>
            Carteira
          </StListItem>
        </StUnorderedList>
      </div>
    `
  })
};

export const OrderedSequence: Story = {
  render: () => ({
    components: {
      StListItem,
      StOrderedList
    },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-3">
        <StOrderedList>
          <StListItem clickable>Selecionar mercado</StListItem>
          <StListItem clickable>Conferir cotação</StListItem>
          <StListItem clickable>Finalizar aposta</StListItem>
        </StOrderedList>
      </div>
    `
  })
};

export const HorizontalSubmenu: Story = {
  render: () => ({
    components: {
      StListItem,
      StUnorderedList
    },
    template: `
      <div class="flex min-h-[240px] flex-col gap-st-3">
        <StUnorderedList orientation="horizontal">
          <StListItem clickable>Início</StListItem>
          <StListItem clickable>Ao vivo</StListItem>
          <StListItem clickable divider>
            Produtos

            <StUnorderedList dense>
              <StListItem clickable>Esportes</StListItem>
              <StListItem clickable>Cassino</StListItem>
              <StListItem clickable>Poker</StListItem>
            </StUnorderedList>
          </StListItem>
        </StUnorderedList>
      </div>
    `
  })
};

export const VerticalNested: Story = {
  render: () => ({
    components: {
      StListItem,
      StOrderedList,
      StUnorderedList
    },
    template: `
      <div class="flex max-w-st-48 flex-col gap-st-3">
        <StUnorderedList>
          <StListItem clickable default-expanded>
            Produtos

            <StOrderedList>
              <StListItem clickable>Esportes</StListItem>
              <StListItem clickable>Cassino</StListItem>
              <StListItem clickable>Casino ao vivo</StListItem>
            </StOrderedList>
          </StListItem>
        </StUnorderedList>
      </div>
    `
  })
};
