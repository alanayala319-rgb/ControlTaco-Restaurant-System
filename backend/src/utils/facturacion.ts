// Lógica pura de negocio para cálculos de la cuenta
export const calcularTotalCuenta = (productos: { precio: number, cantidad: number }[]): number => {
  return productos.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0);
};

export const calcularPropinaSugerida = (total: number, porcentaje: number = 10): number => {
  return (total * porcentaje) / 100;
};
