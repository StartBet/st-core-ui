import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h } from 'vue';

import StPromotionCard from './StPromotionCard.vue';
import StButton from '../../components/buttons/button/StButton.vue';
import {
  buildPromotionCardClasses,
  resolvePromotionCardLinkLabel
} from './styleStPromotionCard';

const promotion = {
  name: 'Super Cashback Semanal',
  description: 'Aqui sua diversão vai mais longe',
  image: 'https://cdn.exemplo.com/cashback.webp'
};

const mountCard = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StPromotionCard, { props: { ...promotion, ...props }, ...options });

describe('styleStPromotionCard', () => {
  it('monta o rotulo do link pelo nome da promocao', () => {
    expect(resolvePromotionCardLinkLabel('Cashback')).toBe(
      'Saiba mais sobre a promoção Cashback'
    );
    expect(resolvePromotionCardLinkLabel('  ')).toBe(
      'Saiba mais sobre a promoção'
    );
    expect(resolvePromotionCardLinkLabel()).toBe('Saiba mais sobre a promoção');
  });

  it('reserva o 16/9 da midia no card e no skeleton', () => {
    const { media, skeletonMedia } = buildPromotionCardClasses({});

    expect(media).toContain('aspect-video');
    expect(skeletonMedia).toContain('aspect-video');
  });

  it('so aplica hover e zoom quando o card e clicavel', () => {
    const linked = buildPromotionCardClasses({ hasLink: true });
    const plain = buildPromotionCardClasses({});

    expect(linked.root).toContain('cursor-pointer');
    expect(linked.image).toContain(
      'md:[@media(hover:hover)]:group-hover:scale-105'
    );
    expect(plain.root).not.toContain('cursor-pointer');
    expect(plain.image).not.toContain('scale-105');
  });

  it('mantem o slot do topo acima do link', () => {
    const { link, top } = buildPromotionCardClasses({ hasLink: true });
    const layer = (cls: string) => Number(cls.match(/z-\[(\d+)\]/)?.[1]);

    expect(layer(top)).toBeGreaterThan(layer(link));
    expect(top).toContain('pointer-events-none');
  });

  it('aplica o className no card e no skeleton', () => {
    const { root, skeleton } = buildPromotionCardClasses({
      className: 'extra'
    });

    expect(root).toContain('extra');
    expect(skeleton).toContain('extra');
  });
});

describe('StPromotionCard', () => {
  it('renderiza imagem, nome, descricao e CTA', () => {
    const wrapper = mountCard();

    const image = wrapper.get('[data-st-promotion-card-image]');
    expect(image.attributes('src')).toBe(promotion.image);
    expect(image.attributes('alt')).toBe('');
    expect(image.attributes('loading')).toBe('lazy');

    expect(wrapper.get('[data-st-promotion-card-name]').text()).toBe(
      promotion.name
    );
    expect(wrapper.get('[data-st-promotion-card-description]').text()).toBe(
      promotion.description
    );
    expect(wrapper.get('[data-st-promotion-card-cta]').text()).toBe(
      'Saiba mais'
    );
  });

  it('rotula o card pelo nome ou pelo ariaLabel', () => {
    expect(
      mountCard().get('[data-st-promotion-card]').attributes('aria-label')
    ).toBe(promotion.name);
    expect(
      mountCard({ ariaLabel: 'Promo' })
        .get('[data-st-promotion-card]')
        .attributes('aria-label')
    ).toBe('Promo');
  });

  it('aceita imageLoading eager para o LCP', () => {
    const wrapper = mountCard({ imageLoading: 'eager' });

    expect(
      wrapper.get('[data-st-promotion-card-image]').attributes('loading')
    ).toBe('eager');
  });

  it('nao cria link sem href', () => {
    expect(mountCard().find('[data-st-promotion-card-link]').exists()).toBe(
      false
    );
  });

  it('cria o link com rotulo acessivel a partir do nome', () => {
    const link = mountCard({ href: '/promotions/cashback' }).get(
      '[data-st-promotion-card-link]'
    );

    expect(link.element.tagName).toBe('A');
    expect(link.attributes('href')).toBe('/promotions/cashback');
    expect(link.attributes('aria-label')).toBe(
      'Saiba mais sobre a promoção Super Cashback Semanal'
    );
    expect(link.attributes('title')).toBe(link.attributes('aria-label'));
  });

  it('usa o linkAriaLabel informado', () => {
    const link = mountCard({ href: '/p', linkAriaLabel: 'Ver cashback' }).get(
      '[data-st-promotion-card-link]'
    );

    expect(link.attributes('aria-label')).toBe('Ver cashback');
  });

  it('renderiza o link pelo componente de linkAs', () => {
    const FakeLink = defineComponent({
      name: 'FakeLink',
      props: { href: { type: String, default: '' } },
      setup:
        (props, { attrs }) =>
        () =>
          h('a', { ...attrs, href: props.href, 'data-fake-link': '' })
    });

    const wrapper = mountCard({ href: '/promotions/x', linkAs: FakeLink });

    const link = wrapper.get('[data-fake-link]');
    expect(link.attributes('href')).toBe('/promotions/x');
    expect(link.attributes('data-st-promotion-card-link')).toBeDefined();
  });

  it('usa o StButton como CTA, fora do foco, pois o card inteiro e o link', () => {
    const wrapper = mountCard({ href: '/p' });
    const cta = wrapper.get('[data-st-promotion-card-cta]');
    const button = wrapper.findComponent(StButton);

    expect(button.exists()).toBe(true);
    expect(button.props()).toMatchObject({
      variant: 'solid',
      color: 'secondary',
      size: 'small'
    });
    expect(cta.element.tagName).toBe('BUTTON');
    expect(cta.attributes('tabindex')).toBe('-1');
    expect(cta.attributes('aria-hidden')).toBe('true');
    expect(cta.classes()).toContain('pointer-events-none');
  });

  it('repassa variante, cor e tamanho ao StButton', () => {
    const button = mountCard({
      ctaVariant: 'outline',
      ctaColor: 'primary',
      ctaSize: 'medium'
    }).findComponent(StButton);

    expect(button.props()).toMatchObject({
      variant: 'outline',
      color: 'primary',
      size: 'medium'
    });
  });

  it('troca o texto do CTA e permite esconder', () => {
    expect(
      mountCard({ ctaLabel: 'Participar' })
        .get('[data-st-promotion-card-cta]')
        .text()
    ).toBe('Participar');
    expect(
      mountCard({ showCta: false })
        .find('[data-st-promotion-card-cta]')
        .exists()
    ).toBe(false);
  });

  it('omite a descricao vazia', () => {
    expect(
      mountCard({ description: '' })
        .find('[data-st-promotion-card-description]')
        .exists()
    ).toBe(false);
  });

  it('cai no fallback sem imagem', () => {
    const wrapper = mountCard({ image: null });

    expect(wrapper.find('[data-st-promotion-card-image]').exists()).toBe(false);
    expect(wrapper.get('[data-st-promotion-card-fallback]').text()).toBe(
      promotion.name
    );
  });

  it('cai no fallback quando a imagem falha e volta com uma imagem nova', async () => {
    const wrapper = mountCard();

    await wrapper.get('[data-st-promotion-card-image]').trigger('error');
    expect(wrapper.find('[data-st-promotion-card-fallback]').exists()).toBe(
      true
    );

    await wrapper.setProps({ image: 'https://cdn.exemplo.com/nova.webp' });
    expect(wrapper.find('[data-st-promotion-card-image]').exists()).toBe(true);
  });

  it('renderiza o skeleton no loading, sem conteudo', () => {
    const wrapper = mountCard({ loading: true, class: 'w-40' });

    const skeleton = wrapper.get('[data-st-promotion-card-skeleton]');
    expect(skeleton.attributes('aria-hidden')).toBe('true');
    expect(skeleton.attributes('aria-busy')).toBe('true');
    expect(skeleton.classes()).toContain('w-40');
    expect(wrapper.find('[data-st-promotion-card]').exists()).toBe(false);
  });

  it('repassa class, style e atributos ao card', () => {
    const wrapper = mountCard({
      class: 'custom',
      style: 'max-width: 300px',
      'data-testid': 'promo'
    });

    const root = wrapper.get('[data-st-promotion-card]');
    expect(root.classes()).toContain('custom');
    expect(root.attributes('style')).toContain('max-width: 300px');
    expect(root.attributes('data-testid')).toBe('promo');
  });

  it('entrega classes, alt e onError pelo slot de imagem', async () => {
    const wrapper = mountCard(
      {},
      {
        slots: {
          image: `<template #image="{ class: imageClass, alt, onError }">
            <img data-custom :class="imageClass" :alt="alt" @error="onError" />
          </template>`
        }
      }
    );

    const custom = wrapper.get('[data-custom]');
    expect(custom.classes()).toContain('object-cover');
    expect(custom.attributes('alt')).toBe('');

    await custom.trigger('error');
    expect(wrapper.find('[data-st-promotion-card-fallback]').exists()).toBe(
      true
    );
  });

  it('renderiza o slot do topo so quando preenchido', () => {
    expect(mountCard().find('[data-st-promotion-card-top]').exists()).toBe(
      false
    );

    const wrapper = mountCard(
      {},
      { slots: { 'top-start': '<span data-tag>Novo</span>' } }
    );
    expect(wrapper.get('[data-st-promotion-card-top] [data-tag]').text()).toBe(
      'Novo'
    );
  });
});
