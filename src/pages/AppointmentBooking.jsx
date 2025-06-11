import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import backIcon from '../assets/icons/backNav.svg';
import ratingIcon from '../assets/icons/rating.svg';
import img1 from '../assets/SelectCard1.png';
import img2 from '../assets/SelectCard2.png';
import img3 from '../assets/SelectCard3.png';
import { AppointmentCompleted } from '../components/appointments/AppointmentCompleted';
import { DoctorAppointmentCard } from '../components/appointments/DoctorAppointmentCard';
import { FilterDoctorAppointment } from '../components/appointments/FilterDoctorAppointment';
import { TimeSlotsOnAppointment } from '../components/appointments/TimeSlotsOnAppointment';
import { RecsForAppointment } from '../components/shared/RecsForAppointment';
import { CalendarOnAppointment } from '../components/ui/CalendarOnAppointment';
import { SelectCard } from '../components/ui/SelectCard';
import { getDepartments } from '../api/departments';
import { getDepartmentSpecializations, getDoctors } from '../api/doctors';
import { createAppointment } from '../api/appointments';
import { AppointmentDetails } from '../components/appointments/AppointmentDetails';
import { getIdFromJWT } from '../utils/jwt';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites';
import { useLocation } from 'react-router-dom';

export function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [favoriteDoctors, setFavoriteDoctors] = useState([]);

  const location = useLocation();
  const { } = location.state || {};

  const steps = [
    { id: 1, title: 'Перший крок', description: 'Вибір відділення' },
    { id: 2, title: 'Другий крок', description: 'Вибір послуги' },
    { id: 3, title: 'Третій крок', description: 'Вибір лікаря' },
    { id: 4, title: 'Четвертий крок', description: 'Вибір часу' },
    { id: 5, title: "П'ятий крок", description: 'Підтвердження даних' },
    { id: 6, title: 'Шостий крок', description: 'Запис завершено' },
  ];

  const recommendations = [
    'Любов лікує серце, але тиск перевіряй сам!',
    'Кава – це прекрасно, але твій пульс може думати інакше!',
    'Не тримай зла – це підвищує тиск!',
    "Сміх знижує рівень кортизолу - смійся на здоров'я!",
    '8 годин сну - найкращий косметолог та лікар!',
    'Вода - це життя, випивай свою денну норму!',
    "Ходьба 30 хвилин на день - простий шлях до здоров'я!",
    'Фрукти та овочі - природні вітаміни для твого організму!',
    'Глибокі вдихи допомагають зняти стрес - спробуй прямо зараз!',
    'Профілактика краще за лікування - не забувай про регулярні огляди!',
  ];

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const updateFavorites = async () => {
    try {
      const favorites = await getFavorites();
      setFavoriteDoctors(favorites.map((fav) => fav.doctor_id));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  useEffect(() => {
    updateFavorites();
  }, []);

  useEffect(() => {
    if (!selectedBranch) return;

    const fetchSpecializations = async () => {
      setIsLoading(true);
      try {
        const data = await getDepartmentSpecializations(selectedBranch.id);
        setSpecializations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecializations();
  }, [selectedBranch]);

  useEffect(() => {
    if (!selectedService) return;

    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const allDoctors = await getDoctors();
        const filteredDoctors = allDoctors
          .filter((doctor) => doctor.specialization_id === selectedService.id)
          .map((doctor) => ({
            id: doctor.doctor_id,
            name: formatDoctorName(
              doctor.user.surname,
              doctor.user.name,
              doctor.user.middlename
            ),
            specialty: selectedService.label,
            rating: doctor.rating,
            specialization_id: doctor.specialization_id,
            consultation_price: doctor.consultation_price,
          }));

        setDoctors(filteredDoctors);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedService]);

  const getRandomRecommendations = (allRecs, count) => {
    const shuffled = [...allRecs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleConfirmAppointment = async () => {
    setIsCreatingAppointment(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const client_id = getIdFromJWT();

      const appointmentData = {
        client_id,
        doctor_id: selectedDoctor.id,
        appointment_date: formattedDate,
        start_time: selectedTime,
        price: selectedDoctor.consultation_price,
      };

      const response = await createAppointment(appointmentData);
      setAppointmentId(response.appointment_id);
      setStep(6);
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setStep(2);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(3);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(4);
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedBranch(null);
    } else if (step === 3) {
      setSelectedService(null);
    } else if (step === 4) {
      setSelectedDoctor(null);
    }
    setStep(step - 1);
  };

  const formatDoctorName = (surname, name, middlename) => {
    const firstInitial = name ? `${name.charAt(0)}.` : '';
    const middleInitial = middlename ? `${middlename.charAt(0)}.` : '';
    return `${surname} ${firstInitial}${middleInitial}`;
  };

  const filteredDoctors = doctors
    .filter((doctor) => {
      const matchesSearch = doctor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const isFavorite = showFavorites
        ? favoriteDoctors.includes(doctor.id)
        : true;

      return matchesSearch && isFavorite;
    })
    .sort((a, b) => {
      if (sortByRating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });

  if (isLoading) {
    return (
      <div className="min-h-210 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-210 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="text-red-600">Помилка завантаження даних: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-210 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="flex justify-between">
              {steps.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col items-center ${
                    step >= item.id ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                    ${
                      step >= item.id ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {item.id}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 w-full bg-gray-200 h-1 rounded-full">
              <div
                className="bg-blue-600 h-1 rounded-full"
                style={{ width: `${(step / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {step === 1 && (
              <>
                <h2 className="text-xl font-bold mb-8 text-center">
                  Оберіть відділення
                </h2>
                <div className="flex justify-center gap-8 mb-8">
                  {departments.slice(0, 2).map((department) => (
                    <SelectCard
                      key={department.id}
                      name={department.name}
                      image={department.id === 1 ? img1 : img2}
                      selected={selectedBranch?.id === department.id}
                      onClick={() => handleBranchSelect(department)}
                    />
                  ))}
                </div>
                <div className="flex justify-center">
                  {departments[2] && (
                    <SelectCard
                      key={departments[2].id}
                      name={departments[2].name}
                      image={img3}
                      selected={selectedBranch?.id === departments[2].id}
                      onClick={() => handleBranchSelect(departments[2])}
                    />
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex items-center mb-6">
                  <img
                    src={backIcon}
                    alt="Назад"
                    className="w-6 h-6 cursor-pointer mr-2"
                    onClick={handleBack}
                  />
                  <h2 className="text-xl font-bold">Оберіть послугу</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  {specializations.map((service) => (
                    <div
                      key={service.id}
                      className="w-full sm:w-[47%] lg:w-[30%]"
                    >
                      <SelectCard
                        name={service.label}
                        selected={selectedService?.id === service.id}
                        onClick={() => handleServiceSelect(service)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                  <div className="flex items-center mb-6">
                    <img
                      src={backIcon}
                      alt="Назад"
                      className="w-6 h-6 cursor-pointer mr-2"
                      onClick={handleBack}
                    />
                    <h2 className="text-xl font-bold">Оберіть лікаря</h2>
                  </div>
                  <FilterDoctorAppointment
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    showFavorites={showFavorites}
                    onToggleFavorites={() => setShowFavorites(!showFavorites)}
                    sortByRating={sortByRating}
                    onToggleRating={() => setSortByRating(!sortByRating)}
                    ratingIcon={ratingIcon}
                  />
                </div>
                <div className="lg:w-3/4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDoctors.map((doctor) => (
                      <DoctorAppointmentCard
                        key={doctor.id}
                        doctor={doctor}
                        onSelect={handleDoctorSelect}
                        isInitiallyFavorite={favoriteDoctors.includes(
                          doctor.id
                        )}
                        updateFavorites={updateFavorites}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img
                      src={backIcon}
                      alt="Назад"
                      className="w-6 h-6 cursor-pointer mr-2"
                      onClick={handleBack}
                    />
                    <h2 className="text-xl font-bold">Оберіть час</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      <span className="font-medium">Лікар:</span>{' '}
                      {selectedDoctor?.name}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Спеціальність:</span>{' '}
                      {selectedDoctor?.specialty}
                    </p>
                  </div>
                </div>

                <CalendarOnAppointment
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    if (!date) setSelectedTime(null);
                  }}
                />

                {selectedDate && (
                  <TimeSlotsOnAppointment
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                    selectedDate={selectedDate}
                    doctorId={selectedDoctor?.id}
                  />
                )}

                {selectedDate && selectedTime && (
                  <div className="mt-8">
                    <button
                      onClick={() => setStep(5)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      Продовжити
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 max-w-2xl mx-auto">
                  <AppointmentDetails
                    branch={selectedBranch}
                    service={selectedService}
                    doctor={selectedDoctor}
                    date={selectedDate}
                    time={selectedTime}
                    onBack={() => setStep(4)}
                    onConfirm={handleConfirmAppointment}
                    isLoading={isCreatingAppointment}
                  />
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="flex-1">
                <AppointmentCompleted appointmentId={appointmentId} />
              </div>
            )}
          </div>

          {step !== 3 && step !== 6 && (
            <div className="lg:w-80">
              <RecsForAppointment
                recommendations={getRandomRecommendations(recommendations, 3)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
