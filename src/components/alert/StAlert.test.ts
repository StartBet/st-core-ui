import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StAlert from './StAlert.vue';
import {
  buildAlertClasses,
  resolveAlertIcon,
  resolveAlertRole
} from './styleStAlert';

const mountAlert = (props: Record<string, unknown> = {}, options = {}) =>
  mount(StAlert, {
    props: { title: 'Verificacao pendente', ...props },
    ...options
  });

const close = (wrapper: ReturnType<typeof mountAlert>) =>
  wrapper.find('[data-st-alert-close]');

describe('styleStAlert', () => {
  it('ocupa a largura toda por padrao, sem sombra', () => {
    const { container } = buildAlertClasses({});

    expect(container).toContain('w-full');
    expect(container).toContain('max-w-full');
    expect(container).not.toContain('shadow-');
  });

  it('centraliza icone e fechar na primeira linha do texto', () => {
    expect(buildAlertClasses({}).icon).toContain('mt-[6px]');
    expect(buildAlertClasses({ hasTitle: false }).icon).toContain('mt-[3px]');
    expect(buildAlertClasses({ hasTitle: false }).close).toContain('mt-[3px]');
  });

  it('segue a escala de largura do StPaper', () => {
    expect(buildAlertClasses({ width: '96' }).container).toContain('w-st-96');
    expect(buildAlertClasses({ width: 'fit-content' }).container).toContain(
      'w-fit'
    );
  });

  it('aplica a superficie, o acento e o conteudo de cada status', () => {
    const statuses = [
      ['info', 'bg-st-surface-info', 'border-st-content-info'],
      ['system', 'bg-st-surface-system', 'border-st-content-system'],
      ['warning', 'bg-st-surface-warning', 'border-st-content-warning'],
      ['positive', 'bg-st-surface-positive', 'border-st-content-positive'],
      ['negative', 'bg-st-surface-negative', 'border-st-content-negative']
    ] as const;

    statuses.forEach(([status, surface, border]) => {
      const classes = buildAlertClasses({ status });

      expect(classes.container).toContain(surface);
      expect(classes.container).toContain(border);
      expect(classes.title).toContain(`text-st-content-${status}`);
    });
  });

  it('resolve icone padrao e papel de cada status', () => {
    expect(resolveAlertIcon('info')).toBe('circle-info');
    expect(resolveAlertIcon('system')).toBe('gear');
    expect(resolveAlertIcon('warning')).toBe('triangle-exclamation');
    expect(resolveAlertIcon('positive')).toBe('circle-check');
    expect(resolveAlertIcon('negative')).toBe('circle-xmark');

    expect(resolveAlertRole('negative')).toBe('alert');
    expect(resolveAlertRole('warning')).toBe('alert');
    expect(resolveAlertRole('info')).toBe('status');
    expect(resolveAlertRole('positive')).toBe('status');
  });
});

describe('StAlert', () => {
  it('renderiza titulo, descricao e icone do status', () => {
    const wrapper = mountAlert({
      status: 'positive',
      description: 'Saques liberados.'
    });

    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('data-st-alert-status')).toBe('positive');
    expect(wrapper.find('[data-st-alert-title]').text()).toBe(
      'Verificacao pendente'
    );
    expect(wrapper.find('[data-st-alert-description]').text()).toBe(
      'Saques liberados.'
    );
    expect(
      wrapper.find('[data-st-alert-icon] svg').attributes('data-icon')
    ).toBe('circle-check');
  });

  it('omite titulo e descricao vazios', () => {
    const wrapper = mountAlert({ title: '', description: 'So descricao' });

    expect(wrapper.find('[data-st-alert-title]').exists()).toBe(false);
    expect(wrapper.find('[data-st-alert-description]').exists()).toBe(true);
  });

  it('troca e esconde o icone', () => {
    expect(
      mountAlert({ icon: 'gear' })
        .find('[data-st-alert-icon] svg')
        .attributes('data-icon')
    ).toBe('gear');
    expect(
      mountAlert({ hideIcon: true }).find('[data-st-alert-icon]').exists()
    ).toBe(false);
  });

  it('nao mostra o botao de fechar por padrao', () => {
    expect(close(mountAlert()).exists()).toBe(false);
  });

  it('some sozinho ao fechar quando nao e controlado', async () => {
    const wrapper = mountAlert({ closable: true });

    expect(close(wrapper).attributes('aria-label')).toBe('Fechar alerta');

    await close(wrapper).trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);
    expect(wrapper.find('[data-st-alert-status]').exists()).toBe(false);
  });

  it('segue o open controlado', async () => {
    const wrapper = mountAlert({ closable: true, open: true });

    await close(wrapper).trigger('click');
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false]);

    await wrapper.setProps({ open: false });
    expect(wrapper.find('[data-st-alert-status]').exists()).toBe(false);

    await wrapper.setProps({ open: true });
    expect(wrapper.find('[data-st-alert-status]').exists()).toBe(true);
  });

  it('renderiza os slots padrao e de acao', () => {
    const wrapper = mountAlert(
      {},
      {
        slots: {
          default: '<span class="extra">Extra</span>',
          action: '<button class="acao">Agir</button>'
        }
      }
    );

    expect(wrapper.find('.extra').exists()).toBe(true);
    expect(wrapper.find('.acao').exists()).toBe(true);
  });

  it('repassa atributos e classes para o container', () => {
    const wrapper = mountAlert(
      { className: 'mb-st-2' },
      { attrs: { id: 'alerta', class: 'extra-class' } }
    );

    expect(wrapper.attributes('id')).toBe('alerta');
    expect(wrapper.classes()).toContain('mb-st-2');
    expect(wrapper.classes()).toContain('extra-class');
  });
});
