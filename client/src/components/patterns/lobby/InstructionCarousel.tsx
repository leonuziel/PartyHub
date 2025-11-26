import React, { useState, useEffect } from 'react';
import './InstructionCarousel.css';

interface InstructionSlide {
  title: string;
  text: string;
  imageUrl?: string;
}

interface InstructionCarouselProps {
  slides: InstructionSlide[];
  autoPlayInterval?: number; // in seconds
}

export const InstructionCarousel: React.FC<InstructionCarouselProps> = ({ slides, autoPlayInterval = 5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, autoPlayInterval * 1000);

    return () => clearInterval(intervalId);
  }, [slides.length, autoPlayInterval]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="instruction-carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className="carousel-slide" key={index}>
            {slide.imageUrl && <img src={slide.imageUrl} alt={slide.title} className="slide-image" />}
            <h3 className="slide-title">{slide.title}</h3>
            <p className="slide-text">{slide.text}</p>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};
