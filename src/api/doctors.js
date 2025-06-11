import { API_URL } from './init';

export const getDoctors = async () => {
  try {
    const response = await fetch(`${API_URL}/users/doctors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getDoctorSpecialization = async (specializationId) => {
  try {
    const response = await fetch(
      `${API_URL}/users/doctors/specialization/${specializationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch specialization with id ${specializationId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching specialization with id ${specializationId}:`,
      error
    );
    throw error;
  }
};

export const getDepartmentSpecializations = async (departmentId) => {
  try {
    const response = await fetch(
      `${API_URL}/departments/${departmentId}/specializations`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch specializations for department ${departmentId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching specializations for department ${departmentId}:`,
      error
    );
    throw error;
  }
};

export const getDoctorById = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/users/doctors/${doctorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch specializations for department ${departmentId}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching specializations for department ${departmentId}:`,
      error
    );
    throw error;
  }
};

export const deleteDoctor = async (doctorId) => {
  try {
    const response = await fetch(`${API_URL}/users/doctors/${doctorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Помилка видалення: ${text || response.statusText}`);
    }
  } catch (error) {
    console.error('Помилка при видаленні лікаря:', error);
    throw error;
  }
};
export const getSpecializationLabel = (specializations, specializationId) => {
  if (!specializations || !specializationId) {
    return 'Спеціальність не вказана';
  }

  const foundSpec = specializations.find(
    (spec) => spec.id === specializationId
  );
  return foundSpec ? foundSpec.label : 'Спеціальність не вказана';
};
