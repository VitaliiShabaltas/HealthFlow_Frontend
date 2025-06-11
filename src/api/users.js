import { API_URL } from './init';

export async function getAllClients(token) {
  if (!token) throw new Error('Токен відсутній');

  const response = await fetch(`${API_URL}/users/clients`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Помилка завантаження клієнтів: ${response.status}`);
  }

  return await response.json();
}
