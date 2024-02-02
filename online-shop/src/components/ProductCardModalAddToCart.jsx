import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useState, useContext } from 'react';
import AppContext from '../AppContext';
import Divider from '@mui/material/Divider';
import { set } from 'date-fns';

const ProductCardModalAddToCart = ({
  setModal,
  addtocart,
  count,
  setCount,
  retailData,
  wholesaleData,
  setOpenSnackbar,
  setShakeCartAnimation,
  radioButtonSelected,
}) => {
  const { analytics, cart, setUpdateCartInfo, updateCartInfo, alertSnackbar, userdata, businesscalculations } =
    useContext(AppContext);

  
    const [unit, setUnit] = useState('Pack');
    const [stocksAvailable, setStocksAvailable] = useState(retailData.stocksAvailable);
    const [averageSalesPerDay, setAverageSalesPerDay] = useState(retailData.averageSalesPerDay);
    const [price, setPrice] = useState(retailData.price);
    const [pieces, setPieces] = useState(retailData.pieces);
    const [itemId, setItemId] = useState(retailData.itemId);
    const [itemName, setItemName] = useState(retailData.itemName);
    const [category, setCategory] = useState(retailData.category);
    useEffect(() => {
      if (radioButtonSelected === 'Pack') {
        setUnit('Pack');
        setStocksAvailable(retailData.stocksAvailable);
        setAverageSalesPerDay(retailData.averageSalesPerDay);
        setPrice(retailData.price);
        setPieces(retailData.pieces);
        setItemId(retailData.itemId);
        setItemName(retailData.itemName);
        setCategory(retailData.category);
      } else {
        setUnit('Box');
        setStocksAvailable(wholesaleData.stocksAvailable);
        setAverageSalesPerDay(wholesaleData.averageSalesPerDay);
        setPrice(wholesaleData.price);
        setPieces(wholesaleData.pieces);
        setItemId(wholesaleData.itemId);
        setItemName(wholesaleData.itemName);
        setCategory(wholesaleData.category);
      }
    }, [radioButtonSelected,wholesaleData,retailData]);
  


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
      if (!['superAdmin','distributor'].includes(userdata? userdata.userRole : 'GUEST')) {
        if (
          totalOrder >
          businesscalculations.getStocksAvailableLessSafetyStock(getStocksAvailable(), getAverageSalesPerDay())
        ) {
          alertSnackbar('error', 'Not enough stocks available');
          return;
        }
      }
    } else {
      if (!['superAdmin','distributor'].includes(userdata ? userdata.userRole : 'GUEST')  ) {
       
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
      addtocart(itemId, count);
      //analytics
      // analytics.logAddToCartEvent(itemId, itemName, category, count, price);
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
        <Typography variant="h6">₱ {count * price}</Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="h6">{count * pieces} pieces</Typography>
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
