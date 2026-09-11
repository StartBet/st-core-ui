import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  dismissAllToasts,
  stToastConfig,
  ST_TOAST_DEFAULT_DURATION,
  ST_TOAST_DEFAULT_MAX,
  toToastOptions,
  useToast
} from './useToast';

const toast = useToast();

const titles = () => toast.toasts.value.map((entry) => entry.title);

const statuses = () => toast.toasts.value.map((entry) => entry.status);

beforeEach(() => {
  vi.useFakeTimers();
  dismissAllToasts();
  stToastConfig.duration = ST_TOAST_DEFAULT_DURATION;
  stToastConfig.max = ST_TOAST_DEFAULT_MAX;
});

afterEach(() => {
  dismissAllToasts();
  vi.useRealTimers();
});

describe('toToastOptions', () => {
  it('aceita apenas o titulo', () => {
    expect(toToastOptions('Aposta registrada')).toEqual({
      title: 'Aposta registrada'
    });
  });

  it('aceita o objeto completo', () => {
    expect(
      toToastOptions({ title: 'Saque', description: 'Em ate 30 minutos' })
    ).toEqual({ title: 'Saque', description: 'Em ate 30 minutos' });
  });

  it('aplica o status do atalho', () => {
    expect(toToastOptions('Erro', 'negative')).toEqual({
      title: 'Erro',
      status: 'negative'
    });
    expect(
      toToastOptions({ title: 'Erro', status: 'info' }, 'negative')
    ).toEqual({ title: 'Erro', status: 'negative' });
  });
});

describe('useToast', () => {
  it('comeca com a fila vazia', () => {
    expect(toast.toasts.value).toEqual([]);
  });

  it('empilha na ordem de chamada e devolve o id', () => {
    const id = toast.toast({ title: 'Primeiro' });
    toast.toast({ title: 'Segundo' });

    expect(typeof id).toBe('string');
    expect(titles()).toEqual(['Primeiro', 'Segundo']);
  });

  it('gera ids unicos', () => {
    const ids = [toast.toast('A'), toast.toast('B'), toast.toast('C')];

    expect(new Set(ids).size).toBe(3);
  });

  it('expoe um atalho por status', () => {
    toast.info('Info');
    toast.system('System');
    toast.warning('Warning');
    toast.positive('Positive');
    toast.negative('Negative');

    expect(statuses()).toEqual([
      'info',
      'system',
      'warning',
      'positive',
      'negative'
    ]);
  });

  it('aceita titulo e descricao nos atalhos', () => {
    toast.positive({ title: 'Aposta registrada', description: 'Bilhete 4821' });

    expect(toast.toasts.value[0]).toMatchObject({
      title: 'Aposta registrada',
      description: 'Bilhete 4821',
      status: 'positive'
    });
  });

  it('fecha sozinho depois da duracao padrao', () => {
    toast.info('Some em 5s');

    expect(titles()).toEqual(['Some em 5s']);

    vi.advanceTimersByTime(ST_TOAST_DEFAULT_DURATION - 1);
    expect(titles()).toEqual(['Some em 5s']);

    vi.advanceTimersByTime(1);
    expect(titles()).toEqual([]);
  });

  it('respeita a duracao informada no toast', () => {
    toast.info({ title: 'Rapido', duration: 1000 });
    toast.info({ title: 'Lento', duration: 9000 });

    vi.advanceTimersByTime(1000);
    expect(titles()).toEqual(['Lento']);

    vi.advanceTimersByTime(8000);
    expect(titles()).toEqual([]);
  });

  it('mantem na tela com duracao 0', () => {
    toast.negative({ title: 'Persistente', duration: 0 });

    vi.advanceTimersByTime(60000);

    expect(titles()).toEqual(['Persistente']);
  });

  it('usa a duracao global configurada', () => {
    stToastConfig.duration = 2000;
    toast.info('Configurado');

    vi.advanceTimersByTime(2000);

    expect(titles()).toEqual([]);
  });

  it('descarta o mais antigo ao passar do maximo', () => {
    stToastConfig.max = 3;

    ['A', 'B', 'C', 'D'].forEach((title) => toast.toast({ title }));

    expect(titles()).toEqual(['B', 'C', 'D']);
  });

  it('nao deixa o maximo cair abaixo de um', () => {
    stToastConfig.max = 0;

    toast.toast('A');
    toast.toast('B');

    expect(titles()).toEqual(['B']);
  });

  it('fecha um toast pelo id', () => {
    const id = toast.toast('A');
    toast.toast('B');

    toast.dismiss(id);

    expect(titles()).toEqual(['B']);
  });

  it('nao dispara o timer de um toast ja fechado', () => {
    const id = toast.info({ title: 'A', duration: 1000 });
    toast.dismiss(id);
    toast.info({ title: 'B', duration: 3000 });

    vi.advanceTimersByTime(1000);

    expect(titles()).toEqual(['B']);
  });

  it('fecha todos de uma vez', () => {
    toast.toast('A');
    toast.toast('B');

    toast.dismissAll();

    expect(titles()).toEqual([]);

    vi.advanceTimersByTime(ST_TOAST_DEFAULT_DURATION);
    expect(titles()).toEqual([]);
  });

  it('congela a contagem no pause e retoma o tempo restante', () => {
    toast.info({ title: 'Pausado', duration: 5000 });

    vi.advanceTimersByTime(2000);
    toast.pause();

    vi.advanceTimersByTime(60000);
    expect(titles()).toEqual(['Pausado']);

    toast.resume();
    vi.advanceTimersByTime(2999);
    expect(titles()).toEqual(['Pausado']);

    vi.advanceTimersByTime(1);
    expect(titles()).toEqual([]);
  });

  it('ignora pause e resume em toasts persistentes', () => {
    toast.info({ title: 'Persistente', duration: 0 });

    toast.pause();
    toast.resume();
    vi.advanceTimersByTime(60000);

    expect(titles()).toEqual(['Persistente']);
  });

  it('compartilha a fila entre chamadas de useToast', () => {
    const outro = useToast();

    toast.positive('Da primeira instancia');

    expect(outro.toasts.value.map((entry) => entry.title)).toEqual([
      'Da primeira instancia'
    ]);

    outro.dismissAll();

    expect(toast.toasts.value).toEqual([]);
  });
});
