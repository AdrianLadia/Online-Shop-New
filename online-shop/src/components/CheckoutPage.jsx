import { Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import CheckoutSummary from './CheckoutSummary';
import GoogleMaps from './GoogleMaps';
import AppContext from '../AppContext';
import { useState } from 'react';
import TextField from '@mui/material/TextField';

import PaymentMethods from './PaymentMethods';
import CheckoutPageContext from './CheckoutPageContext';
import PaymayaSdk from './PaymayaSdk';
import GoogleMapsModalSelectSaveAddress from './GoogleMapsModalSelectSaveAddress';
import GoogleMapsModalSelectContactModal from './GoogleMapsModalSelectContactModal';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import businessCalculations from '../../utils/businessCalculations';
import paperBoyLocation from '../data/paperBoyLocation';
import cloudFirestoreDb from '../cloudFirestoreDb';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import PaymentMethodContext from '../context/PaymentMethodContext';
import { useNavigate } from 'react-router-dom';
import dataManipulation from '../../utils/dataManipulation';

const style = textFieldStyle();
const labelStyle = textFieldLabelStyle();

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const CheckoutPage = () => {
  const datamanipulation = new dataManipulation();
  const { userdata, firestore, cart, setCart, refreshUser, setRefreshUser, userstate, products } =
    React.useContext(AppContext);

  const [selectedAddress, setSelectedAddress] = useState(false);
  const [payMayaCardSelected, setPayMayaCardSelected] = useState(false);
  const [total, setTotal] = React.useState(0);
  const [localname, setLocalName] = React.useState('');
  const [localemail, setLocalEmail] = React.useState('');
  const [localphonenumber, setLocalPhoneNumber] = React.useState('');
  const [vat, setVat] = React.useState(0);
  const [deliveryFee, setDeliveryFee] = React.useState(0);
  const [grandTotal, setGrandTotal] = React.useState(0);
  const [localDeliveryAddress, setLocalDeliveryAddress] = React.useState('');
  const cloudfirestoredb = new cloudFirestoreDb();

  const [openModalSavedAddress, setOpenModalSavedAddress] = React.useState(false);
  const handleOpenModalSavedAddress = () => setOpenModalSavedAddress(true);
  const handleCloseModalSavedAddress = () => setOpenModalSavedAddress(false);

  const [openContactModal, setOpenContactModal] = React.useState(false);
  const handleOpenContactModal = () => setOpenContactModal(true);
  const handleCloseContactModal = () => setOpenContactModal(false);

  const [locallatitude, setLocalLatitude] = useState(10.373536960704778);
  const [locallongitude, setLocalLongitude] = useState(123.89504097627021);
  const [zoom, setZoom] = useState(18);

  const [totalWeight, setTotalWeight] = useState(0);
  const [deliveryVehicle, setDeliveryVehicle] = useState(null);
  const [needAssistance, setNeedAssistance] = useState(false);
  const [area, setArea] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [allowShipping, setAllowShipping] = useState(true);
  const [useShippingLine, setUseShippingLine] = useState(false);
  const paperboylocation = new paperBoyLocation();
  const businesscalculations = new businessCalculations();
  const cloudfirestore = new cloudFirestoreDb();

  const paperboylatitude = paperboylocation.latitude;
  const paperboylongitude = paperboylocation.longitude;

  const [placedOrder, setPlacedOrder] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState('SUCCESS');
  const navigateTo = useNavigate();
  const [mayaRedirectUrl, setMayaRedirectUrl] = useState(null);
  const [mayaCheckoutId, setMayaCheckoutId] = useState(null);
  const [mayaCheckoutItemDetails,setMayaCheckoutItemDetails] = useState(null);
  const [addressText, setAddressText] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  // PAYMENT METHODS
  const [bdoselected, setBdoselected] = useState(false);
  const [unionbankselected, setUnionbankselected] = useState(false);
  const [gcashselected, setGcashselected] = useState(false);
  const [mayaselected, setMayaselected] = useState(false);
  const [visaselected, setVisaselected] = useState(false);
  const [mastercardselected, setMastercardselected] = useState(false);
  const [bitcoinselected, setBitcoinselected] = useState(false);
  const [ethereumselected, setEthereumselected] = useState(false);
  const [solanaselected, setSolanaselected] = useState(false);

  const paymentMethodValues = {
    bdoselected,
    setBdoselected,
    unionbankselected,
    setUnionbankselected,
    gcashselected,
    setGcashselected,
    mayaselected,
    setMayaselected,
    visaselected,
    setVisaselected,
    mastercardselected,
    setMastercardselected,
    bitcoinselected,
    setBitcoinselected,
    ethereumselected,
    setEthereumselected,
    solanaselected,
    setSolanaselected,
  };

  // PAYMENT METHODS
  useEffect(() => {
    if (mayaselected) {
      if (transactionStatus === 'SUCCESS') {
        console.log('ran sdk');
        const firstName={localname.split(' ')[0]}
        const lastName={localname.split(' ')[1]}
        const eMail={localemail}
        const phoneNumber={localphonenumber}
        const totalPrice={grandTotal}
        PaymayaSdk(setMayaRedirectUrl, setMayaCheckoutId,firstName,lastName,eMail,phoneNumber,totalPrice,localDeliveryAddress,addressText,referenceNumber);
      }
    }
  }, [placedOrder]);

  useEffect(() => {
    console.log('ran maya redirect');
    if (mayaRedirectUrl != null) {
      window.location.href = mayaRedirectUrl;
    }
  }, [mayaRedirectUrl]);

  useEffect(() => {
    setRefreshUser(!refreshUser);
  }, []);

  useEffect(() => {
    console.log('ran asdasdasd');
    const totaldifference = businesscalculations.getTotalDifferenceOfPaperboyAndSelectedLocation(
      paperboylatitude,
      paperboylongitude,
      locallatitude,
      locallongitude
    );
    const kilometers = businesscalculations.convertTotalDifferenceToKilometers(totaldifference);
    const areasInsideDeliveryLocation = businesscalculations.getLocationsInPoint(locallatitude, locallongitude);
    const vehicleObject = businesscalculations.getVehicleForDelivery(totalWeight);
    const deliveryFee = businesscalculations.getDeliveryFee(kilometers, vehicleObject, needAssistance);
    setArea(areasInsideDeliveryLocation);
    const inLalamoveSericeArea = businesscalculations.checkIfAreasHasLalamoveServiceArea(areasInsideDeliveryLocation);
    if (inLalamoveSericeArea) {
      setDeliveryFee(deliveryFee);
      setDeliveryVehicle(vehicleObject);
    }

    if (!areasInsideDeliveryLocation.includes('lalamoveServiceArea') && area.length > 0) {
      setDeliveryFee(500);
      setDeliveryVehicle(vehicleObject);
      setUseShippingLine(true);
    }
    let orderdata = null;
  }, [locallatitude, locallongitude, totalWeight, needAssistance]);

  function generateOrderReference() {
    const date = new Date();
    const randomNumber = Math.floor(Math.random() * 1000000);
    return (
      date.getHours().toLocaleString() +
      date.getMinutes().toLocaleString() +
      date.getMonth().toString() +
      date.getDate().toString() +
      date.getFullYear().toString() +
      '-' +
      randomNumber
    );
  }

  async function onPlaceOrder() {
    // Check if order has enough stocks
    const readproducts = products;
    const [outOfStockDetected, message] = await businesscalculations.checkStocksIfAvailableInFirestore(cart);
    if (outOfStockDetected) {
      alert(message);
      return;
    }

    // Check if userstate is userloaded
    if (userstate === 'userloaded') {
      try {

        const orderReferenceNumber = generateOrderReference();
        setReferenceNumber(orderReferenceNumber);

        console.log(total);
        const res = await cloudfirestoredb.transactionPlaceOrder({
          userid: userdata.uid,
          localDeliveryAddress: localDeliveryAddress,
          locallatitude: locallatitude,
          locallongitude: locallongitude,
          userphonenumber: userdata.phoneNumber,
          username: userdata.name,
          orderDate: new Date(),
          localname: localname,
          localphonenumber: localphonenumber,
          cart: cart,
          itemstotal: total,
          vat: vat,
          shippingtotal: deliveryFee,
          grandTotal: grandTotal,
          reference: orderReferenceNumber,
          deliveryNotes: deliveryNotes,
          totalWeight: totalWeight,
          deliveryVehicle: deliveryVehicle.name,
          needAssistance: needAssistance,
        });
        console.log(res.data);
        setTransactionStatus(res.data);
        setPlacedOrder(!placedOrder);
      } catch (err) {
        console.log(err);
      }

      setCart([]);
    }
  }

  useEffect(() => {
    setRefreshUser(!refreshUser);
  }, []);

  useEffect(() => {
    if (userdata) {
      setLocalEmail(userdata.email);

      if (userdata.contactPerson.length > 0) {
        setLocalPhoneNumber(userdata.contactPerson[0].phoneNumber);
        setLocalName(userdata.contactPerson[0].name);
      }
      if (userdata.deliveryAddress.length > 0) {
        setLocalDeliveryAddress(userdata.deliveryAddress[0].address);
        setLocalLatitude(userdata.deliveryAddress[0].latitude);
        setLocalLongitude(userdata.deliveryAddress[0].longitude);
        setZoom(15);
      }
    }
  }, [userdata]);

  useEffect(() => {
    if (!area.includes('lalamoveServiceArea') && area.length > 0) {
      if (total + vat < 10000) setAllowShipping(false);
      else {
        setAllowShipping(true);
      }
    } else {
      setAllowShipping(true);
    }
  }, [area]);

  useEffect(() => {
    const grandTotal = businesscalculations.getGrandTotal(total, vat, deliveryFee);
    setGrandTotal(grandTotal);
  }, [total, vat, deliveryFee]);

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col bg-gradient-to-r overflow-x-hidden from-colorbackground via-color2 to-color1 ">
        <Divider sx={{ marginTop: 0.1, marginBottom: 3 }} />

        <div className="flex flex-col self-center items-center gap-6 w-full">
          <div className="flex flex-row w-full justify-between ml-4 my-5">
            <div className="flex justify-center w-full p-3">
              <Typography variant="h4" className="font-bold">
                Delivery Address
              </Typography>
            </div>
            <div className="flex justify-center w-full">
              <button
                id="selectFromSavedAddressButton"
                className="bg-color10b hover:bg-blue-400 rounded-lg w-3/6 font-bold "
                onClick={handleOpenModalSavedAddress}
              >
                Select From Saved Address
              </button>
            </div>
          </div>
          <TextField
            id="addressEntry"
            label="Address"
            InputLabelProps={labelStyle}
            variant="filled"
            className=" w-11/12 self-center mb-5 bg-white"
            onChange={(event) => setLocalDeliveryAddress(event.target.value)}
            value={localDeliveryAddress}
          />
          
          <TextField
            disabled
            id="googleAddress"
            label="Google Pipoint Address"
            InputLabelProps={labelStyle}
            variant="filled"
            className=" w-11/12 self-center mb-5 bg-white"     
            value={addressText}
          />
        </div>

        <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

        <GoogleMaps
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          locallatitude={locallatitude}
          setLocalLatitude={setLocalLatitude}
          locallongitude={locallongitude}
          setLocalLongitude={setLocalLongitude}
          setLocalDeliveryAddress={setLocalDeliveryAddress}
          zoom={zoom}
          setZoom={setZoom}
          setAddressText={setAddressText}
        />

        <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

        <div className="flex flex-col self-center items-center gap-6 w-full">
          <div className="flex flex-row w-full justify-between ml-4 my-5">
            <div className="flex justify-center w-full p-3">
              <Typography variant="h4" className="font-bold">
                Contact Details
              </Typography>
            </div>
            <div className="flex justify-center w-full ">
              <button
                id="selectFromSavedContactsButton"
                className="bg-color10b hover:bg-blue-400 rounded-lg w-3/6 font-bold "
                onClick={handleOpenContactModal}
              >
                Select From Saved Contacts
              </button>
            </div>
          </div>

          <TextField
            id="contactNumberEntry"
            label="Contact #"
            InputLabelProps={labelStyle}
            variant="filled"
            className=" w-11/12 mt-1 bg-white"
            onChange={(event) => setLocalPhoneNumber(event.target.value)}
            value={localphonenumber || ''}
          />
          <TextField
            id="contactNameEntry"
            label="Name"
            InputLabelProps={labelStyle}
            variant="filled"
            className=" w-11/12 mt-1 bg-white"
            onChange={(event) => setLocalName(event.target.value)}
            value={localname || ''}
          />
        </div>

        <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

        {allowShipping == false ? (
          <div className="flex justify-center my-5">
            <Typography variant="h7" color="red">
              Minimum order outside Cebu is 10000 pesos
            </Typography>
          </div>
        ) : (
          <>
            {area.length == 0 ? (
              <div className="flex justify-center my-5">
                <Typography variant="h7" color="red">
                  Sorry we cant deliver to your selected area
                </Typography>
              </div>
            ) : (
              <>
                {area.includes('lalamoveServiceArea') ? (
                  <div>
                    <div className="flex justify-center mt-7">
                      <Typography variant="h4" className="font-bold">
                        Assistance
                      </Typography>
                    </div>
                    <div className="flex justify-center items-center mt-5">
                      <Typography variant="h6">
                        Driver helps unload items?
                        {deliveryVehicle != null ? ' ₱' + deliveryVehicle.driverAssistsPrice : null}
                      </Typography>
                      <Switch {...label} color="secondary" onClick={() => setNeedAssistance(!needAssistance)} />
                    </div>
                  </div>
                ) : null}

                {area.includes('lalamoveServiceArea') || area.length == 0 ? null : (
                  <div className="flex justify-center mt-5 mb-5">
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Shipping Option
                    </Typography>
                  </div>
                )}

                {area.includes('davaoArea') ? (
                  <div className="flex flex-col justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Davao Port via Sulpicio Lines</Typography>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                      When we ship to your place we will charge 500 pesos to deliver it to the port. This includes Cebu
                      Port Authority, and Handling Charges.
                    </Typography>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                      In order to claim the items from the Port you need to pay the shipping fee in their office.
                    </Typography>
                  </div>
                ) : null}

                {area.includes('iloiloArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Iloilo Port via Cokaliong or Trans Asia</Typography>
                  </div>
                ) : null}

                {area.includes('leyteMaasinArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Leyte Maasin Port via Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('cagayanDeOroArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">
                      We can ship to Cagayan De Oro Port cia Trans Asia, Cokaliong or Sulpicio.
                    </Typography>
                  </div>
                ) : null}

                {area.includes('surigaoArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Surigao Port via Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('butuanArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Butuan Port via Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('dapitanArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Dapitan Port via Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('zamboangaArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Zamboanga Port via Alison.</Typography>
                  </div>
                ) : null}

                {area.includes('pagadianArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Pagadian Port via Roble.</Typography>
                  </div>
                ) : null}

                {area.includes('generalSantosArea text-center mx-10') ? (
                  <div className="flex justify-center">
                    <Typography variant="h6">We can ship to General Santos Port via Sulpicio.</Typography>
                  </div>
                ) : null}

                {area.includes('bacolodArea text-center mx-10') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">
                      We can ship to Bacolod Port via Diamante trucking, or your preferred logistics company.
                    </Typography>
                  </div>
                ) : null}

                {area.includes('dumagueteArea text-center mx-10') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">
                      We can ship to Dumaguete using Matiao Trucking, or your preferred logistics company.
                    </Typography>
                  </div>
                ) : null}

                {area.includes('boholArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Bohol Port via Lite Shipping.</Typography>
                  </div>
                ) : null}

                {area.includes('masbateArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Masbate Port via Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('manilaArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Manila Port via 2GO, or Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('samarArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Samar Port via Cokaliong.</Typography>
                  </div>
                ) : null}

                {area.includes('leytePalomponArea') ? (
                  <div className="flex justify-center text-center mx-10">
                    <Typography variant="h6">We can ship to Leyte Palompon Port via Cokaliong</Typography>
                  </div>
                ) : null}

                <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

                {/* {area.includes("lalamoveServiceArea") ||
              area.length == 0 ? null : (
               
              )} */}

                <div className="flex justify-center mt-7 my-5">
                  <Typography variant="h4" className="font-bold">
                    Checkout Summary
                  </Typography>
                </div>

                {area.length == 0 ? null : (
                  <CheckoutSummary
                    total={total}
                    setTotal={setTotal}
                    vat={vat}
                    deliveryFee={deliveryFee}
                    grandTotal={grandTotal}
                    totalWeight={totalWeight}
                    setTotalWeight={setTotalWeight}
                    deliveryVehicleObject={deliveryVehicle}
                    setDeliveryVehicle={setDeliveryVehicle}
                    setVat={setVat}
                    area={area}
                    setMayaCheckoutItemDetails = {setMayaCheckoutItemDetails}
                  />
                )}
                <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

                <div className="flex justify-center m-5">
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Payment
                  </Typography>
                </div>

                <PaymentMethodContext.Provider value={paymentMethodValues}>
                  <PaymentMethods />
                </PaymentMethodContext.Provider>

                <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

                <div className="flex w-full justify-center my-5 items ">
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={5}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    label="Delivery Notes"
                    color="secondary"
                    InputLabelProps={labelStyle}
                    className="rounded-md w-9/12 2xl:w-2/6 xl:w-3/6  "
                    sx={style}
                  />
                </div>

                <div className="flex justify-center mt-2">
                  <button
                    id="placeorderbutton"
                    onClick={onPlaceOrder}
                    className="bg-color10b hover:bg-blue-600 text-white text-lg font-bold py-3 px-6 rounded-xl mb-5"
                  >
                    {' '}
                    Place Order{' '}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <GoogleMapsModalSelectSaveAddress
          open={openModalSavedAddress}
          handleClose={handleCloseModalSavedAddress}
          setLocalDeliveryAddress={setLocalDeliveryAddress}
          setLocalLatitude={setLocalLatitude}
          setLocalLongitude={setLocalLongitude}
          setZoom={setZoom}
        />
        <GoogleMapsModalSelectContactModal
          open={openContactModal}
          handleClose={handleCloseContactModal}
          setLocalName={setLocalName}
          setLocalPhoneNumber={setLocalPhoneNumber}
        />

        {/* // A summary of the items in the customer's shopping cart */}

        {/* // Order total, including tax and shipping */}
        {/* // A button or link to submit the order */}
        {/* MODAL // Option for creating an account or signing in, if the customer has an account with the website */}
      </div>
    </ThemeProvider>
  );
};

export default CheckoutPage;

// Shipping and billing information forms for the customer to fill out
// Payment information, such as a credit card or PayPal form

// Terms and conditions, and/or a privacy policy

// Option for entering a promotional code or gift card
