import { Typography } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import CheckoutSummary from './CheckoutSummary';
import GoogleMaps from './GoogleMaps';
import AppContext from '../AppContext';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import firestoredb from './firestoredb';
import Paper from '@mui/material/Paper';
// import PaymentMenuCard from "./PaymentMenuCard";
import PaymentMethods from './PaymentMethods';
import CheckoutPageContext from './CheckoutPageContext';
import PaymentMenuCard from './PaymentMenuCard';
import GoogleMapsModalSelectSaveAddress from './GoogleMapsModalSelectSaveAddress';
import GoogleMapsModalSelectContactModal from './GoogleMapsModalSelectContactModal';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import businessCalculations from '../../utils/businessCalculations';
import { FaScribd } from 'react-icons/fa';
import serviceAreas from '../data/serviceAreas';
import paperBoyLocation from '../data/paperBoyLocation';
import lalamoveDeliveryVehicles from '../data/lalamoveDeliveryVehicles';
import dataManipulation from '../../utils/dataManipulation';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const CheckoutPage = () => {
  const [
    userdata,
    setUserData,
    isadmin,
    db,
    cart,
    setCart,
    favoriteitems,
    setFavoriteItems,
    userId,
    setUserId,
    refreshUser,
    setRefreshUser,
    userLoaded,
    setUserLoaded,
    deliveryaddress,
    setDeliveryAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    userstate,
    setUserState,
    phonenumber,
    setPhoneNumber,
  ] = React.useContext(AppContext);

  const [selectedAddress, setSelectedAddress] = useState(false);
  const firestore = new firestoredb();
  const [payMayaCardSelected, setPayMayaCardSelected] = useState(false);
  const [launchPayMayaCheckout, setLaunchPayMayaCheckout] = useState(false);
  const [total, setTotal] = React.useState(0);
  const [localname, setLocalName] = React.useState('');
  const [localemail, setLocalEmail] = React.useState('');
  const [localphonenumber, setLocalPhoneNumber] = React.useState('');
  const [vat, setVat] = React.useState(0);
  const [deliveryFee, setDeliveryFee] = React.useState(0);
  const [grandtotal, setGrandTotal] = React.useState(0);
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

  const [totalWeight, setTotalWeight] = useState(0);
  const [deliveryVehicle, setDeliveryVehicle] = useState(null);
  const [needAssistance, setNeedAssistance] = useState(false);
  const [area, setArea] = useState([]);
  const [deliveryNotes, setDeliveryNotes] = useState(null);
  const [allowShipping, setAllowShipping] = useState(true);
  const serviceareas = new serviceAreas();
  const paperboylocation = new paperBoyLocation();
  const lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
  const datamanipulation = new dataManipulation();
  const businesscalculations = new businessCalculations();

  const lalamoveServiceArea = serviceareas.lalamoveServiceArea;
  const iloiloArea = serviceareas.iloiloArea;
  const bacolodArea = serviceareas.bacolodArea;
  const dumagueteArea = serviceareas.dumagueteArea;
  const boholArea = serviceareas.boholArea;
  const masbateArea = serviceareas.masbateArea;
  const manilaArea = serviceareas.manilaArea;
  const samarArea = serviceareas.samarArea;
  const leyteMaasinArea = serviceareas.leyteMaasinArea;
  const leytePalomponArea = serviceareas.leytePalomponArea;
  const cagayanDeOroArea = serviceareas.cagayanDeOroArea;
  const surigaoArea = serviceareas.surigaoArea;
  const butuanArea = serviceareas.butuanArea;
  const dapitanArea = serviceareas.dapitanArea;
  const zamboangaArea = serviceareas.zamboangaArea;
  const pagadianArea = serviceareas.pagadianArea;
  const davaoArea = serviceareas.davaoArea;
  const generalSantosArea = serviceareas.generalSantosArea;
  const paperboylatitude = paperboylocation.latitude;
  const paperboylongitude = paperboylocation.longitude;

  const deliveryFeePerKmMotor = lalamovedeliveryvehicles.motorcycle.deliveryFeePerKm;
  const maxWeightMotor = lalamovedeliveryvehicles.motorcycle.maxWeight;
  const minDelFeeMotor = lalamovedeliveryvehicles.motorcycle.minDelFee;
  const driverAssistsMotor = lalamovedeliveryvehicles.motorcycle.driverAssistsPrice;

  const deliveryFeePerKmSedan = lalamovedeliveryvehicles.sedan.deliveryFeePerKm;
  const minDelFeeSedan = lalamovedeliveryvehicles.sedan.minDelFee;
  const maxWeightSedan = lalamovedeliveryvehicles.sedan.maxWeight;
  const driverAssistsSedan = lalamovedeliveryvehicles.sedan.driverAssistsPrice;

  const deliveryFeePerKmMPV = lalamovedeliveryvehicles.mpv.deliveryFeePerKm;
  const minDelFeeMPV = lalamovedeliveryvehicles.mpv.minDelFee;
  const maxWeightMPV = lalamovedeliveryvehicles.mpv.maxWeight;
  const driverAssistsMPV = lalamovedeliveryvehicles.mpv.driverAssistsPrice;

  const deliveryFeePerKmPickUp = lalamovedeliveryvehicles.pickup.deliveryFeePerKm;
  const minDelFeePickUp = lalamovedeliveryvehicles.pickup.minDelFee;
  const maxWeightPickUp = lalamovedeliveryvehicles.pickup.maxWeight;
  const driverAssistsPickUp = lalamovedeliveryvehicles.pickup.driverAssistsPrice;

  const deliveryFeePerKmVan = lalamovedeliveryvehicles.van.deliveryFeePerKm;
  const minDelFeeVan = lalamovedeliveryvehicles.van.minDelFee;
  const maxWeightVan = lalamovedeliveryvehicles.van.maxWeight;
  const driverAssistsVan = lalamovedeliveryvehicles.van.driverAssistsPrice;

  const deliveryFeePerKmClosedVan = lalamovedeliveryvehicles.closedvan.deliveryFeePerKm;
  const minDelFeeClosedVan = lalamovedeliveryvehicles.closedvan.minDelFee;
  const maxWeightClosedVan = lalamovedeliveryvehicles.closedvan.maxWeight;
  const driverAssistsClosedVan = lalamovedeliveryvehicles.closedvan.driverAssistsPrice;

  useEffect(() => {
    const totaldifference = businesscalculations.getTotalDifferenceOfPaperboyAndSelectedLocation(
      paperboylatitude,
      paperboylongitude,
      locallatitude,
      locallongitude
    );
    const kilometers = businesscalculations.convertTotalDifferenceToKilometers(totaldifference);
    const areasInsideDeliveryLocation = businesscalculations.getLocationsInPoint(locallatitude, locallongitude);
    setArea(areasInsideDeliveryLocation);
    const inLalamoveSericeArea = businesscalculations.checkIfAreasHasLalamoveServiceArea(areasInsideDeliveryLocation);
    if (inLalamoveSericeArea) {
      console.log(needAssistance)
      const vehicleObject = businesscalculations.getVehicleForDelivery(totalWeight)
      const deliveryFee = businesscalculations.getDeliveryFee(kilometers,vehicleObject,needAssistance);
      console.log(deliveryFee)
      setDeliveryFee(deliveryFee);
      setDeliveryVehicle(vehicleObject);
    
    }

    if (!areasInsideDeliveryLocation.includes('lalamoveServiceArea') && area.length > 0) {
      setDeliveryFee(500);
      setDeliveryVehicle(['Shipping Lines', 0]);
    }
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

  function securityOrderDataIsValid() {
    if (
      localname.length > 0 &&
      localphonenumber.length > 0 &&
      localDeliveryAddress.length > 0 &&
      locallatitude !== 0 &&
      locallongitude !== 0 &&
      grandtotal === total + vat + deliveryFee &&
      grandtotal > 0 &&
      cart.length > 0 &&
      totalWeight > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  async function checkStocksIfAvailableInFirestore() {
    function countStrings(arr) {
      const counts = {};
      arr.forEach((str) => {
        counts[str] = counts[str] ? counts[str] + 1 : 1;
      });
      return counts;
    }
    // CONFIRM AGAIN IF STOCKS AVAILABLE
    let message = 'Unfortunately someone else might have bought the stocks listed below. \n \n';
    let outOfStockDetected = false;
    const count = countStrings(cart);
    const countEntries = Object.entries(count);
    const calculations = new businessCalculations();
    const products = await firestore.readAllProducts();

    countEntries.map(([itemid, quantity]) => {
      console.log(itemid, quantity);
      products.map((dataitem) => {
        if (dataitem.itemid === itemid) {
          const stocksAvailableLessSafetyStock = calculations.getStocksAvailableLessSafetyStock(
            dataitem.stocksAvailable,
            dataitem.averageSalesPerDay
          );
          if (stocksAvailableLessSafetyStock < quantity) {
            message = message + `${dataitem.itemname} - ${stocksAvailableLessSafetyStock} stocks left \n`;
            console.log(itemid, 'firestore:', stocksAvailableLessSafetyStock, 'order:', quantity);
            outOfStockDetected = true;
          }
        }
      });
      message += '\nPlease refresh the page to see the updated stocks.';
    });

    if (outOfStockDetected) {
      console.log(message);
      return [true, message];
    } else {
      return [false, message];
    }
  }

  useEffect(() => {
    console.log(cart);
  }, []);

  function onPlaceOrder() {
    // setLaunchPayMayaCheckout(true)

    // CHECK FOR OUT OF STOCKS
    console.log('ran');
    checkStocksIfAvailableInFirestore().then((result) => {
      const [outOfStockDetected, message] = result;
      if (outOfStockDetected) {
        alert(message);
        return;
      }
    });

    console.log('ran ran ran ran');
    if (userstate === 'userloaded') {
      try {
        // setLaunchPayMayaCheckout(true);
        if (securityOrderDataIsValid()) {
          console.log([
            userdata.uid,
            localDeliveryAddress,
            locallatitude,
            locallongitude,
            localphonenumber,
            localname,
            new Date(),
            localname,
            localDeliveryAddress,
            localphonenumber,
            cart,
            total,
            vat,
            deliveryFee,
            grandtotal,
            generateOrderReference(),
            userdata.name,
            userdata.phonenumber,
            deliveryNotes,
            totalWeight,
            deliveryVehicle[0],
            needAssistance,
          ]);
          // firestore
          //   .transactionPlaceOrder(
          //     userdata.uid,
          //     localDeliveryAddress,
          //     locallatitude,
          //     locallongitude,
          //     localphonenumber,
          //     localname,
          //     new Date(),
          //     localname,
          //     localDeliveryAddress,
          //     localphonenumber,
          //     cart,
          //     total,
          //     vat,
          //     deliveryFee,
          //     grandtotal,
          //     generateOrderReference(),
          //     userdata.name,
          //     userdata.phonenumber,
          //     deliveryNotes,
          //     totalWeight,
          //     deliveryVehicle[0],
          //     needAssistance
          //   )
          // .then(() => {
          //   setCart([]);
          // });
        } else {
          alert('Please fill up all the fields.');
        }
      } catch (error) {
        console.log('error');
        alert('Failed to place order. Please try again.');
      }
    }
  }

  useEffect(() => {
    setRefreshUser(!refreshUser);
  }, []);

  useEffect(() => {
    if (userdata) {
      setLocalEmail(userdata.email);

      if (userdata.contactPerson.length > 0) {
        setLocalPhoneNumber(userdata.contactPerson[0].phonenumber);
        setLocalName(userdata.contactPerson[0].name);
      }
      if (userdata.deliveryaddress.length > 0) {
        setLocalDeliveryAddress(userdata.deliveryaddress[0].address);
        setLocalLatitude(userdata.deliveryaddress[0].latitude);
        setLocalLongitude(userdata.deliveryaddress[0].longitude);
        setZoom(15);
      }
    }
  }, [userdata]);

  useEffect(() => {
    setVat(total * 0.12);
    setGrandTotal(total + vat + deliveryFee);

    if (!area.includes('lalamoveServiceArea') && area.length > 0) {
      if (total < 10000) setAllowShipping(false);
      else {
        setAllowShipping(true);
      }
    } else {
      setAllowShipping(true);
    }
  }, [total, vat, grandtotal, deliveryFee, latitude, longitude, area]);

  useEffect(() => {}, [deliveryaddress]);

  function responsiveAssistancePrice() {
    if (deliveryVehicle[0] == 'Motorcycle') {
      return driverAssistsMotor;
    }

    if (deliveryVehicle[0] == 'Sedan') {
      return driverAssistsSedan;
    }
    if (deliveryVehicle[0] == 'MPV') {
      return driverAssistsMPV;
    }
    if (deliveryVehicle[0] == 'Pick Up') {
      return driverAssistsPickUp;
    }
    if (deliveryVehicle[0] == 'Van') {
      return driverAssistsVan;
    }
    if (deliveryVehicle[0] == 'Closed Van') {
      return driverAssistsClosedVan;
    }
  }

  return (
    <div className="flex flex-col">
      <CheckoutPageContext.Provider value={[payMayaCardSelected, setPayMayaCardSelected]}>
        {/* <PaymentMethods /> */}
        {launchPayMayaCheckout ? (
          <PaymentMenuCard
            firstname={localname.split(' ')[0]}
            lastname={localname.split(' ')[1]}
            email={localemail}
            phonenumber={localphonenumber}
            totalprice={grandtotal}
          />
        ) : null}
      </CheckoutPageContext.Provider>

      <div className="flex flex-row my-5 ">
        <div className="flex justify-center w-full mt-5 ml-5 ">
          <Typography variant="h5" className="bold" sx={{ fontWeight: 'bold' }}>
            Delivery Address
          </Typography>
        </div>
        <div className="flex justify-center w-full">
          <button
            data-testid="selectFromSavedAddressButton"
            className="bg-blue-300 p-3 rounded-lg mx-5 "
            onClick={handleOpenModalSavedAddress}
          >
            Select From Saved Address
          </button>
        </div>
      </div>

      <div className="justify-center w-full">
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
        />

        <TextField
          id="filled-basic"
          label="Address"
          variant="filled"
          className="w-full"
          onChange={(event) => setLocalDeliveryAddress(event.target.value)}
          value={localDeliveryAddress}
          sx={{ marginTop: 1 }}
        />

        <div className="flex flex-row my-5 ">
          <div className="flex justify-center w-full mt-7 ml-5 ">
            <Typography variant="h5" className="bold" sx={{ fontWeight: 'bold' }}>
              Contact Details
            </Typography>
          </div>
          <div className="flex justify-center w-full">
            <button className="bg-blue-300 p-3 rounded-lg mt-2 mx-5" onClick={handleOpenContactModal}>
              Select From Saved Contacts
            </button>
          </div>
        </div>

        <TextField
          id="filled-basic"
          label="Contact #"
          variant="filled"
          className="w-full"
          onChange={(event) => setLocalPhoneNumber(event.target.value)}
          value={localphonenumber || ''}
          sx={{ marginTop: 1 }}
        />
        <TextField
          id="filled-basic"
          label="Name"
          variant="filled"
          className="w-full"
          onChange={(event) => setLocalName(event.target.value)}
          value={localname || ''}
          sx={{ marginTop: 1 }}
        />
      </div>

      {allowShipping == false ? (
        <div className="flex justify-center my-5">
          <Typography variant="h7" color="red">
            Minimum orderoutside Cebu is 10000 pesos
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
                  <div className="flex justify-center mt-5">
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Assistance
                    </Typography>
                  </div>
                  <div className="flex justify-center mt-5">
                    <Typography variant="h6">
                      Driver helps unload items?
                      {deliveryVehicle != null ? ' ₱' + deliveryVehicle.driverAssistsPrice : null}
                    </Typography>
                    <Switch {...label} color="success" onClick={() => setNeedAssistance(!needAssistance)} />
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

              {/* {area.includes("lalamoveServiceArea") ||
              area.length == 0 ? null : (
               
              )} */}

              <div className="flex justify-center my-5">
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Checkout Summary
                </Typography>
              </div>

              {area.length == 0 ? null : (
                <CheckoutSummary
                  total={total}
                  setTotal={setTotal}
                  vat={vat}
                  deliveryFee={deliveryFee}
                  grandtotal={grandtotal}
                  totalWeight={totalWeight}
                  setTotalWeight={setTotalWeight}
                  deliveryVehicleObject={deliveryVehicle}
                  setDeliveryVehicle={setDeliveryVehicle}
                  area={area}
                />
              )}
              <Divider sx={{ marginTop: 3 }} />

              <div className="flex justify-center mt-5">
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Payment
                </Typography>
              </div>

              <PaymentMethods />
              <Divider sx={{ marginTop: 3 }} />
              <div className="flex w-full justify-center my-5 items">
                <TextField
                  id="outlined-multiline-static"
                  label="Delivery Notes"
                  multiline
                  rows={4}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-center mt-5">
                <button
                  id="placeorderbutton"
                  onClick={onPlaceOrder}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5"
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
  );
};

export default CheckoutPage;

// Shipping and billing information forms for the customer to fill out
// Payment information, such as a credit card or PayPal form

// Terms and conditions, and/or a privacy policy

// Option for entering a promotional code or gift card
