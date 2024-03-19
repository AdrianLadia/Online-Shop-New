import { Typography } from '@mui/material';
import React from 'react';
import { useEffect, startTransition } from 'react';
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
import NavBar from './NavBar';
import { Radio } from '@mui/material';
import { AiOutlineShopping } from 'react-icons/ai';
import { CiDeliveryTruck } from 'react-icons/ci';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FaRegSave } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import { BiImageAdd } from 'react-icons/bi';
import uploadFileToFirebaseStorage from './ImageComponents/ImageUploadFunction.js';

const style = textFieldStyle();
const labelStyle = textFieldLabelStyle();

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const RadioButton = ({ step, setStep, stepName, steps, index }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    console.log('setting step', stepName);
    setStep(stepName);
  };

  useEffect(() => {
    const toCheckIncludeList = steps.slice(index);
    console.log(stepName, toCheckIncludeList);
    if (toCheckIncludeList.includes(step)) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [step]);

  return (
    <>
      {index !== 0 && <hr style={{ border: checked ? '1px solid green' : '1px solid black', width: '100%' }} />}
      <Radio
        checked={checked}
        onClick={handleChange}
        value="a"
        name="radio-buttons"
        inputProps={{ 'aria-label': 'A' }}
      />
    </>
  );
};

const StepBar = ({ step, setStep, steps }) => {
  return (
    <div className="flex flex-row items-center">
      {steps.map((stepName, index) => {
        return (
          <>
            <RadioButton step={step} setStep={setStep} stepName={stepName} steps={steps} index={index} />
          </>
        );
      })}
    </div>
  );
};

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
    products,
    setMayaRedirectUrl,
    setMayaCheckoutId,
    paymentMethodSelected,
    storage,
    openProfileUpdaterModal,
    firestore,
    orders,
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

  const [urlOfBir2303, setUrlOfBir2303] = useState(null);

  const [countOfOrdersThisYear, setCountOfOrdersThisYear] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [pickUpOrDeliver, setPickUpOrDeliver] = useState('deliver');
  const [allowedDates, setAllowedDates] = useState(null);
  const [kilometersFromStore, setKilometersFromStore] = useState(0);

  const [isAccountClaimed, setIsAccountClaimed] = useState(false);
  const [firstOrderDiscount, setFirstOrderDiscount] = useState(0);

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      const url = await uploadFileToFirebaseStorage({
        file,
        fileName: null,
        folderName: `2303Forms/${userdata ? userdata.uid : 'GUEST'}`,
        storage,
        resize: false,
      });
      on2303Upload(url);
    } catch (error) {
      alertSnackbar('error', error.message);
    }
  };
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
      startTransition(() => navigateTo('/shop'));
    }
  }, [openProfileUpdaterModal]);

  // IF CHECKOUT SUMMARY IS EMPTY REDIRECT TO SHOP
  useEffect(() => {
    setRowsMountCount(rowsMountCount + 1);
  }, [rows]);

  useEffect(() => {
    if (rowsMountCount >= 2) {
      if (rows.length === 0) {
        startTransition(() => navigateTo('/shop'));
      }
    }
  }, [rowsMountCount]);

  // freeDelivery Checker

  // PAYMENT METHODS

  useEffect(() => {
    async function getTableData() {
      const [rows_non_state, total_non_state, total_weight_non_state, vat, firstOrderDiscount] =
        datamanipulation.getCheckoutPageTableDate(
          products,
          cart,
          null,
          urlOfBir2303,
          isInvoiceNeeded,
          userdata ? userdata.orders : ['hasOrders']
        );
      console.log(vat);
      console.log(total_non_state);
      console.log(firstOrderDiscount);
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
            manualCustomerOrderProcess: manualCustomerOrderProcess,
            contactName: localname,
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
      if (urlOfBir2303 === null) {
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
        firstOrderDiscount: firstOrderDiscount,
        manualCustomerOrderProcess: manualCustomerOrderProcess,
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
    const grandTotal = businesscalculations.getGrandTotal(total, vat, deliveryFee, firstOrderDiscount);
    setGrandTotal(grandTotal);
  }, [total, vat, deliveryFee, firstOrderDiscount]);

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
    setIsInvoiceNeeded(false);
    setUrlOfBir2303(null);
  }

  useEffect(() => {
    if (userdata) {
      if (userdata.bir2303Link != '') {
        setUrlOfBir2303(userdata.bir2303Link);
        setIsInvoiceNeeded(true);
      } else {
        setIsInvoiceNeeded(false);
        setUrlOfBir2303('');
      }
    }
  }, []);

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
  const steps = [
    'Choose A Method',
    'Enter Delivery Information',
    'Provide Contact Information',
    'BIR 2303 Information',
    'Review and Confirm Order',
    'Add Delivery Note',
    'Payment Method',
  ];
  const [step, setStep] = useState(steps[0]);

  useEffect(() => {
    console.log('urlOfBir2303', urlOfBir2303);
  }, [urlOfBir2303]);

  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen flex flex-col items-center justify-evenly gap-5">
        {/* <div className="w-full">
          <NavBar />
        </div> */}
        <div className="w-full  lg:w-1/2">
          <StepBar step={step} setStep={setStep} steps={steps} />
        </div>
        <div className="flex flex-row items-center justify-between w-full lg:w-1/2 px-2 ">
          <FaArrowLeft
            onClick={() => {
              if (step == steps[0]) {
                navigateTo('/shop');
              } else {
                setStep(steps[steps.indexOf(step) - 1]);
              }
            }}
            size={30}
            className="text-color10b hover:cursor-pointer"
          />
          {step}
          <FaArrowRight
            onClick={() => {
              if (step == steps[steps.length - 1]) {
                return;
              } else {
                setStep(steps[steps.indexOf(step) + 1]);
              }
            }}
            size={30}
            className="text-color10b hover:cursor-pointer"
          />
        </div>
        {step == 'Choose A Method' ? (
          <div className=" flex h-full w-full items-center justify-center">
            <div className=" flex flex-col lg:flex-row gap-10 lg:gap-20 -mt-12  ">
              <button
                onClick={() => {
                  setStep('Provide Contact Information');
                  setPickUpOrDeliver('pickup');
                }}
                className="flex flex-col rounded-lg p-3 bg-color10a text-white items-center  w-52 h-52 justify-center hover:bg-color10c"
              >
                <AiOutlineShopping size={150} />
                Pick Up
              </button>
              <button
                onClick={() => {
                  setStep('Enter Delivery Information');
                  setPickUpOrDeliver('deliver');
                }}
                className="flex flex-col items-center justify-center rounded-lg p-3 bg-color10a text-white  w-52 h-52  hover:bg-color10c"
              >
                <CiDeliveryTruck size={150} />
                Deliver
              </button>
            </div>
          </div>
        ) : null}
        {step == 'Enter Delivery Information' ? (
          pickUpOrDeliver == 'deliver' ? (
            <div className=" flex flex-col h-full w-full items-center gap-2 ">
              <div className="w-full flex flex-row justify-between">
                <div className="flex justify-start ml-2 lg:mx-14 flex-col mb-2 ">
                  {/* <Typography>
                    • <strong>Click on the map</strong> to change the delivery point.
                  </Typography> */}
                  <Typography>
                    • Please <strong>pinpoint</strong> your delivery address below.
                  </Typography>
                  {/* <Typography>
                    • Use the <strong>search button</strong> to easily find your address and{' '}
                    <strong>adjust the pin</strong> to your address.
                  </Typography> */}
                </div>
              </div>

              <div className="flex flex-row w-11/12 gap-5  items-center">
                <TextField
                  // disabled
                  id="address search"
                  label="Search for a City / Barangay"
                  InputLabelProps={labelStyle}
                  variant="filled"
                  className=" w-full self-center bg-white  rounded-lg"
                  value={addressGeocodeSearch}
                  onChange={(e) => setAddressGeocodeSearch(e.target.value)}
                />
                <button
                  onClick={searchAddress}
                  className="hover:bg-gray-400 bg-gray-200 p-3 rounded-lg text-black w-32 font-bold h-full"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setOpenModalSavedAddress(true);
                  }}
                  className="hover:bg-gray-400 bg-gray-200 h-full p-2.5 w-32 flex justify-center items-center rounded-lg text-black"
                >
                  <FaRegSave size={30} />
                </button>
              </div>
              <div className="flex w-full h-full lg:px-12 ">
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
              <div className="flex flex-row w-11/12 lg:w-full  justify-between lg:justify-center">
                <TextField
                  id="addressEntry"
                  label="Address (required)"
                  InputLabelProps={labelStyle}
                  variant="filled"
                  className=" bg-white lg:w-11/12 w-full"
                  onChange={(event) => setLocalDeliveryAddress(event.target.value)}
                  value={localDeliveryAddress}
                />
              </div>
              <div className="flex flex-row justify-between px-5 w-full mb-8 lg:justify-center lg:gap-5  ">
                <div className="flex flex-col">
                  <span className="text-color10b">Delivery Date</span>
                  <OrdersCalendar
                    startDate={startDate}
                    setStartDate={setStartDate}
                    minDate={allowedDates ? allowedDates.minDate : null}
                    maxDate={allowedDates ? allowedDates.maxDate : null}
                    filterDate={allowedDates ? allowedDates.excludeDates : null}
                    disabledDates={allowedDates ? allowedDates.holidays : null}
                  />
                </div>
                <div className="flex flex-col  h-full  justify-end ">
                  <button
                    onClick={() => {
                      if (localDeliveryAddress.length > 0) {
                        setStep('Provide Contact Information');
                      } else {
                        alertSnackbar('error', 'Please enter your address');
                      }
                    }}
                    className="p-3 rounded-lg flex-end font-bold text-white bg-color10a hover:bg-color10c h-12"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex justify-center items-center text-center">
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    You have selected pick up.
                  </Typography>
                  <Typography variant="h5" component="h2">
                    No need to fill up this part.
                  </Typography>
                </CardContent>
              </Card>
            </div>
          )
        ) : null}

        {step == 'Provide Contact Information' ? (
          <div className=" flex flex-col h-full justify-center w-full items-center gap-5">
            <div className="flex flex-col lg:w-1/2 w-11/12 items-center  rounded-lg border-2 shadow-2xl ">
              <div className="flex justify-start w-full  p-5 rounded-t-lg border-b-2 ">
                <button
                  id="selectFromSavedContactsButton"
                  className="hover:bg-gray-400 bg-gray-200 text-black rounded-lg p-3 flex flex-row items-center justify-center gap-2  "
                  onClick={handleOpenContactModal}
                >
                  <FaRegSave size={30} />
                  Select from saved contacts
                </button>
              </div>
              <div className=" flex w-full flex-col gap-5 p-5">
                <TextField
                  id="contactNumberEntry"
                  label="Contact # (required)"
                  InputLabelProps={labelStyle}
                  variant="filled"
                  className=" w-full mt-1 bg-white"
                  onChange={(event) => setLocalPhoneNumber(event.target.value)}
                  value={localphonenumber || ''}
                />
                <TextField
                  id="contactNameEntry"
                  label="Name (required)"
                  InputLabelProps={labelStyle}
                  variant="filled"
                  className=" w-full mt-1 bg-white"
                  onChange={(event) => setLocalName(event.target.value)}
                  value={localname || ''}
                />
                {isAccountClaimed ? (
                  <TextField
                    id="emailAddressEntry"
                    label="E-mail (required)"
                    InputLabelProps={labelStyle}
                    variant="filled"
                    className=" w-full mt-1 bg-white"
                    onChange={(event) => setLocalEmail(event.target.value)}
                    value={localemail || ''}
                  />
                ) : null}
                <div className="flex flex-row w-full ">
                  <button
                    onClick={() => {
                      if (localname.length > 0 && localphonenumber.length > 0) {
                        if (isAccountClaimed) {
                          if (localemail.length > 0) {
                            setStep('BIR 2303 Information');
                          } else {
                            alertSnackbar('error', 'Please enter your email');
                          }
                        } else {
                          setStep('Review and Confirm Order');
                        }
                      } else {
                        alertSnackbar('error', 'Please enter your name and phone number');
                      }
                    }}
                    className="p-3 rounded-lg font-bold text-white bg-color10a hover:bg-color10c w-full"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {step == 'BIR 2303 Information' ? (
          <div className=" flex flex-col h-full justify-center lg:w-1/2 w-full items-center gap-5 ">
            {!isInvoiceNeeded ? (
              <>
                <div className="flex justify-center m-5 -mt-20 ">
                  <Typography className="text-center" variant="h6">
                    Do you have a BIR 2303 form or COR?
                  </Typography>
                </div>
                <div className="flex justify-center items-center gap-5">
                  <button
                    onClick={() => {
                      setIsInvoiceNeeded(true);
                    }}
                    className="hover:bg-gray-400 bg-gray-200 p-3 rounded-lg text-black w-20"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setIsInvoiceNeeded(false);
                      setStep('Review and Confirm Order');
                    }}
                    className="p-3 bg-color10b rounded-lg text-white w-20 hover:bg-color10c font-bold"
                  >
                    No
                  </button>
                </div>
              </>
            ) : null}
            {isInvoiceNeeded ? (
              <div className=" h-full flex flex-col">
                <div className="h-8/10 flex flex-col">
                  <div className="flex cursor-pointer m-5 h-full rounded-lg justify-center items-center bg-slate-50 border-2 border-color-black ">
                    <div>
                      <input
                        type="file"
                        id={`imageUpload`}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor={`imageUpload`}>
                        {urlOfBir2303 != null ? (
                          <img className="w-full h-full object-contain" src={urlOfBir2303} alt="bir image" />
                        ) : (
                          <BiImageAdd className="cursor-pointer" size={150} />
                        )}
                      </label>
                    </div>
                  </div>
                  <Divider className="border-2 mb-5 mx-5" />
                </div>
                <div className="h-3/10  flex flex-col">
                  <Typography variant="h7" className="flex justify-center mb-5 mx-5">
                    Please upload a photo below of your BIR 2303 form if you have one.
                  </Typography>
                  <div className="flex flex-row justify-evenly h-12 ">
                    <button onClick={removeBir2303} className="hover:bg-gray-400 bg-gray-200 p-3 rounded-lg text-black">
                      Remove BIR 2303
                    </button>
                    <button
                      onClick={() => {
                        if (urlOfBir2303 != null) {
                          setStep('Review and Confirm Order');
                        } else {
                          alertSnackbar('error', 'Please upload BIR 2303');
                        }
                      }}
                      className="p-3 rounded-lg bg-color10b hover:bg-color10c text-white font-bold"
                    >
                      Continue
                    </button>
                    {/* <ImageUploadButton
                      buttonTitle={'Upload BIR 2303 Form'}
                      storage={storage}
                      folderName={`2303Forms/${userdata ? userdata.uid : 'GUEST'}`}
                      onUploadFunction={on2303Upload}
                    /> */}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {step == 'Review and Confirm Order' ? (
          <div className=" flex flex-col h-full justify-center lg:w-1/2 w-full items-center gap-5 overflow-auto ">
            <div className="w-full flex flex-col h-full gap-5  justify-evenly">
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
              <Divider className="border-2 mb-5 mx-5" />
              <div className="w-full flex justify-center px-3 mb-3">
                <button
                  onClick={() => {
                    setStep('Add Delivery Note');
                  }}
                  className="w-full lg:w-1/2 rounded-lg p-3 bg-color10b text-white font-bold"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {step == 'Add Delivery Note' ? (
          <div className=" flex h-full w-full lg:w-1/2 items-center flex-col justify-evenly">
            <div className=" shadow-2xl flex flex-col w-5/6 lg:w-1/2 items-center  rounded-lg border-2 p-10 justify-evenly gap-10 ">
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={5}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                label="Delivery Notes (Not required)"
                color="primary"
                InputLabelProps={labelStyle}
                className="rounded-md w-full   "
                sx={style}
              />
              <div className="w-full flex justify-center lg:w-1/2 flex-col items-center">
              <Divider className="border-2 mb-5 mx-5 w-full" />
                <button
                  onClick={() => {
                    setStep('Payment Method');
                  }}
                  className="p-3 w-full lg:w-1/2 mx-10 rounded-lg bg-color10a hover:bg-color10c text-white font-bold"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {step == 'Payment Method' ? (
          <div className=" flex flex-col h-full  lg:w-1/2 w-full items-center overflow-auto justify-evenly  ">
            <div className=" max-h-[80%] border-2 rounded-lg flex flex-col justify-start overflow-auto ">
              <PaymentMethods
                pickUpOrDeliver={pickUpOrDeliver}
                itemsTotalPrice={total}
                userdata={userdata}
                email={localemail}
                phoneNumber={localphonenumber}
                manualCustomerOrderProcess={manualCustomerOrderProcess}
              />
            </div>
            <div className="flex w-full justify-center">
              <button onClick={()=>{
                // log all states
                console.log('localname', localname)
                console.log('localemail', localemail)
                console.log('localphonenumber', localphonenumber)
                console.log('localDeliveryAddress', localDeliveryAddress)
                console.log('locallatitude', locallatitude)
                console.log('locallongitude', locallongitude)
                console.log('zoom', zoom)
                console.log('deliveryVehicle', deliveryVehicle)
                console.log('needAssistance', needAssistance)
                console.log('deliveryNotes', deliveryNotes)
                console.log('allowShipping', allowShipping)
                console.log('useShippingLine', useShippingLine)
                console.log('placedOrder', placedOrder)
                console.log('transactionStatus', transactionStatus)
                console.log('mayaCheckoutItemDetails', mayaCheckoutItemDetails)
                console.log('addressText', addressText)
                console.log('addressGeocodeSearch', addressGeocodeSearch)
                console.log('placeOrderLoading', placeOrderLoading)
                console.log('isInvoiceNeeded', isInvoiceNeeded)
                console.log('rowsMountCount', rowsMountCount)
                console.log('urlOfBir2303', urlOfBir2303)
                console.log('countOfOrdersThisYear', countOfOrdersThisYear)
                console.log('startDate', startDate)
                console.log('pickUpOrDeliver', pickUpOrDeliver)
                console.log('allowedDates', allowedDates)
                console.log('kilometersFromStore', kilometersFromStore)
                console.log('isAccountClaimed', isAccountClaimed)
                console.log('firstOrderDiscount', firstOrderDiscount)
                console.log('total', total)
                console.log('vat', vat)
                console.log('deliveryFee', deliveryFee)
                console.log('grandTotal', grandTotal)
                console.log('totalWeight', totalWeight)
                console.log('rows', rows)
                console.log('step', step)



              }} className="p-3 w-full lg:w-1/2 mx-5 rounded-lg bg-color10a text-white font-bold">Continue</button>
            </div>
          </div>
        ) : null}

        {/* <div className="flex justify-center mt-2 mb-6">
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
                    </div> */}

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
