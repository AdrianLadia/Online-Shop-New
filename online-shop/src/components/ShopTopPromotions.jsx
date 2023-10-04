import React from 'react';
import ReactPlayer from 'react-player';
import { Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

const ShopTopPromotions = ({ setTopPromotionsInView }) => {
  const myElement = useRef(null);

  function isElementOutOfView(el) {
    if (!el) return true;

    const rect = el.getBoundingClientRect();

    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (myElement.current) {
        const outOfView = isElementOutOfView(myElement.current);
        setTopPromotionsInView(!outOfView);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // The emp
  return (
    <div ref={myElement} className="flex w-full text-gray-700 flex-col gap-5 mt-5 justify-center">
      <Typography variant="h5" className="text-center text font-bold">
        How to order
      </Typography>
      <div className="w-full flex justify-center">
        <ReactPlayer
          url="https://youtu.be/Gf_teseuqGE"
          controls={true}
          // ... other props
        />
      </div>
    </div>
  );
};

export default ShopTopPromotions;
