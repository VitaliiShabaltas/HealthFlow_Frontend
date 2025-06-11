import React from 'react';
import doctorImage from '../../assets/doctor.png';
import cancelIcon from '../../assets/icons/cancel.svg';
import phoneIcon from '../../assets/icons/phone.svg';

export function PopupPhone({ isOpen, onClose, doctor }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'Номер не вказаний';
    return `${phone.slice(0, 3)} (${phone.slice(3, 6)}) ${phone.slice(
      6,
      9
    )}-${phone.slice(9, 11)}-${phone.slice(11)}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <img
            src={cancelIcon}
            alt="Close"
            className="w-6 h-6 cursor-pointer"
          />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Зв'язатися з лікарем
        </h3>

        <div className="flex justify-center mb-4">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-24 h-24 object-cover rounded-full border-2 border-blue-200"
          />
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">Номер телефону лікаря:</p>
          <div className="flex items-center justify-center gap-2">
            <img src={phoneIcon} alt="Phone" className="w-5 h-5" />
            <span className="text-xl font-semibold text-gray-800">
              {formatPhoneNumber(doctor?.user?.phone)}
            </span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-gray-600 text-sm text-center">
            Графік роботи: Пн-Пт з 10:00 до 18:00
            <br />У вихідні дні телефон може бути недоступний
          </p>
        </div>
      </div>
    </div>
  );
}
