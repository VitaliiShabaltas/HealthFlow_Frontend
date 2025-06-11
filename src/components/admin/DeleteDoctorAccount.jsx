import { useEffect, useState } from 'react';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { Button } from '../ui/Button';
import {
  getDoctors,
  deleteDoctor,
  getDepartmentSpecializations,
} from '../../api/doctors';

export default function DeleteDoctorAccount() {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorsAndSpecs = async () => {
      try {
        const doctorsFromApi = await getDoctors();
        setDoctors(doctorsFromApi);

        const specsMap = {};

        const uniqueDepartments = [
          ...new Set(doctorsFromApi.map((doc) => doc.department_id)),
        ];

        await Promise.all(
          uniqueDepartments.map(async (depId) => {
            const specs = await getDepartmentSpecializations(depId);
            specsMap[depId] = specs;
          })
        );

        const doctorSpecs = {};
        for (const doctor of doctorsFromApi) {
          const deptSpecs = specsMap[doctor.department_id] || [];
          const match = deptSpecs.find(
            (s) => s.id === doctor.specialization_id
          );
          doctorSpecs[doctor.doctor_id] = match ? match.label : 'Невідома';
        }

        setSpecializations(doctorSpecs);
      } catch (err) {
        console.error(err);
        setError('Помилка при завантаженні даних лікарів або спеціальностей');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorsAndSpecs();
  }, []);

  const handleDelete = async (doctorId) => {
    const confirmed = window.confirm(
      'Ви впевнені, що хочете видалити цього лікаря?'
    );
    if (!confirmed) return;

    try {
      await deleteDoctor(doctorId);
      setDoctors((prev) => prev.filter((d) => d.doctor_id !== doctorId));
      alert('Лікаря успішно видалено');
    } catch (err) {
      console.error(err);
      alert('Помилка при видаленні лікаря');
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.user?.surname || ''} ${
      doctor.user?.name || ''
    } ${doctor.user?.middlename || ''}`.toLowerCase();
    const spec = (specializations[doctor.doctor_id] || '').toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      spec.includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) return <div className="p-4">Завантаження...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Видалення акаунтів лікарів</h1>

        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Пошук лікарів..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor.doctor_id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex-grow flex items-center">
                <div className="flex items-center gap-4 w-full">
                  <span className="font-semibold text-lg min-w-[350px] text-left mr-4">
                    {doctor.user?.surname} {doctor.user?.name}{' '}
                    {doctor.user?.middlename}
                  </span>
                  <span className="text-gray-500">
                    {specializations[doctor.doctor_id] || 'Завантаження...'}
                  </span>
                </div>
              </div>

              <div className="ml-4">
                <Button
                  onClick={() => handleDelete(doctor.doctor_id)}
                  className="px-3 py-1.5 flex items-center gap-2"
                  variant="danger"
                  rounded
                >
                  <FiTrash2 size={16} />
                  <span className="hidden sm:inline">Видалити</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? 'Лікарів за вашим запитом не знайдено'
              : 'Немає лікарів для відображення'}
          </div>
        )}
      </div>
    </div>
  );
}
