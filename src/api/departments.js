import { API_URL } from './init';

export const getDepartments = async () => {
  try {
    const response = await fetch(`${API_URL}/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};