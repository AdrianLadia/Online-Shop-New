import React, { useState } from 'react';
import { HiArrowSmallRight } from "react-icons/hi2";
import { HiArrowSmallLeft } from "react-icons/hi2";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex) => Math.min(currentIndex + 1, images.length - 1));
  };

  function selectImage(index) {
    setCurrentIndex(index);
  }

  return (
    <div className="flex flex-col">
      <img src={images[currentIndex]} alt={`Slide ${currentIndex}`} />
      <div className="flex flex-row justify-between mt-2 p-3">
        {/* <button onClick={goToPrevious} disabled={currentIndex === 0}>
          {'<'} Back
        </button> */}
        <HiArrowSmallLeft size={30} onClick={goToPrevious} disabled={currentIndex === 0}/>
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 mt-2.5 bg-${currentIndex === index ? 'color10b' : 'gray-300'} rounded-full`}
            onClick={() => selectImage(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
        <HiArrowSmallRight size={30} onClick={goToNext} disabled={currentIndex === images.length - 1}/>
      </div>
    </div>
  );
};

export default ImageCarousel;
