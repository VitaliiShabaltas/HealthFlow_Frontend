import { useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { Button } from '../components/ui/Button';

export function LoginPage({ isLoggedIn, setIsLoggedIn, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (token, role) => {
    localStorage.setItem('jwt-token', token);
    localStorage.setItem('userRole', role);
    if (
      window.location.search.includes('code=') ||
      window.location.search.includes('scope=')
    ) {
      navigate(window.location.pathname, { replace: true });
    }
    setUserRole(role);
    switch (role) {
      default:
        navigate('/');
    }

    setIsLoggedIn(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const credentials = {
        login: email,
        password: password,
      };

      const { token, role } = await loginUser(credentials);
      handleLogin(token, role);
    } catch (err) {
      setError(err.message || 'Невірний email або пароль');
      console.error('Login error:', err);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError('');
      console.log(
        'Google login success, sending access token to backend:',
        tokenResponse
      );

      try {
        const response = await fetch(
          'http://localhost:3000/auth/google-login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken: tokenResponse.access_token,
            }),
          }
        );

        if (!response.ok) {
          let backendError =
            'Помилка під час входу через Google. Сервер відповів із помилкою.';
          try {
            const errorData = await response.json();
            backendError = errorData.message || backendError;
          } catch (e) {}
          throw new Error(backendError);
        }

        const data = await response.json();
        if (data.token && data.role) {
          handleLogin(data.token, data.role);
        } else {
          console.error('Backend response missing appToken or userRole', data);
          setError(
            'Не вдалося отримати необхідні дані від сервера після Google входу.'
          );
        }
      } catch (err) {
        console.error('Error sending access token to backend:', err);
        setError(err.message || 'Помилка під час обробки Google входу.');
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setError(
        error?.error_description ||
          error?.details ||
          'Помилка входу через Google. Будь ласка спробуйте ще раз.'
      );
    },
  });

  if (isLoggedIn) return null;

  return (
    <div className="flex justify-center mt-20 mb-16">
      <div className="p-[2px] rounded-2xl bg-gradient-to-b from-gradient-red to-gradient-blue">
        <div className="bg-white rounded-2xl px-7 py-6 w-sm">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start bg-white rounded-2xl"
          >
            <h2 className="font-bold text-3xl mb-5 text-start">Вхід</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <label htmlFor="email" className="text-lg mb-2">
              Email / номер телефона
            </label>
            <input
              type="email"
              placeholder="Email"
              className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password" className="text-xl mb-2 mt-5">
              Пароль
            </label>
            <input
              type="password"
              placeholder="Пароль"
              className="border-1 border-gray-600 rounded-md w-full px-3 py-2"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="py-5">
              У тебе немає акаунта?{' '}
              <Link to="/register" className="border-b-1 hover:border-b-2">
                Реєстрація
              </Link>
            </p>

            <Button type="submit">Вхід</Button>
          </form>

          <div className="mt-4 flex flex-col items-center">
            <p className="mb-2 text-sm text-gray-600">
              Або увійдіть за допомогою
            </p>
            <Button
              onClick={() => {
                googleLogin();
              }}
              className="relative bg-transparent text-gray-600 font-normal border-gray-600 border-1 hover:bg-gray-100 w-full flex items-center justify-center py-2"
              type="button"
            >
              <img
                src="./src/assets/icons/google.png"
                alt="google"
                className="w-5 h-5 mr-2"
              />
              Увійти за допомогою Google
            </Button>
          </div>

          <p className="pt-2">
            <Link to="/forgot-password" className="border-b-1 hover:border-b-2">
              Забули пароль?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
