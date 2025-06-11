import { jwtDecode } from 'jwt-decode';

export function getIdFromJWT() {
  const token = getJWT();
  if (!token) return null;
  const id = jwtDecode(token).sub;
  if (id) {
    return id;
  } else {
    throw new Error("sub doesn't exists in jwt payload");
  }
}

export function getJWT() {
  return localStorage.getItem('jwt-token');
}
export function getRoleFromJWT() {
  const token = getJWT();
  if (!token) return null;
  const role = jwtDecode(token).role;
  if (role) {
    return role;
  } else {
    throw new Error("role doesn't exist in jwt payload");
  }
}
