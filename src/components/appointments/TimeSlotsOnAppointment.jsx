import React, { useEffect, useState } from 'react';
import { isToday, parse, format } from 'date-fns';
import { getDoctorTimetable } from '../../api/timeslot';

export function TimeSlotsOnAppointment({ selectedTime, onTimeSelect, selectedDate, doctorId }) {
  const [busySlots, setBusySlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeslotsonappointment = [
    '10:00', '10:30', '11:00', '11:30', '12:00',
    '12:30', '13:00', '13:30', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00'
  ];

  useEffect(() => {
    onTimeSelect(null);
    if (doctorId && selectedDate) {
      fetchDoctorTimetable();
    }
  }, [selectedDate, doctorId]);

  const fetchDoctorTimetable = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const timetable = await getDoctorTimetable(doctorId, formattedDate);
    
    const unavailableTimes = timetable
      .filter(item => item.status === 'busy' || item.status === 'unavailable')
      .map(item => {
        const startTime = item.start_time.substring(0, 5);
        return startTime;
      });
    
    setBusySlots(unavailableTimes);
  } catch (err) {
    setError(err.message);
    console.error('Error fetching doctor timetable:', err);
  } finally {
    setIsLoading(false);
  }
};

  const isTimeDisabled = (time) => {
    if (!isToday(selectedDate)) return busySlots.includes(time);
    
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    
    return slotTime < now || busySlots.includes(time);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        Помилка завантаження розкладу: {error}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Доступні часи</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {timeslotsonappointment.map((time) => {
          const disabled = isTimeDisabled(time);
          return (
            <button
              key={time}
              onClick={() => !disabled && onTimeSelect(time)}
              disabled={disabled}
              className={`py-2 px-4 rounded-lg border transition-colors
                ${selectedTime === time 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : disabled
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}