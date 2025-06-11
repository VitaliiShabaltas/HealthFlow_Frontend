import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import backIcon from '../assets/icons/backNav.svg';
import { Button } from '../components/ui/Button';
import { RecForm } from '../components/shared/RecForm';
import { RecView } from '../components/shared/RecView';

export function HealthCardPage() {
  const { clientId } = useParams();
  const [adding, setAdding] = useState(false);
  const [medicalCards, setMedicalCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMedicalCards = async () => {
      try {
        const response = await fetch(
          `https://healthflowbackend-production.up.railway.app/medical-card/${clientId}`
        );
        const data = await response.json();
        setMedicalCards(data || []);
      } catch (error) {
        console.error('Failed to fetch medical cards', error);
      }
    };

    if (clientId) fetchMedicalCards();
  }, [clientId]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < medicalCards.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 bg-white mt-25 mb-25 p-17 shadow rounded-xl relative">
      <div className="relative flex items-center justify-center mb-9">
        <h2 className="text-2xl font-bold">Медична карта</h2>
        <div
          onClick={() => window.history.back()}
          className="absolute right-0 flex items-center text-gray-600 font-semibold cursor-pointer"
        >
          <img
            src={backIcon}
            alt="Назад"
            className="w-4 h-4 cursor-pointer mr-2"
          />
          Назад
        </div>
      </div>

      <div className="flex justify-center items-center bg-white mt-4">
        {adding ? (
          <RecForm onCancel={() => setAdding(false)} clientId={clientId} />
        ) : (
          <RecView
            data={medicalCards[currentIndex]}
            onPrev={handlePrev}
            onNext={handleNext}
            index={currentIndex}
            total={medicalCards.length}
          />
        )}
      </div>

      {!adding && (
        <div className="mt-6 text-center">
          <Button onClick={() => setAdding(true)}>Додати рекомендацію</Button>
        </div>
      )}
    </div>
  );
}
