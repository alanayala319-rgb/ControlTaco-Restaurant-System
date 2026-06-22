import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2, Utensils, X } from 'lucide-react';
import {
  getMesas,
  getProductos,
  getVentas,
  saveMesas,
  saveProductos,
  saveVentas,
} from '../data/controlTacoStore';
import type { MesaData, ProductoData } from '../data/controlTacoStore';
import './Mesas.css';

export default function Mesas() {
  const [mesas, setMesas] = useState<MesaData[]>([]);
  const [productos, setProductos] = useState<ProductoData[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<MesaData | null>(null);
  const [pedido, setPedido] = useState<{ producto: ProductoData; cantidad: number }[]>([]);
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('4');
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');

  useEffect(() => {
    setMesas(getMesas());
    setProductos(getProductos());
  }, []);

  const persistMesas = (nextMesas: MesaData[]) => {
    setMesas(nextMesas);
    saveMesas(nextMesas);
  };

  const persistProductos = (nextProductos: ProductoData[]) => {
    setProductos(nextProductos);
    saveProductos(nextProductos);
  };

  const getStatusColor = (estado: MesaData['estado']) => {
    switch (estado) {
      case 'Disponible':
        return 'var(--success-color)';
      case 'Ocupada':
        return 'var(--danger-color)';
      case 'Reservada':
        return 'var(--warning-color)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const crearMesa = (event: FormEvent) => {
    event.preventDefault();
    const mesaNumero = Number(numero);
    const mesaCapacidad = Number(capacidad);

    if (!mesaNumero || !mesaCapacidad) return;
    if (mesas.some((mesa) => mesa.numero === mesaNumero)) {
      alert('Ya existe una mesa con ese numero.');
      return;
    }

    const nuevaMesa: MesaData = {
      _id: `mesa-${Date.now()}`,
      numero: mesaNumero,
      capacidad: mesaCapacidad,
      estado: 'Disponible',
    };

    persistMesas([...mesas, nuevaMesa].sort((a, b) => a.numero - b.numero));
    setNumero('');
    setCapacidad('4');
  };

  const eliminarMesa = (mesaId: string) => {
    persistMesas(mesas.filter((mesa) => mesa._id !== mesaId));
  };

  const cambiarEstado = (mesaId: string, estado: MesaData['estado']) => {
    persistMesas(mesas.map((mesa) => (mesa._id === mesaId ? { ...mesa, estado } : mesa)));
  };

  const abrirModalPedido = (mesa: MesaData) => {
    setMesaSeleccionada(mesa);
    setPedido([]);
    setMetodoPago('Efectivo');
    setModalAbierto(true);
  };

  const agregarProducto = (producto: ProductoData) => {
    if (producto.stock <= 0) return;

    setPedido((prev) => {
      const cantidadActual = prev.find((p) => p.producto.id === producto.id)?.cantidad ?? 0;
      if (cantidadActual >= producto.stock) return prev;

      const existe = prev.find((p) => p.producto.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.producto.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
        );
      }

      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const totalPedido = pedido.reduce(
    (acc, curr) => acc + curr.producto.precio * curr.cantidad,
    0,
  );

  const cobrarPedido = () => {
    if (!mesaSeleccionada || pedido.length === 0) return;

    const productosActualizados = productos.map((producto) => {
      const itemPedido = pedido.find((item) => item.producto.id === producto.id);
      return itemPedido ? { ...producto, stock: producto.stock - itemPedido.cantidad } : producto;
    });

    const nuevaVenta = {
      id: `venta-${Date.now()}`,
      mesaNumero: mesaSeleccionada.numero,
      total: totalPedido,
      metodoPago,
      fecha: new Date().toISOString(),
      productos: pedido.map((item) => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        subtotal: item.producto.precio * item.cantidad,
      })),
    };

    persistProductos(productosActualizados);
    saveVentas([nuevaVenta, ...getVentas()]);
    cambiarEstado(mesaSeleccionada._id, 'Disponible');
    setModalAbierto(false);
    alert(`Venta registrada por $${totalPedido}.00`);
  };

  return (
    <div className="mesas-page animate-fade-in">
      <header className="page-header">
        <h1>Gestion de Mesas y Pedidos</h1>
        <p className="text-secondary">Crea mesas, cambia estados y cobra pedidos.</p>
      </header>

      <form className="card mesa-form" onSubmit={crearMesa}>
        <div>
          <label>Numero</label>
          <input className="input" type="number" min="1" value={numero} onChange={(event) => setNumero(event.target.value)} />
        </div>
        <div>
          <label>Capacidad</label>
          <input className="input" type="number" min="1" value={capacidad} onChange={(event) => setCapacidad(event.target.value)} />
        </div>
        <button className="btn btn-primary" type="submit">
          <Plus size={16} />
          Crear Mesa
        </button>
      </form>

      <div className="mesas-leyenda">
        <div className="leyenda-item"><span className="dot" style={{ backgroundColor: 'var(--success-color)' }}></span> Disponible</div>
        <div className="leyenda-item"><span className="dot" style={{ backgroundColor: 'var(--danger-color)' }}></span> Ocupada</div>
        <div className="leyenda-item"><span className="dot" style={{ backgroundColor: 'var(--warning-color)' }}></span> Reservada</div>
      </div>

      <div className="mesas-grid">
        {mesas.map((mesa) => (
          <div key={mesa._id} className="mesa-card card" style={{ borderTop: `4px solid ${getStatusColor(mesa.estado)}` }}>
            <div className="mesa-header">
              <h2>Mesa {mesa.numero}</h2>
              <span className="badge" style={{ backgroundColor: `${getStatusColor(mesa.estado)}20`, color: getStatusColor(mesa.estado) }}>
                {mesa.estado}
              </span>
            </div>

            <div className="mesa-body">
              <div className="mesa-info">
                <Utensils size={16} />
                <span>Capacidad: {mesa.capacidad} pax</span>
              </div>
              <select className="input" value={mesa.estado} onChange={(event) => cambiarEstado(mesa._id, event.target.value as MesaData['estado'])}>
                <option>Disponible</option>
                <option>Ocupada</option>
                <option>Reservada</option>
              </select>
            </div>

            <div className="mesa-footer mesa-actions">
              <button className="btn btn-primary" onClick={() => abrirModalPedido(mesa)}>
                Tomar / Cobrar Pedido
              </button>
              <button className="btn btn-danger" onClick={() => eliminarMesa(mesa._id)} aria-label={`Eliminar mesa ${mesa.numero}`}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && mesaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2>Pedido - Mesa {mesaSeleccionada.numero}</h2>
              <button className="btn-close" onClick={() => setModalAbierto(false)} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body order-modal">
              <div>
                <h3>Productos</h3>
                <div className="product-list">
                  {productos.map((prod) => (
                    <div key={prod.id} className="product-row">
                      <div>
                        <strong>{prod.nombre}</strong>
                        <span className="text-secondary">${prod.precio}.00 - Stock {prod.stock}</span>
                      </div>
                      <button className="btn btn-primary" disabled={prod.stock <= 0} onClick={() => agregarProducto(prod)} aria-label={`Agregar ${prod.nombre}`}>
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="account-panel">
                <h3>Cuenta Actual</h3>
                {pedido.length === 0 ? (
                  <p className="text-secondary">La cuenta esta vacia.</p>
                ) : (
                  <ul className="order-summary">
                    {pedido.map((item) => (
                      <li key={item.producto.id}>
                        <span>{item.cantidad}x {item.producto.nombre}</span>
                        <strong>${item.producto.precio * item.cantidad}.00</strong>
                      </li>
                    ))}
                    <li className="order-total">
                      <strong>Total:</strong>
                      <strong>${totalPedido}.00</strong>
                    </li>
                  </ul>
                )}
                <label>Metodo de pago</label>
                <select className="input" value={metodoPago} onChange={(event) => setMetodoPago(event.target.value as typeof metodoPago)}>
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn" style={{ border: '1px solid var(--border-color)' }} onClick={() => setModalAbierto(false)}>Cancelar</button>
              <button className="btn btn-primary" disabled={pedido.length === 0} onClick={cobrarPedido}>
                Cobrar y Registrar Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
