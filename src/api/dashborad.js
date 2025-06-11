import { API_URL } from './init';

export async function getDashboard(token) {
  const role = localStorage.getItem('userRole');

  if (!token) throw new Error('Токен отсутствует');

  let endpoint;
  switch (role) {
    case 'doctor':
      endpoint = '/doctor-dashboard';
      break;
    case 'manager':
      endpoint = '/manager-dashboard';
      break;
    case 'moderator':
      endpoint = '/moderator-dashboard';
      break;
    default:
      break;
  }

  const response = await fetch(`${API_URL}/users${endpoint}}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  return await response.json();
}
