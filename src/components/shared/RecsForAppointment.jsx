import React from 'react';

export function RecsForAppointment({ recommendations }) {
  return (
    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg w-full lg:w-[450px]">
      <h3 className="font-bold text-2xl mb-6 text-center">
        Рекомендації від лікарів
      </h3>
      <ul className="space-y-6 text-lg leading-relaxed px-4">
        {recommendations.map((item, index) => (
          <li key={index} className="italic text-center">
            "{item}"
          </li>
        ))}
      </ul>
    </div>
  );
}
