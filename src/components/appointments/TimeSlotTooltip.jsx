import React from 'react';
import { FaCommentDots, FaVideo } from 'react-icons/fa';

const TimeSlotTooltip = ({
  recordNumber,
  date,
  time,
  patient,
  showMedicalCardButton = true,
  showIcons = true,
}) => {
  return (
    <div className="absolute z-10 bg-white rounded-lg shadow-xl p-4 w-100 text-sm text-black">
      <div className="flex justify-between">
        <p className="font-semibold text-left">Запис №{recordNumber}</p>
        <div className="flex justify-between mt-2">
          <span className="text-gray-500 mr-6">на {date}</span>
          <span className="text-gray-500">{time}</span>
        </div>
      </div>
      <p className="text-left">{patient}</p>

      {(showMedicalCardButton || showIcons) && (
        <div className="flex items-center mt-3 gap-5">
          {showMedicalCardButton && (
            <button className="bg-red-300 text-white px-3 py-2 rounded-md text-sm font-medium">
              Переглянути мед.карту
            </button>
          )}
          {showIcons && (
            <div className="flex space-x-3 text-xl text-gray-600">
              <FaVideo className="cursor-pointer" />
              <FaCommentDots className="cursor-pointer" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default TimeSlotTooltip;
