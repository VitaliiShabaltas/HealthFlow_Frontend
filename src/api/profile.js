import { API_URL } from './init';

export async function getProfile(id, token) {
  if (!token) throw new Error('Токен отсутствует');

  const response = await fetch(`${API_URL}/users/profile/${id}`, {
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
export async function updateProfile(id, token, updatedData) {
  if (!token) throw new Error('Токен відсутній');

  const response = await fetch(`${API_URL}/users/profile/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error(`Помилка збереження: ${response.status}`);
  }

  return await response.json();
}
