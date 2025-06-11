import React, { useState, useEffect } from 'react';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { FilterDoctorList } from '../components/doctors/FilterDoctorList';
import { getDoctors, getDepartmentSpecializations } from '../api/doctors';
import { getFavorites } from '../api/favorites';

export function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await getDoctors();

        const departmentIds = [
          ...new Set(doctorsData.map((d) => d.department_id)),
        ];

        const allSpecs = [];
        for (const departmentId of departmentIds) {
          const specs = await getDepartmentSpecializations(departmentId);
          allSpecs.push(...specs);
        }

        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setSpecializations(allSpecs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

useEffect(() => {
  if (activeFilters.length === 0) {
    setFilteredDoctors(doctors);
  } else {
    const isDoctorId = (id) => doctors.some((d) => d.doctor_id === id);

    const doctorIds = activeFilters.filter((id) => isDoctorId(id));
    const specIds = activeFilters.filter((id) => !isDoctorId(id));

    let filtered = doctors;

    if (doctorIds.length > 0) {
      filtered = filtered.filter((doctor) =>
        doctorIds.includes(doctor.doctor_id)
      );
    }

    if (specIds.length > 0) {
      filtered = filtered.filter((doctor) =>
        specIds.includes(doctor.specialization_id)
      );
    }

    setFilteredDoctors(filtered);
  }
}, [activeFilters, doctors]);

  const updateFavorites = async () => {
    try {
      const favorites = await getFavorites();
      setFavoriteDoctors(favorites);
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-210 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error)
    return (
      <div className="text-center py-10 text-red-500">Помилка: {error}</div>
    );

  return (
    <div className="bg-[#f8f9f9] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Наші лікарі</h1>

        <div className="flex gap-6">
          <div className="w-1/4">
            <FilterDoctorList
              specializations={specializations}
              onFilterChange={setActiveFilters}
              updateFavorites={updateFavorites}
            />
          </div>

          <div className="w-3/4 space-y-8">
            {filteredDoctors.length === 0 ? (
              <p className="text-center py-10">
                Лікарів за обраними фільтрами не знайдено
              </p>
            ) : (
              filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctor_id}
                  doctor={doctor}
                  specializations={specializations}
                  updateFavorites={updateFavorites}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}