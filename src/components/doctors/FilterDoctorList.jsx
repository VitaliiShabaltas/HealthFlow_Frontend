import React, { useState, useEffect } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { getFavorites } from '../../api/favorites';
import TherapeuticDepartment from '../../assets/icons/TherapeuticDepartment.svg';
import PediatricDepartment from '../../assets/icons/PediatricDepartment.svg';
import DepartmentSpecialMedicine from '../../assets/icons/DepartmentSpecialMedicine.svg';
export function FilterDoctorList({ specializations, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    therapeutic: false,
    pediatric: false,
    specialized: false,
  });

  const [filters, setFilters] = useState({
    generalTherapy: false,
    gastroenterology: false,
    cardiology: false,
    neurology: false,
    endocrinology: false,
    familyMedicine: false,

    pediatrics: false,
    logopedics: false,
    psychology: false,

    urology: false,
    gynecology: false,
    orthopedics: false,
    dermatology: false,
    ophthalmology: false,
    otolaryngology: false,
    psychotherapy: false,
  });

  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);

  const filterToSpecId = {
    generalTherapy: 6,
    gastroenterology: 5,
    cardiology: 1,
    neurology: 9,
    endocrinology: 3,
    familyMedicine: 4,

    pediatrics: 13,
    logopedics: 8,
    psychology: 14,

    urology: 16,
    gynecology: 7,
    orthopedics: 11,
    dermatology: 2,
    ophthalmology: 10,
    otolaryngology: 12,
    psychotherapy: 15,
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await getFavorites();
        setFavoriteDoctors(favorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, [isHeartFilled]);

  const toggleHeart = async () => {
    const newHeartState = !isHeartFilled;
    setIsHeartFilled(newHeartState);

    if (newHeartState) {
      const favorites = await getFavorites();
      const favDoctorIds = favorites.map((fav) => fav.doctor_id);
      const activeFilterIds = Object.entries(filters)
        .filter(([_, isActive]) => isActive)
        .map(([filterName]) => filterToSpecId[filterName]);
      onFilterChange([...favDoctorIds, ...activeFilterIds]);
    } else {
      const activeFilterIds = Object.entries(filters)
        .filter(([_, isActive]) => isActive)
        .map(([filterName]) => filterToSpecId[filterName]);
      onFilterChange(activeFilterIds);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFilter = (filterName) => {
    const newFilters = {
      ...filters,
      [filterName]: !filters[filterName],
    };
    setFilters(newFilters);

    const activeFilterIds = Object.entries(newFilters)
      .filter(([_, isActive]) => isActive)
      .map(([filterName]) => filterToSpecId[filterName]);

    if (isHeartFilled) {
      const favDoctorIds = favoriteDoctors.map((fav) => fav.doctor_id);
      onFilterChange([...favDoctorIds, ...activeFilterIds]);
    } else {
      onFilterChange(activeFilterIds);
    }
  };

  return (
    <div className="w-72 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div
        className="flex items-center justify-between mb-5 cursor-pointer"
        onClick={toggleHeart}
      >
        <h3 className="text-lg font-semibold text-gray-800">Обрані лікарі</h3>
        <div className="focus:outline-none">
          <svg
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill={isHeartFilled ? '#FF0000' : 'none'}
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 transition-colors duration-200"
          >
            <path
              d="M26.05 5.76258C25.4116 5.12384 24.6535 4.61714 23.8192 4.27144C22.9849 3.92574 22.0906 3.7478 21.1875 3.7478C20.2844 3.7478 19.3902 3.92574 18.5558 4.27144C17.7215 4.61714 16.9635 5.12384 16.325 5.76258L15 7.08758L13.675 5.76258C12.3854 4.47297 10.6363 3.74847 8.81253 3.74847C6.98874 3.74847 5.23964 4.47297 3.95003 5.76258C2.66041 7.0522 1.93591 8.80129 1.93591 10.6251C1.93591 12.4489 2.66041 14.198 3.95003 15.4876L15 26.5376L26.05 15.4876C26.6888 14.8491 27.1955 14.0911 27.5412 13.2568C27.8869 12.4225 28.0648 11.5282 28.0648 10.6251C28.0648 9.72197 27.8869 8.82771 27.5412 7.99339C27.1955 7.15907 26.6888 6.40103 26.05 5.76258Z"
              stroke={isHeartFilled ? '#FF0000' : '#202020'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="mb-4">
        <button
          type="button"
          className="flex items-center justify-between cursor-pointer mb-2 w-full text-left"
          onClick={() => toggleSection('therapeutic')}
        >
          <div className="flex items-center">
            <img
              src={TherapeuticDepartment}
              alt="Therapeutic Department"
              className="w-5 h-5 mr-3"
            />
            <span className="font-medium text-gray-700">
              Терапевтичне відділення
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            {expandedSections.therapeutic ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.therapeutic && (
          <div className="space-y-2 pl-8">
            {[
              { id: 'generalTherapy', label: 'Загальна терапія' },
              { id: 'gastroenterology', label: 'Гастроентерологія' },
              { id: 'cardiology', label: 'Кардіологія' },
              { id: 'neurology', label: 'Неврологія' },
              { id: 'endocrinology', label: 'Ендокринологія' },
              { id: 'familyMedicine', label: 'Сімейна медицина' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className="flex items-center p-1 cursor-pointer hover:bg-gray-50 rounded w-full text-left"
                onClick={() => toggleFilter(item.id)}
              >
                <Checkbox checked={filters[item.id]} />
                <span className="text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          type="button"
          className="flex items-center justify-between cursor-pointer mb-2 w-full text-left"
          onClick={() => toggleSection('pediatric')}
        >
          <div className="flex items-center">
            <img
              src={PediatricDepartment}
              alt="Pediatric Department"
              className="w-5 h-5 mr-3"
            />
            <span className="font-medium text-gray-700">
              Педіатричне відділення
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            {expandedSections.pediatric ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.pediatric && (
          <div className="space-y-2 pl-8">
            {[
              { id: 'pediatrics', label: 'Педіатрія' },
              { id: 'logopedics', label: 'Логопедія' },
              { id: 'psychology', label: 'Психологія' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className="flex items-center p-1 cursor-pointer hover:bg-gray-50 rounded w-full text-left"
                onClick={() => toggleFilter(item.id)}
              >
                <Checkbox checked={filters[item.id]} />
                <span className="text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          className="flex items-center justify-between cursor-pointer mb-2 w-full text-left"
          onClick={() => toggleSection('specialized')}
        >
          <div className="flex items-center min-w-0">
            <img
              src={DepartmentSpecialMedicine}
              alt="Special Medicine Department"
              className="w-5 h-5 mr-3"
            />
            <span className="font-medium text-gray-700 truncate">
              Відділ спец. медицини
            </span>
          </div>
          <span className="text-gray-500 text-sm flex-shrink-0 ml-2">
            {expandedSections.specialized ? '▼' : '▶'}
          </span>
        </button>

        {expandedSections.specialized && (
          <div className="space-y-2 pl-8">
            {[
              { id: 'urology', label: 'Урологія' },
              { id: 'gynecology', label: 'Гінекологія' },
              { id: 'orthopedics', label: 'Ортопедія та травм.' },
              { id: 'dermatology', label: 'Дерматологія' },
              { id: 'ophthalmology', label: 'Офтальмологія' },
              { id: 'otolaryngology', label: 'Отоларингологія' },
              { id: 'psychotherapy', label: 'Психотерапія' },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className="flex items-center p-1 cursor-pointer hover:bg-gray-50 rounded w-full text-left"
                onClick={() => toggleFilter(item.id)}
              >
                <Checkbox checked={filters[item.id]} />
                <span className="text-gray-700 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
