import React, { useEffect, useState } from 'react';
import TimeSlot from './TimeSlot';
import axios from 'axios';

const TimeSlotsWrapper = ({ date, doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);

  useEffect(() => {
    axios
      .get('https://healthflowbackend-production.up.railway.app/appointments')
      .then((res) => {
        setAppointments(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSlotClick = (time) => {
    setActiveSlot(time);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {['10:00:00', '11:00:00', '11:30:00', '13:00:00'].map((time) => {
        const appointment = appointments.find(
          (a) =>
            a.appointment_date === date &&
            a.start_time === time &&
            a.doctor.doctor_id === doctorId
        );

        return (
          <TimeSlot
            key={time}
            time={time}
            available={!!appointment}
            isActive={activeSlot === time}
            onClick={() => handleSlotClick(time)}
            appointment={appointment}
          />
        );
      })}
    </div>
  );
};

export default TimeSlotsWrapper;
