import { useState, useEffect } from 'react';
import { API_URL } from './init';

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch(`${API_URL}/departments`);
        if (!res.ok) throw new Error('Не вдалося завантажити відділення');
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error(err);
        setError('Помилка при завантаженні відділень');
      }
    }
    fetchDepartments();
  }, []);

  return { departments, error };
}

export function useSpecialties(departmentId) {
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSpecialties() {
      if (!departmentId) {
        setSpecialties([]);
        return;
      }
      try {
        const res = await fetch(
          `${API_URL}/departments/${departmentId}/specializations`
        );
        if (!res.ok) throw new Error('Не вдалося завантажити спеціальності');
        const data = await res.json();
        setSpecialties(data);
      } catch (err) {
        console.error(err);
        setError('Помилка при завантаженні спеціальностей');
      }
    }
    fetchSpecialties();
  }, [departmentId]);

  return { specialties, error };
}

export function useDoctors(specialtyId) {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      if (!specialtyId) {
        setDoctors([]);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/users/doctors`);

        teredDoctors = data.filter(
          (doctor) => String(doctor.specialization_id) === String(specialtyId)
        );
        setDoctors(filteredDoctors);
      } catch (err) {
        console.error(err);
        setError('Помилка при завантаженні лікарів');
      }
    }
    fetchDoctors();
  }, [specialtyId]);

  return { doctors, error };
}
