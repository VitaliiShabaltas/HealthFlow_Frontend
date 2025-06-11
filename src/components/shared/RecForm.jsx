import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { getDoctorById } from '../../api/doctors';
import { getJWT } from '../../utils/jwt';

export const RecForm = ({ onCancel, clientId }) => {
  const [appointmentId, setAppointmentId] = useState('');
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const doctorId = parseInt(localStorage.getItem('doctorId'), 10);

  useEffect(() => {
    const fetchLatestAppointment = async () => {
      try {
        const res = await fetch(
          'https://healthflowbackend-production.up.railway.app/appointments'
        );
        const appointments = await res.json();

        const filtered = appointments.filter(
          (a) =>
            a.client_id === parseInt(clientId, 10) &&
            a.doctor_id === doctorId &&
            a.status === 'scheduled'
        );

        const sorted = filtered.sort((a, b) => {
          const dateA = new Date(`${a.appointment_date}T${a.start_time}`);
          const dateB = new Date(`${b.appointment_date}T${b.start_time}`);
          return dateB - dateA;
        });

        if (sorted.length > 0) {
          setAppointmentId(sorted[0].appointment_id.toString());
        } else {
          setErrorMessage(
            'Немає запланованих прийомів для цього клієнта і лікаря.'
          );
        }
      } catch (err) {
        setErrorMessage('Помилка при отриманні даних про прийом');
        console.error(err);
      }
    };

    const fetchDoctorName = async () => {
      try {
        const token = getJWT();
        const doctor = await getDoctorById(doctorId, token);
        const { surname, name, middlename } = doctor.user;
        const fullName = [surname, name, middlename].filter(Boolean).join(' ');
        setDoctorName(fullName);
      } catch (err) {
        setErrorMessage('Помилка при завантаженні даних лікаря');
        console.error(err);
      }
    };

    if (clientId && doctorId) {
      fetchLatestAppointment();
      fetchDoctorName();
    }
  }, [clientId, doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!appointmentId || isNaN(appointmentId)) {
      setErrorMessage('Прийому на який можна записати мед карту не існує');
      return;
    }

    try {
      const token = getJWT();

      const checkResponse = await fetch(
        'https://healthflowbackend-production.up.railway.app/medical-card',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!checkResponse.ok) {
        const text = await checkResponse.text();
        throw new Error(`Не вдалося перевірити медкартки: ${text}`);
      }

      const existingCards = await checkResponse.json();
      const exists = existingCards.some(
        (card) => card.appointment_id === parseInt(appointmentId, 10)
      );

      if (exists) {
        setErrorMessage('Медична картка для цього прийому вже існує');
        return;
      }

      const newRecord = {
        client_id: parseInt(clientId, 10),
        doctor_id: doctorId,
        appointment_id: parseInt(appointmentId, 10),
        complaints,
        diagnosis,
        prescriptions,
        notes,
      };

      const response = await fetch(
        'https://healthflowbackend-production.up.railway.app/medical-card/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newRecord),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage(`Помилка при створенні медичної картки: ${errorText}`);
        return;
      }

      const updateResponse = await fetch(
        `https://healthflowbackend-production.up.railway.app/appointments/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'completed' }),
        }
      );

      if (!updateResponse.ok) {
        const updateErrorText = await updateResponse.text();
        console.error('Appointment update error:', updateErrorText);
        setErrorMessage(`Помилка оновлення статусу: ${updateErrorText}`);
        return;
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      setErrorMessage('Сталася помилка при збереженні.');
    }
  };

  return (
    <div className="max-w-5xl w-full border border-gray-300 rounded-xl shadow-md bg-white p-6">
      <div className="text-left mb-4">
        <p className="text-lg">
          <strong>Дата:</strong> {new Date().toLocaleDateString()}
        </p>
        <p className="text-lg">
          <strong>Лікар:</strong> {doctorName || 'завантаження...'}
        </p>
      </div>

      {errorMessage && (
        <div className="text-red-600 bg-red-100 border border-red-400 rounded p-3 mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block font-semibold mb-1 text-lg">Скарги:</label>
          <input
            type="text"
            value={complaints}
            onChange={(e) => setComplaints(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-lg">Діагноз:</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-lg">
            Призначення:
          </label>
          <input
            type="text"
            value={prescriptions}
            onChange={(e) => setPrescriptions(e.target.value)}
            className="w-full border rounded border-gray-300 px-3 py-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-lg">Нотатки:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded border-gray-300 px-3 py-3"
            rows="4"
            required
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit">Зберегти</Button>
          <Button type="button" onClick={onCancel} variant="secondary">
            Скасувати
          </Button>
        </div>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">
                Медичну картку створено
              </h3>
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  onCancel();
                }}
              >
                Закрити
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
