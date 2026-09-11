import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StAvatar from './StAvatar.vue';
import {
  resolveAvatarColor,
  resolveAvatarContent,
  resolveAvatarIconSize,
  resolveAvatarInitials,
  stAvatarLetterColors
} from './styleStAvatar';

const IMAGE = 'https://example.com/user.png';

describe('styleStAvatar', () => {
  it('monta as iniciais com o primeiro e o ultimo nome', () => {
    expect(resolveAvatarInitials('Uncle')).toBe('U');
    expect(resolveAvatarInitials('Arthur Morgan')).toBe('AM');
    expect(resolveAvatarInitials('Reverend Orville Swanson')).toBe('RS');
    expect(resolveAvatarInitials('Dutch van der Linde')).toBe('DL');
  });

  it('normaliza espacos, acentos e caixa', () => {
    expect(resolveAvatarInitials('  Arthur   Morgan  ')).toBe('AM');
    expect(resolveAvatarInitials('javier escuella')).toBe('JE');
    expect(resolveAvatarInitials('Javiér Escuélla')).toBe('JE');
  });

  it('devolve vazio quando nao ha nome', () => {
    expect(resolveAvatarInitials()).toBe('');
    expect(resolveAvatarInitials('')).toBe('');
    expect(resolveAvatarInitials('   ')).toBe('');
  });

  it('mantem a mesma cor para o mesmo nome', () => {
    expect(resolveAvatarColor('Arthur Morgan')).toBe('blue');
    expect(resolveAvatarColor('arthur morgan')).toBe('blue');
    expect(resolveAvatarColor('ARTHUR MORGAN')).toBe('blue');
    expect(resolveAvatarColor('Arthur James Morgan')).toBe('blue');
  });

  it('deriva a cor da inicial do primeiro nome', () => {
    expect(resolveAvatarColor('Sadie Adler')).toBe('green');
    expect(resolveAvatarColor('Dutch van der Linde')).toBe('yellow');
    expect(resolveAvatarColor('Micah Bell')).toBe('orange');
    expect(resolveAvatarColor('Bill Williamson')).toBe('ocean');
  });

  it('cobre as 26 letras do alfabeto', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    letters.forEach((letter) => {
      expect(stAvatarLetterColors[letter]).toBeDefined();
    });
    expect(Object.keys(stAvatarLetterColors)).toHaveLength(26);
  });

  it('usa a cor padrao quando a inicial nao e uma letra', () => {
    expect(resolveAvatarColor('123')).toBe('blue');
    expect(resolveAvatarColor('#tag')).toBe('blue');
  });

  it('resolve o conteudo pela imagem, pelo nome e pelo fallback', () => {
    expect(resolveAvatarContent({ src: IMAGE, name: 'Arthur Morgan' })).toBe(
      'image'
    );
    expect(
      resolveAvatarContent({
        src: IMAGE,
        name: 'Arthur Morgan',
        hasImageError: true
      })
    ).toBe('initials');
    expect(resolveAvatarContent({ name: 'Arthur Morgan' })).toBe('initials');
    expect(resolveAvatarContent({})).toBe('placeholder');
    expect(resolveAvatarContent({ hasImageError: true })).toBe('placeholder');
  });

  it('resolve o tamanho do icone do placeholder', () => {
    expect(resolveAvatarIconSize()).toBe(5);
    expect(resolveAvatarIconSize('small')).toBe(3);
    expect(resolveAvatarIconSize('large')).toBe(7);
  });
});

describe('StAvatar', () => {
  it('renderiza a imagem quando recebe src', () => {
    const wrapper = mount(StAvatar, {
      props: { src: IMAGE, name: 'Arthur Morgan' }
    });
    const image = wrapper.find('img');

    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe(IMAGE);
    expect(image.attributes('alt')).toBe('Arthur Morgan');
    expect(image.classes()).toContain('object-cover');
    expect(wrapper.attributes('data-st-avatar-content')).toBe('image');
  });

  it('prioriza alt sobre name no texto alternativo', () => {
    const wrapper = mount(StAvatar, {
      props: { src: IMAGE, name: 'Arthur Morgan', alt: 'Foto de perfil' }
    });

    expect(wrapper.find('img').attributes('alt')).toBe('Foto de perfil');
  });

  it('renderiza as iniciais e a cor do nome quando nao ha imagem', () => {
    const wrapper = mount(StAvatar, { props: { name: 'Arthur Morgan' } });

    expect(wrapper.text()).toBe('AM');
    expect(wrapper.classes()).toContain('bg-st-blue-700');
    expect(wrapper.classes()).toContain('text-st-blue-100');
    expect(wrapper.attributes('role')).toBe('img');
    expect(wrapper.attributes('aria-label')).toBe('Arthur Morgan');
  });

  it('permite forcar a cor da paleta', () => {
    const wrapper = mount(StAvatar, {
      props: { name: 'Arthur Morgan', color: 'purple' }
    });

    expect(wrapper.classes()).toContain('bg-st-purple-700');
    expect(wrapper.classes()).toContain('text-st-purple-100');
  });

  it('cai para as iniciais quando a imagem falha', async () => {
    const wrapper = mount(StAvatar, {
      props: { src: IMAGE, name: 'Arthur Morgan' }
    });

    await wrapper.find('img').trigger('error');

    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.text()).toBe('AM');
    expect(wrapper.attributes('data-st-avatar-content')).toBe('initials');
  });

  it('volta a tentar a imagem quando o src muda', async () => {
    const wrapper = mount(StAvatar, {
      props: { src: IMAGE, name: 'Arthur Morgan' }
    });

    await wrapper.find('img').trigger('error');
    expect(wrapper.find('img').exists()).toBe(false);

    await wrapper.setProps({ src: 'https://example.com/outra.png' });
    expect(wrapper.find('img').exists()).toBe(true);
  });

  it('renderiza o placeholder sem imagem e sem nome', () => {
    const wrapper = mount(StAvatar);

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.attributes('data-st-avatar-content')).toBe('placeholder');
    expect(wrapper.classes()).toContain('bg-st-surface-2');
  });

  it('aplica os tamanhos disponiveis', () => {
    const sizes = [
      ['small', 'h-st-4', 'text-st-xs'],
      ['medium', 'h-st-5', 'text-st-base'],
      ['large', 'h-st-7', 'text-st-lg']
    ] as const;

    sizes.forEach(([size, box, text]) => {
      const wrapper = mount(StAvatar, {
        props: { name: 'Arthur Morgan', size }
      });

      expect(wrapper.classes()).toContain(box);
      expect(wrapper.classes()).toContain(text);
    });
  });

  it('deixa respiro e superficie neutra para imagens vazadas', () => {
    const wrapper = mount(StAvatar, {
      props: { src: IMAGE, fit: 'contain', name: 'Van der Linde' }
    });

    expect(wrapper.find('img').classes()).toContain('object-contain');
    expect(wrapper.classes()).toContain('p-[5px]');
    expect(wrapper.classes()).toContain('bg-st-surface-1');
  });

  it('nao aplica o respiro de contain nas iniciais', () => {
    const wrapper = mount(StAvatar, {
      props: { fit: 'contain', name: 'Arthur Morgan' }
    });

    expect(wrapper.classes()).not.toContain('p-[5px]');
    expect(wrapper.classes()).toContain('bg-st-blue-700');
  });

  it('anexa className e encaminha class, style e demais attrs', () => {
    const wrapper = mount(StAvatar, {
      props: { name: 'Arthur Morgan', className: 'custom-x' },
      attrs: { class: 'attr-x', style: 'opacity: 0.5', 'data-id': 'abc' }
    });

    expect(wrapper.classes()).toContain('custom-x');
    expect(wrapper.classes()).toContain('attr-x');
    expect(wrapper.attributes('style')).toContain('opacity: 0.5');
    expect(wrapper.attributes('data-id')).toBe('abc');
  });
});
