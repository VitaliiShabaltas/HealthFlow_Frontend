import axios from 'axios';
import { API_URL } from '../api/init';

export const fetchDoctorsWithSpecializations = async () => {
  try {
    const doctorsResponse = await axios.get(`${API_URL}/users/doctors`);
    const doctors = doctorsResponse.data;

    const doctorsWithSpecializations = await Promise.all(
      doctors.map(async (doctor) => {
        try {
          const specResponse = await axios.get(
            `${API_URL}/departments/${doctor.department_id}/specializations`
          );
          const specialization = specResponse.data.find(
            (spec) => spec.department_id === doctor.department_id
          );
          return {
            ...doctor,
            specialization: specialization?.label || 'Невідома спеціальність'
          };
        } catch (error) {
          console.error(`Error fetching specialization for doctor ${doctor.doctor_id}:`, error);
          return {
            ...doctor,
            specialization: 'Невідома спеціальність'
          };
        }
      })
    );

    return doctorsWithSpecializations;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const fetchAllAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};