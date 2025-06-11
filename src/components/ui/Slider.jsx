import React, { useState, useEffect, useCallback } from 'react';
import doubleArrowLeft from '../../assets/icons/doubleArrowLeft.svg';
import doubleArrowRight from '../../assets/icons/doubleArrowRight.svg';
export function Slider({ images, autoPlay = true, autoPlayInterval = 6000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('none');

  const goToNext = useCallback(() => {
    setSlideDirection('next');
    if (images && images.length > 0) {
      setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    }
  }, [images]);

  const goToPrevious = useCallback(() => {
    setSlideDirection('prev');
    if (images && images.length > 0) {
      setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    }
  }, [images]);

  useEffect(() => {
    if (!autoPlay || !images || images.length < 2) return;
    const id = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, images, goToNext]);

  useEffect(() => {
    if (slideDirection === 'none') return;
    const timer = setTimeout(() => setSlideDirection('none'), 550);
    return () => clearTimeout(timer);
  }, [slideDirection]);

  if (!images || images.length === 0) {
    return <div className="text-center p-5 italic">No images to display</div>;
  }

  const animationClass =
    slideDirection === 'next'
      ? 'animate-slideInFromRight'
      : slideDirection === 'prev'
      ? 'animate-slideInFromLeft'
      : '';

  return (
    <div
      className="relative w-2/4 mx-auto overflow-hidden"
      style={{ minHeight: '300px' }}
    >
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/35 bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full z-10 transition-colors"
      >
        <img src={doubleArrowLeft} alt="Previous" className="w-6 h-6" />
      </button>

      <div className="w-full h-full flex items-center justify-center">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className={`block w-full h-auto transition-all duration-500 ease-in-out ${animationClass}`}
        />
      </div>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/35 bg-opacity-30 hover:bg-opacity-50 p-2 rounded-full z-10 transition-colors"
      >
        <img src={doubleArrowRight} alt="Next" className="w-6 h-6" />
      </button>
    </div>
  );
}
