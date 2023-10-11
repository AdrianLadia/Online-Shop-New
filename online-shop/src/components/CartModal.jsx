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

const CartModal = (props) => {
  const openCart = props.openCart;
  const setOpenCart = props.setOpenCart;
  const finalCartData = props.finalCartData;
  const totalPrice = props.totalPrice;

  const [cartisempty, setCartisempty] = useState(true);
  const { width, height } = useWindowDimensions();
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
    firestore.createUserCart({ cart: [] }, userdata.uid);
  }

  useEffect(() => {
    CheckIfCartIsEmpty();
    console.log(finalCartData);
  }, [finalCartData]);

  return (
    <Modal open={openCart} onClose={CloseCart}>
      <Fade in={openCart}>
        <Box sx={style} className="flex flex-col p-8 rounded-2xl overflow-y-auto bg-colorbackground border-color60">
          <div className="flex flex-row justify-between mb-4">
            <QuotationCreatorButton
              arrayOfProductData={finalCartData}
              deliveryFee={0}
              companyName="Star Pack"
              senderName=""
            />
            <button
              id="closeCartButton"
              onClick={CloseCart}
              className="bg-red1 hover:bg-red-400 p-2 rounded-full w-10 text-white"
            >
              X
            </button>
          </div>
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
                    className="bg-red1h-10 mt-5 hover:bg-red-400 bg-red1 p-2 rounded-lg text-white "
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
