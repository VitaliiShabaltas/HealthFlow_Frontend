// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center mt-20 mb-16">
      <div className="p-[2px] rounded-2xl bg-gradient-to-b from-gradient-red to-gradient-blue">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start px-7 py-6 w-sm bg-white rounded-2xl "
        >
          <h2 className="font-bold text-3xl mb-5 text-start">
            Ведіть пароль для вашого аккаунту
          </h2>

          <label htmlFor="email" className="text-lg mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            className="border-1 border-gray-600 rounded-md w-full px-3 py-2 mb-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button>Відновити аккаунт</Button>
        </form>
      </div>
    </div>
  );
}
