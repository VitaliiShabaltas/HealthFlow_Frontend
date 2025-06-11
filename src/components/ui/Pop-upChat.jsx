import React from 'react';
import doctorImage from '../../assets/doctor.png';
import awardIcon from '../../assets/icons/award.svg';
import cancelIcon from '../../assets/icons/cancel.svg';
import qrCodeImage from '../../assets/qrCode.png';

export function PopupChat({ isOpen, onClose, doctor }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
          Напишіть мені через додаток
        </h3>

        <div className="flex justify-center mb-4">
          <img
            src={doctorImage}
            alt="Doctor"
            className="w-24 h-24 object-cover rounded-full border-2 border-blue-200"
          />
        </div>

        <p className="text-gray-600 text-center mb-6">
          Завантажте додаток HealthFlow+ відсканувавши QR-код нижче або{' '}
          <a href="#" className="text-blue-500 hover:underline">
            за посиланням
          </a>
          , щоб надіслати повідомлення лікарю.
        </p>

        <div className="flex justify-center mb-6">
          <img
            src={qrCodeImage}
            alt="QR Code"
            className="w-48 h-48 object-contain"
          />
        </div>

        <div className="bg-gray-100 rounded-lg p-4 flex items-start">
          <img
            src={awardIcon}
            alt="Award"
            className="w-5 h-5 mt-4 flex-shrink-0"
          />
          <p className="text-gray-600 text-sm">
            Наш додаток є найбезпечнішим і найпростішим способом захисту ваших
            даних і спілкування на медичні теми.
          </p>
        </div>
      </div>
    </div>
  );
}
