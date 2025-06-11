import React from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import backIcon from '../../assets/icons/backNav.svg';

export function AppointmentDetails({ 
  branch, 
  service, 
  doctor, 
  date, 
  time, 
  onBack, 
  onConfirm,
  isLoading 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <img
          src={backIcon}
          alt="Назад"
          className="w-6 h-6 cursor-pointer mr-2"
          onClick={onBack}
        />
        <h2 className="text-xl font-bold">Деталі запису</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="pb-4 border-b">
          <p className="text-gray-600 mb-1">Відділення:</p>
          <p className="font-medium">{branch?.name}</p>
        </div>
        
        <div className="pb-4 border-b">
          <p className="text-gray-600 mb-1">Послуга:</p>
          <p className="font-medium">{service?.label}</p>
        </div>
        
        <div className="pb-4 border-b">
          <p className="text-gray-600 mb-1">Лікар:</p>
          <p className="font-medium">{doctor?.name}</p>
        </div>
        
        <div className="pb-4 border-b">
          <p className="text-gray-600 mb-1">Дата та час:</p>
          <p className="font-medium">
            {date && format(date, 'dd.MM.yyyy', { locale: uk })} {time}
          </p>
        </div>
        
        <div className="pt-4">
          <p className="text-gray-600 mb-1">Ціна:</p>
          <p className="font-medium text-blue-600">{doctor?.consultation_price} грн.</p>
        </div>
      </div>

      <button
        onClick={onConfirm}
        disabled={isLoading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading = 'Записатись на прийом'}
      </button>
    </div>
  );
}