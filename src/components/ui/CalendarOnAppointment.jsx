import React, { useState } from 'react';
import { format, addMonths, isBefore, isSameMonth, isSameDay, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { uk } from 'date-fns/locale';

export function CalendarOnAppointment({ selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);
  
  const today = new Date();
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  
  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onDateSelect(null);
  };
  
  const prevMonth = () => {
    const newMonth = addMonths(currentMonth, -1);
    setCurrentMonth(newMonth);
    onDateSelect(null);
  };

  const isDateDisabled = (date) => {
    return isBefore(date, today) && !isSameDay(date, today);
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDay = getDay(monthStart);
    const daysInMonth = getDaysInMonth(currentMonth);
    const days = [];
    
    for (let i = 1; i < (startDay === 0 ? 7 : startDay); i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isDisabled = isDateDisabled(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isHovered = hoveredDate && isSameDay(date, hoveredDate) && !isSelected;
      
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onDateSelect(date)}
          onMouseEnter={() => !isDisabled && !isSelected && setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          disabled={isDisabled}
          className={`h-10 rounded-full flex items-center justify-center transition-colors
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${isHovered ? 'bg-blue-100' : ''}
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          &lt;
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'LLLL yyyy', { locale: uk })}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm">
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
}