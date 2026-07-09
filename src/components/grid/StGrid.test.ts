import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StGrid from './StGrid.vue';

describe('StGrid', () => {
  it('renderiza slot e aplica classes base', () => {
    const wrapper = mount(StGrid, {
      slots: { default: '<div data-testid="item" />' }
    });

    expect(wrapper.find('[data-testid="item"]').exists()).toBe(true);
    expect(wrapper.attributes('class')).toContain('grid');
    expect(wrapper.attributes('class')).toContain('grid-cols-1');
  });

  it('aplica cols e gaps com tokens st', () => {
    const wrapper = mount(StGrid, {
      props: { cols: 3, gap: 2, gapX: 4, gapY: 1 }
    });
    const classList = wrapper.attributes('class') ?? '';

    expect(classList).toContain('grid-cols-3');
    expect(classList).toContain('gap-st-2');
    expect(classList).toContain('gap-x-st-4');
    expect(classList).toContain('gap-y-st-1');
  });

  it('aplica padding e margin shorthand', () => {
    const wrapper = mount(StGrid, {
      props: { padding: '1 2', margin: '3 4 5 6' }
    });
    const classList = wrapper.attributes('class') ?? '';

    expect(classList).toContain('py-st-1');
    expect(classList).toContain('px-st-2');
    expect(classList).toContain('mt-st-3');
    expect(classList).toContain('mr-st-4');
    expect(classList).toContain('mb-st-5');
    expect(classList).toContain('ml-st-6');
  });

  it('aplica cols responsivas e className customizado', () => {
    const wrapper = mount(StGrid, {
      props: {
        smCols: 2,
        mdCols: 3,
        lgCols: 4,
        smPadding: '1',
        className: 'custom-grid'
      }
    });
    const classList = wrapper.attributes('class') ?? '';

    expect(classList).toContain('sm:grid-cols-2');
    expect(classList).toContain('md:grid-cols-3');
    expect(classList).toContain('lg:grid-cols-4');
    expect(classList).toContain('sm:p-st-1');
    expect(classList).toContain('custom-grid');
  });
});
