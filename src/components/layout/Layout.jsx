import React from 'react';
import { Link, Outlet, useLocation, matchPath } from 'react-router-dom';
import profileIconSrc from '../../assets/icons/profileIcon.svg';
import logoSrc from '../../assets/logo.jpg';
import { Button } from '../ui/Button';
const contacts = [
  {
    icon: <img src="../../../assets/icons/phone.svg" alt="" />,
    label: 'Телефон',
    value: '+380 95 111 111 11',
  },
  {
    icon: <img src="../../../assets/icons/mapMark.svg" alt="" />,
    label: 'Адреса',
    value: 'м. Дніпро, бул. Кучеревського, 1',
  },
  {
    icon: <img src="../../../assets/icons/clock.svg" alt="" />,
    label: 'Графік роботи',
    value: (
      <>
        <p>Пн-Сб: 8:00 – 20:00</p>
        <p>Нд: 8:00 – 16:00</p>
      </>
    ),
  },
  {
    icon: <img src="../../../assets/icons/telegram.svg" alt="" />,
    label: "Зв'язатися з нами(connect with us)",
  },
];
const specialties = [
  'Загальна терапія',
  'Дерматологія',
  'Педіатрія',
  'Гастроентерологія',
  'Сімейна медицина',
  'Кардіологія',
  'Гінекологія',
  'Ортопедія та травматологія',
  'Урологія',
  'Офтальмологія',
  'Психотерапія',
  'Отоларингологія',
  'Неврологія',
  'Психологія',
  'Ендокринологія',
  'Логопедія',
];

export function Layout({ isLoggedIn, userRole }) {
  const midIndex = Math.ceil(specialties.length / 2);
  const firstColumn = specialties.slice(0, midIndex);
  const secondColumn = specialties.slice(midIndex);
  const location = useLocation();

  const noFooterRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/admin',
    '/patients',
    '/schedule',
    '/doctor-profile',
    '/healthCard/:id',
    '/doctor/chat/undefined',
    '/profile',
  ];
  const hideFooter = noFooterRoutes.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname)
  );
  const isManagerOrModerator =
    userRole === 'manager' || userRole === 'moderator';
  const isDoctor = userRole === 'doctor';
  return (
    <>
      {!isManagerOrModerator && (
        <header className="bg-white shadow text-gray-700 w-full top-0 z-50">
          <div className="container mx-auto flex items-center justify-between py-4 px-6">
            <Link to="/" className="logo flex items-center space-x-4">
              <img
                src={logoSrc}
                alt="HealthFlow+"
                className="h-12 w-12 md:h-16 md:w-16"
              />
              <h1 className="text-xl md:text-2xl font-bold">
                <span className="text-red-600">Health</span>
                <span className="text-blue-600">Flow+</span>
              </h1>
            </Link>
            <nav className="hidden md:flex gap-4 lg:gap-10 xl:gap-20">
              <Link
                to="/"
                className="border-b-2 border-transparent hover:border-gray-700 font-semibold text-base lg:text-lg"
              >
                Головна
              </Link>
              {!isDoctor && (
                <Link
                  to="/doctors"
                  className="border-b-2 border-transparent hover:border-gray-700 font-semibold text-base lg:text-lg"
                >
                  Список лікарів
                </Link>
              )}
              {isDoctor && (
                <Link
                  to="/schedule"
                  className="border-b-2 border-transparent hover:border-gray-700 font-semibold text-base lg:text-lg"
                >
                  Розклад
                </Link>
              )}
              {!isDoctor && (
                <Link
                  to="/appointment"
                  className="border-b-2 border-transparent hover:border-gray-700 font-semibold text-base lg:text-lg"
                >
                  Запис на прийом
                </Link>
              )}
              {isDoctor && (
                <Link
                  to="/patients"
                  className="border-b-2 border-transparent hover:border-gray-700 font-semibold text-base lg:text-lg"
                >
                  Пацієнти
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3 md:gap-5">
              {isLoggedIn && (
                <Link to="/profile">
                  <img
                    src={profileIconSrc}
                    alt="Profile"
                    className="w-7 h-7 md:w-8 md:h-8"
                  />
                </Link>
              )}
              {isLoggedIn ? (
                <Link to="/profile">
                  <span className="text-gray-700 font-semibold text-base lg:text-lg transition-colors">
                    Особистий кабінет
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 font-semibold text-base lg:text-lg hover:text-blue-600 transition-colors"
                >
                  Реєстрація/Вхід
                </Link>
              )}
            </div>
          </div>
        </header>
      )}
      <main className="">
        {' '}
        <Outlet />
      </main>
      {!hideFooter && (
        <footer className="flex flex-col items-center bg-white">
          <section className="flex items-start mt-6">
            <div className="mt-16">
              <div className="flex gap-5 items-center mb-12">
                <img src="../../assets/logo.jpg" alt="" />
                <h1 className="text-xl md:text-2xl font-bold">
                  <span className="text-red-600">Health</span>
                  <span className="text-blue-600">Flow+</span>
                </h1>
              </div>
              <span className="font-medium text-xl whitespace-nowrap ">
                Слідкуйте за нами у соцмережах
              </span>
              <div className="flex gap-8 mt-6">
                <img src="../../../assets/icons/instagram.svg" alt="" />
                <img src="../../../assets/icons/facebook.svg" alt="" />
              </div>
            </div>
            <div className="mx-auto pl-36 pr-52">
              <h2 className="text-xl whitespace-nowrap font-semibold text-gray-800 text-start mb-7">
                Напрямки HealthFlow+
              </h2>
              <div className="flex flex-col sm:flex-row">
                <ul className="sm:w-1/2 space-y-4 text-gray-700">
                  {firstColumn.map((item, idx) => (
                    <li key={idx} className="leading-relaxed text-start">
                      {item}
                    </li>
                  ))}
                </ul>
                <ul className="sm:w-1/2 space-y-4 text-gray-700 mt-6 sm:mt-0 sm:pl-12">
                  {secondColumn.map((item, idx) => (
                    <li key={idx} className="leading-relaxed text-start">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800 text-start">
                Контакти
              </h2>
              <div className="flex flex-col gap-4">
                {contacts.map((item, idx) => (
                  <div key={idx} className="flex  items-center space-x-4">
                    <div className="flex-shrink-0 text-start w-12 h-12 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="">
                      <p className="font-medium text-gray-700 text-start">
                        {item.label}
                      </p>
                      <div className="text-gray-600 text-start">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button rounded className="mt-4 py-3">
                Зворотній зв'язок
              </Button>
            </div>
          </section>
          <span className="mt-8">
            2025 © <span className="font-semibold">HealthFlow+</span> | Всі
            права захищені
          </span>
        </footer>
      )}
    </>
  );
}
