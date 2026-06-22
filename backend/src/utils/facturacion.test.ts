import { describe, it, expect } from 'vitest';
import { calcularTotalCuenta, calcularPropinaSugerida } from './facturacion';

describe('Facturación Logic', () => {
  it('debería calcular el total de la cuenta correctamente', () => {
    const productos = [
      { precio: 20, cantidad: 2 }, // 40
      { precio: 30, cantidad: 1 }, // 30
    ];
    const total = calcularTotalCuenta(productos);
    expect(total).toBe(70);
  });

  it('debería retornar 0 si no hay productos', () => {
    expect(calcularTotalCuenta([])).toBe(0);
  });

  it('debería calcular la propina sugerida correctamente al 10%', () => {
    const propina = calcularPropinaSugerida(100);
    expect(propina).toBe(10);
  });

  it('debería calcular propina con un porcentaje custom', () => {
    const propina = calcularPropinaSugerida(100, 15);
    expect(propina).toBe(15);
  });
});
