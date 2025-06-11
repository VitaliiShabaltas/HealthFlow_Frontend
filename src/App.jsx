import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from 'react-router-dom';

import { Layout } from './components/layout/Layout';

import { AppointmentBooking } from './pages/AppointmentBooking';
import { DoctorChatPage } from './pages/DoctorChatPage';
import { DoctorSchedule } from './pages/DoctorSchedule';
import { DoctorsList } from './pages/DoctorsListPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HealthCardPage } from './pages/HealthCardPage';
import { LoginPage } from './pages/LoginPage';
import { MainPage } from './pages/MainPage';
import { PatientsList } from './pages/PatientsList';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { getJWT } from './utils/jwt';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getJWT());
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem('userRole');
    if (roleFromStorage) {
      setUserRole(roleFromStorage);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} userRole={userRole} />}>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                userRole === 'manager' || userRole === 'moderator' ? (
                  <Navigate to="/profile" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <LoginPage
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  setUserRole={setUserRole}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterPage
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              isLoggedIn ? <Navigate to="/" replace /> : <ForgotPasswordPage />
            }
          />
          <Route
            path="/doctors"
            element={
              isLoggedIn ? <DoctorsList /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/appointment"
            element={
              isLoggedIn ? (
                <AppointmentBooking />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <ProfilePage handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/patients"
            element={
              isLoggedIn ? <PatientsList /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/healthCard/:clientId" element={<HealthCardPage />} />

          <Route
            path="/doctor/chat/:id"
            element={
              isLoggedIn ? <DoctorChatPage /> : <Navigate to="/login" replace />
            }
          />

          <Route path="/schedule" element={<DoctorSchedule />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />}
        />
      </Routes>
    </Router>
  );
}
