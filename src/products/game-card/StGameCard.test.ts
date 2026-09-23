import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import StGameCard from './StGameCard.vue';
import {
  buildGameCardClasses,
  resolveGameCardFavoriteLabel,
  resolveGameCardLinkLabel,
  resolveGameCardProvider
} from './styleStGameCard';

const game = {
  name: 'Fortune Rabbit',
  provider: { name: 'PGSoft', slug: 'pgsoft' },
  image: 'https://cdn.exemplo.com/fortune-rabbit.webp'
};

const mountCard = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StGameCard, { props: { ...game, ...props }, ...options });

describe('styleStGameCard', () => {
  it('aceita o provedor como objeto ou texto', () => {
    expect(resolveGameCardProvider({ name: 'PGSoft' })).toBe('PGSoft');
    expect(resolveGameCardProvider('Pragmatic Play')).toBe('Pragmatic Play');
    expect(resolveGameCardProvider({})).toBe('');
    expect(resolveGameCardProvider(null)).toBe('');
    expect(resolveGameCardProvider()).toBe('');
  });

  it('monta o rotulo do link pelo nome do jogo', () => {
    expect(resolveGameCardLinkLabel('Fortune Rabbit')).toBe(
      'Jogar Fortune Rabbit'
    );
    expect(resolveGameCardLinkLabel('')).toBe('');
  });

  it('monta o rotulo do favorito pela acao', () => {
    expect(resolveGameCardFavoriteLabel(false, 'Aviator')).toBe(
      'Adicionar aos favoritos o jogo Aviator'
    );
    expect(resolveGameCardFavoriteLabel(true, 'Aviator')).toBe(
      'Remover dos favoritos o jogo Aviator'
    );
    expect(resolveGameCardFavoriteLabel()).toBe('Adicionar aos favoritos');
  });

  it('usa a proporcao retrato por padrao e 16/9 no wide', () => {
    expect(buildGameCardClasses({}).root).toContain('aspect-[10/13]');
    expect(buildGameCardClasses({ aspect: 'wide' }).root).toContain(
      'aspect-video'
    );
  });

  it('mantem a mesma forma no skeleton e no indisponivel', () => {
    const { skeleton, unavailable } = buildGameCardClasses({ aspect: 'wide' });

    expect(skeleton).toContain('aspect-video');
    expect(unavailable).toContain('aspect-video');
  });

  it('mantem nome e provedor acima da sobreposicao do hover', () => {
    const { info, link, top } = buildGameCardClasses({ hasLink: true });
    const layer = (cls: string) => Number(cls.match(/z-\[(\d+)\]/)?.[1]);

    expect(layer(info)).toBeGreaterThan(layer(link));
    expect(layer(top)).toBeGreaterThan(layer(info));
    expect(info).toContain('pointer-events-none');
  });

  it('so aplica o zoom da capa no desktop e quando o card e clicavel', () => {
    expect(buildGameCardClasses({ hasLink: true }).image).toContain(
      'md:[@media(hover:hover)]:group-hover:scale-110'
    );
    expect(buildGameCardClasses({}).image).not.toContain('scale-110');
  });

  it('nao renderiza a sobreposicao abaixo do md, para o toque navegar direto', () => {
    const overlay = buildGameCardClasses({ hasLink: true }).overlay.split(' ');

    expect(overlay).toContain('hidden');
    expect(overlay).toContain('md:flex');
    expect(overlay).not.toContain('flex');
  });
});

describe('StGameCard', () => {
  it('renderiza capa, nome e provedor', () => {
    const wrapper = mountCard();
    const image = wrapper.find('[data-st-game-card-image]');

    expect(image.attributes('src')).toBe(game.image);
    expect(image.attributes('loading')).toBe('lazy');
    expect(wrapper.find('[data-st-game-card-name]').text()).toBe(
      'Fortune Rabbit'
    );
    expect(wrapper.find('[data-st-game-card-provider]').text()).toBe('PGSoft');
  });

  it('carrega a capa sem lazy quando pedido', () => {
    const wrapper = mountCard({ imageLoading: 'eager' });

    expect(
      wrapper.find('[data-st-game-card-image]').attributes('loading')
    ).toBe('eager');
  });

  it('cai no fallback quando nao ha capa', () => {
    const wrapper = mountCard({ image: null });

    expect(wrapper.find('[data-st-game-card-image]').exists()).toBe(false);
    expect(wrapper.find('[data-st-game-card-fallback]').text()).toBe(
      'Fortune Rabbit'
    );
  });

  it('cai no fallback quando a capa falha e volta com uma capa nova', async () => {
    const wrapper = mountCard();

    await wrapper.find('[data-st-game-card-image]').trigger('error');

    expect(wrapper.find('[data-st-game-card-image]').exists()).toBe(false);
    expect(wrapper.find('[data-st-game-card-fallback]').exists()).toBe(true);

    await wrapper.setProps({ image: 'https://cdn.exemplo.com/outra.webp' });

    expect(wrapper.find('[data-st-game-card-image]').exists()).toBe(true);
  });

  it('esconde o nome com showName falso e mantem o provedor', () => {
    const wrapper = mountCard({ showName: false });

    expect(wrapper.find('[data-st-game-card-name]').exists()).toBe(false);
    expect(wrapper.find('[data-st-game-card-provider]').exists()).toBe(true);
  });

  it('nao renderiza o bloco de texto sem nome visivel e sem provedor', () => {
    const wrapper = mountCard({ showName: false, provider: null });

    expect(wrapper.find('[data-st-game-card-info]').exists()).toBe(false);
  });

  it('sem href nao existe link', () => {
    const wrapper = mountCard();

    expect(wrapper.find('[data-st-game-card-link]').exists()).toBe(false);
    expect(wrapper.find('a').exists()).toBe(false);
  });

  it('com href o card inteiro vira o acesso ao jogo', () => {
    const wrapper = mountCard({ href: '/play/pgsoft/fortune-rabbit' });
    const link = wrapper.find('[data-st-game-card-link]');

    expect(link.element.tagName).toBe('A');
    expect(link.attributes('href')).toBe('/play/pgsoft/fortune-rabbit');
    expect(link.attributes('aria-label')).toBe('Jogar Fortune Rabbit');
    expect(wrapper.find('[data-st-game-card-play]').text()).toBe('Jogue');
  });

  it('aceita rotulos proprios e outro componente de link', () => {
    const wrapper = mountCard({
      href: '/play/pgsoft/fortune-rabbit',
      linkAs: 'button',
      linkAriaLabel: 'Abrir Fortune Rabbit',
      playLabel: 'Jogar'
    });
    const link = wrapper.find('[data-st-game-card-link]');

    expect(link.element.tagName).toBe('BUTTON');
    expect(link.attributes('aria-label')).toBe('Abrir Fortune Rabbit');
    expect(wrapper.find('[data-st-game-card-play]').text()).toBe('Jogar');
  });

  it('entrega o destino como href para o componente de link', () => {
    const FakeLink = defineComponent({
      props: { href: { type: String, default: '' } },
      setup(props, { slots }) {
        return () => h('a', { 'data-fake': props.href }, slots.default?.());
      }
    });
    const wrapper = mountCard({ href: '/play/x', linkAs: FakeLink });

    expect(wrapper.find('[data-fake]').attributes('data-fake')).toBe('/play/x');
  });

  it('mostra o skeleton enquanto carrega', () => {
    const wrapper = mountCard({ loading: true });

    expect(wrapper.find('[data-st-game-card-skeleton]').exists()).toBe(true);
    expect(wrapper.find('[data-st-game-card]').exists()).toBe(false);
    expect(wrapper.attributes('aria-busy')).toBe('true');
  });

  it('mostra o skeleton mesmo sem dados', () => {
    const wrapper = mount(StGameCard, { props: { loading: true } });

    expect(wrapper.find('[data-st-game-card-skeleton]').exists()).toBe(true);
  });

  it('mostra indisponivel quando o jogo nao tem nome', () => {
    const wrapper = mount(StGameCard);

    expect(wrapper.find('[data-st-game-card-unavailable]').text()).toBe(
      'Jogo indisponivel'
    );
    expect(
      mount(StGameCard, { props: { unavailableLabel: 'Fora do ar' } }).text()
    ).toBe('Fora do ar');
  });

  it('posiciona conteudo por cima da capa pelo slot do topo', () => {
    const wrapper = mountCard(
      { href: '/play/x' },
      { slots: { 'top-start': '<span class="online">1.2k</span>' } }
    );
    const top = wrapper.find('[data-st-game-card-top]');

    expect(top.find('.online').exists()).toBe(true);
    expect(wrapper.find('[data-st-game-card-link] .online').exists()).toBe(
      false
    );
  });

  it('sempre mostra a estrela de favorito, fora do link', () => {
    const semSlot = mountCard();
    const comLink = mountCard({ href: '/play/x' });

    expect(semSlot.find('[data-st-game-card-favorite]').exists()).toBe(true);
    expect(
      comLink
        .find('[data-st-game-card-link] [data-st-game-card-favorite]')
        .exists()
    ).toBe(false);
  });

  it('esconde a estrela com showFavorite falso', () => {
    const semEstrela = mountCard({ showFavorite: false });
    const comSlot = mountCard(
      { showFavorite: false },
      { slots: { 'top-start': '<span class="online">1.2k</span>' } }
    );

    expect(semEstrela.find('[data-st-game-card-favorite]').exists()).toBe(
      false
    );
    expect(semEstrela.find('[data-st-game-card-top]').exists()).toBe(false);
    expect(comSlot.find('.online').exists()).toBe(true);
    expect(comSlot.find('[data-st-game-card-favorite]').exists()).toBe(false);
  });

  it('nao mostra a estrela no skeleton nem no indisponivel', () => {
    expect(
      mountCard({ loading: true }).find('[data-st-game-card-favorite]').exists()
    ).toBe(false);
    expect(
      mount(StGameCard).find('[data-st-game-card-favorite]').exists()
    ).toBe(false);
  });

  it('reflete o favorito na estrela e no aria-pressed', () => {
    const fora = mountCard();
    const dentro = mountCard({ favorite: true });

    expect(
      fora.find('[data-st-game-card-favorite]').attributes('aria-pressed')
    ).toBe('false');
    expect(fora.find('[data-st-game-card-favorite] svg').classes()).toContain(
      'stroke-st-content-bright'
    );
    expect(
      dentro.find('[data-st-game-card-favorite]').attributes('aria-pressed')
    ).toBe('true');
    expect(dentro.find('[data-st-game-card-favorite] svg').classes()).toContain(
      'fill-st-warning'
    );
  });

  it('rotula a estrela pela acao e aceita rotulo proprio', () => {
    expect(
      mountCard().find('[data-st-game-card-favorite]').attributes('aria-label')
    ).toBe('Adicionar aos favoritos o jogo Fortune Rabbit');
    expect(
      mountCard({ favorite: true })
        .find('[data-st-game-card-favorite]')
        .attributes('aria-label')
    ).toBe('Remover dos favoritos o jogo Fortune Rabbit');
    expect(
      mountCard({ favoriteAriaLabel: 'Favoritar' })
        .find('[data-st-game-card-favorite]')
        .attributes('aria-label')
    ).toBe('Favoritar');
  });

  it('emite update:favorite com o valor invertido', async () => {
    const fora = mountCard();
    const dentro = mountCard({ favorite: true });

    await fora.find('[data-st-game-card-favorite]').trigger('click');
    await dentro.find('[data-st-game-card-favorite]').trigger('click');

    expect(fora.emitted('update:favorite')).toEqual([[true]]);
    expect(dentro.emitted('update:favorite')).toEqual([[false]]);
  });

  it('troca a imagem pelo slot, repassando classe e erro', async () => {
    const wrapper = mountCard(
      {},
      {
        slots: {
          image: `<template #image="{ class: cls, onError }">
            <img class="custom-img" :class="cls" @error="onError" />
          </template>`
        }
      }
    );
    const image = wrapper.find('.custom-img');

    expect(image.classes()).toContain('object-cover');

    await image.trigger('error');

    expect(wrapper.find('.custom-img').exists()).toBe(false);
    expect(wrapper.find('[data-st-game-card-fallback]').exists()).toBe(true);
  });

  it('rotula o card pelo nome e aceita rotulo proprio', () => {
    expect(mountCard().attributes('aria-label')).toBe('Fortune Rabbit');
    expect(
      mountCard({ ariaLabel: 'Jogo em alta' }).attributes('aria-label')
    ).toBe('Jogo em alta');
  });

  it('anexa className e encaminha class, style e demais attrs', () => {
    const wrapper = mountCard(
      { className: 'custom-x' },
      {
        attrs: { class: 'attr-x', style: 'max-width: 180px', 'data-id': '42' }
      }
    );

    expect(wrapper.classes()).toContain('custom-x');
    expect(wrapper.classes()).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('max-width: 180px');
    expect(wrapper.attributes('data-id')).toBe('42');
  });
});
