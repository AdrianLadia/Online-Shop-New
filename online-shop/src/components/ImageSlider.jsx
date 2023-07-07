import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Image from './ImageComponents/Image';

const ImageSlider = (props) => {
  const id = props.id;
  const imageLinks = props.imageLinks;

  const max = imageLinks.length;
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
    if (sliderValue === 1 && 1 <= imageLinks.length) {
      setIndex(0);
    } else if (sliderValue === 2 && 2 <= imageLinks.length) {
      setIndex(1);
    } else if (sliderValue === 3 && 3 <= imageLinks.length) {
      setIndex(2);
    } else if (sliderValue === 4 && 4 <= imageLinks.length) {
      setIndex(3);
    } else if (sliderValue === 5 && 5 <= imageLinks.length) {
      setIndex(4);
    } else if (sliderValue === 6 && 6 <= imageLinks.length) {
      setIndex(5);
    } else if (sliderValue === 7 && 7 <= imageLinks.length) {
      setIndex(6);
    } else if (sliderValue === 8 && 8 <= imageLinks.length) {
      setIndex(7);
    } else if (sliderValue === 9 && 1 <= imageLinks.length) {
      setIndex(8);
    } else if (sliderValue === 10 && 1 <= imageLinks.length ) {
      setIndex(9);
    }
  }, [sliderValue]);

  return (
    <div id={id} className="flex flex-col items-center justify-center mt-5">
      <Image
        imageUrl={imageLinks[index]}
        className={'md:2/6 lg:w-1/2 ' + ifBlur()}
        onLoad={() => {
          setBlur(false);
        }}
        divClassName={'flex justify-center'}
      />
      {/* <img className={ 'md:2/6 lg:w-1/2 ' + ifBlur() } src={imageLinks[index]} alt="product" onLoad={() => { 
            setBlur(false)    
        }}/> */}
      <div className="w-3/4 md:2/6 lg:w-2/5 mt-5">
        <Slider
          aria-label="rotation slider"
          defaultValue={0}
          getAriaValueText={valuetext}
          
          step={1}
          marks
          min={1}
          max={max}
        />
      </div>
      <div className="flex flex-row mt-5">
      </div>
      {/* <Slider defaultValue={30} step={10} marks min={10} max={110} disabled /> */}
    </div>
  );
};

export default ImageSlider;
