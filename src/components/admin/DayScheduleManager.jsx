import React, { useState, useEffect } from 'react';
import TimeSlotManager from './TimeSlotManager';
import { API_URL } from '../../api/init';
import {
  generateTimeFromIndex,
  generateTimeSlots,
} from '../../utils/GenerateTimeSlots';

export default function DayScheduleManager({
  day,
  date,
  dateRaw,
  slots,
  dayIndex,
  activeSlot,
  setActiveSlot,
  doctorId,
}) {
  const [slotStates, setSlotStates] = useState(slots);

  useEffect(() => {
    setSlotStates(slots);
  }, [slots]);

  const removeSlot = async (index) => {
    const updated = [...slotStates];
    const slot = updated[index];

    if (slot?.time && !slot.available && !slot.isRemoved) {
      const startTime = slot.time;
      const [hours, minutes] = startTime.split(':');
      const endTimeDate = new Date(0, 0, 0, +hours, +minutes + 30);
      const endTime = endTimeDate.toTimeString().slice(0, 5);

      try {
        const payload = {
          doctor_id: Number(doctorId),
          date: dateRaw,
          start_time: startTime,
          end_time: endTime,
          status: 'unavailable',
        };

        const res = await fetch(`${API_URL}/timetable/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorBody = await res.text();
          console.error('Bad response:', res.status, errorBody);
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();

        updated[index] = {
          ...slot,
          isRemoved: true,
          timeTableId: data.time_table_id,
        };
        setSlotStates(updated);
      } catch (err) {
        console.error('Не вдалося створити слот (unavailable):', err);
      }
    }
  };

  const restoreSlot = async (index) => {
    const updated = [...slotStates];
    const slot = updated[index];

    if (slot?.time && !slot.available && slot.isRemoved) {
      const idToDelete = slot.timeTableId;
      if (!idToDelete) {
        console.warn('Не знайдено timeTableId для цього слоту');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/timetable/delete/${idToDelete}`, {
          method: 'DELETE',
          headers: { Accept: '*/*' },
        });
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        updated[index] = {
          ...slot,
          isRemoved: false,
          available: false,
          status: undefined,
          timeTableId: undefined,
        };
        setSlotStates(updated);
      } catch (err) {
        console.error('Помилка при видаленні unavailable-слоту:', err);
      }
    }
  };

  const toggleSlot = (index) => {
    const updated = [...slotStates];
    const slot = updated[index];

    if (slot?.available && slot.status === 'busy') return;

    if (!slot?.time) {
      const fullTime = generateTimeFromIndex(index);
      updated[index] = { time: fullTime, available: false };
    } else if (!slot.available && !slot.isRemoved) {
      updated[index] = {};
    }
    setSlotStates(updated);
  };

  return (
    <div className="flex flex-col border-r last:border-r-0 px-4 border-gray-400 relative gap-1">
      <p className="font-semibold text-center">{day}</p>
      <p className="text-xs text-gray-600 text-center mb-4">{date}</p>

      <div className="flex flex-col gap-2">
        {slotStates.map((slot, idx) => (
          <TimeSlotManager
            key={idx}
            time={slot.time}
            available={slot.available}
            isRemoved={slot.isRemoved}
            isActive={
              activeSlot?.dayIndex === dayIndex && activeSlot?.slotIndex === idx
            }
            onActivate={() => setActiveSlot({ dayIndex, slotIndex: idx })}
            onDeactivate={() => setActiveSlot(null)}
            onToggle={() => toggleSlot(idx)}
            onRemove={() => removeSlot(idx)}
            onRestore={() => restoreSlot(idx)}
            onClose={() => setActiveSlot(null)}
            date={dateRaw}
            doctorId={doctorId}
          />
        ))}
      </div>
    </div>
  );
}
