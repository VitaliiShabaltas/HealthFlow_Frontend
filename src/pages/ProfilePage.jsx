import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/profile';
import { UserProfile } from '../components/patients/UserProfile';
import { DoctorProfile } from '../components/doctors/DoctorProfile';
import { Button } from '../components/ui/Button';
import { PopupChat } from '../components/ui/Pop-upChat';
import { getIdFromJWT, getJWT } from '../utils/jwt';
import { AdminPanelPage } from './AdminPanelPage';
import { getDoctorById, getDepartmentSpecializations } from '../api/doctors';
import { getAppointments } from '../api/appointments';
import { API_URL } from '../api/init';

export function ProfilePage({ handleLogout }) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isClient, setIsClient] = useState(true);

  async function fetchProfile() {
    try {
      const id = getIdFromJWT();
      const token = getJWT();

      const baseData = await getProfile(id, token);
      let fullData = baseData;

      if (baseData.role === 'doctor') {
        const doctorData = await getDoctorById(baseData.user_id);

        let specializationName = null;
        if (doctorData.specialization_id && doctorData.department_id) {
          const specializations = await getDepartmentSpecializations(
            doctorData.department_id
          );
          const foundSpec = specializations.find(
            (spec) => spec.id === doctorData.specialization_id
          );
          specializationName = foundSpec ? foundSpec.label : null;
        }
        fullData = {
          ...doctorData.user,
          ...doctorData,
          room: doctorData.cabinet,
          specialization: specializationName,
          rating: doctorData.rating,
          experienceStartDate: doctorData.experience_years,
        };
        localStorage.setItem('doctorId', doctorData.doctor_id);
      }
      if (baseData.role === 'client') {
        const appointments = await getAppointments(token);
        const doctorResponse = await fetch(`${API_URL}/users/doctors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allDoctors = await doctorResponse.json();
        const doctorMap = new Map();
        allDoctors.forEach((d) => doctorMap.set(d.doctor_id, d));

        const scheduledDoctors = appointments
          .filter(
            (appointment) =>
              appointment.status === 'scheduled' &&
              appointment.client_id === baseData.user_id
          )
          .map((appointment) => {
            const doctor = doctorMap.get(appointment.doctor_id);
            return {
              id: appointment.doctor_id,
              fullName: doctor
                ? `${doctor.user?.surname || ''} ${doctor.user?.name || ''} ${
                    doctor.user?.middlename || ''
                  }`.trim()
                : "Ім'я не знайдено",
            };
          })
          .filter(
            (value, index, self) =>
              index === self.findIndex((d) => d.id === value.id)
          );

        fullData = {
          ...fullData,
          scheduledDoctors,
        };
      }
      setUserData(fullData);
      localStorage.setItem('userRole', baseData.role);
      setUserRole(baseData.role);

      if (baseData.role === 'manager' || baseData.role === 'moderator') {
        setIsClient(false);
      }
    } catch (err) {
      setError('Не вдалося завантажити профіль');
      console.error('Помилка профілю:', err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleOpenChat = (doctorName) => {
    setSelectedDoctor({ name: doctorName });
    setShowChatPopup(true);
  };

  if (loading)
    return (
      <div className="min-h-210 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error) return <p className="text-red-600">{error}</p>;
  if (!userData) return <p>Користувача не знайдено</p>;

  return isClient ? (
    <div className="max-w-4xl mx-auto mb-20 px-4">
      <div className="flex justify-between items-center mb-12 mt-8">
        <h1 className="text-4xl text-gray-800 font-bold">
          {userData.role === 'doctor' ? 'Кабінет лікаря' : 'Особистий кабінет'}
        </h1>
        <Button onClick={handleLogout} rounded className="max-w-64">
          Вийти з акаунту
        </Button>
      </div>

      {userData.role === 'doctor' ? (
        <DoctorProfile
          doctorId={userData.doctor_id}
          name={`${userData.surname} ${userData.name} ${userData.middlename}`.trim()}
          email={userData.email}
          phone={userData.phone}
          specialization={userData.specialization}
          experienceSince={userData.experienceStartDate}
          roomNumber={userData.room}
          onProfileUpdated={fetchProfile}
          rating={userData.rating}
        />
      ) : (
        <>
          <UserProfile
            name={`${userData.surname} ${userData.name} ${userData.middlename}`.trim()}
            birthDate={userData.date_of_birth}
            email={userData.email}
            phone={userData.phone}
            handleLogout={handleLogout}
            onProfileUpdated={fetchProfile}
            onOpenChat={handleOpenChat}
            scheduledDoctors={userData.scheduledDoctors}
          />
          <PopupChat
            isOpen={showChatPopup}
            onClose={() => setShowChatPopup(false)}
            doctor={selectedDoctor}
          />
        </>
      )}
    </div>
  ) : (
    <AdminPanelPage handleLogout={handleLogout} />
  );
}
