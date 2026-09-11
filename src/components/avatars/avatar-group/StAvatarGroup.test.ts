import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StAvatarGroup from './StAvatarGroup.vue';
import {
  clampAvatarGroupMax,
  resolveAvatarGroupOverflow
} from './styleStAvatarGroup';
import type { StAvatarGroupItem } from './StAvatarGroup.interface';

const names = [
  'Arthur Morgan',
  'Dutch van der Linde',
  'John Marston',
  'Sadie Adler',
  'Micah Bell',
  'Charles Smith',
  'Hosea Matthews'
];

const buildAvatars = (total: number): StAvatarGroupItem[] =>
  names.slice(0, total).map((name) => ({ name }));

const mountGroup = (props: Record<string, unknown> = {}) =>
  mount(StAvatarGroup, { props: { avatars: buildAvatars(3), ...props } });

const avatars = (wrapper: ReturnType<typeof mountGroup>) =>
  wrapper.findAll('[data-st-avatar-content]');

const overflow = (wrapper: ReturnType<typeof mountGroup>) =>
  wrapper.find('[data-st-avatar-overflow]');

describe('styleStAvatarGroup', () => {
  it('limita o max a pelo menos um avatar', () => {
    expect(clampAvatarGroupMax(undefined)).toBe(5);
    expect(clampAvatarGroupMax(Number.NaN)).toBe(5);
    expect(clampAvatarGroupMax(0)).toBe(1);
    expect(clampAvatarGroupMax(-3)).toBe(1);
    expect(clampAvatarGroupMax(3.8)).toBe(3);
  });

  it('calcula o excedente apenas acima do limite', () => {
    expect(resolveAvatarGroupOverflow(3, 5)).toBe(0);
    expect(resolveAvatarGroupOverflow(5, 5)).toBe(0);
    expect(resolveAvatarGroupOverflow(6, 5)).toBe(1);
    expect(resolveAvatarGroupOverflow(12, 5)).toBe(7);
  });
});

describe('StAvatarGroup', () => {
  it('renderiza todos os avatares quando estao dentro do limite', () => {
    const wrapper = mountGroup();

    expect(avatars(wrapper)).toHaveLength(3);
    expect(overflow(wrapper).exists()).toBe(false);
    expect(wrapper.attributes('role')).toBe('group');
    expect(wrapper.attributes('aria-label')).toBe('Grupo de usuarios');
  });

  it('renderiza um unico avatar sem contador', () => {
    const wrapper = mountGroup({ avatars: buildAvatars(1) });

    expect(avatars(wrapper)).toHaveLength(1);
    expect(overflow(wrapper).exists()).toBe(false);
  });

  it('nao renderiza nada quando a lista esta vazia', () => {
    const wrapper = mountGroup({ avatars: [] });

    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('mostra os 5 primeiros e o contador a partir do sexto', () => {
    const wrapper = mountGroup({ avatars: buildAvatars(6) });

    expect(avatars(wrapper)).toHaveLength(5);
    expect(overflow(wrapper).text()).toBe('+1');
    expect(overflow(wrapper).attributes('aria-label')).toBe('Mais 1 usuarios');
  });

  it('atualiza o contador conforme o total de usuarios', () => {
    expect(overflow(mountGroup({ avatars: buildAvatars(7) })).text()).toBe(
      '+2'
    );
    expect(
      overflow(mountGroup({ avatars: buildAvatars(7), max: 2 })).text()
    ).toBe('+5');
  });

  it('permite customizar o rotulo do contador', () => {
    const wrapper = mountGroup({
      avatars: buildAvatars(7),
      overflowAriaLabel: (count: number) => `${count} usuarios ocultos`
    });

    expect(overflow(wrapper).attributes('aria-label')).toBe(
      '2 usuarios ocultos'
    );
  });

  it('exibe exatamente 5 avatares quando a lista tem 5', () => {
    const wrapper = mountGroup({ avatars: buildAvatars(5) });

    expect(avatars(wrapper)).toHaveLength(5);
    expect(overflow(wrapper).exists()).toBe(false);
  });

  it('sobrepoe os avatares a partir do segundo', () => {
    const wrapper = mountGroup();
    const list = avatars(wrapper);

    expect(list[0].classes()).not.toContain('-ml-[8px]');
    expect(list[1].classes()).toContain('-ml-[8px]');
    expect(list[2].classes()).toContain('-ml-[8px]');
    expect(list[0].classes()).toContain('ring-2');
  });

  it('empilha o primeiro avatar por cima dos demais', () => {
    const wrapper = mountGroup();
    const list = avatars(wrapper);

    expect(list[0].attributes('style')).toContain('z-index: 3');
    expect(list[2].attributes('style')).toContain('z-index: 1');
  });

  it('propaga o tamanho para avatares e contador', () => {
    const wrapper = mountGroup({ avatars: buildAvatars(6), size: 'large' });

    expect(avatars(wrapper)[0].classes()).toContain('h-st-7');
    expect(overflow(wrapper).classes()).toContain('h-st-7');
    expect(avatars(wrapper)[1].classes()).toContain('-ml-[11px]');
  });

  it('usa o nome de cada item para iniciais e cor', () => {
    const wrapper = mountGroup();
    const list = avatars(wrapper);

    expect(list[0].text()).toBe('AM');
    expect(list[0].classes()).toContain('bg-st-blue-700');
    expect(list[1].text()).toBe('DL');
    expect(list[1].classes()).toContain('bg-st-yellow-700');
  });

  it('aceita imagem e fit por item', () => {
    const wrapper = mountGroup({
      avatars: [
        { name: 'Arthur Morgan', src: 'https://example.com/arthur.png' },
        {
          name: 'Van der Linde',
          src: 'https://example.com/gangue.png',
          fit: 'contain'
        }
      ]
    });
    const images = wrapper.findAll('img');

    expect(images).toHaveLength(2);
    expect(images[0].classes()).toContain('object-cover');
    expect(images[1].classes()).toContain('object-contain');
  });

  it('anexa className e avatarClassName', () => {
    const wrapper = mountGroup({
      className: 'group-x',
      avatarClassName: 'item-x'
    });

    expect(wrapper.classes()).toContain('group-x');
    expect(avatars(wrapper)[0].classes()).toContain('item-x');
  });
});
