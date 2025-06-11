import React from 'react';
import {
  useDepartments,
  useSpecialties,
  useDoctors,
} from '../../api/useDepartmentData';

export default function FiltersBarAdmin({
  departmentId,
  setDepartmentId,
  specialtyId,
  setSpecialtyId,
  doctorId,
  setDoctorId,
}) {
  const { departments, error: depError } = useDepartments();

  const { specialties, error: specError } = useSpecialties(departmentId);

  const { doctors, error: docError } = useDoctors(specialtyId);

  return (
    <div className="flex flex-wrap gap-4 justify-center px-4 pt-4 pb-2 ">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Відділення
        </label>
        <select
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value);

            setSpecialtyId('');
            setDoctorId('');
          }}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer"
        >
          <option value="">-- Оберіть відділення --</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>
        {depError && <p className="text-xs text-red-500">{depError}</p>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Спеціальність
        </label>
        <select
          value={specialtyId}
          onChange={(e) => {
            setSpecialtyId(e.target.value);

            setDoctorId('');
          }}
          disabled={!departmentId || specialties.length === 0}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer disabled:opacity-50"
        >
          <option value="">-- Оберіть спеціальність --</option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {spec.label}
            </option>
          ))}
        </select>
        {specError && <p className="text-xs text-red-500">{specError}</p>}
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Лікар</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          disabled={!specialtyId || doctors.length === 0}
          className="border border-gray-300 rounded-md px-3 py-2 bg-white cursor-pointer disabled:opacity-50"
        >
          <option value="">-- Оберіть лікаря --</option>
          {doctors.map((doc) => {
            const fullName =
              `${doc.user.surname} ${doc.user.name} ${doc.user.middlename}`.trim();
            return (
              <option key={doc.doctor_id} value={doc.doctor_id}>
                {fullName}
              </option>
            );
          })}
        </select>
        {docError && <p className="text-xs text-red-500">{docError}</p>}
      </div>
    </div>
  );
}
