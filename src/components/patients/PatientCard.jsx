import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export default function PatientCard({ id, name, date, messages, onClick }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center border border-gray-300 rounded-xl px-4 py-6 shadow-sm">
      <div>
        <p className="flex font-semibold">{name}</p>
        <p className="flex text-sm text-gray-500">
          Дата першого звернення: {date}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div onClick={onClick} className="cursor-pointer">
          <Button className="bg-[#FF8A8A] cursor-pointer font-bold text-white px-3 py-2 rounded-md text-sm shadow-sm">
            Переглянути мед.карту
          </Button>
        </div>
        <FontAwesomeIcon
          icon={faVideo}
          className="text-gray-700 text-xl cursor-pointer"
        />
        <div className="relative">
          <FontAwesomeIcon
            icon={faCommentDots}
            className="text-gray-700 text-xl cursor-pointer"
            onClick={() => navigate(`/doctor/chat/${id}`)}
          />
          {messages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              {messages}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
