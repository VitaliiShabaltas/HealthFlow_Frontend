import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { Button } from '../components/ui/Button';
import { validatePhone, checkEmailExists } from '../api/validation';

export function RegisterPage({ setIsLoggedIn }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (token) => {
    localStorage.setItem('jwt-token', token);
    navigate('/', { replace: true });
    setIsLoggedIn(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const [surname, name, middlename] = fullName.trim().split(' ');

    if (!validatePhone(phoneNumber)) {
      setError(
        'Невірний формат номера телефону. Використовуйте формат +380XXXXXXXXX'
      );
      return;
    }
    if (!surname || !name) {
      setError("Будь ласка, введіть принаймні прізвище та ім'я");
      return;
    }
    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError('Користувач з таким email вже існує');
        return;
      }

      const credentials = {
        surname,
        name,
        middlename: middlename || '',
        email,
        phone: phoneNumber,
        password,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth).toISOString() : '',
      };

      const { token } = await registerUser(credentials);
      handleRegister(token);
    } catch (err) {
      setError(err.message || 'Щось пішло не так під час реєстрації');
      console.error('Registration error:', err);
    }
  };
  return (
    <div className="flex justify-center mt-20 mb-16">
      <div className="p-[2px] rounded-2xl bg-gradient-to-b from-gradient-red to-gradient-blue">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start px-7 py-6 w-sm bg-white rounded-2xl"
        >
          <h2 className="font-bold text-3xl mb-5">Реєстрація</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <label htmlFor="name" className="text-lg mb-2 ">
            ПІБ (Прізвище Ім'я По-батькові)
          </label>
          <input
            type="text"
            placeholder="Наприклад: Іванов Іван Іванович"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label htmlFor="email" className="text-lg mb-2 mt-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="phone" className="text-lg mb-2 mt-2">
            Номер телефону
          </label>
          <input
            type="tel"
            placeholder="Номер телефону"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
            value={phoneNumber}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\+?\d{0,13}$/.test(val)) {
                setPhoneNumber(val);
              }
            }}
            required
          />

          <label htmlFor="date" className="text-lg mb-2 mt-2">
            Дата народження (за бажанням)
          </label>
          <input
            type="date"
            placeholder="Дата народження"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
            value={dateOfBirth}
            required
            onChange={(e) => setDateOfBirth(e.target.value)}
          />

          <label htmlFor="password" className="text-xl mb-2 mt-2">
            Пароль
          </label>
          <input
            type="password"
            placeholder="Пароль"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <label htmlFor="confirmPassword" className="text-xl mb-2 mt-2">
            Підтвердіть пароль
          </label>
          <input
            type="password"
            placeholder="Повторіть пароль"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <p className="py-5">
            Вже існує аккаунт?{' '}
            <Link to="/login" className="border-b-1 hover:border-b-2">
              Авторизуватися
            </Link>
          </p>

          <Button type="submit">Зареєструватися</Button>
        </form>
      </div>
    </div>
  );
}
