import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import StExampleButton from './StExampleButton.vue';

describe('StExampleButton', () => {
  it('should render the default label and button type', () => {
    const wrapper = mount(StExampleButton);
    const button = wrapper.get('button');

    expect(button.text()).toBe('Example button');
    expect(button.attributes('type')).toBe('button');
  });

  it('should apply the primary styles by default', () => {
    const wrapper = mount(StExampleButton);
    const button = wrapper.get('button');

    expect(button.classes()).toContain('bg-slate-900');
    expect(button.classes()).toContain('text-white');
    expect(button.classes()).toContain('hover:bg-slate-700');
  });

  it('should apply the secondary styles when requested', () => {
    const wrapper = mount(StExampleButton, {
      props: {
        label: 'Secondary action',
        variant: 'secondary'
      }
    });
    const button = wrapper.get('button');

    expect(button.text()).toBe('Secondary action');
    expect(button.classes()).toContain('bg-white');
    expect(button.classes()).toContain('text-slate-900');
    expect(button.classes()).toContain('ring-slate-300');
    expect(button.classes()).toContain('hover:bg-slate-50');
  });

  it('should fall back to the primary styles when the runtime variant is invalid', () => {
    const wrapper = mount(StExampleButton, {
      props: {
        variant: 'unexpected' as never
      }
    });
    const button = wrapper.get('button');

    expect(button.classes()).toContain('bg-slate-900');
    expect(button.classes()).toContain('text-white');
    expect(button.classes()).toContain('hover:bg-slate-700');
  });

  it('should render slot content instead of the fallback label', () => {
    const wrapper = mount(StExampleButton, {
      props: {
        label: 'Fallback label'
      },
      slots: {
        default: 'Slot label'
      }
    });

    expect(wrapper.get('button').text()).toBe('Slot label');
    expect(wrapper.text()).not.toContain('Fallback label');
  });
});
