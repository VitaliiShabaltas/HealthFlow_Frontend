export const API_URL =
  'https://healthflowbackend-production-0199.up.railway.app';
export function authFetch(input, init = {}) {
  const token = localStorage.getItem('jwt-token');
  return fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
}
