import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../assets/icons/backNav.svg';
import DaySchedule from '../components/doctors/DaySchedule';
import { generateTimeSlots } from '../utils/GenerateTimeSlots';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import ukLocale from 'date-fns/locale/uk';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export function DoctorSchedule() {
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);
  const doctorId = parseInt(localStorage.getItem('doctorId'), 10);

  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  useEffect(() => {
    const fetchSchedule = async () => {
      const startDate = format(
        addWeeks(startOfCurrentWeek, weekOffset),
        'yyyy-MM-dd'
      );
      const endDate = format(
        addDays(addWeeks(startOfCurrentWeek, weekOffset), 6),
        'yyyy-MM-dd'
      );

      try {
        const res = await fetch(
          `https://healthflowbackend-production.up.railway.app/timetable?doctorId=${doctorId}&dateFrom=${startDate}&dateTo=${endDate}`
        );
        const data = await res.json();

        // Групуємо по кожному дню тижня
        const grouped = Array.from({ length: 7 }, (_, i) => {
          const dateObj = addDays(addWeeks(startOfCurrentWeek, weekOffset), i);
          const dateStr = format(dateObj, 'yyyy-MM-dd');
          const prettyDate = format(dateObj, 'dd MMM', { locale: ukLocale });
          const dayName = daysOfWeek[i];

          // Беремо лише ті таймслоти зі статусом busy/unavailable для поточного дня
          const rawSlotsForDay = data.filter((s) => s.date === dateStr);

          // Створюємо масив об’єктів { time: 'HH:mm', status: 'busy'|'unavailable' }
          const slotsForDay = rawSlotsForDay.map((s) => ({
            time: s.start_time.slice(0, 5),
            status: s.status, // 'busy' або 'unavailable'
          }));

          // Генеруємо всі таймслоти (від 10:00 до 18:30 інтервал 30 хв)
          const fullSlots = generateTimeSlots().map((slot) => {
            const match = slotsForDay.find((x) => x.time === slot.time);

            if (match) {
              if (match.status === 'busy') {
                // busy → доступний (available: true), бо на ньому є запис
                return {
                  ...slot,
                  available: true,
                  status: 'busy',
                  date: dateStr,
                };
              }
              // unavailable → відображаємо як порожній (пустий об’єкт)
              return {};
            }

            // Нема запису в БД → неактивний (available: false)
            return { ...slot, available: false };
          });

          return {
            day: dayName,
            date: prettyDate,
            slots: fullSlots,
          };
        });

        setScheduleData(grouped);
      } catch (err) {
        console.error('Помилка при завантаженні розкладу:', err);
      }
    };

    fetchSchedule();
  }, [weekOffset]);

  return (
    <div className="max-w-2/3 mx-auto mt-6 mb-20">
      <div className="relative flex items-center justify-center mb-9 mt-9">
        <h2 className="text-2xl font-bold">Розклад на тиждень</h2>
        <div
          onClick={() => navigate(-1)}
          className="absolute right-0 flex items-center text-gray-600 font-semibold cursor-pointer"
        >
          <img
            src={backIcon}
            alt="Назад"
            className="w-4 h-4 cursor-pointer mr-2"
          />
          Назад
        </div>
      </div>

      <div className="p-6 bg-white shadow rounded-xl">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="text-gray-600 flex font-semibold cursor-pointer px-4 py-2"
          >
            <img
              src={backIcon}
              alt="Попередній"
              className="w-4 h-4 cursor-pointer mr-2 mt-1"
            />
            Попередній тиждень
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="text-gray-600 flex font-semibold cursor-pointer px-4 py-2"
          >
            Наступний тиждень
            <img
              src={backIcon}
              alt="Наступний"
              className="w-4 h-4 cursor-pointer ml-2 mt-1 rotate-180"
            />
          </button>
        </div>

        <div className="grid grid-cols-7 bg-white pt-4 pb-4 relative z-0">
          {scheduleData.map((day, idx) => (
            <DaySchedule
              key={idx}
              day={day.day}
              date={day.date}
              slots={day.slots}
              activeSlot={activeSlot}
              setActiveSlot={setActiveSlot}
              doctorId={doctorId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
