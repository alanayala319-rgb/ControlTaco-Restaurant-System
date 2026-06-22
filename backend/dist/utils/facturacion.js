"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularPropinaSugerida = exports.calcularTotalCuenta = void 0;
// Lógica pura de negocio para cálculos de la cuenta
const calcularTotalCuenta = (productos) => {
    return productos.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
};
exports.calcularTotalCuenta = calcularTotalCuenta;
const calcularPropinaSugerida = (total, porcentaje = 10) => {
    return (total * porcentaje) / 100;
};
exports.calcularPropinaSugerida = calcularPropinaSugerida;
