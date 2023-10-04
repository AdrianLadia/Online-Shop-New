import { Typography } from '@mui/material';
import React from 'react';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';

const ScrollTopButton = (props) => {

  const wholesaleOrRetailRef = props.wholesaleOrRetailRef

  function scrollUp() {
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'smooth', // if you want a smooth scrolling effect
    // });
    wholesaleOrRetailRef.current.scrollIntoView({ behavior: 'smooth' });
  }


  const {categorySelectorInView,topPromotionsInView} = props;

  return (
    <div className="flex fixed top-5 w-full justify-center z-50">
      {/* <button className='position fixed bottom-2 content-center bg-color10b'> */}
      {categorySelectorInView || topPromotionsInView ? null : 
      <button onClick={scrollUp} className="rounded-full bg-color10b px-3 py-1">
        <div className="flex flex-row hover:">
          <BsFillArrowUpCircleFill color="white" />
          <Typography sx={{ fontSize: 11, fontStyle: 'bold', marginLeft: 1, color: 'White' }}>Back to Top</Typography>
        </div>
      </button>
      }
    </div>
  );
};

export default ScrollTopButton;
