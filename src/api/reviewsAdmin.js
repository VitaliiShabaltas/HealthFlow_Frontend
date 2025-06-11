import { API_URL } from './init';

export const getAllReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/reviews?is_approved=false&include=doctor.user,doctor.department,doctor.specialization,client`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/${reviewId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to approve review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error approving review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_URL}/reviews/delete/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const fetchDoctorsData = async () => {
  try {
    const response = await fetch(
      `${API_URL}/users/doctors?include=user,department,specialization`
    );
    if (!response.ok) throw new Error('Failed to fetch doctors');
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const getDepartmentSpecializations = async (departmentId) => {
  try {
    const response = await fetch(`${API_URL}/departments/${departmentId}/specializations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch specializations for department ${departmentId}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching specializations for department ${departmentId}:`, error);
    throw error;
  }
};