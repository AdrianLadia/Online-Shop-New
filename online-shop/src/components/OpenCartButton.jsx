import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useContext, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CartModal from './CartModal';

import { Outlet, useLocation } from 'react-router-dom';
import AppContext from '../AppContext';
import CircularProgress from '@mui/material/CircularProgress';
import businessCalculations from '../../utils/businessCalculations';
import dataManipulation from '../../utils/dataManipulation';
import AppConfig from '../AppConfig';

const OpenCartButton = (props) => {
  const businesscalculations = new businessCalculations();
  const datamanipulation = new dataManipulation();
  let [totalPrice, setTotalPrice] = useState(0);
  let [openCart, setOpenCart] = useState(false);
  let [finalCartData, setFinalCartData] = useState([]);
  const shakeCartAnimation = props.shakeCartAnimation;
  const setShakeCartAnimation = props.setShakeCartAnimation;

  const location = useLocation();
  const { analytics,refreshUser, setRefreshUser, userstate, cart, setCart, products, updateCartInfo, setUpdateCartInfo } =
    useContext(AppContext);

  function onAddToCartClick(product) {
    let stocksAvailable = 1000000000000
    products.forEach((item) => {
      if (item.itemId == product ) {
        if (item.unit == 'Pack') {
          stocksAvailable = item.stocksAvailable - new AppConfig().getRetailSafetyStock()
        }
        else {
          
          const safetyStock = businesscalculations.getSafetyStock(item.averageSalesPerDay)
          stocksAvailable = item.stocksAvailable - safetyStock
        }
      }
    });
    const newCart = businesscalculations.addToCart(cart, product, stocksAvailable);
    setUpdateCartInfo(!updateCartInfo);
    setCart(newCart);
  }

  function RemoveFromCart(product) {
    const newCart = businesscalculations.removeFromCart(cart, product);
    setUpdateCartInfo(!updateCartInfo);
    setCart(newCart);
  }

  function GetPricePerProduct() {
    let prices = [];

    Object.entries(cart).map(([key, value]) => {
      products.map((product, index) => {
        if (key === product.itemId) {
          prices.push({
            itemimage: product.imageLinks[0],
            itemName: product.itemName,
            itemId: key,
            quantity: value,
            pieces: product.pieces,
            totalPieces: value * product.pieces,
            price: product.price,
            total: product.price * value,
            addbutton: (
              <button
                id="addToCartIncrement"
                onClick={() => onAddToCartClick(key)}
                className="bg-color60 hover:bg-color10c text-white font-bold py-2 px-4 rounded"
              >
                +
              </button>
            ),
            removebutton: (
              <button
                id="addToCartDecrement"
                onClick={() => RemoveFromCart(key)}
                className="bg-red1 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
              >
                -
              </button>
            ),
            category: product.category,
          });
        }
      });
    });

    // Get Total Price
    let total_price = 0;
    prices.map((item, index) => {
      total_price += item.total;
    });

    setTotalPrice(total_price);
    prices.sort((a, b) => {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return 0;
    });
    setFinalCartData(prices);
  }

  useEffect(() => {
    GetPricePerProduct();
  }, [cart, products, updateCartInfo]);

  useEffect(() => {
    setRefreshUser(!refreshUser);
  }, []);

  function GetQuantity() {
    let count = 0;
    Object.entries(cart).map(([key, value]) => {
      count += value;
    });
    return count;
  }

  function ViewCart() {
    analytics.logOpenCartEvent(cart);
    setOpenCart(true);
  }

  function CloseCart() {
    setOpenCart(false);
  }

  useEffect(() => {
    if (shakeCartAnimation) {
      setTimeout(() => {
        setShakeCartAnimation(false);
      }, 500);
    }
  }, [shakeCartAnimation]);

  function responsiveShakeCartAnimation() {
    if (shakeCartAnimation) {
      return 'animate-shake';
    }
  }

  return (
    <div>
      <div className="flex fixed bottom-20 w-full justify-center z-50">
        <button
          id="opencartbutton"
          onClick={ViewCart}
          className={
            ' bg-color10b text-white font-bold py-3 px-4 rounded-full w-2/4 lg:w-1/5 xl:w-72 2xl:w-1/6 position fixed bottom-2 content-center ' +
            responsiveShakeCartAnimation()
          }
        >
          {userstate !== 'userloading' ? (
            <div className="flex flex-row justify-center">
              <div>
                <span className="flex h-3 w-3 ">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none bg-color10a rounded-full">
                    {GetQuantity()}
                  </span>
                </span>
                <AiOutlineShoppingCart size={25} />
              </div>
              <div className="mt-0.5 flex flex-row ml-3">
                <Typography variant="h6"> ₱ </Typography>
                <Typography sx={{ marginLeft: 1 }} id="totalPrice" variant="h6">
                  {' '}
                  {totalPrice.toLocaleString()}{' '}
                </Typography>
              </div>
            </div>
          ) : (
            <CircularProgress />
          )}
        </button>
      </div>
      <div>
        <CartModal
          openCart={openCart}
          setOpenCart={setOpenCart}
          finalCartData={finalCartData}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
};

export default OpenCartButton;
