import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '../assets/icons/backNav.svg';
import commentatorIcon from '../assets/icons/commentator.svg';
import { DoctorChat } from '../components/shared/DoctorChat';

export function DoctorChatPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        const menuButton = document.querySelector('.menu-button');
        if (menuButton && !menuButton.contains(event.target)) {
          setShowPatientMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [patientId]);

  const patients = [
    {
      id: '1',
      name: 'Петренко Г.Н.',
      lastMessage: 'Добрий день, коли можна прийти?',
      time: '10:30',
      unread: 1,
    },
    {
      id: '2',
      name: 'Кіріченко Г.Н.',
      lastMessage: 'Дякую за консультацію',
      time: '09:15',
      unread: 3,
    },
    {
      id: '3',
      name: 'Орнаменцце Г.Н.',
      lastMessage: 'Нагадайте будь ласка адресу',
      time: 'Вчора',
      unread: 0,
    },
    {
      id: '4',
      name: 'Погодько О.Л.',
      lastMessage: 'Результати аналізів вже є?',
      time: 'Вчора',
      unread: 0,
    },
    {
      id: '5',
      name: 'Міриченко П.П.',
      lastMessage: 'До побачення',
      time: '28.04',
      unread: 0,
    },
  ];

  const selectedPatient = patientId
    ? patients.find((p) => p.id === patientId)
    : patients[0];

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewMedicalCard = () => {
    navigate(`/healthCard/${selectedPatient.id}`);
    setShowPatientMenu(false);
  };

  const handleDeleteChat = () => {
    alert(`Чат с ${selectedPatient.name} будет удален`);
    setShowPatientMenu(false);
    navigate('/doctor/chat');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      <div className="w-full h-px bg-gray-200"></div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Мої пацієнти</h2>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <img src={backIcon} alt="Назад" className="w-4 h-4 mr-2" />
                Назад
              </button>
            </div>
            <input
              type="text"
              placeholder="Пошук пацієнта..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/doctor/chat/${patient.id}`)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={commentatorIcon}
                      alt="Commentator"
                      className="w-8 h-8"
                    />
                    <div className="text-left">
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-gray-500">
                        {patient.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">
                      {patient.time}
                    </span>
                    {patient.unread > 0 && (
                      <span className="mt-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {patient.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedPatient ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white relative">
                <div className="flex items-center gap-3">
                  <img
                    src={commentatorIcon}
                    alt="Patient"
                    className="w-8 h-8"
                  />
                  <h3 className="font-semibold">{selectedPatient.name}</h3>
                </div>
                <button
                  onClick={() => setShowPatientMenu(!showPatientMenu)}
                  className="menu-button text-gray-500 hover:text-gray-700 p-2"
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>

                {showPatientMenu && (
                  <div
                    ref={menuRef}
                    className="absolute right-4 top-14 bg-white shadow-lg rounded-md border border-gray-200 z-10 w-48"
                  >
                    <button
                      onClick={handleViewMedicalCard}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Переглянути мед. карту
                    </button>
                    <button
                      onClick={handleDeleteChat}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Видалити чат
                    </button>
                  </div>
                )}
              </div>

              <DoctorChat patient={selectedPatient} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Оберіть пацієнта для початку спілкування
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
