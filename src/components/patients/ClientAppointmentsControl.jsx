import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiSearch } from 'react-icons/fi';
import {
  getAppointments,
  deleteAppointment,
  getDoctors,
  getTimeTableByDoctorAndDate,
  deleteTimeTableEntry,
} from '../../api/appointments';

export default function ClientAppointmentsPage() {
  const [records, setRecords] = useState([]);
  const [doctorsMap, setDoctorsMap] = useState({});
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointments, doctors] = await Promise.all([
          getAppointments(),
          getDoctors(),
        ]);

        const doctorDetails = {};
        doctors.forEach((doc) => {
          const fullName = `${doc.user.surname} ${doc.user.name} ${doc.user.middlename}`;
          doctorDetails[doc.doctor_id] = {
            cabinet: doc.cabinet,
            fullName,
          };
        });

        const formatted = appointments.map((app) => ({
          id: app.appointment_id,
          date: new Date(app.appointment_date).toLocaleDateString('uk-UA'),
          time: app.start_time.slice(0, 5),
          doctor: doctorDetails[app.doctor_id]?.fullName || 'Невідомо',
          cabinet: `№${doctorDetails[app.doctor_id]?.cabinet ?? '?'}`,
          doctorFull: `${doctorDetails[app.doctor_id]?.specialization ?? ''} ${
            doctorDetails[app.doctor_id]?.fullName ?? ''
          }`,
          patient: `${app.client.surname ?? ''} ${app.client.name?.[0] ?? ''}.${
            app.client.middlename?.[0] ?? ''
          }.`,
          patientFull: `${app.client.surname ?? ''} ${app.client.name ?? ''} ${
            app.client.middlename ?? ''
          }`,
          status: app.status,
        }));

        setDoctorsMap(doctorDetails);
        setRecords(formatted);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchData();
  }, []);

  const toggleRecord = (id) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    try {
      const recordToDelete = records.find((r) => r.id === id);
      if (!recordToDelete) return;

      const doctorEntry = Object.entries(doctorsMap).find(
        ([, value]) => value.fullName === recordToDelete.doctor
      );
      if (!doctorEntry) throw new Error('Не знайдено лікаря для запису');
      const doctorId = parseInt(doctorEntry[0], 10);

      const [day, month, year] = recordToDelete.date.split('.');
      const dateFormatted = `${year}-${month}-${day}`;

      const timetable = await getTimeTableByDoctorAndDate(
        doctorId,
        dateFormatted
      );

      const timetableEntry = timetable.find(
        (entry) => entry.start_time.slice(0, 5) === recordToDelete.time
      );

      if (!timetableEntry)
        throw new Error('Не знайдено запису розкладу для видалення');

      await deleteTimeTableEntry(timetableEntry.time_table_id);

      await deleteAppointment(id);

      setRecords(records.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Помилка при видаленні:', err.message);
    }
  };

  const formatDateForSorting = (dateStr) => {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
  };

  const filteredRecords = [...records]
    .sort(
      (a, b) =>
        new Date(`${formatDateForSorting(b.date)}T${b.time}`) -
        new Date(`${formatDateForSorting(a.date)}T${a.time}`)
    )
    .filter(
      (r) =>
        r.patientFull.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctorFull.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Записи</h1>
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Пошук записів..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-md  border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-lg">Запис №{record.id}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleDelete(record.id, e)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <FiX size={20} />
                    </button>
                    <button
                      onClick={() => toggleRecord(record.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      {expandedRecord === record.id ? (
                        <FiChevronUp size={20} />
                      ) : (
                        <FiChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {!expandedRecord || expandedRecord !== record.id ? (
                  <div className="flex justify-between text-[#525252] text-sm">
                    <div className="flex items-center space-x-1">
                      <span>Дата:</span>
                      <span>
                        {record.date} {record.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Лікар:</span>
                      <span>{record.doctor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Пацієнт:</span>
                      <span>{record.patient}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-blue-50 border-t border-blue-100 rounded-b-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <p className="text-[#9A9A9A] min-w-[100px]">
                        Дата запису:
                      </p>
                      <p className="font-medium text-[#7b7b7b]">
                        {record.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <p className="text-[#9A9A9A]">Час запису:</p>
                        <p className="font-medium text-[#7b7b7b]">
                          {record.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <p className="text-[#9A9A9A]">Кабінет:</p>
                        <p className="font-medium text-[#7b7b7b]">
                          {record.cabinet}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <p className="text-[#9A9A9A]">Статус:</p>
                        <p className="font-medium text-[#7b7b7b]">
                          {record.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <p className="text-[#9A9A9A]">Пацієнт:</p>
                        <p className="font-medium text-[#7b7b7b]">
                          {record.patientFull}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <p className="text-[#9A9A9A]">Лікар:</p>
                        <p className="font-medium text-[#7b7b7b]">
                          {record.doctorFull}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Записів не знайдено
          </div>
        )}
      </div>
    </div>
  );
}
