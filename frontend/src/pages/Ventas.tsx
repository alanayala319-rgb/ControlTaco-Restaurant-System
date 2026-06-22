import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { getVentas, saveVentas } from '../data/controlTacoStore';
import type { VentaData } from '../data/controlTacoStore';

export default function Ventas() {
  const [ventas, setVentas] = useState<VentaData[]>([]);
  const [mesaNumero, setMesaNumero] = useState('');
  const [total, setTotal] = useState('');
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia'>('Efectivo');

  useEffect(() => {
    setVentas(getVentas());
  }, []);

  const persistVentas = (nextVentas: VentaData[]) => {
    setVentas(nextVentas);
    saveVentas(nextVentas);
  };

  const agregarVenta = (event: FormEvent) => {
    event.preventDefault();
    const mesa = Number(mesaNumero);
    const monto = Number(total);
    if (!mesa || !monto) return;

    const nuevaVenta: VentaData = {
      id: `venta-${Date.now()}`,
      mesaNumero: mesa,
      total: monto,
      metodoPago,
      fecha: new Date().toISOString(),
      productos: [{ nombre: 'Venta manual', cantidad: 1, subtotal: monto }],
    };

    persistVentas([nuevaVenta, ...ventas]);
    setMesaNumero('');
    setTotal('');
    setMetodoPago('Efectivo');
  };

  const eliminarVenta = (ventaId: string) => {
    persistVentas(ventas.filter((venta) => venta.id !== ventaId));
  };

  const exportarCsv = () => {
    const rows = [
      ['Fecha', 'Mesa', 'Metodo', 'Total'],
      ...ventas.map((venta) => [
        new Date(venta.fecha).toLocaleString(),
        `Mesa ${venta.mesaNumero}`,
        venta.metodoPago,
        `$${venta.total}.00`,
      ]),
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ventas-controltaco.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalVendido = ventas.reduce((acc, venta) => acc + venta.total, 0);

  return (
    <div className="animate-fade-in">
      <header className="page-header">
        <h1>Ventas y Reportes</h1>
        <p className="text-secondary">Historial de transacciones y registro manual.</p>
      </header>

      <form className="card form-grid" onSubmit={agregarVenta}>
        <div>
          <label>Mesa</label>
          <input className="input" type="number" min="1" value={mesaNumero} onChange={(event) => setMesaNumero(event.target.value)} />
        </div>
        <div>
          <label>Total</label>
          <input className="input" type="number" min="1" value={total} onChange={(event) => setTotal(event.target.value)} />
        </div>
        <div>
          <label>Metodo</label>
          <select className="input" value={metodoPago} onChange={(event) => setMetodoPago(event.target.value as typeof metodoPago)}>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Transferencia</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          <Plus size={16} />
          Registrar Venta
        </button>
      </form>

      <div className="card table-card">
        <div className="section-title">
          <div>
            <h3>Transacciones Recientes</h3>
            <p className="text-secondary">Total vendido: ${totalVendido}.00</p>
          </div>
          <button className="btn btn-primary" onClick={exportarCsv}>
            <Receipt size={16} />
            Exportar Reporte
          </button>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Mesa</th>
                <th>Metodo</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{new Date(venta.fecha).toLocaleString()}</td>
                  <td>Mesa {venta.mesaNumero}</td>
                  <td>{venta.metodoPago}</td>
                  <td>${venta.total}.00</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => eliminarVenta(venta.id)} aria-label="Eliminar venta">
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
