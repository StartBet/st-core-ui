import { describe, expect, it } from 'vitest';

import {
  createSizeClasses,
  sizeClassSuffixes,
  sizeHeightClasses,
  sizeWidthClasses,
  spacingShorthandToClasses
} from './spacingShorthand';

describe('spacingShorthandToClasses', () => {
  it('retorna array vazio quando o valor não é informado', () => {
    expect(spacingShorthandToClasses(undefined, 'p')).toEqual([]);
  });

  it('resolve shorthand simples', () => {
    expect(spacingShorthandToClasses('2', 'p')).toEqual(['p-st-2']);
  });

  it('resolve shorthand com dois valores', () => {
    expect(spacingShorthandToClasses('1 4', 'm')).toEqual([
      'my-st-1',
      'mx-st-4'
    ]);
  });

  it('resolve shorthand com três valores', () => {
    expect(spacingShorthandToClasses('1 2 3', 'p')).toEqual([
      'pt-st-1',
      'px-st-2',
      'pb-st-3'
    ]);
  });

  it('resolve shorthand com quatro valores e prefixo responsivo', () => {
    expect(spacingShorthandToClasses('1 2 3 4', 'm', 'md')).toEqual([
      'md:mt-st-1',
      'md:mr-st-2',
      'md:mb-st-3',
      'md:ml-st-4'
    ]);
  });

  it('preserva os valores especiais 0 e auto', () => {
    expect(spacingShorthandToClasses('0 auto', 'm')).toEqual([
      'my-0',
      'mx-auto'
    ]);
  });
});

describe('size class helpers', () => {
  it('expõe o mapa base de sufixos de tamanho', () => {
    expect(sizeClassSuffixes.auto).toBe('auto');
    expect(sizeClassSuffixes['fit-content']).toBe('fit');
    expect(sizeClassSuffixes['12']).toBe('st-12');
    expect(sizeClassSuffixes['240']).toBe('st-240');
  });

  it('cria classes de width e height a partir do prefixo', () => {
    const widthClasses = createSizeClasses('w');
    const heightClasses = createSizeClasses('h');

    expect(widthClasses.full).toBe('w-full');
    expect(widthClasses['min-content']).toBe('w-min');
    expect(heightClasses['10']).toBe('h-st-10');
    expect(heightClasses['168']).toBe('h-st-168');
  });

  it('expõe os mapas prontos de width e height', () => {
    expect(sizeWidthClasses['24']).toBe('w-st-24');
    expect(sizeHeightClasses['64']).toBe('h-st-64');
  });
});
