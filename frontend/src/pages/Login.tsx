import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('controltaco_session', 'active');
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card card animate-fade-in">
        <div className="login-header">
          <ChefHat size={48} className="logo-icon" />
          <h1>ControlTaco</h1>
          <p>Inicia sesión para gestionar el restaurante</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              className="input" 
              placeholder="admin@controltaco.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
