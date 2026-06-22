import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { PackagePlus, Trash2 } from 'lucide-react';
import { getProductos, saveProductos } from '../data/controlTacoStore';
import type { ProductoData } from '../data/controlTacoStore';

export default function Inventario() {
  const [productos, setProductos] = useState<ProductoData[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('Tacos');

  useEffect(() => {
    setProductos(getProductos());
  }, []);

  const persistProductos = (nextProductos: ProductoData[]) => {
    setProductos(nextProductos);
    saveProductos(nextProductos);
  };

  const agregarProducto = (event: FormEvent) => {
    event.preventDefault();
    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (!nombre.trim() || !precioNumero || stockNumero < 0) return;

    persistProductos([
      ...productos,
      {
        id: `prod-${Date.now()}`,
        nombre: nombre.trim(),
        precio: precioNumero,
        stock: stockNumero,
        categoria: categoria.trim() || 'General',
      },
    ]);

    setNombre('');
    setPrecio('');
    setStock('');
    setCategoria('Tacos');
  };

  const eliminarProducto = (productoId: string) => {
    persistProductos(productos.filter((producto) => producto.id !== productoId));
  };

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Inventario</h1>
        <p className="text-secondary">Gestion de productos, precios y stock.</p>
      </header>

      <form className="card form-grid" onSubmit={agregarProducto}>
        <div>
          <label>Producto</label>
          <input className="input" value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Ej. Taco campechano" />
        </div>
        <div>
          <label>Precio</label>
          <input className="input" type="number" min="1" value={precio} onChange={(event) => setPrecio(event.target.value)} placeholder="35" />
        </div>
        <div>
          <label>Stock</label>
          <input className="input" type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} placeholder="50" />
        </div>
        <div>
          <label>Categoria</label>
          <input className="input" value={categoria} onChange={(event) => setCategoria(event.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">
          <PackagePlus size={16} />
          Agregar Producto
        </button>
      </form>

      <div className="card table-card">
        <h3>Lista de Productos</h3>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoria</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>${producto.precio}.00</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => eliminarProducto(producto.id)} aria-label={`Eliminar ${producto.nombre}`}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
