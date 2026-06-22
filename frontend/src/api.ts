const API_URL = 'http://localhost:5000/api';

export const getMesas = async () => {
  const response = await fetch(`${API_URL}/mesas`);
  if (!response.ok) throw new Error('Error al obtener mesas');
  return response.json();
};

export const abrirCuenta = async (mesaId: string) => {
  const response = await fetch(`${API_URL}/pedidos/cuenta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mesaId }),
  });
  if (!response.ok) throw new Error('Error al abrir cuenta');
  return response.json();
};

// Add more API calls here as needed
