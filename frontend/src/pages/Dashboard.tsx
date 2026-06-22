import { useEffect, useMemo, useState } from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { getMesas, getVentas } from '../data/controlTacoStore';
import type { VentaData } from '../data/controlTacoStore';
import './Dashboard.css';

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

export default function Dashboard() {
  const [ventas, setVentas] = useState<VentaData[]>([]);

  useEffect(() => {
    setVentas(getVentas());
  }, []);

  const ventasHoy = ventas.filter((venta) => new Date(venta.fecha).toDateString() === new Date().toDateString());
  const totalHoy = ventasHoy.reduce((acc, venta) => acc + venta.total, 0);
  const mesas = getMesas();

  const weeklyData = useMemo(() => {
    const hoy = new Date();
    const data = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(hoy);
      date.setDate(hoy.getDate() - (6 - index));
      const total = ventas
        .filter((venta) => new Date(venta.fecha).toDateString() === date.toDateString())
        .reduce((acc, venta) => acc + venta.total, 0);

      return {
        label: diasSemana[date.getDay()],
        total,
      };
    });

    const max = Math.max(...data.map((item) => item.total), 1);
    return data.map((item) => ({ ...item, height: Math.max((item.total / max) * 100, item.total > 0 ? 12 : 4) }));
  }, [ventas]);

  const stats = [
    { title: 'Ventas de Hoy', value: `$${totalHoy}.00`, icon: DollarSign, color: 'var(--success-color)' },
    { title: 'Ordenes', value: String(ventasHoy.length), icon: ShoppingBag, color: 'var(--primary-color)' },
    { title: 'Mesas', value: String(mesas.length), icon: Users, color: 'var(--warning-color)' },
    { title: 'Ticket Promedio', value: `$${ventasHoy.length ? Math.round(totalHoy / ventasHoy.length) : 0}.00`, icon: TrendingUp, color: 'var(--success-color)' },
  ];

  return (
    <div className="dashboard animate-fade-in">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="text-secondary">Resumen de actividad del restaurante</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card stat-card">
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h3>Ventas Semanales</h3>
          <div className="weekly-chart">
            {weeklyData.map((item) => (
              <div className="chart-column" key={item.label}>
                <div className="bar-wrap">
                  <div className="bar" style={{ height: `${item.height}%` }}>
                    <span>${item.total}</span>
                  </div>
                </div>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
