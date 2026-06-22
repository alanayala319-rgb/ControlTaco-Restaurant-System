import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Package, Receipt, LogOut } from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/mesas', label: 'Mesas', icon: UtensilsCrossed },
    { path: '/inventario', label: 'Inventario', icon: Package },
    { path: '/ventas', label: 'Ventas', icon: Receipt },
  ];

  const handleLogout = () => {
    localStorage.removeItem('controltaco_session');
    navigate('/login', { replace: true });
    window.location.assign('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <UtensilsCrossed className="logo" />
          <h2>ControlTaco</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="btn nav-item text-danger" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
