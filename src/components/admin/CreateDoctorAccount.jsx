import { useState } from 'react';
import { Button } from '../ui/Button';
const API_BASE = 'https://healthflowbackend-production.up.railway.app';
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateDateOfBirth,
} from '../../api/validation';

import { useDepartments, useSpecialties } from '../../api/useDepartmentData';

export default function CreateDoctorAccount() {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    departmentId: '',
    specialtyId: '',
    fullName: '',
    dateOfBirth: '',
    workingSince: today,
    phone: '',
    email: '',
    password: '',
    office: '',
    consultationPrice: '',
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { departments, error: departmentsError } = useDepartments();

  const { specialties, error: specialtiesError } = useSpecialties(
    formData.departmentId
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');

    if (name === 'departmentId') {
      setFormData((prev) => ({ ...prev, specialtyId: '' }));
    }
  };

  const parseFullName = (fullName) => {
    const parts = fullName.trim().split(' ');
    return {
      surname: parts[0] || '',
      name: parts[1] || '',
      middlename: parts[2] || '',
    };
  };

  const calculateExperienceYears = (dateStr) => {
    if (!dateStr) return 0;
    const startYear = new Date(dateStr).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.departmentId) {
      setErrorMessage('Будь ласка, оберіть відділення');
      return;
    }
    if (!formData.specialtyId) {
      setErrorMessage('Будь ласка, оберіть спеціальність');
      return;
    }
    if (!formData.fullName.trim()) {
      setErrorMessage('Введіть ПІБ');
      return;
    }
    if (!validateFullName(formData.fullName.trim())) {
      setErrorMessage(
        "ПІБ повинно містити принаймні прізвище та ім'я, тільки літери української або латинської абетки"
      );
      return;
    }
    if (!formData.dateOfBirth) {
      setErrorMessage('Введіть дату народження');
      return;
    }
    if (!validateDateOfBirth(formData.dateOfBirth)) {
      setErrorMessage('Вік лікаря має бути не менше 16 років');
      return;
    }
    if (!formData.workingSince) {
      setErrorMessage('Введіть дату початку роботи');
      return;
    }
    if (!formData.email) {
      setErrorMessage('Введіть email');
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrorMessage('Введіть коректну електронну пошту');
      return;
    }
    if (!formData.phone) {
      setErrorMessage('Введіть номер телефону');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMessage(
        'Номер телефону повинен бути у форматі +380xxxxxxxxx (український мобільний номер)'
      );
      return;
    }
    if (!formData.password) {
      setErrorMessage('Введіть пароль');
      return;
    }
    if (!validatePassword(formData.password)) {
      setErrorMessage('Пароль повинен містити мінімум 6 символів');
      return;
    }
    if (!formData.office) {
      setErrorMessage('Вкажіть кабінет');
      return;
    }
    if (!formData.consultationPrice) {
      setErrorMessage('Вкажіть ціну консультації');
      return;
    }

    const { surname, name, middlename } = parseFullName(formData.fullName);

    const payload = {
      user: {
        name,
        surname,
        middlename,
        date_of_birth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'doctor',
      },
      department_id: Number(formData.departmentId),
      specialization_id: String(formData.specialtyId),
      cabinet: formData.office,
      experience_years: calculateExperienceYears(formData.workingSince),
      consultation_price: Number(formData.consultationPrice),
    };

    try {
      const res = await fetch(`${API_BASE}/users/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errTxt = 'Помилка при створенні лікаря';
        try {
          const errData = await res.json();
          if (errData?.message) {
            if (errData.message.includes('already exists')) {
              errTxt =
                'Користувач з такою електронною поштою або номером телефону вже існує';
            } else {
              errTxt = errData.message;
            }
          }
        } catch {}
        throw new Error(errTxt);
      }

      setShowSuccessModal(true);
      setFormData({
        departmentId: '',
        specialtyId: '',
        fullName: '',
        dateOfBirth: '',
        workingSince: today,
        phone: '',
        email: '',
        password: '',
        office: '',
        consultationPrice: '',
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Помилка при створенні лікаря');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Форма додання нового лікаря
        </h2>

        {errorMessage && (
          <div className="mb-4 p-2   text-red-700 rounded">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between mb-6 gap-4">
            <div className="w-[200px]">
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="border rounded-md px-4 py-2 bg-white w-full cursor-pointer"
              >
                <option value="">Оберіть відділення</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[200px]">
              <select
                name="specialtyId"
                value={formData.specialtyId}
                onChange={handleChange}
                disabled={!formData.departmentId || specialties.length === 0}
                className="border rounded-md px-4 py-2 bg-white w-full cursor-pointer disabled:opacity-50"
              >
                <option value="">Оберіть спеціальність</option>
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">ПІБ:</label>
            <input
              type="text"
              name="fullName"
              placeholder="Прізвище Ім'я По батькові"
              value={formData.fullName}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">
              Дата народження:
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-[200px] border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">
              Працює лікарем з:
            </label>
            <input
              type="date"
              name="workingSince"
              value={formData.workingSince}
              onChange={handleChange}
              className="w-[200px] border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">
              Номер телефона:
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Номер телефону"
              value={formData.phone}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">
              Електронна пошта:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">Пароль:</label>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">
              Кабінет:
            </label>
            <input
              type="text"
              name="office"
              placeholder="Номер кабінету"
              value={formData.office}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-left w-[150px]">
              Ціна консультації:
            </label>
            <input
              type="number"
              name="consultationPrice"
              placeholder="Ціна"
              value={formData.consultationPrice}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">Підтвердити</Button>
            <Button
              type="button"
              onClick={() => {
                setFormData({
                  departmentId: '',
                  specialtyId: '',
                  fullName: '',
                  dateOfBirth: '',
                  workingSince: '',
                  phone: '',
                  email: '',
                  password: '',
                  office: '',
                  consultationPrice: '',
                });
                setErrorMessage('');
                setSpecialties([]);
              }}
            >
              Скасувати
            </Button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Успішно додано</h3>
              <Button onClick={() => setShowSuccessModal(false)}>
                Закрити
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
