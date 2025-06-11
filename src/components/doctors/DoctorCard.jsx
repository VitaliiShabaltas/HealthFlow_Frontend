import React, { useState, useEffect } from 'react';
import doctorImage from '../../assets/doctor.png';
import commentatorIcon from '../../assets/icons/commentator.svg';
import { PopupChat } from '../ui/Pop-upChat';
import { getReviewsByDoctor } from '../../api/reviews';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { getSpecializationLabel } from '../../api/doctors';
import { addFavorite, removeFavorite, getFavorites } from '../../api/favorites';
import { useNavigate } from 'react-router-dom';
import { PopupPhone } from '../ui/Pop-upPhone';

export function DoctorCard({ doctor, specializations, updateFavorites }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviewsByDoctor(doctor.doctor_id);
        const doctorReviews = reviewsData.filter(
          (review) => review.doctor_id === doctor.doctor_id
        );
        setReviews(doctorReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const favorites = await getFavorites();
        setIsFavorite(
          favorites.some((fav) => fav.doctor_id === doctor.doctor_id)
        );
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    fetchReviews();
    checkFavoriteStatus();
  }, [doctor.doctor_id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(doctor.doctor_id);
      } else {
        await addFavorite(doctor.doctor_id);
      }
      setIsFavorite(!isFavorite);
      if (updateFavorites) {
        await updateFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Не удалось изменить статус избранного');
    }
  };

  const formatClientName = (client) => {
    return `${client.surname} ${client.name.charAt(0)}.${
      client.middlename ? client.middlename.charAt(0) + '.' : ''
    }`;
  };

  const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy р.', { locale: uk });
  };

  const formattedName = `${doctor.user.surname} ${doctor.user.name.charAt(0)}.${
    doctor.user.middlename ? doctor.user.middlename.charAt(0) + '.' : ''
  }`;

  const handleBookAppointment = () => {
    navigate('/appointment');
  };

  return (
    <div className="mb-10 bg-white rounded-lg overflow-hidden shadow-md relative h-[330px]">
      <div className="flex h-full">
        <div className="w-1/2 p-6 border-r border-gray-200 flex flex-col">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <img
                src={doctorImage}
                alt="Doctor"
                className="w-24 h-24 object-cover rounded-full border-2 border-blue-200"
              />
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {formattedName}
                    </h3>
                    <p className="text-lg text-gray-600 mt-1">
                      {getSpecializationLabel(
                        specializations,
                        doctor.specialization_id
                      )}{' '}
                      · Рейтинг: {doctor.rating}/5
                    </p>
                  </div>
                  <button
                    onClick={toggleFavorite}
                    className="flex items-center justify-between mb-5 cursor-pointer hover:scale-110 transition-transform"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 30 30"
                      fill={isFavorite ? '#FF0000' : 'none'}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 transition-colors duration-200"
                    >
                      <path
                        d="M26.05 5.76258C25.4116 5.12384 24.6535 4.61714 23.8192 4.27144C22.9849 3.92574 22.0906 3.7478 21.1875 3.7478C20.2844 3.7478 19.3902 3.92574 18.5558 4.27144C17.7215 4.61714 16.9635 5.12384 16.325 5.76258L15 7.08758L13.675 5.76258C12.3854 4.47297 10.6363 3.74847 8.81253 3.74847C6.98874 3.74847 5.23964 4.47297 3.95003 5.76258C2.66041 7.0522 1.93591 8.80129 1.93591 10.6251C1.93591 12.4489 2.66041 14.198 3.95003 15.4876L15 26.5376L26.05 15.4876C26.6888 14.8491 27.1955 14.0911 27.5412 13.2568C27.8869 12.4225 28.0648 11.5282 28.0648 10.6251C28.0648 9.72197 27.8869 8.82771 27.5412 7.99339C27.1955 7.15907 26.6888 6.40103 26.05 5.76258Z"
                        stroke={isFavorite ? '#FF0000' : '#202020'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(doctor.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 w-fit">
              <a
                href="#"
                className="text-sm px-3 py-2 bg-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center gap-2 w-[200px]"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPopupOpen(true);
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                <span className="truncate">Зв'язатися через чат</span>
              </a>

              <a
                href="#"
                className="text-sm px-3 py-2 bg-green-200 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center gap-2 w-[200px]"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPhonePopupOpen(true);
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="truncate">Зв'язатися по телефону</span>
              </a>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-end">
              <button
                onClick={handleBookAppointment}
                className="text-sm px-5 py-2.5 bg-shade-red text-white rounded-lg hover:bg-red-400 transition"
              >
                Записатися на прийом
              </button>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-6 flex flex-col">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Відгуки</h4>

          <div className="flex-1 overflow-y-auto pr-2">
            {loadingReviews ? (
              <p className="text-center py-4">Завантаження відгуків...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center py-4">Ще немає відгуків</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.review_id} className="flex gap-3">
                    <img
                      src={commentatorIcon}
                      alt="Commentator"
                      className="w-8 h-8"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {formatClientName(review.client)}
                          </p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatReviewDate(review.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-2 text-left">
                        {review.review}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <PopupChat
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        doctor={doctor}
      />

      <PopupPhone
        isOpen={isPhonePopupOpen}
        onClose={() => setIsPhonePopupOpen(false)}
        doctor={doctor}
      />
    </div>
  );
}
