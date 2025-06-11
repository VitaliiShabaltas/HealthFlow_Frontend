import React from 'react';

export function FilterDoctorAppointment({
  searchQuery,
  onSearchChange,
  showFavorites,
  onToggleFavorites,
  sortByRating,
  onToggleRating,
  ratingIcon,
  updateFavorites,
}) {
  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-3">
        <label
          htmlFor="search"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Пошук лікаря
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введіть ім'я лікаря"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={async () => {
            await onToggleFavorites(!showFavorites);
            if (updateFavorites) updateFavorites();
          }}
          className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
            showFavorites ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <svg
              className={`w-6 h-6 mr-3 ${
                showFavorites
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-500 fill-none'
              }`}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="text-base text-gray-700">Обрані лікарі</span>
          </div>
        </button>

        <button
          onClick={() => onToggleRating(!sortByRating)}
          className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
            sortByRating ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <img src={ratingIcon} alt="Рейтинг" className="w-6 h-6 mr-3" />
            <span className="text-base text-gray-700">Рейтинг</span>
          </div>
        </button>
      </div>
    </div>
  );
}
