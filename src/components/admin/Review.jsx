import { useEffect, useState } from 'react';
import FiltersBarAdmin from './FiltersBarAdmin';
import { Button } from '../ui/Button';
import {
  getAllReviews,
  approveReview,
  deleteReview,
  fetchDoctorsData,
  getDepartmentSpecializations,
} from '../../api/reviewsAdmin';
import {
  useDepartments,
  useSpecialties,
  useDoctors,
} from '../../api/useDepartmentData';

export default function Review() {
  const [departmentId, setDepartmentId] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allSpecializations, setAllSpecializations] = useState([]);

  const { departments } = useDepartments();
  const { specialties } = useSpecialties(departmentId);
  const { doctors } = useDoctors(specialtyId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [reviewsData, doctorsData] = await Promise.all([
          getAllReviews(false),
          fetchDoctorsData(),
        ]);

        const enrichedReviews = reviewsData
          .filter((review) => review.is_approved === false)
          .map((review) => {
            const doctor = doctorsData.find(
              (d) => d.doctor_id === review.doctor_id
            );
            return {
              ...review,
              doctor: doctor || null,
            };
          });

        setReviews(enrichedReviews);
        setFilteredReviews(enrichedReviews);
        setError(null);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      const loadSpecializations = async () => {
        try {
          const specsPromises = departments.map((d) =>
            getDepartmentSpecializations(d.id)
          );
          const specsResults = await Promise.all(specsPromises);
          setAllSpecializations(specsResults.flat());
        } catch (err) {
          console.error('Error loading specializations:', err);
        }
      };

      loadSpecializations();
    }
  }, [departments]);

  const getSpecializationLabel = (specializationId) => {
    if (!specializationId) return 'Спеціальність не вказана';

    const spec = allSpecializations.find((s) => s.id === specializationId);
    return spec?.label || spec?.name || 'Спеціальність не вказана';
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-400';
      case 3:
        return 'bg-orange-300';
      case 4:
        return 'bg-yellow-400';
      case 5:
        return 'bg-yellow-300';
      default:
        return 'bg-gray-300';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    filterReviews();
  }, [departmentId, specialtyId, doctorId, searchQuery, reviews]);

  const filterReviews = () => {
    let result = [...reviews];

    if (departmentId) {
      result = result.filter(
        (review) =>
          String(review?.doctor?.department?.id) === String(departmentId)
      );
    }

    if (specialtyId) {
      result = result.filter(
        (review) =>
          String(review?.doctor?.specialization_id) === String(specialtyId)
      );
    }

    if (doctorId) {
      result = result.filter(
        (review) => String(review?.doctor?.doctor_id) === String(doctorId)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((review) => {
        const doctorName = `${review?.doctor?.user?.surname || ''} ${
          review?.doctor?.user?.name || ''
        }`.toLowerCase();

        const clientName = `${review?.client?.surname || ''} ${
          review?.client?.name || ''
        }`.toLowerCase();

        const reviewText = review?.review?.toLowerCase() || '';

        return (
          doctorName.includes(query) ||
          clientName.includes(query) ||
          reviewText.includes(query)
        );
      });
    }

    setFilteredReviews(result);
  };

  const handleApproveReview = async (id) => {
    try {
      await approveReview(id);
      const [reviewsData, doctorsData] = await Promise.all([
        getAllReviews(false),
        fetchDoctorsData(),
      ]);
      const enrichedReviews = reviewsData
        .filter((review) => review.is_approved === false)
        .map((review) => ({
          ...review,
          doctor:
            doctorsData.find((d) => d.doctor_id === review.doctor_id) || null,
        }));
      setReviews(enrichedReviews);
      setFilteredReviews(enrichedReviews);
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  const handleDeleteReview = async (id) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => String(review.review_id) !== String(id))
    );
    setFilteredReviews((prevFiltered) =>
      prevFiltered.filter((review) => String(review.review_id) !== String(id))
    );
    try {
      await deleteReview(id);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
  };

  if (isLoading) {
    return <div className="p-6 text-center">Завантаження відгуків...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Помилка: {error}</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Управління відгуками</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <FiltersBarAdmin
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
          specialtyId={specialtyId}
          setSpecialtyId={setSpecialtyId}
          doctorId={doctorId}
          setDoctorId={setDoctorId}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Список відгуків</h3>

        {filteredReviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Немає відгуків за обраними критеріями
          </p>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review?.review_id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-left">
                      {review?.doctor?.user?.surname || 'Невідомий'}{' '}
                      {review?.doctor?.user?.name || ''}
                      {review?.doctor?.user?.middlename
                        ? ` ${review.doctor.user.middlename}`
                        : ''}
                    </h3>
                    <p className="text-gray-600 text-left">
                      {getSpecializationLabel(
                        review?.doctor?.specialization_id
                      )}{' '}
                      •{' '}
                      {review?.doctor?.department?.name ||
                        'Відділення не вказано'}
                    </p>
                    <p className="text-gray-800 mt-2 text-left">
                      {review?.review || 'Відгук відсутній'}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <p className="text-sm text-gray-500">
                        Пацієнт: {review?.client?.surname || 'Невідомий'}{' '}
                        {review?.client?.name || ''}
                      </p>
                      <p className="text-sm text-gray-500">
                        Дата:{' '}
                        {review?.created_at
                          ? formatDate(review.created_at)
                          : 'Дата не вказана'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-md ${getRatingColor(
                          review?.rating || 0
                        )} text-white font-bold`}
                      >
                        {review?.rating || 0}
                      </div>
                      {renderStars(review?.rating || 0)}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleApproveReview(review?.review_id)}
                        className="px-3 py-1 text-sm w-auto"
                      >
                        Схвалити
                      </Button>
                      <Button
                        onClick={() => handleDeleteReview(review?.review_id)}
                        className="px-3 py-1 text-sm w-auto bg-red-500 hover:bg-red-600"
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
