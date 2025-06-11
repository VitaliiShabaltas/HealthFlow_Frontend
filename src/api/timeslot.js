import { API_URL } from './init';

export const getDoctorTimetable = async (doctorId, date) => {
  try {
    const response = await fetch(`${API_URL}/timetable?doctorId=${doctorId}&date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch timetable');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching timetable:', error);
    throw error;
  }
};