import { describe, expect, it } from 'vitest';

import { applyInputMask } from './inputMask';

describe('applyInputMask', () => {
  it('retorna o valor original quando não recebe máscara', () => {
    expect(applyInputMask(undefined, 'abc-123')).toBe('abc-123');
  });

  it('aplica a máscara de telefone brasileiro', () => {
    expect(applyInputMask('phone-br', '31995555555')).toBe('(31) 99555-5555');
    expect(applyInputMask('phone-br', '31abc9955')).toBe('(31) 9955');
  });

  it('aplica a máscara de CPF', () => {
    expect(applyInputMask('cpf', '12345678901')).toBe('123.456.789-01');
    expect(applyInputMask('cpf', '123abc456')).toBe('123.456');
  });
});
