import { API_URL } from './init';

export const getReviewsByDoctor = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/reviews?doctorId=${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();
    return data.filter((review) => review.is_approved);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};
