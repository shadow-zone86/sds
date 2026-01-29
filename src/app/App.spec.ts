import { describe, it, expect } from '@jest/globals';
import { mount } from '@vue/test-utils';
import App from './App.vue';
import { router } from './router';

describe('App', () => {
  it('renders and mounts', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });
    expect(wrapper.find('.app').exists()).toBe(true);
  });
});
