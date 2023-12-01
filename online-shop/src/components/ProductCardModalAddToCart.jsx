import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';
import Divider from '@mui/material/Divider';

const ProductCardModalAddToCart = ({
  setModal,
  addtocart,
  count,
  setCount,
  itemData,
  setOpenSnackbar,
  setShakeCartAnimation,
}) => {
  const { analytics, cart, setUpdateCartInfo, updateCartInfo, alertSnackbar, userdata, businesscalculations } =
    useContext(AppContext);
  const itemId = itemData.itemId;
  const unit = itemData.unit;

  const stocksAvailable = itemData.stocksAvailable;
  const averageSalesPerDay = itemData.averageSalesPerDay;

  function AddToCart() {
    setUpdateCartInfo(!updateCartInfo);
    let cartQuantity = cart[itemId];
    if (cartQuantity === undefined) {
      cartQuantity = 0;
    }
    const totalOrder = cartQuantity + parseInt(count);

    function getStocksAvailable() {
      return stocksAvailable;
    }

    function getAverageSalesPerDay() {
     
      return averageSalesPerDay;
    }
    if (unit == 'Pack') {
      if (userdata?.userRole != 'superAdmin') {
        if (
          totalOrder >
          businesscalculations.getStocksAvailableLessSafetyStock(getStocksAvailable(), getAverageSalesPerDay())
        ) {
          alertSnackbar('error', 'Not enough stocks available');
          return;
        }
      }
    } else {
      if (userdata?.userRole != 'superAdmin') {
       
        if (
          totalOrder >
          businesscalculations.getStocksAvailableLessSafetyStock(getStocksAvailable(), getAverageSalesPerDay(), false)
        ) {
          alertSnackbar('error', 'Not enough stocks available');
          return;
        }
      }
    }

    if (count > 0) {
      // opens snackbar
      setOpenSnackbar(true);
      // adds to cart
      console.log(itemId,count)
      addtocart(itemId, count);
      //analytics
      analytics.logAddToCartEvent(itemId, itemData.itemName, itemData.category, count, itemData.price);
      //back to 0
      setCount(0);
      //close modal
      setModal(false);
      //shake cart
      setShakeCartAnimation(true);
    }
  }


  return (
    <div className="flex flex-col mt-5">
      <div className="flex flex-row justify-evenly">
        <Typography variant="h6">₱ {count * itemData.price}</Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="h6">{count * itemData.pieces} pieces</Typography>
      </div>
      <div className="flex w-full justify-center my-5">
        <div className="flex flex-col w-32 justify-center items-center">
          <div className="flex flex-row justify-between w-full">
            <button
              className="bg-color10b text-white h-10 w-10 rounded-lg text-2xl"
              onClick={() => {
                if (count > 0) {
                  setCount(count - 1);
                }
              }}
            >
              -
            </button>

            <Typography variant="h4">{count}</Typography>
            <button
              onClick={() => {
                setCount(count + 1);
              }}
              className="bg-color10b text-white h-10 w-10 rounded-lg text-2xl"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center my-5">
        <button className="bg-color10b text-white p-3 rounded-lg w-full mx-5" onClick={AddToCart}>
          {' '}
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCardModalAddToCart;
