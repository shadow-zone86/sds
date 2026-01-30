import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { usePageLoader } from './usePageLoader';

const FAST_CONFIG = {
  durationMs: 1000,
  progressFrom: 0,
  progressTo: 75,
  hideDelayMs: 50,
  fallbackTimeoutMs: 200,
  logoPath: '/logo.webp',
  logoAlt: 'Загрузка',
  logoMaxWidthPx: 187,
  logoMaxHeightPx: 52,
};

const PageLoaderTestWrapper = defineComponent({
  props: {
    config: { type: Object, default: () => FAST_CONFIG },
  },
  setup(props) {
    return usePageLoader({ config: props.config });
  },
  render() {
    return h('div', [
      h('span', { 'data-test': 'loading' }, String(this.isLoading)),
      h('span', { 'data-test': 'progress' }, this.progressWidth),
      h('div', { ref: 'progressRef' }),
      h('span', { 'data-config-alt': this.config?.logoAlt }),
    ]);
  },
});

describe('usePageLoader', () => {
  let rafCallbacks: Array<(time: number) => void> = [];
  let rafId = 0;

  beforeEach(() => {
    jest.useFakeTimers();
    rafCallbacks = [];
    rafId = 0;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: (time: number) => void) => {
      rafCallbacks.push(cb);
      return ++rafId;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('возвращает начальное состояние: isLoading true, progressWidth 0%', () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PageLoaderTestWrapper);
    expect(wrapper.find('[data-test="loading"]').text()).toBe('true');
    expect(wrapper.find('[data-test="progress"]').text()).toBe('0%');
  });

  it('после mount запускает анимацию (requestAnimationFrame вызван)', () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true,
      writable: true,
    });

    mount(PageLoaderTestWrapper);
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it('при document.readyState === complete сразу вызывает loadHandler и через hideDelayMs скрывает лоадер', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PageLoaderTestWrapper);
    await nextTick();
    if (rafCallbacks.length > 0) rafCallbacks[0](0);
    jest.advanceTimersByTime(FAST_CONFIG.hideDelayMs);
    await nextTick();

    expect(wrapper.find('[data-test="loading"]').text()).toBe('false');
    expect(wrapper.find('[data-test="progress"]').text()).toBe('100%');
  });

  it('по событию load устанавливает прогресс 100% и через hideDelayMs скрывает лоадер', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true,
      writable: true,
    });

    const addSpy = jest.spyOn(window, 'addEventListener');
    const wrapper = mount(PageLoaderTestWrapper);
    await nextTick();
    expect(addSpy).toHaveBeenCalledWith('load', expect.any(Function));

    const loadHandler = addSpy.mock.calls.find((c) => c[0] === 'load')?.[1] as () => void;
    loadHandler();
    await nextTick();
    expect(wrapper.find('[data-test="progress"]').text()).toBe('100%');

    jest.advanceTimersByTime(FAST_CONFIG.hideDelayMs);
    await nextTick();
    expect(wrapper.find('[data-test="loading"]').text()).toBe('false');
  });

  it('fallback: через fallbackTimeoutMs скрывает лоадер, если load не произошёл', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PageLoaderTestWrapper);
    await nextTick();
    jest.advanceTimersByTime(FAST_CONFIG.fallbackTimeoutMs);
    await nextTick();

    expect(wrapper.find('[data-test="loading"]').text()).toBe('false');
  });

  it('при unmount отменяет RAF, снимает load и очищает fallback timeout', () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true,
      writable: true,
    });

    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    const wrapper = mount(PageLoaderTestWrapper);
    wrapper.unmount();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(rafId);
    expect(removeSpy).toHaveBeenCalledWith('load', expect.any(Function));
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('принимает частичный config и мержит с дефолтом', () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true,
      writable: true,
    });

    const wrapper = mount(PageLoaderTestWrapper, {
      props: { config: { logoAlt: 'Custom alt', hideDelayMs: 99 } },
    });
    expect(wrapper.find('[data-config-alt]').attributes('data-config-alt')).toBe('Custom alt');
  });
});
