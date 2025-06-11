import { getJWT } from '../utils/jwt';
import { API_URL } from './init';

export const createAppointment = async (appointmentData) => {
  try {
    const token = localStorage.getItem('jwt-token');
    const response = await fetch(`${API_URL}/appointments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        client_id: appointmentData.client_id,
        doctor_id: appointmentData.doctor_id,
        appointment_date: appointmentData.appointment_date,
        start_time: appointmentData.start_time,
        price: appointmentData.price,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create appointment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

export async function getAppointments() {
  const token = getJWT();

  const response = await fetch(`${API_URL}/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Не вдалося отримати дані про прийоми');
  }

  return await response.json();
}
export const deleteAppointment = async (id) => {
  const token = getJWT();

  const res = await fetch(`${API_URL}/appointments/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Помилка видалення:', text);
    throw new Error('Не вдалося видалити запис');
  }

  return;
};
export const getDoctors = async () => {
  const res = await fetch(`${API_URL}/users/doctors`);
  if (!res.ok) throw new Error('Не вдалося отримати лікарів');
  return res.json();
};

export const getTimeTableByDoctorAndDate = async (doctorId, date) => {
  const res = await fetch(
    `${API_URL}/timetable?doctorId=${doctorId}&date=${date}`
  );
  if (!res.ok) throw new Error('Не вдалося отримати розклад');
  return res.json();
};

export const deleteTimeTableEntry = async (timeTableId) => {
  const res = await fetch(`${API_URL}/timetable/delete/${timeTableId}`, {
    method: 'DELETE',
    headers: {
      accept: '*/*',
    },
  });

  if (!res.ok) {
    throw new Error('Не вдалося видалити запис розкладу');
  }
};

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

export const getFilteredAppointments = async (filters = {}) => {
  try {
    const token = getJWT();
    const queryParams = new URLSearchParams();

    if (filters.doctor_id) queryParams.append('doctor_id', filters.doctor_id);
    if (filters.specialization_id)
      queryParams.append('specialization_id', filters.specialization_id);
    if (filters.department_id)
      queryParams.append('department_id', filters.department_id);
    if (filters.start_date)
      queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    if (filters.status) queryParams.append('status', filters.status);

    const response = await fetch(
      `${API_URL}/appointments/filter?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch filtered appointments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching filtered appointments:', error);
    throw error;
  }
};

export const getAppointmentsStats = async (filters = {}) => {
  try {
    const token = getJWT();
    const queryParams = new URLSearchParams();

    if (filters.doctor_id) queryParams.append('doctor_id', filters.doctor_id);
    if (filters.specialization_id)
      queryParams.append('specialization_id', filters.specialization_id);
    if (filters.department_id)
      queryParams.append('department_id', filters.department_id);
    if (filters.start_date)
      queryParams.append('start_date', filters.start_date);
    if (filters.end_date) queryParams.append('end_date', filters.end_date);
    if (filters.status) queryParams.append('status', filters.status);

    const response = await fetch(
      `${API_URL}/appointments/stats?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch appointments statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching appointments statistics:', error);
    throw error;
  }
};

export const formatDoctorName = (doctor) => {
  if (!doctor || !doctor.user) return 'Лікар не вказаний';
  return `${doctor.user.surname} ${doctor.user.name}`;
};

export const getDoctorIdByName = (doctors, fullName) => {
  if (!fullName || fullName === 'Лікар') return null;

  const doctor = doctors.find((d) => {
    const doctorFullName = `${d.user.surname} ${d.user.name}`;
    return doctorFullName === fullName;
  });

  return doctor ? doctor.doctor_id : null;
};
