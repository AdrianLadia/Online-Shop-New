import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const ImageSlider = (props) => {
  const id = props.id;
  const imageLinks = props.imageLinks;
  const max = (imageLinks.length) * 45;
  const [sliderValue, setSliderValue] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [blur, setBlur] = React.useState(true);

  function valuetext(value) {
    setSliderValue(value);
  }

  useEffect(() => {
    setBlur(true);
  }, [sliderValue]);

  function ifBlur() {
    if (blur) {
      return 'filter blur-sm';
    } else {
      return '';
    }
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
    } else if (sliderValue === 45 && 2 <= imageLinks.length) {
      setIndex(1);
    } else if (sliderValue === 90 && 3 <= imageLinks.length) {
      setIndex(2);
    } else if (sliderValue === 135 && 4 <= imageLinks.length) {
      setIndex(3);
    } else if (sliderValue === 180 && 5 <= imageLinks.length) {
      setIndex(4);
    } else if (sliderValue === 225 && 6 <= imageLinks.length) {
      setIndex(5);
    } else if (sliderValue === 270 && 7 <= imageLinks.length) {
      setIndex(6);
    } else if (sliderValue === 315 && 8 <= imageLinks.length) {
      setIndex(7);
    } else if (sliderValue === 360 && 1 <= imageLinks.length) {
      setIndex(0);
    }
  }, [sliderValue]);

  return (
    <div id={id} className='flex flex-col items-center mt-5'>
      <img className={ 'md:2/6 lg:w-2/5 ' + ifBlur() } src={imageLinks[index]} alt="product" onLoad={() => { 
            setBlur(false)    
        }}/>
        <div className='w-3/4 md:2/6 lg:w-2/5 mt-5'>
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
        </div>
        {/* <Slider defaultValue={30} step={10} marks min={10} max={110} disabled /> */}
   
    </div>
  );
};

export default ImageSlider;
