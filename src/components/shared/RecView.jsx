import React from 'react';

export function RecView({ data, onPrev, onNext, index, total }) {
  if (!data) {
    return (
      <p className="text-center text-gray-500">
        Медична карта не знайдена або ще не створена.
      </p>
    );
  }

  const { client, appointment, complaints, diagnosis, prescriptions, notes } =
    data;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-9 px-2">
        <span className="text-xl font-bold">
          {client.surname} {client.name} {client.middlename}
        </span>
      </div>
      {index > 0 && (
        <div
          onClick={onPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-3xl cursor-pointer px-4 select-none"
        >
          &lt;
        </div>
      )}

      <div className="max-w-5xl w-full border border-gray-300 rounded-xl shadow-md bg-white p-8">
        <div className="whitespace-pre-wrap text-left text-lg text-gray-800 leading-relaxed">
          <p>
            <strong className="text-lg">Дата:</strong>{' '}
            {new Date(appointment.appointment_date).toLocaleDateString()}
          </p>
          <p>
            <strong className="text-lg">Пацієнт:</strong> {client.surname}{' '}
            {client.name} {client.middlename}
          </p>
          <p>
            <strong className="text-lg">Дата народження:</strong>{' '}
            {new Date(client.date_of_birth).toLocaleDateString()}
          </p>
          <p className="mt-2">
            <strong className="text-lg">Скарги:</strong>
            <br />
            {complaints}
          </p>
          <p className="mt-2">
            <strong className="text-lg">Діагноз:</strong>
            <br />
            {diagnosis}
          </p>
          <p className="mt-2">
            <strong className="text-lg">Призначення:</strong>
            <br />
            {prescriptions}
          </p>
          <p className="mt-2">
            <strong className="text-lg">Нотатки:</strong>
            <br />
            {notes}
          </p>
        </div>
      </div>

      {index < total - 1 && (
        <div
          onClick={onNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-3xl cursor-pointer px-4 select-none"
        >
          &gt;
        </div>
      )}

      <p className="text-center mt-4 text-sm text-gray-500">
        Сторінка {index + 1} / {total}
      </p>
    </div>
  );
}
