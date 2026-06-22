export type MesaEstado = 'Disponible' | 'Ocupada' | 'Reservada';

export interface MesaData {
  _id: string;
  numero: number;
  capacidad: number;
  estado: MesaEstado;
}

export interface ProductoData {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

export interface VentaData {
  id: string;
  mesaNumero: number;
  total: number;
  metodoPago: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  fecha: string;
  productos: { nombre: string; cantidad: number; subtotal: number }[];
}

const MESAS_KEY = 'controltaco_mesas';
const PRODUCTOS_KEY = 'controltaco_productos';
const VENTAS_KEY = 'controltaco_ventas';

export const mesasIniciales: MesaData[] = [
  { _id: 'mesa-1', numero: 1, capacidad: 4, estado: 'Disponible' },
  { _id: 'mesa-2', numero: 2, capacidad: 2, estado: 'Ocupada' },
  { _id: 'mesa-3', numero: 3, capacidad: 6, estado: 'Reservada' },
  { _id: 'mesa-4', numero: 4, capacidad: 4, estado: 'Disponible' },
];

export const productosIniciales: ProductoData[] = [
  { id: 'prod-1', nombre: 'Taco al Pastor', precio: 25, stock: 80, categoria: 'Tacos' },
  { id: 'prod-2', nombre: 'Taco de Bistec', precio: 30, stock: 60, categoria: 'Tacos' },
  { id: 'prod-3', nombre: 'Gringa de Suadero', precio: 45, stock: 35, categoria: 'Especialidades' },
  { id: 'prod-4', nombre: 'Refresco Cola', precio: 20, stock: 48, categoria: 'Bebidas' },
];

export const ventasIniciales: VentaData[] = [
  {
    id: 'venta-1',
    mesaNumero: 2,
    total: 280,
    metodoPago: 'Efectivo',
    fecha: new Date().toISOString(),
    productos: [{ nombre: 'Taco al Pastor', cantidad: 8, subtotal: 200 }, { nombre: 'Refresco Cola', cantidad: 4, subtotal: 80 }],
  },
];

function readStored<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getMesas() {
  return readStored(MESAS_KEY, mesasIniciales);
}

export function saveMesas(mesas: MesaData[]) {
  localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
}

export function getProductos() {
  return readStored(PRODUCTOS_KEY, productosIniciales);
}

export function saveProductos(productos: ProductoData[]) {
  localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
}

export function getVentas() {
  return readStored(VENTAS_KEY, ventasIniciales);
}

export function saveVentas(ventas: VentaData[]) {
  localStorage.setItem(VENTAS_KEY, JSON.stringify(ventas));
}
