"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const facturacion_1 = require("./facturacion");
(0, vitest_1.describe)('Facturación Logic', () => {
    (0, vitest_1.it)('debería calcular el total de la cuenta correctamente', () => {
        const productos = [
            { precio: 20, cantidad: 2 }, // 40
            { precio: 30, cantidad: 1 }, // 30
        ];
        const total = (0, facturacion_1.calcularTotalCuenta)(productos);
        (0, vitest_1.expect)(total).toBe(70);
    });
    (0, vitest_1.it)('debería retornar 0 si no hay productos', () => {
        (0, vitest_1.expect)((0, facturacion_1.calcularTotalCuenta)([])).toBe(0);
    });
    (0, vitest_1.it)('debería calcular la propina sugerida correctamente al 10%', () => {
        const propina = (0, facturacion_1.calcularPropinaSugerida)(100);
        (0, vitest_1.expect)(propina).toBe(10);
    });
    (0, vitest_1.it)('debería calcular propina con un porcentaje custom', () => {
        const propina = (0, facturacion_1.calcularPropinaSugerida)(100, 15);
        (0, vitest_1.expect)(propina).toBe(15);
    });
});
