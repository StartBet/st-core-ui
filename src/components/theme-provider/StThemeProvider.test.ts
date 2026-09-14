import { enableAutoUnmount, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, inject, nextTick } from 'vue';

import StThemeProvider from './StThemeProvider.vue';
import {
  readDocumentTheme,
  resolveThemeMode,
  stThemeContextKey,
  toggleThemeMode
} from './styleStThemeProvider';

const ThemeProbe = defineComponent({
  name: 'ThemeProbe',
  setup() {
    const context = inject(stThemeContextKey, null);

    return { context };
  },
  template: `
    <span data-testid="probe">
      {{ context?.theme.value ?? 'none' }}:{{ context?.resolvedTheme.value ?? 'none' }}
    </span>
  `
});

type MediaQueryListener = (event: MediaQueryListEvent) => void;

const stubMatchMedia = (matches: boolean) => {
  const listeners = new Set<MediaQueryListener>();

  const query = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn((_: string, listener: MediaQueryListener) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn((_: string, listener: MediaQueryListener) => {
      listeners.delete(listener);
    })
  };

  vi.spyOn(window, 'matchMedia').mockReturnValue(
    query as unknown as MediaQueryList
  );

  return {
    query,
    emit: (next: boolean) => {
      query.matches = next;

      for (const listener of listeners) {
        listener({ matches: next } as MediaQueryListEvent);
      }
    }
  };
};

/**
 * A medicao de `prefers-color-scheme` e compartilhada entre providers, entao
 * cada teste precisa desmontar o que montou para zerar a contagem de assinantes.
 */
enableAutoUnmount(afterEach);

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  vi.restoreAllMocks();
});

describe('resolveThemeMode', () => {
  it('devolve o proprio modo quando explicito', () => {
    expect(resolveThemeMode('dark')).toBe('dark');
    expect(resolveThemeMode('light', { parentTheme: 'dark' })).toBe('light');
  });

  it('herda o tema do pai e cai em light sem pai', () => {
    expect(resolveThemeMode('inherit', { parentTheme: 'dark' })).toBe('dark');
    expect(resolveThemeMode('inherit')).toBe('light');
  });

  it('usa a preferencia do sistema e recua para o pai quando ela falta', () => {
    expect(resolveThemeMode('system', { systemTheme: 'dark' })).toBe('dark');
    expect(
      resolveThemeMode('system', { parentTheme: 'dark', systemTheme: null })
    ).toBe('dark');
    expect(resolveThemeMode('system')).toBe('light');
  });

  it('alterna entre claro e escuro', () => {
    expect(toggleThemeMode('dark')).toBe('light');
    expect(toggleThemeMode('light')).toBe('dark');
  });
});

describe('readDocumentTheme', () => {
  it('le o data-theme do documento', () => {
    expect(readDocumentTheme()).toBe('light');

    document.documentElement.setAttribute('data-theme', 'dark');
    expect(readDocumentTheme()).toBe('dark');
  });
});

describe('StThemeProvider', () => {
  it('renderiza o slot e aplica o tema resolvido', () => {
    const wrapper = mount(StThemeProvider, {
      slots: { default: '<div data-testid="x" />' }
    });

    expect(wrapper.find('[data-testid="x"]').exists()).toBe(true);
    expect(wrapper.attributes('data-theme')).toBe('light');
    expect(wrapper.element.tagName).toBe('DIV');
  });

  it('aplica as, inline e className', () => {
    const wrapper = mount(StThemeProvider, {
      props: { as: 'section', inline: true, className: 'extra', theme: 'dark' }
    });

    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.attributes('class')).toBe('contents extra');
    expect(wrapper.attributes('data-theme')).toBe('dark');
  });

  it('herda o tema do provider acima', () => {
    const wrapper = mount({
      components: { StThemeProvider, ThemeProbe },
      template: `
        <StThemeProvider theme="dark">
          <StThemeProvider data-testid="inner">
            <ThemeProbe />
          </StThemeProvider>
        </StThemeProvider>
      `
    });

    expect(wrapper.get('[data-testid="inner"]').attributes('data-theme')).toBe(
      'dark'
    );
    expect(wrapper.get('[data-testid="probe"]').text()).toBe('inherit:dark');
  });

  it('cria ilha clara dentro de um escopo escuro', () => {
    const wrapper = mount({
      components: { StThemeProvider },
      template: `
        <StThemeProvider theme="dark" data-testid="outer">
          <StThemeProvider theme="light" data-testid="island">
            <StThemeProvider data-testid="leaf" />
          </StThemeProvider>
        </StThemeProvider>
      `
    });

    expect(wrapper.get('[data-testid="outer"]').attributes('data-theme')).toBe(
      'dark'
    );
    expect(wrapper.get('[data-testid="island"]').attributes('data-theme')).toBe(
      'light'
    );
    expect(wrapper.get('[data-testid="leaf"]').attributes('data-theme')).toBe(
      'light'
    );
  });

  it('troca o tema por setTheme e toggle, emitindo os eventos', async () => {
    const wrapper = mount(StThemeProvider, { props: { theme: 'light' } });

    wrapper.vm.setTheme('dark');
    await nextTick();

    expect(wrapper.attributes('data-theme')).toBe('dark');
    expect(wrapper.emitted('update:theme')?.[0]).toEqual(['dark']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['dark']);

    wrapper.vm.toggle();
    await nextTick();

    expect(wrapper.attributes('data-theme')).toBe('light');
    expect(wrapper.emitted('change')?.[1]).toEqual(['light']);
  });

  it('deixa a prop vencer o tema escolhido internamente quando muda', async () => {
    const wrapper = mount(StThemeProvider, { props: { theme: 'light' } });

    wrapper.vm.setTheme('dark');
    await nextTick();
    expect(wrapper.attributes('data-theme')).toBe('dark');

    await wrapper.setProps({ theme: 'inherit' });
    expect(wrapper.attributes('data-theme')).toBe('light');
  });

  it('segue a preferencia do sistema e reage a mudanca', async () => {
    const media = stubMatchMedia(true);

    const wrapper = mount(StThemeProvider, { props: { theme: 'system' } });
    await nextTick();

    expect(wrapper.attributes('data-theme')).toBe('dark');

    media.emit(false);
    await nextTick();

    expect(wrapper.attributes('data-theme')).toBe('light');

    wrapper.unmount();
    expect(media.query.removeEventListener).toHaveBeenCalled();
  });

  it('abre um unico listener de sistema para varios providers', async () => {
    const media = stubMatchMedia(true);

    const wrapper = mount({
      components: { StThemeProvider },
      template: `
        <StThemeProvider theme="system">
          <StThemeProvider theme="system" data-testid="inner" />
        </StThemeProvider>
      `
    });
    await nextTick();

    expect(wrapper.get('[data-testid="inner"]').attributes('data-theme')).toBe(
      'dark'
    );
    expect(media.query.addEventListener).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    expect(media.query.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('espelha o tema no documento com root e restaura ao desmontar', async () => {
    const wrapper = mount(StThemeProvider, {
      props: { theme: 'dark', root: true }
    });
    await nextTick();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await wrapper.setProps({ theme: 'light' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    wrapper.unmount();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('nao toca no documento sem root', async () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const wrapper = mount(StThemeProvider, { props: { theme: 'light' } });
    await nextTick();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    wrapper.unmount();
  });
});
