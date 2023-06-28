import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const ImageSlider = (props) => {
  const id = props.id;
  const imageLinks = props.imageLinks;
  const max = (imageLinks.length - 1) * 45;
  const [sliderValue, setSliderValue] = React.useState(0);
  const [index, setIndex] = React.useState(0);

  function valuetext(value) {
    setSliderValue(value);
  }

  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    // Preload all the images
    const preloadImages = async () => {
      try {
        const promises = imageLinks.map((link) => loadImage(link));
        await Promise.all(promises);
        console.log('Images preloaded!');
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();

  }, [imageLinks]);

  useEffect(() => {
    if (sliderValue === 0 && 1 <= imageLinks.length) {
        setIndex(0);
    }
    else if (sliderValue === 45 && 2 <= imageLinks.length) {
        setIndex(1);
    }
    else if (sliderValue === 90 && 3 <= imageLinks.length) {
        setIndex(2);
    }
    else if (sliderValue === 135 && 4 <= imageLinks.length) {
        setIndex(3);
    }
    else if (sliderValue === 180 && 5 <= imageLinks.length) {
        setIndex(4);
    }
    else if (sliderValue === 225 && 6 <= imageLinks.length) {
        setIndex(5);
    }
    else if (sliderValue === 270 && 7 <= imageLinks.length) {
        setIndex(6);
    }
    else if (sliderValue === 315 && 8 <= imageLinks.length) {
        setIndex(7);
    }
    else if (sliderValue === 360 && 1 <= imageLinks.length) {
        setIndex(0);
    }
  }, [sliderValue]);

    useEffect(() => {
        console.log(index);
    }, [index]);

  return (
    <div id={id}>
        <img src={imageLinks[index]} alt="product" />
      <Box sx={{ width: 300 }}>
        <Slider
          aria-label="rotation slider"
          defaultValue={0}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={45}
          marks
          min={0}
          max={max}
        />
        {/* <Slider defaultValue={30} step={10} marks min={10} max={110} disabled /> */}
      </Box>
    </div>
  );
};

export default ImageSlider;
