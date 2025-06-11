import React, { useState } from 'react';
import TimeSlotTooltip from '../appointments/TimeSlotTooltip';
import { getJWT } from '../../utils/jwt';

export default function TimeSlotManager({
  time,
  available,
  isRemoved,
  isActive,
  onActivate,
  onDeactivate,
  onToggle,
  onRemove,
  onRestore,
  onClose,
  date,
  doctorId,
}) {
  const [appointmentData, setAppointmentData] = useState(null);

  const handleToggle = async () => {
    if (!available) return;

    if (isActive) {
      onDeactivate();
      setAppointmentData(null);
      return;
    }

    onActivate();

    try {
      const token = getJWT();
      const res = await fetch(
        `https://healthflowbackend-production.up.railway.app/appointments`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const found = data.find((a) => {
        return (
          a.doctor_id === Number(doctorId) &&
          a.appointment_date === date &&
          a.start_time.slice(0, 5) === time
        );
      });

      if (found) {
        setAppointmentData({
          recordNumber: found.appointment_id,
          date: found.appointment_date,
          time: `${found.start_time.slice(0, 5)} - ${found.end_time.slice(
            0,
            5
          )}`,
          patient: `${found.client.surname} ${found.client.name} ${found.client.middlename}`,
          clientId: found.client.user_id,
        });
      } else {
        setAppointmentData(null);
      }
    } catch (err) {
      console.error('Помилка при отриманні даних запису:', err);
      setAppointmentData(null);
    }
  };

  if (!available && isRemoved) {
    return (
      <div
        onClick={onRestore}
        className="h-[32px] border-dashed border border-blue-300 relative text-center py-1 rounded transition-colors bg-white text-blue-500 hover:bg-blue-100 cursor-pointer"
        title={`Повернути слот ${time}`}
      >
        +
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={handleToggle}
        className={`relative text-center py-1 rounded transition-colors duration-200 ${
          available
            ? isActive
              ? 'bg-blue-300 text-blue-800'
              : 'bg-blue-200 text-blue-800 hover:bg-blue-300 cursor-pointer'
            : 'bg-gray-100 text-gray-400 hover:text-gray-400 hover:bg-gray-200 '
        }`}
      >
        {time}

        {!available && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 text-[10px] text-blue-900 bg-blue-300 rounded-full hover:bg-blue-200 cursor-pointer"
            title="Позначити як unavailable"
          >
            ×
          </button>
        )}
      </div>

      {isActive && available && appointmentData && (
        <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 z-50">
          <TimeSlotTooltip
            onClose={() => {
              onClose();
              setAppointmentData(null);
            }}
            recordNumber={appointmentData.recordNumber}
            date={appointmentData.date}
            time={appointmentData.time}
            patient={appointmentData.patient}
            clientId={appointmentData.clientId}
            showMedicalCardButton={false}
            showIcons={false}
          />
        </div>
      )}
    </div>
  );
}
