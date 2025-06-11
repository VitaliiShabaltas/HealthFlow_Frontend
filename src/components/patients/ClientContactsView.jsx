import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { getAllClients } from '../../api/users';
import { getJWT } from '../../utils/jwt';

export default function ClientContactsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getJWT();
    getAllClients(token)
      .then(setPatients)
      .catch((err) => {
        console.error(err);
        setError('Не вдалося завантажити пацієнтів');
      });
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      (patient.email &&
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Контакти пацієнтів</h1>

        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Пошук пацієнтів..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <div
            key={patient.user_id}
            className="flex items-center gap-20 bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <span className="font-semibold text-lg min-w-[330px] text-left">
              {`${patient.surname} ${patient.name} ${patient.middlename}`}
            </span>
            <span className="text-gray-700 min-w-[200px] text-left">
              тел: {patient.phone}
            </span>
            {patient.email ? (
              <span className="text-gray-700 ml-10 text-left">
                пошта: {patient.email}
              </span>
            ) : (
              <span className="text-gray-400 ml-10">пошта: не вказано</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
