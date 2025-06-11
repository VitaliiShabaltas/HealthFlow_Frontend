import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../assets/icons/backNav.svg';
import FiltersBarAdmin from './FiltersBarAdmin';
import DayScheduleManager from './DayScheduleManager';
import { generateTimeSlots } from '../../utils/GenerateTimeSlots';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import ukLocale from 'date-fns/locale/uk';

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const API_BASE = 'https://healthflowbackend-production.up.railway.app';

export default function DoctorScheduleManager() {
  const navigate = useNavigate();
  const [departmentId, setDepartmentId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [scheduleData, setScheduleData] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null);

  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  useEffect(() => {
    if (!doctorId) {
      setScheduleData([]);
      return;
    }

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
          `${API_BASE}/timetable?doctorId=${doctorId}&dateFrom=${startDate}&dateTo=${endDate}`
        );
        if (!res.ok) throw new Error(`Статус ${res.status}`);
        const data = await res.json();

        const grouped = Array.from({ length: 7 }, (_, i) => {
          const dateObj = addDays(addWeeks(startOfCurrentWeek, weekOffset), i);
          const dateStr = format(dateObj, 'yyyy-MM-dd');
          const prettyDate = format(dateObj, 'dd MMM', { locale: ukLocale });
          const dayName = daysOfWeek[i];

          const rawSlotsForDay = data.filter((s) => s.date === dateStr);

          const slotsForDay = rawSlotsForDay.map((s) => ({
            time: s.start_time.slice(0, 5),
            status: s.status,
            timeTableId: s.time_table_id,
          }));

          const fullSlots = generateTimeSlots().map((slot) => {
            const match = slotsForDay.find((x) => x.time === slot.time);
            if (match) {
              if (match.status === 'busy') {
                return {
                  ...slot,
                  available: true,
                  status: 'busy',
                  date: dateStr,
                  timeTableId: match.timeTableId,
                };
              }
              if (match.status === 'unavailable') {
                return {
                  ...slot,
                  available: false,
                  status: 'unavailable',
                  isRemoved: true,
                  date: dateStr,
                  timeTableId: match.timeTableId,
                };
              }
            }
            return {
              ...slot,
              available: false,
              isRemoved: false,
            };
          });

          return {
            day: dayName,
            date: prettyDate,
            dateRaw: dateStr,
            slots: fullSlots,
          };
        });

        setScheduleData(grouped);
      } catch (err) {
        console.error('Помилка при завантаженні розкладу:', err);
      }
    };

    fetchSchedule();
  }, [weekOffset, doctorId]);

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-20 ">
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
        <div className=" mb-4">
          <FiltersBarAdmin
            departmentId={departmentId}
            setDepartmentId={setDepartmentId}
            specialtyId={specialtyId}
            setSpecialtyId={setSpecialtyId}
            doctorId={doctorId}
            setDoctorId={setDoctorId}
          />
        </div>

        <div className="flex justify-between items-center mb-2 px-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            disabled={!doctorId}
            className={`text-gray-600 flex font-semibold cursor-pointer px-4 py-2 ${
              !doctorId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <img src={backIcon} alt="Назад" className="w-4 h-4 mr-2 mt-1" />
            Попередній тиждень
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            disabled={!doctorId}
            className={`text-gray-600 flex font-semibold cursor-pointer px-4 py-2 ${
              !doctorId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Наступний тиждень
            <img
              src={backIcon}
              alt="Вперед"
              className="w-4 h-4 ml-2 mt-1 rotate-180"
            />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-4 pb-4">
          {scheduleData.map((day, idx) => (
            <DayScheduleManager
              key={idx}
              day={day.day}
              date={day.date}
              dateRaw={day.dateRaw}
              slots={day.slots}
              dayIndex={idx}
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
