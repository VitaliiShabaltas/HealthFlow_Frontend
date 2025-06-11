import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doneIcon from '../../assets/icons/done.svg';

export function AppointmentCompleted({ appointmentId }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <img
          src={doneIcon}
          alt="Запис підтверджено"
          className="w-16 h-16 mx-auto"
        />
      </div>

      <h1 className="text-2xl font-bold mb-2">Вас записано на прийом</h1>
      <h2 className="text-xl text-gray-600 mb-8">Номер запису №{appointmentId}</h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
        <p className="mb-4">
          Якщо ви ще не завантажили додаток, то можете зробити це за цим
          посиланням.
        </p>

        <p className="font-medium mb-2">Це необхідно для:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>перегляду вашого запису</li>
          <li>скасування/переносу запису</li>
          <li>можливості оплатити прийом</li>
          <li>залишити відгук про прийом</li>
          <li>можливості зв'язатися з лікарем через мобільний пристрій</li>
          <li>можливість отримання нагадування про прийом</li>
        </ul>
      </div>

      <div className="mb-6 flex items-center text-left">
        <input
          type="checkbox"
          id="confirmation"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="w-5 h-5 mr-3"
        />
        <label htmlFor="confirmation" className="text-gray-700">
          Я ознайомився з інформацією щодо застосунку
        </label>
      </div>

      <button
        onClick={handleReturnHome}
        disabled={!isConfirmed}
        className={`w-full py-2 px-6 rounded-lg font-medium transition-colors cursor-pointer ${
          isConfirmed
            ? 'bg-[#d64d4d] hover:bg-[#b53c3c] text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Повернутись на головну сторінку
      </button>
    </div>
  );
}