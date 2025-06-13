import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/backNav.svg';
import PatientCard from '../components/patients/PatientCard';
import { FiSearch } from 'react-icons/fi';
import { API_URL } from '../api/init';

export function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const doctorId = parseInt(localStorage.getItem('doctorId'), 10);

  useEffect(() => {
    if (!doctorId) {
      console.error('Doctor ID is missing');
      return;
    }
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${API_URL}/appointments`);
        const data = await response.json();

        const doctorAppointments = data.filter(
          (appt) => appt.doctor_id === doctorId
        );

        const uniqueClientsMap = new Map();
        doctorAppointments.forEach((appt) => {
          const client = appt.client;
          if (!uniqueClientsMap.has(client.user_id)) {
            uniqueClientsMap.set(client.user_id, {
              id: client.user_id,
              name: `${client.surname} ${client.name} ${client.middlename}`,
              date: appt.appointment_date,
              messages: 0,
            });
          }
        });

        setPatients(Array.from(uniqueClientsMap.values()));
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      }
    };

    fetchAppointments();
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2/3 mx-auto mb-20">
      <div className="font-semibold text-2xl text-center mb-3 mt-9">
        Пацієнти
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Пошук записів..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none  "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div
          onClick={() => navigate(-1)}
          className="right-0 flex items-center text-gray-600 font-semibold cursor-pointer"
        >
          <img
            src={backIcon}
            alt="Назад"
            className="w-4 h-4 cursor-pointer mr-2"
          />
          Назад
        </div>
      </div>

      <div className="space-y-5">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((p, i) => (
            <PatientCard
              key={i}
              id={p.id}
              name={p.name}
              date={p.date}
              messages={p.messages}
              onClick={() => navigate(`/healthCard/${p.id}`)}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-4 text-sm">Пацієнтів не знайдено.</p>
        )}
      </div>
    </div>
  );
}
