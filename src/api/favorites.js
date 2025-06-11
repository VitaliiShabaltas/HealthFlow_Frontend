import { API_URL } from './init';
import { getIdFromJWT, getJWT } from '../utils/jwt';

export const getFavorites = async () => {
  try {
    const clientId = getIdFromJWT();
    if (!clientId) return [];
    
    const response = await fetch(`${API_URL}/users/fav/${clientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getJWT()}`
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const addFavorite = async (doctorId) => {
  try {
    const clientId = getIdFromJWT();
    if (!clientId) throw new Error('User not authenticated');

    const response = await fetch(
      `${API_URL}/users/fav/add?clientId=${clientId}&doctorId=${doctorId}`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJWT()}`
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to add favorite');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (doctorId) => {
  try {
    const clientId = getIdFromJWT();
    if (!clientId) throw new Error('User not authenticated');

    const response = await fetch(
      `${API_URL}/users/fav/delete?clientId=${clientId}&doctorId=${doctorId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getJWT()}`
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
 
    return { success: true };
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};