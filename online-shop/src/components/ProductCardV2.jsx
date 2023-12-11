import React from 'react';
import AppContext from '../AppContext';
import { useState, useEffect, useContext } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { set } from 'date-fns';
import { is } from 'date-fns/locale';

const ProductCardV2 = ({ searchedItemId, itemData, setModal, setClickedProduct, openSnackbar, setOpenSnackbar }) => {
  const [heart, setHeart] = useState(false);
  const {
    firestore,
    analytics,
    alertSnackbar,
    userdata,
    favoriteitems,
    setFavoriteItems,
    products,
    isAdmin,
    isSuperAdmin,
    isDistributor,
  } = useContext(AppContext);

  const itemName = itemData.itemName;
  const imageUrl = itemData.imageLinks[0];
  const price = itemData.price;
  // const
  const itemId = itemData.itemId;
  const category = itemData.category;
  const [wholesaleStocks, setWholesaleStocks] = useState(null);
  const [wholesalePrice, setWholesalePrice] = useState(null);

  useEffect(() => {
    try {
      const wholesaleItemId = itemData.itemId.replace(/-RET$/, '');
      const find = products.find((product) => product.itemId === wholesaleItemId);
      const stocksAvailable = find.stocksAvailable;
      const p = find.price;
      setWholesaleStocks(stocksAvailable);
      setWholesalePrice(p);
    } catch {}
  }, [searchedItemId, products]);

  function onHeartClick() {
    if (userdata === null) return alertSnackbar('info', 'Login to add items to favorites');

    if (heart) {
      setHeart(!heart);
      setFavoriteItems(favoriteitems.filter((item) => item !== itemId));
      firestore.removeItemFromFavorites(userdata.uid, itemId);
    } else {
      setHeart(!heart);
      setFavoriteItems([...favoriteitems, itemId]);
      firestore.addItemToFavorites(userdata.uid, itemId);
    }
  }

  function showModal() {
    setModal(true);
    console.log('item clicked', itemData.itemId);
    setClickedProduct(itemData);
    firestore.updateProductClicks(itemId, userdata ? userdata.uid : 'GUEST', userdata?.userRole);
    analytics.logOpenProductModalEvent(itemId, itemName, category);
  }

  useEffect(() => {
    if (favoriteitems.includes(itemId)) {
      setHeart(true);
    } else {
      setHeart(false);
    }
  }, [itemData]);

  return (
    <div className={'max-w-sm rounded overflow-hidden shadow-lg bg-white relative mx-10 my-10'}>
      <div className="relative" onClick={showModal}>
        <img className="w-full h-96 object-cover" src={imageUrl} alt={itemName} />
        <button className="absolute bottom-4 right-4 rounded-full bg-color10b text-white h-12 w-12 flex items-center justify-center text-4xl">
          +
        </button>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{itemName}</div>
        {isAdmin || isSuperAdmin || isDistributor ? (
          <>
            {!isDistributor ? (
              <p className="text-gray-700 text-base">Retail Stocks Available : {itemData.stocksAvailable} </p>
            ) : null}
            <p className="text-gray-700 text-base">
              <>
                {!isDistributor ? <>Wholesale Stocks Available</> : <>Stocks Available</>} : {wholesaleStocks} 
              </>
              </p>
            {!isDistributor ? <p className="text-gray-700 text-base">Retail Price : ₱ {price} </p> : null}
            <p className="text-gray-700 text-base">Wholesale Price : ₱ {wholesalePrice} </p>
          </>
        ) : null}
      </div>
      <div className="absolute top-0 right-0 p-4">
        <button className="text-gray-600 hover:text-gray-800">
          {/* Heart Icon from Heroicons (https://heroicons.com/) */}
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3z" />
              </svg> */}
          {heart ? (
            <AiFillHeart id={itemId} size={40} onClick={onHeartClick} className=" cursor-pointer text-red-500 " />
          ) : (
            <AiOutlineHeart
              size={40}
              onClick={onHeartClick}
              color="white"
              className=" cursor-pointer hover:text-red-500"
            />
          )}
        </button>
      </div>
      <div>
        <Snackbar
          className="mb-5 lg:mb-5"
          variant="success"
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={openSnackbar}
          onClose={() => {
            setOpenSnackbar(false);
          }}
          message={'Added to cart'}
          action={
            <Button
              color="success"
              size="small"
              onClick={() => {
                setOpenSnackbar(false);
              }}
            >
              {' '}
              Close{' '}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default ProductCardV2;
