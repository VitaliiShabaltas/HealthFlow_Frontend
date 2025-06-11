import React from 'react';
import TimeSlot from '../appointments/TimeSlot';

export default function DaySchedule({
  day,
  date,
  slots,
  activeSlot,
  setActiveSlot,
  doctorId,
}) {
  const handleSlotClick = (time) => {
    setActiveSlot((prev) =>
      prev?.time === time && prev?.day === day ? null : { time, day }
    );
  };

  const closeTooltip = () => setActiveSlot(null);

  return (
    <div className="flex flex-col items-center border-r last:border-r-0 px-4 border-gray-400 relative gap-1">
      <p className="font-semibold">{day},</p>
      <p className="text-sm text-gray-600 mb-3">{date}</p>
      {slots.length > 0 ? (
        slots.map((slot, i) => (
          <div key={i} className="mb-2 w-full relative">
            {Object.keys(slot).length > 0 ? (
              <TimeSlot
                time={slot.time}
                available={slot.available}
                isActive={
                  activeSlot?.time === slot.time && activeSlot?.day === day
                }
                onClick={() => handleSlotClick(slot.time)}
                onClose={closeTooltip}
                date={slot.date}
                doctorId={doctorId}
              />
            ) : (
              <p className="text-xs text-gray-400 mt-3 mb-2 flex items-center justify-center h-3">
                —
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400 mt-3 flex items-center justify-center h-3">
          —
        </p>
      )}
    </div>
  );
}
