import React, { useEffect } from 'react';
import { Modal, Typography } from '@material-ui/core';
import Box from '@mui/material/Box';
import { useContext, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import useWindowDimensions from './UseWindowDimensions';
import CheckoutButton from './CheckoutButton';
import CartTable from './CartTable';
import Fade from '@mui/material/Fade';
import AppContext from '../AppContext';
import QuotationCreatorButton from './QuotationCreatorButton';
import { CircularProgress } from '@material-ui/core';

const CartModal = (props) => {
  const openCart = props.openCart;
  const setOpenCart = props.setOpenCart;
  const finalCartData = props.finalCartData;
  const totalPrice = props.totalPrice;

  const [cartisempty, setCartisempty] = useState(true);
  const { width, height } = useWindowDimensions();
  const [outStocksLoading, setOutStocksLoading] = useState(false);
  const { userdata, firestore, setCart } = React.useContext(AppContext);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
    width: '95%',

    '@media (min-width: 1024px)': {
      width: '85%',
    },

    bgcolor: 'background.paper',
    border: '2px solid #000',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  let rows = finalCartData;

  function CloseCart() {
    setOpenCart(false);
  }

  function CheckIfCartIsEmpty() {
    if (finalCartData.length >= 1) {
      setCartisempty(false);
    } else {
      setCartisempty(true);
    }
  }

  function clearCart() {
    setCart({});
    if (userdata) {
      firestore.createUserCart({ cart: [] }, userdata.uid);
    }
  }

  useEffect(() => {
    CheckIfCartIsEmpty();
  }, [finalCartData]);

  async function outStocksClick() {
    setOutStocksLoading(true);
    await firestore.transactionOutStocks(finalCartData);
    setCart({});
    setOutStocksLoading(false);
  }

  return (
    <Modal open={openCart} onClose={CloseCart}>
      <Fade in={openCart}>
        <Box
          sx={style}
          className="flex flex-col p-8 rounded-2xl overflow-y-auto h-9/10 bg-colorbackground border-color60"
        >
          <div className="flex flex-row justify-between mb-4">
            <div className="flex flex-row gap-5">
              <QuotationCreatorButton
                arrayOfProductData={finalCartData}
                deliveryFee={0}
                companyName="Star Pack"
                senderName=""
              />
              {userdata?.userRole === 'superAdmin' ? (
                <button
                  onClick={outStocksClick}
                  className="py-2 px-3 bg-color10b rounded text-white hover:bg-blue-700 "
                  disabled={outStocksLoading}
                >
                  {outStocksLoading ? <CircularProgress size={20} /> : <>Out Stocks</>}
                </button>
              ) : null}
            </div>
            <button onClick={CloseCart} className="bg-gray-200 text-black rounded-full text-2xl h-10 w-10">
              x
            </button>
          </div>
          {/* <div className="flex">
           
          </div> */}
          <div className="flex flex-row-reverse mb-4"></div>
          <div className="flex flex-row justify-between p-2">
            <FaShoppingCart size={35} />
            <Typography id="modal-modal-title" variant="h6" component="h2" className="ml-auto font-bold">
              Cart Total: ₱ {totalPrice.toLocaleString()}
            </Typography>
          </div>

          {/* TABLE  */}
          {cartisempty ? <> Cart is empty </> : <CartTable rows={rows} />}

          <div className="flex ">
            {cartisempty ? (
              <> </>
            ) : (
              
              <div className="flex flex-row justify-between w-full p-4">
                <div>
                  <button
                    id="clearCartButton"
                    onClick={clearCart}
                    className="bg-red1h-10 mt-5 hover:bg-gray-400 bg-gray-200 px-3 py-2 rounded-lg text-black "
                  >
                    Clear Cart
                  </button>
                </div>
                <div>
                  <CheckoutButton setOpenCart={setOpenCart} totalPrice={totalPrice} />
                </div>
              </div>
            )}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CartModal;
