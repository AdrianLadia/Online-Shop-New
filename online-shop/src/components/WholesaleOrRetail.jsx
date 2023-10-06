import { Typography } from '@mui/material';
import isFirstDayOfMonth from 'date-fns/isFirstDayOfMonth/index';
import React, { useContext,useRef } from 'react';
import { useState } from 'react';
import AppContext from '../AppContext';
import { AiFillHeart } from 'react-icons/ai';
import AppConfig from '../AppConfig';

const WholesaleOrRetail = (props) => {
  const setWholesale = props.setWholesale;
  const setRetail = props.setRetail;
  const wholesale = props.wholesale;
  const retail = props.retail;
  const { setSelectedCategory,selectedCategory,setCategoryValue,categories} = useContext(AppContext);
  const wholesaleOrRetailRef = props.wholesaleOrRetailRef;

  function onWholesaleClick() {
    setWholesale(true);
    setRetail(false);
    
  }

  function onRetailClick() {
    if (selectedCategory == 'Favorites') {
      const featuredCategory = new AppConfig().getFeaturedCategory();
      setSelectedCategory(featuredCategory);
      categories.forEach((category, index) => {

        if (category === featuredCategory) {
          setCategoryValue(index);
        }
      });
    }
    setWholesale(false);
    setRetail(true);
  }

  function buttonStyle(no) {
    if (no == 1) {
      if (wholesale == true && retail == false) {
        return ' text-white ';
      }
    } else if (no == 2) {
      if (retail == true && wholesale == false) {
        return ' text-white';
      }
    }
  }

  function responsiveButtonColorPack() {
    if (retail) {
      return 'shadow-xl bg-color10b  ';
    } else {
      return 'bg-gray-400 text-bg-color10b';
    }
  }

  function responsiveButtonColorBox() {
    if (wholesale) {
      return 'shadow-xl bg-color10b';
    } else {
      return 'bg-gray-400 text-bg-color10b';
    }
  }

  function checkIfWholesaleOrRetailSelected() {
    if (wholesale || retail) {;
      return true;
    }
    else {
      return false;
    }
  }

  function responsiveButtonColorFavorites() {
    if (selectedCategory == 'Favorites' && !checkIfWholesaleOrRetailSelected()) {
      return 'shadow-xl bg-color10b  ';
    } else {
      return 'bg-gray-400 text-bg-color10b';
    }
  }

  function onFavoritesClick() {
    setSelectedCategory('Favorites');
    setWholesale(false);
    setRetail(false);
    setCategoryValue(0)
  }

  return (
    <div className="from-colorbackground  via-color2 to-color1 flex flex-col items-center drop-shadow-xl  ">
      <div ref={wholesaleOrRetailRef} className="flex">
        <Typography className="text-2xl font-semibold mt-5 mb-5 text-gray-700">Purchase items by</Typography>
      </div>
      <div className="flex flex-row justify-center">
        <button
          onClick={onWholesaleClick}
          // className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-color10a hover:bg-color30 hover:border-color10a lg:w-40 hover:animate-pulse"
          // className=" mr-1 mt-5 flex-none font-semibold p-3 rounded-full bg-gradient-to-r from-color30 to-color10a lg:w-40 hover:animate-pulse"
          className={
            ' mr-1  flex-none font-semibold p-3 rounded-full w-3/5 2xs:w-32 lg:w-40 hover:animate-pulse text-white ' +
            responsiveButtonColorBox()
          }
        >
          <Typography>BOX</Typography>
        </button>
        <button
          onClick={onRetailClick}
          // className="ml-1  flex-none font-semibold p-3 rounded-full bg-color10a hover:bg-color30 hover:border-color10a lg:w-40 hover:animate-pulse"
          // className="ml-1  flex-none font-semibold p-3 rounded-full bg-gradient-to-l from-color30 to-color10a lg:w-40 hover:animate-pulse"
          className={
            'ml-1  flex-none font-semibold p-3 rounded-full w-3/5 2xs:w-32 lg:w-40 hover:animate-pulse text-white ' +
            responsiveButtonColorPack()
          }
        >
          <Typography>PACK</Typography>
        </button>
        <button className={' ml-2  flex-none font-semibold p-3 rounded-full  hover:animate-pulse text-white ' + responsiveButtonColorFavorites()}  onClick={onFavoritesClick} >
          <AiFillHeart className="text-2xl" color='red' />
        </button>
      </div>
    </div>
  );
};

export default WholesaleOrRetail;
