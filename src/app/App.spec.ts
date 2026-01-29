import { describe, it, expect } from '@jest/globals';
import { mount } from '@vue/test-utils';
import App from './App.vue';
import { router } from './router';

describe('App', () => {
  it('рендерится и монтируется', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });
    expect(wrapper.find('.app').exists()).toBe(true);
  });
});
