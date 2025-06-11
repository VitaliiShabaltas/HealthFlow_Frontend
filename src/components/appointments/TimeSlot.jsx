import React, { useState } from 'react';
import TimeSlotTooltip from './TimeSlotTooltip';

export default function TimeSlot({
  time,
  available,
  isActive,
  onClick,
  onClose,
  date,
  doctorId,
}) {
  const [appointmentData, setAppointmentData] = useState(null);

  const handleClick = async () => {
    if (!available) return;
    onClick();

    try {
      const res = await fetch(
        `https://healthflowbackend-production.up.railway.app/appointments`
      );
      const data = await res.json();

      const appointment = data.find(
        (a) =>
          a.doctor_id === doctorId &&
          a.appointment_date === date &&
          a.start_time.slice(0, 5) === time
      );

      if (appointment) {
        setAppointmentData({
          recordNumber: appointment.appointment_id,
          date: appointment.appointment_date,
          time: `${appointment.start_time.slice(
            0,
            5
          )} - ${appointment.end_time.slice(0, 5)}`,
          patient: `${appointment.client.surname} ${appointment.client.name} ${appointment.client.middlename}`,
          clientId: appointment.client.user_id,
        });
      } else {
        setAppointmentData(null);
      }
    } catch (error) {
      console.error('Помилка при отриманні даних запису:', error);
      setAppointmentData(null);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        className={`text-center py-1 rounded cursor-pointer transition-colors duration-200 ${
          available
            ? isActive
              ? 'bg-blue-300 text-blue-800'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
            : 'bg-gray-100 text-gray-400 hover:text-gray-400 hover:bg-gray-200 '
        }`}
      >
        {time}
      </div>

      {isActive && available && appointmentData && (
        <div className="absolute top-0 left-full ml-2 z-50">
          <TimeSlotTooltip
            onClose={onClose}
            recordNumber={appointmentData.recordNumber}
            date={appointmentData.date}
            time={appointmentData.time}
            patient={appointmentData.patient}
            clientId={appointmentData.clientId}
          />
        </div>
      )}
    </div>
  );
}
