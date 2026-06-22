import { BrowserRouter, Navigate, Outlet, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Mesas from './pages/Mesas';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';

function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem('controltaco_session') === 'active';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="mesas" element={<Mesas />} />
            <Route path="inventario" element={<Inventario />} />
            <Route path="ventas" element={<Ventas />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
