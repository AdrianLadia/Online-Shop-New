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
import TextField from '@mui/material/TextField';
import { set } from 'date-fns';

const CartModal = (props) => {
  const openCart = props.openCart;
  const setOpenCart = props.setOpenCart;
  const finalCartData = props.finalCartData;
  const totalPrice = props.totalPrice;

  const [cartisempty, setCartisempty] = useState(true);
  const { width, height } = useWindowDimensions();
  const [outStocksLoading, setOutStocksLoading] = useState(false);
  const {
    userdata,
    firestore,
    setCart,
    manualCustomerOrderProcess,
    isAppleDevice,
    isAndroidDevice,
    isGoogleChrome,
    isAffiliate,
    isDistributor,
    affiliateUid,
    ipAddress,
    isSupportedBrowser,
    isAdmin,
    isSuperAdmin,
  } = React.useContext(AppContext);
  const [openCreateQuotationModal, setOpenCreateQuotationModal] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState('');
  const [balance, setBalance] = useState('');
  const [note, setNote] = useState('');
  const [openSecretLog, setOpenSecretLog] = useState(false);

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

  const childModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '50%',
    transform: 'translate(-50%, -50%)',
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

  function secretFunction() {
    setOpenSecretLog(true);
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
              {['superAdmin', 'admin', 'distributor', 'affiliate'].includes(userdata?.userRole) ||
              manualCustomerOrderProcess == true ? (
                <button
                  onClick={() => setOpenCreateQuotationModal(true)}
                  className="py-2 px-3 bg-color10b rounded text-white hover:bg-blue-700 "
                  disabled={outStocksLoading}
                >
                  Download as PDF
                </button>
              ) : null}

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
          {cartisempty ? <div onClick={secretFunction}> Cart is empty </div> : <CartTable rows={rows} />}

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
          {openSecretLog ? (
            <div className="flex flex-col gap-1 overflow-y-auto">
              <div className="border-b-2">userId: {userdata ? userdata.uid : ''}</div>
              <div className="border-b-2">manualCustomerOrderProcess: {manualCustomerOrderProcess.toString()}</div>
              <div className="border-b-2">isAppleDevice: {isAppleDevice.toString()}</div>
              <div className="border-b-2">isAndroidDevice: {isAndroidDevice.toString()}</div>
              <div className="border-b-2">isGoogleChrome: {isGoogleChrome.toString()}</div>
              <div className="border-b-2">affiliateUid: {affiliateUid}</div>
              <div className="border-b-2">ipAddress: {ipAddress}</div>
              <div className="border-b-2">device: {window.navigator.userAgent}</div>
              <div className="border-b-2">isSupportedBrowser: {isSupportedBrowser.toString()}</div>
              <div className="border-b-2">isAdmin: {isAdmin.toString()}</div>
              <div className="border-b-2">isSuperAdmin: {isSuperAdmin.toString()}</div>
              <div className="border-b-2">isAffiliate: {isAffiliate.toString()}</div>
              <div className="border-b-2">isDistributor: {isDistributor.toString()}</div>
            </div>
          ) : null}
          <Modal
            open={openCreateQuotationModal}
            onClose={() => setOpenCreateQuotationModal(false)}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{ ...childModalStyle, width: '90%' }}>
              <div className="flex flex-col justify-center gap-6">
                <TextField
                  required
                  id="outlined-basic123"
                  label="Delivery Fee"
                  variant="outlined"
                  sx={{ marginTop: 1 }}
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                />
                <TextField
                  required
                  id="outlined-basic123"
                  label="Balance"
                  variant="outlined"
                  sx={{ marginTop: 1 }}
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
                <TextField
                  required
                  id="outlined-basic123"
                  label="Note"
                  variant="outlined"
                  value={note}
                  sx={{ marginTop: 1 }}
                  onChange={(e) => setNote(e.target.value)}
                />
                <div className="flex justify-center">
                  <QuotationCreatorButton
                    arrayOfProductData={finalCartData}
                    deliveryFee={deliveryFee}
                    balance={balance}
                    note={note}
                    companyName="Star Pack"
                    senderName=""
                  />
                </div>
              </div>
              {/* <Button onClick={handleClose}>Close Child Modal</Button> */}
            </Box>
          </Modal>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CartModal;
