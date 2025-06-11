import React, { useState, useEffect } from 'react';
import { getReviewsByDoctor } from '../../api/reviews';
import { addFavorite, removeFavorite } from '../../api/favorites';

export function DoctorAppointmentCard({ doctor, onSelect, isInitiallyFavorite, updateFavorites }) {
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);

  useEffect(() => {
    setIsFavorite(isInitiallyFavorite);
  }, [isInitiallyFavorite]);

  useEffect(() => {
    const fetchReviewsCount = async () => {
      setIsLoadingReviews(true);
      try {
        const reviews = await getReviewsByDoctor(doctor.id);
        setReviewsCount(reviews.length);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsCount(0);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviewsCount();
  }, [doctor.id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    
    try {
      if (isFavorite) {
        await removeFavorite(doctor.id);
      } else {
        await addFavorite(doctor.id);
      }
      setIsFavorite(!isFavorite);
      if (updateFavorites) {
        await updateFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const formatReviewsCount = (count) => {
    if (count === 0) return 'немає відгуків';
    if (count === 1) return '1 відгук';
    if (count < 5) return `${count} відгуки`;
    return `${count} відгуків`;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border border-gray-200 hover:border-blue-300 relative overflow-hidden"
      onClick={() => onSelect(doctor)}
    >
      <div className="absolute bottom-0 left-0 h-2 w-full bg-blue-600 z-10"></div>

      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800 text-left">
            {doctor.name}
          </h3>
          <p className="text-gray-600 mt-1 text-left">{doctor.specialty}</p>
        </div>

        <button
          onClick={toggleFavorite}
          className="text-gray-400 hover:text-red-500 focus:outline-none flex-shrink-0 ml-2"
          aria-label={isFavorite ? 'Видалити з обраних' : 'Додати в обрані'}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#FF0000' : 'none'}
            stroke={isFavorite ? '#FF0000' : '#6B7280'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="flex items-center mt-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < doctor.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">
          {isLoadingReviews ? 'Завантаження...' : formatReviewsCount(reviewsCount)}
        </span>
      </div>
    </div>
  );
}