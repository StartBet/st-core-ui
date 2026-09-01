import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

import { useCarouselPagination } from './useCarouselPagination';

const makeHarness = (
  propsFactory: () => Parameters<typeof useCarouselPagination>[0]
) =>
  defineComponent({
    name: 'PaginationHarness',
    setup() {
      const pagination = useCarouselPagination(propsFactory());

      return () =>
        h(
          'div',
          {
            'data-total': pagination.total.value,
            'data-per-page': pagination.perPage.value,
            'data-can-navigate': pagination.canNavigate.value,
            'data-infinite-loop': pagination.infiniteLoop.value,
            'data-position': pagination.position.value,
            'data-active-index': pagination.activeIndex.value,
            'data-active-page': pagination.activePage.value,
            'data-page-count': pagination.pageCount.value,
            'data-is-snapping': pagination.isSnapping.value,
            'data-clone-offset': pagination.cloneOffset.value,
            'data-visible-indexes': pagination.visibleIndexes.value.join(',')
          },
          JSON.stringify(pagination.pagePositions.value)
        );
    }
  });

const readData = (wrapper: ReturnType<typeof mount>, key: string) =>
  wrapper.attributes(key);

describe('useCarouselPagination', () => {
  describe('estado inicial', () => {
    it('normaliza total, perPage e expõe computed básicos', () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 5,
          slidePerPage: 2,
          infiniteLoop: false
        }))
      );

      expect(readData(wrapper, 'data-total')).toBe('5');
      expect(readData(wrapper, 'data-per-page')).toBe('2');
      expect(readData(wrapper, 'data-can-navigate')).toBe('true');
      expect(readData(wrapper, 'data-infinite-loop')).toBe('false');
      expect(readData(wrapper, 'data-position')).toBe('0');
      expect(readData(wrapper, 'data-active-index')).toBe('0');
      expect(readData(wrapper, 'data-active-page')).toBe('0');
      expect(readData(wrapper, 'data-page-count')).toBe('3');
      expect(readData(wrapper, 'data-clone-offset')).toBe('0');
    });

    it('inibe navegação e loop quando não há slides suficientes', () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 2,
          slidePerPage: 3,
          infiniteLoop: true
        }))
      );

      expect(readData(wrapper, 'data-per-page')).toBe('2');
      expect(readData(wrapper, 'data-can-navigate')).toBe('false');
      expect(readData(wrapper, 'data-infinite-loop')).toBe('false');
    });

    it('aceita initialIndex', () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 5,
          slidePerPage: 1,
          infiniteLoop: false,
          initialIndex: 2
        }))
      );

      expect(readData(wrapper, 'data-position')).toBe('2');
      expect(readData(wrapper, 'data-active-index')).toBe('2');
    });
  });

  describe('navegação sem loop infinito', () => {
    it('navega para próxima página com next', async () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 5,
          slidePerPage: 2,
          infiniteLoop: false
        }))
      );

      await wrapper.vm.$nextTick();
      expect(readData(wrapper, 'data-position')).toBe('0');
    });

    it('limita avanço no fim do carrossel', async () => {
      const total = ref(5);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.next();
      expect(api!.position.value).toBe(2);
      api!.next();
      expect(api!.position.value).toBe(3);
      api!.next();
      expect(api!.position.value).toBe(3);
    });

    it('limita recuo no início do carrossel', async () => {
      const total = ref(5);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.prev();
      expect(api!.position.value).toBe(0);
    });

    it('moveBy com passos arbitrários e clamp', async () => {
      const total = ref(5);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.moveBy(1);
      expect(api!.position.value).toBe(1);
      api!.moveBy(10);
      expect(api!.position.value).toBe(3);
      api!.moveBy(-10);
      expect(api!.position.value).toBe(0);
      api!.moveBy(0);
      expect(api!.position.value).toBe(0);
    });

    it('goToSlide direciona para índice clampado', async () => {
      const total = ref(5);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.goToSlide(4);
      expect(api!.position.value).toBe(3);
      api!.goToSlide(-5);
      expect(api!.position.value).toBe(0);
      api!.goToSlide(99);
      expect(api!.position.value).toBe(3);
    });

    it('goToPage navega para posições válidas', async () => {
      const total = ref(5);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      expect(api!.pagePositions.value).toEqual([0, 2, 3]);
      api!.goToPage(1);
      expect(api!.position.value).toBe(2);
      api!.goToPage(2);
      expect(api!.position.value).toBe(3);
      api!.goToPage(99);
      expect(api!.position.value).toBe(3);
      api!.goToPage(-5);
      expect(api!.position.value).toBe(0);
    });

    it('goToSlide ignora com total zero', async () => {
      const total = ref(0);
      const slidePerPage = ref(1);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.goToSlide(3);
      expect(api!.position.value).toBe(0);
    });

    it('goToPage ignora com pagePositions vazio', async () => {
      const total = ref(0);
      const slidePerPage = ref(1);
      const infiniteLoop = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.goToPage(1);
      expect(api!.position.value).toBe(0);
    });
  });

  describe('loop infinito', () => {
    it('exibe cloneOffset igual a perPage', () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 4,
          slidePerPage: 2,
          infiniteLoop: true
        }))
      );

      expect(readData(wrapper, 'data-clone-offset')).toBe('2');
      expect(readData(wrapper, 'data-infinite-loop')).toBe('true');
    });

    it('normaliza posição após next/prev animados via handleTransitionEnd', async () => {
      const total = ref(4);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(true);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.next();
      expect(api!.position.value).toBe(2);
      expect(api!.isSnapping.value).toBe(false);
      api!.next();
      expect(api!.position.value).toBe(4);
      api!.handleTransitionEnd();
      expect(api!.position.value).toBe(0);
    });

    it('normaliza imediatamente quando animated=false', async () => {
      const total = ref(4);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(true);
      const animated = ref(false);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({
            total,
            slidePerPage,
            infiniteLoop,
            animated
          });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.next();
      api!.next();
      expect(api!.position.value).toBe(0);
      expect(api!.isSnapping.value).toBe(true);
    });

    it('handleTransitionEnd ignora eventos de outras propriedades', async () => {
      const total = ref(4);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(true);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.next();
      api!.next();
      api!.handleTransitionEnd(
        new TransitionEvent('transitionend', { propertyName: 'opacity' })
      );
      expect(api!.position.value).toBe(4);
    });

    it('goToSlide normaliza índice no modo infinito', async () => {
      const total = ref(4);
      const slidePerPage = ref(2);
      const infiniteLoop = ref(true);

      let api: ReturnType<typeof useCarouselPagination>;

      const Harness = defineComponent({
        setup() {
          api = useCarouselPagination({ total, slidePerPage, infiniteLoop });
          return () => h('div');
        }
      });

      mount(Harness);
      await Promise.resolve();
      api!.goToSlide(-1);
      expect(api!.position.value).toBe(3);
      api!.goToSlide(6);
      expect(api!.position.value).toBe(2);
    });
  });

  describe('visibleIndexes', () => {
    it('retorna indices visiveis sem loop', () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 5,
          slidePerPage: 2,
          infiniteLoop: false,
          initialIndex: 2
        }))
      );

      expect(readData(wrapper, 'data-visible-indexes')).toBe('2,3');
    });

    it('retorna indices visiveis com loop infinito', () => {
      const wrapper = mount(
        makeHarness(() => ({
          total: 4,
          slidePerPage: 2,
          infiniteLoop: true,
          initialIndex: 3
        }))
      );

      expect(readData(wrapper, 'data-visible-indexes')).toBe('3,0');
    });
  });
});
