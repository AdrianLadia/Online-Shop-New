import { Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import CheckoutSummary from './CheckoutSummary';
import GoogleMaps from './GoogleMaps';
import AppContext from '../AppContext';
import { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import PaymentMethods from './PaymentMethods';
import GoogleMapsModalSelectSaveAddress from './GoogleMapsModalSelectSaveAddress';
import GoogleMapsModalSelectContactModal from './GoogleMapsModalSelectContactModal';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import paperBoyLocation from '../data/paperBoyLocation';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import CheckoutContext from '../context/CheckoutContext';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Geocode from 'react-geocode';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import Image from './ImageComponents/Image';
import AppConfig from '../AppConfig';
import firebaseConfig from '../firebase_config';
import OrdersCalendar from './OrdersCalendar';
import allowedDeliveryDates from '../../utils/classes/allowedDeliveryDates';
import CheckoutNotification from './CheckoutNotification';
import isValidPhilippinePhoneNumber from '../../utils/isValidPhilippinePhoneNumber';

const style = textFieldStyle();
const labelStyle = textFieldLabelStyle();

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const CheckoutPage = () => {
  const {
    rows,
    setRows,
    total,
    setTotal,
    totalWeight,
    setTotalWeight,
    vat,
    setVat,
    deliveryFee,
    setDeliveryFee,
    grandTotal,
    setGrandTotal,
    area,
    setArea,
    referenceNumber,
    setReferenceNumber,
  } = useContext(CheckoutContext);

  const {
    datamanipulation,
    cloudfirestore,
    userdata,
    cart,
    setCart,
    refreshUser,
    setRefreshUser,
    userstate,
    products,
    mayaRedirectUrl,
    setMayaRedirectUrl,
    setMayaCheckoutId,
    paymentMethodSelected,
    storage,
    openProfileUpdaterModal,
    firestore,
    orders,
    analytics,
    alertSnackbar,
    businesscalculations,
    affiliateUid,
    manualCustomerOrderProcess,
  } = React.useContext(AppContext);
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [localname, setLocalName] = React.useState('');
  const [localemail, setLocalEmail] = React.useState('');
  const [localphonenumber, setLocalPhoneNumber] = React.useState('');

  const [localDeliveryAddress, setLocalDeliveryAddress] = React.useState('');

  const [openModalSavedAddress, setOpenModalSavedAddress] = React.useState(false);
  const handleOpenModalSavedAddress = () => setOpenModalSavedAddress(true);
  const handleCloseModalSavedAddress = () => setOpenModalSavedAddress(false);

  const [openContactModal, setOpenContactModal] = React.useState(false);
  const handleOpenContactModal = () => setOpenContactModal(true);
  const handleCloseContactModal = () => setOpenContactModal(false);

  const [locallatitude, setLocalLatitude] = useState(10.373536960704778);
  const [locallongitude, setLocalLongitude] = useState(123.89504097627021);
  const [zoom, setZoom] = useState(18);

  const [deliveryVehicle, setDeliveryVehicle] = useState(null);
  const [needAssistance, setNeedAssistance] = useState(false);

  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [allowShipping, setAllowShipping] = useState(true);
  const [useShippingLine, setUseShippingLine] = useState(false);

  const paperboylocation = new paperBoyLocation();

  const paperboylatitude = paperboylocation.latitude;
  const paperboylongitude = paperboylocation.longitude;

  const [placedOrder, setPlacedOrder] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const navigateTo = useNavigate();

  const [mayaCheckoutItemDetails, setMayaCheckoutItemDetails] = useState(null);
  const [addressText, setAddressText] = useState('');
  const [addressGeocodeSearch, setAddressGeocodeSearch] = useState('');

  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);

  const [isInvoiceNeeded, setIsInvoiceNeeded] = useState(false);

  const [rowsMountCount, setRowsMountCount] = useState(0);

  const [urlOfBir2303, setUrlOfBir2303] = useState('');

  const [countOfOrdersThisYear, setCountOfOrdersThisYear] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [pickUpOrDeliver, setPickUpOrDeliver] = useState('deliver');
  const [allowedDates, setAllowedDates] = useState(null);
  const [kilometersFromStore, setKilometersFromStore] = useState(0);

  const [isAccountClaimed, setIsAccountClaimed] = useState(false);
  const [firstOrderDiscount, setFirstOrderDiscount] = useState(0);
  useEffect(() => {
    const ad = new allowedDeliveryDates();
    ad.runMain();
    const minDate = ad.minDate;
    const maxDate = ad.maxDate;
    const filterDate = ad.excludeDates;
    const holidays = ad.holidays;
    const isStoreOpen = ad.isStoreOpen;
    setStartDate(minDate);
    setAllowedDates(ad);
  }, []);

  // Get count of orders for this year
  useEffect(() => {
    const yearToday = new Date().getFullYear();

    const count = datamanipulation.countAllOrdersOfUserInASpecificYear(orders, yearToday);

    setCountOfOrdersThisYear(count);
  }, []);

  // Get url of bir2303
  useEffect(() => {
    const userDataUrlOfBir2303 = userdata?.bir2303Link;
    if (userDataUrlOfBir2303) {
      setUrlOfBir2303(userDataUrlOfBir2303);
    }
  }, [userdata]);

  // This is to check if account is claimed if it is not claimed then we will not ask for email

  useEffect(() => {
    function getIsAccountClaimed() {
      if (userdata) {
        if (userdata.isAccountClaimed != undefined) {
          return userdata.isAccountClaimed;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
    setIsAccountClaimed(getIsAccountClaimed());
  }, [userdata]);

  // IF PROFILE DETAILS LACKING REDIRECT TO PROFILE UPDATER MODAL
  useEffect(() => {
    if (openProfileUpdaterModal) {
      navigateTo('/shop');
    }
  }, [openProfileUpdaterModal]);

  // IF CHECKOUT SUMMARY IS EMPTY REDIRECT TO SHOP
  useEffect(() => {
    setRowsMountCount(rowsMountCount + 1);
  }, [rows]);

  useEffect(() => {
    if (rowsMountCount >= 2) {
      if (rows.length === 0) {
        navigateTo('/shop');
      }
    }
  }, [rowsMountCount]);

  // freeDelivery Checker

  // PAYMENT METHODS

  useEffect(() => {
    async function getTableData() {
      const [rows_non_state, total_non_state, total_weight_non_state, vat,firstOrderDiscount] = datamanipulation.getCheckoutPageTableDate(
        products,
        cart,
        null,
        urlOfBir2303,
        isInvoiceNeeded,
        userdata ? userdata.orders : ['hasOrders']
      );
      setVat(vat);
      setMayaCheckoutItemDetails(rows_non_state);
      setRows(rows_non_state);
      setTotal(total_non_state);
      setTotalWeight(total_weight_non_state);
      setFirstOrderDiscount(firstOrderDiscount);
    }
    getTableData();
  }, [urlOfBir2303, isInvoiceNeeded]);

  // PAYMENT METHODS
  useEffect(() => {
    if (transactionStatus != null) {
      if (transactionStatus.data === 'SUCCESS') {
        setCart({});

        businesscalculations
          .afterCheckoutRedirectLogic({
            paymentMethodSelected: paymentMethodSelected,
            referenceNumber: referenceNumber,
            grandTotal: grandTotal,
            deliveryFee: deliveryFee,
            vat: vat,
            rows: rows,
            area: area,
            fullName: userdata ? userdata.name : 'Guest',
            eMail: localemail,
            phoneNumber: userdata ? userdata.phoneNumber : localphonenumber,
            setMayaRedirectUrl: setMayaRedirectUrl,
            setMayaCheckoutId: setMayaCheckoutId,
            localDeliveryAddress: localDeliveryAddress,
            addressText: addressText,
            userId: userdata ? userdata.uid : 'GUEST',
            navigateTo: navigateTo,
            itemsTotal: total,
            date: new Date(),
            deliveryVehicle: deliveryVehicle,
            kilometersFromStore: kilometersFromStore,
          })
          .then((url) => {
            if (url) {
              // this is used for paymaya url
              alertSnackbar('info', 'Moving you to the payment page. Do not exit this page.');
              window.location.href = url;
              setPlaceOrderLoading(false);
            }
          });
        setRefreshUser(!refreshUser);
      }
      if (transactionStatus.status == 409 || transactionStatus.status == 400) {
        alertSnackbar('info', transactionStatus.data);
        setPlaceOrderLoading(false);
      }
    }
  }, [placedOrder]);

  useEffect(() => {
    setRefreshUser(!refreshUser);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const totaldifference = businesscalculations.getTotalDifferenceOfPaperboyAndSelectedLocation(
      paperboylatitude,
      paperboylongitude,
      locallatitude,
      locallongitude
    );
    const kilometers = businesscalculations.convertTotalDifferenceToKilometers(totaldifference);
    setKilometersFromStore(kilometers);
    const areasInsideDeliveryLocation = businesscalculations.getLocationsInPoint(locallatitude, locallongitude);
    let vehicleObject = 'motorcycle';
    let deliveryFee = 0;
    if (totalWeight) {
      vehicleObject = businesscalculations.getVehicleForDelivery(totalWeight, pickUpOrDeliver);
      deliveryFee = businesscalculations.getDeliveryFee(kilometers, vehicleObject, needAssistance);
    }
    setArea(areasInsideDeliveryLocation);
    const inLalamoveSericeArea = businesscalculations.checkIfAreasHasLalamoveServiceArea(areasInsideDeliveryLocation);
    if (inLalamoveSericeArea) {
      if (total >= new AppConfig().getFreeDeliveryThreshold()) {
        setDeliveryFee(0);
      } else {
        setDeliveryFee(deliveryFee);
      }
      setDeliveryVehicle(vehicleObject);
    }

    if (!areasInsideDeliveryLocation.includes('lalamoveServiceArea') && area.length > 0) {
      setDeliveryFee(500);
      setDeliveryVehicle(vehicleObject);
      setUseShippingLine(true);
    }
    let orderdata = null;
  }, [locallatitude, locallongitude, totalWeight, needAssistance, pickUpOrDeliver]);

  useEffect(() => {
    if (deliveryVehicle?.name == 'storePickUp') {
      setLocalLatitude(deliveryVehicle.latitude);
      setLocalLongitude(deliveryVehicle.longitude);
    }
  }, [deliveryVehicle]);

  async function onPlaceOrder() {
    const minimumOrder = new AppConfig().getMinimumOrder();
    setPlaceOrderLoading(true);
    if (parseFloat(total) < minimumOrder) {
      alertSnackbar('error', `Minimum order is ${minimumOrder} pesos`);
      setPlaceOrderLoading(false);
      return;
    }

    if (isInvoiceNeeded) {
      if (urlOfBir2303 === '') {
        alertSnackbar(
          'error',
          'Please upload BIR 2303 form. If BIR 2303 is not available, We will just send a delivery receipt instead.'
        );
        setPlaceOrderLoading(false);
        return;
      }
    }

    if (paymentMethodSelected == null) {
      alertSnackbar('error', 'Please select a payment method');
      setPlaceOrderLoading(false);
      return;
    }

    if (!isValidPhilippinePhoneNumber(localphonenumber)) {
      alertSnackbar('error', 'Please enter a valid Philippine phone number');
      setPlaceOrderLoading(false);
      return;
    }

    function isValidEmail(email) {
      // Regular expression pattern to validate email address
      const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

      return pattern.test(email);
    }
    if (isAccountClaimed) {
      if (!isValidEmail(localemail)) {
        alertSnackbar('error', 'Please enter a valid email');
        setPlaceOrderLoading(false);
        return;
      }
    }

    if (localname === '') {
      alertSnackbar('error', 'Please enter your name');
      setPlaceOrderLoading(false);
      return;
    }

    if (localDeliveryAddress === '') {
      alertSnackbar('error', 'Please enter your address');
      setPlaceOrderLoading(false);
      return;
    }

    try {
      const orderReferenceNumber = businesscalculations.generateOrderReference();
      setReferenceNumber(orderReferenceNumber);

      let sendEmail;
      if (new AppConfig().getIsDevEnvironment()) {
        sendEmail = false;
      } else {
        sendEmail = true;
      }

      const res = await cloudfirestore.transactionPlaceOrder({
        userid: userdata ? userdata.uid : null,
        localDeliveryAddress: localDeliveryAddress,
        locallatitude: locallatitude,
        locallongitude: locallongitude,
        userphonenumber: userdata ? userdata.phoneNumber : localphonenumber,
        username: userdata ? userdata.name : localname,
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
        eMail: localemail,
        sendEmail: sendEmail,
        isInvoiceNeeded: isInvoiceNeeded,
        urlOfBir2303: urlOfBir2303,
        countOfOrdersThisYear: countOfOrdersThisYear,
        deliveryDate: startDate.toISOString(),
        paymentMethod: paymentMethodSelected,
        userRole: userdata ? userdata.userRole : 'GUEST',
        affiliateUid: affiliateUid,
        kilometersFromStore: kilometersFromStore,
        firstOrderDiscount : firstOrderDiscount,
      });

      setTransactionStatus(res);
      setPlacedOrder(!placedOrder);
      localStorage.setItem('cart', JSON.stringify({}));
      // analytics.logPlaceOrderEvent(cart, grandTotal, localemail, localphonenumber, localname);
    } catch (err) {
      console.log(err);
      setPlaceOrderLoading(false);
    }
  }

  useEffect(() => {
    setRefreshUser(!refreshUser);
  }, []);

  useEffect(() => {
    if (userdata) {
      if (isAccountClaimed) {
        setLocalEmail(userdata.email);
      } else {
        setLocalEmail(null);
      }

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
      if (userdata.contactPerson.length == 0) {
        setLocalPhoneNumber(userdata.phoneNumber);
      }
    }
  }, [userdata, isAccountClaimed]);

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
    console.log(firstOrderDiscount, 'firstOrderDiscount');
    const grandTotal = businesscalculations.getGrandTotal(total, vat, deliveryFee,firstOrderDiscount);
    setGrandTotal(grandTotal);
  }, [total, vat, deliveryFee,firstOrderDiscount]);

  useEffect(() => {
    if (total > 0) {
      // analytics.logOpenCheckoutPageEvent(cart, total);
    }
  }, [total]);

  function searchAddress() {
    Geocode.fromAddress(addressGeocodeSearch, firebaseConfig.apiKey, 'en', 'ph').then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLocalLatitude(lat);
        setLocalLongitude(lng);
        setZoom(18);
        setAddressGeocodeSearch('');
        setLocalDeliveryAddress('');
      },
      (error) => {
        alertSnackbar('error', 'Address not found. Be more specific.');
      }
    );
  }

  async function on2303Upload(url) {
    await firestore.addBir2303Link(userdata ? userdata.uid : 'GUEST', url);
    setUrlOfBir2303(url);
  }

  async function removeBir2303() {
    await firestore.deleteBir2303Link(userdata ? userdata.uid : 'GUEST');
    setUrlOfBir2303('');
  }

  function handlePickUpOrDeliverSwitch() {
    if (pickUpOrDeliver == 'pickup') {
      setPickUpOrDeliver('deliver');
      setLocalDeliveryAddress('');
    }
    if (pickUpOrDeliver == 'deliver') {
      setPickUpOrDeliver('pickup');
      setLocalDeliveryAddress('Pick Up at Store');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col bg-gradient-to-r overflow-x-hidden bg-colorbackground ">
        <Divider sx={{ marginTop: 0.1, marginBottom: 3 }} />
        <div className="flex flex-col justify-center w-full items-center">
          <Typography variant="h6">Would you like to pick up items?</Typography>
          <Switch {...label} color="secondary" onClick={handlePickUpOrDeliverSwitch} />
        </div>

        {pickUpOrDeliver == 'deliver' ? (
          <>
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
                    className="hover:bg-color10c bg-color10b text-white rounded-lg w-4/6 xs:w-3/6 p-1 font-bold "
                    onClick={handleOpenModalSavedAddress}
                  >
                    Select From Saved Address
                  </button>
                </div>
              </div>
            </div>
            <Divider sx={{ marginTop: 1, marginBottom: 3 }} />
            <div className="flex justify-start ml-2 lg:mx-14 flex-col mb-2 ">
              <Typography>
                • <strong>Click on the map</strong> to change the delivery point.
              </Typography>
              <Typography>
                • Please <strong>pinpoint</strong> your delivery address below.
              </Typography>
              <Typography>
                • Use the <strong>search button</strong> to easily find your address and <strong>adjust the pin</strong>{' '}
                to your address.
              </Typography>
            </div>

            <div className="gap-2 p-2 flex flex-row-reverse justify-between w-11/12 self-center">
              <button
                onClick={searchAddress}
                className="p-4 text-white font-bold bg-color10b hover:bg-color10c rounded-lg mr-2 lg:mr-5"
              >
                Search
              </button>
              <TextField
                // disabled
                id="address search"
                label="Search for a landmark"
                InputLabelProps={labelStyle}
                variant="filled"
                className="w-full self-center bg-white"
                value={addressGeocodeSearch}
                onChange={(e) => setAddressGeocodeSearch(e.target.value)}
              />
            </div>
            <div className="lg:mx-14 mt-5">
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
            </div>
            <TextField
              id="addressEntry"
              label="Address (required)"
              InputLabelProps={labelStyle}
              variant="filled"
              className=" w-11/12 self-center bg-white mt-7"
              onChange={(event) => setLocalDeliveryAddress(event.target.value)}
              value={localDeliveryAddress}
            />
          </>
        ) : null}
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
                className="bg-color10b hover:bg-color10c text-white rounded-lg w-4/6 xs:w-3/6 p-1 font-bold "
                onClick={handleOpenContactModal}
              >
                Select From Saved Contacts
              </button>
            </div>
          </div>

          <TextField
            id="contactNumberEntry"
            label="Contact # (required)"
            InputLabelProps={labelStyle}
            variant="filled"
            className=" w-11/12 mt-1 bg-white"
            onChange={(event) => setLocalPhoneNumber(event.target.value)}
            value={localphonenumber || ''}
          />
          <TextField
            id="contactNameEntry"
            label="Name (required)"
            InputLabelProps={labelStyle}
            variant="filled"
            className=" w-11/12 mt-1 bg-white"
            onChange={(event) => setLocalName(event.target.value)}
            value={localname || ''}
          />
          {isAccountClaimed ? (
            <TextField
              id="emailAddressEntry"
              label="E-mail (required)"
              InputLabelProps={labelStyle}
              variant="filled"
              className=" w-11/12 mt-1 bg-white"
              onChange={(event) => setLocalEmail(event.target.value)}
              value={localemail || ''}
            />
          ) : null}
        </div>

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
                {area.includes('lalamoveServiceArea') &&
                deliveryVehicle.name != 'motorcycle' &&
                deliveryVehicle.name != 'storePickUp' ? (
                  null
                  // <div>
                  //   <Divider sx={{ marginTop: 5, marginBottom: 3 }} />
                  //   <div className="flex justify-center mt-7">
                  //     <Typography variant="h4" className="font-bold">
                  //       Assistance
                  //     </Typography>
                  //   </div>
                  //   <div className="flex justify-center items-center mt-5 px-3">
                  //     <Typography variant="h6">
                  //       Driver helps unload items?
                  //       {deliveryVehicle != null ? ' ₱' + deliveryVehicle.driverAssistsPrice : null}
                  //     </Typography>
                  //     <Switch {...label} color="secondary" onClick={() => setNeedAssistance(!needAssistance)} />
                  //   </div>
                  // </div>
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

                <div className="flex justify-center mt-7 m-5">
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
                    setMayaCheckoutItemDetails={setMayaCheckoutItemDetails}
                    rows={rows}
                    kilometersFromStore={kilometersFromStore}
                    firstOrderDiscount={firstOrderDiscount}
                  />
                )}
                {userdata ? (
                  <div className="flex flex-col lg:flex-row justify-center">
                    <div className="flex justify-center m-5">
                      <Typography variant="h6">Do you have a BIR 2303 form or COR?</Typography>
                    </div>
                    <div className="flex justify-center items-center">
                      <Switch
                        {...label}
                        checked={isInvoiceNeeded}
                        color="secondary"
                        onClick={() => setIsInvoiceNeeded(!isInvoiceNeeded)}
                      />
                    </div>
                  </div>
                ) : null}

                {isInvoiceNeeded ? (
                  urlOfBir2303 != '' ? (
                    <>
                      <div className="flex justify-center m-5">
                        <Image imageUrl={urlOfBir2303} />
                      </div>
                      <div className="flex justify-center m-5">
                        <ImageUploadButton
                          buttonTitle={'Update BIR 2303 Form'}
                          storage={storage}
                          folderName={`2303Forms/${userdata ? userdata.uid : 'GUEST'}`}
                          onUploadFunction={on2303Upload}
                        >
                          update BIR 2303
                        </ImageUploadButton>
                        <button onClick={removeBir2303} className="p-2 ml-5 rounded-lg bg-red-400 text-white">
                          Remove BIR 2303
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Typography variant="h7" className="flex justify-center mb-5 mx-5">
                        Please upload a photo below of your BIR 2303 form if you have one.
                      </Typography>
                      <ImageUploadButton
                        buttonTitle={'Upload BIR 2303 Form'}
                        storage={storage}
                        folderName={`2303Forms/${userdata ? userdata.uid : 'GUEST'}`}
                        onUploadFunction={on2303Upload}
                      />
                      <div className="flex justify-center mt-5 mx-5">
                        <Image imageUrl={urlOfBir2303} />
                      </div>
                    </div>
                  )
                ) : null}

                <Divider sx={{ marginTop: 1, marginBottom: 3 }} />
                <div className="flex flex-col justify-center m-5">
                  <div className=" flex justify-center">
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {pickUpOrDeliver == 'deliver' ? <>Delivery Date</> : <>Pick Up Date</>}
                    </Typography>
                  </div>
                  <div className="flex justify-center mt-5 mb-5">
                    <OrdersCalendar
                      startDate={startDate}
                      setStartDate={setStartDate}
                      minDate={allowedDates ? allowedDates.minDate : null}
                      maxDate={allowedDates ? allowedDates.maxDate : null}
                      filterDate={allowedDates ? allowedDates.excludeDates : null}
                      disabledDates={allowedDates ? allowedDates.holidays : null}
                    />
                  </div>
                </div>

                <Divider sx={{ marginTop: 1, marginBottom: 3 }} />

                <div className="flex justify-center m-5">
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Payment
                  </Typography>
                </div>

                <PaymentMethods
                  pickUpOrDeliver={pickUpOrDeliver}
                  itemsTotalPrice={total}
                  userdata={userdata}
                  email={localemail}
                  phoneNumber={localphonenumber}
                />

                <Divider sx={{ marginTop: 5, marginBottom: 3 }} />

                <div className="flex w-full justify-center my-5 items ">
                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={5}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    label="Delivery Notes"
                    color="primary"
                    InputLabelProps={labelStyle}
                    className="rounded-md w-9/12 2xl:w-2/6 xl:w-3/6  "
                    sx={style}
                  />
                </div>

                <div className="flex justify-center mt-2 mb-6">
                  <button
                    id="placeorderbutton"
                    onClick={onPlaceOrder}
                    className="hover:bg-color10c bg-color10b text-white text-lg font-bold py-3 px-6 rounded-xl mb-5 "
                    disabled={placeOrderLoading}
                  >
                    {placeOrderLoading ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p>Processing your order.</p>
                        <p>Please wait and do not refresh the page.</p>
                        <CircularProgress size={50} style={{ color: 'white' }} sx={{ marginTop: 1 }} />
                      </div>
                    ) : (
                      'Place Order'
                    )}
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
        <CheckoutNotification allowedDates={allowedDates} />
      </div>
    </ThemeProvider>
  );
};

export default CheckoutPage;

// Shipping and billing information forms for the customer to fill out
// Payment information, such as a credit card or PayPal form

// Terms and conditions, and/or a privacy policy

// Option for entering a promotional code or gift card
