import { Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import CheckoutSummary from "./CheckoutSummary";
import GoogleMaps from "./GoogleMaps";
import AppContext from "../AppContext";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import firestoredb from "./firestoredb";
import Paper from "@mui/material/Paper";
// import PaymentMenuCard from "./PaymentMenuCard";
import PaymentMethods from "./PaymentMethods";
import CheckoutPageContext from "./CheckoutPageContext";
import PaymentMenuCard from "./PaymentMenuCard";
import GoogleMapsModalSelectSaveAddress from "./GoogleMapsModalSelectSaveAddress";
import GoogleMapsModalSelectContactModal from "./GoogleMapsModalSelectContactModal";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import businessCalculations from "./businessCalculations";
import { FaScribd } from "react-icons/fa";

const label = { inputProps: { "aria-label": "Switch demo" } };

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
  const [localname, setLocalName] = React.useState("");
  const [localemail, setLocalEmail] = React.useState("");
  const [localphonenumber, setLocalPhoneNumber] = React.useState("");
  const [vat, setVat] = React.useState(0);
  const [deliveryFee, setDeliveryFee] = React.useState(0);
  const [grandtotal, setGrandTotal] = React.useState(0);
  const [localDeliveryAddress, setLocalDeliveryAddress] = React.useState("");

  const [openModalSavedAddress, setOpenModalSavedAddress] =
    React.useState(false);
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

  const paperboylatitude = 10.360659698017077;
  const paperboylongitude = 123.93380793795234;

  const deliveryFeePerKmMotor = 15;
  const maxWeightMotor = 20;
  const minDelFeeMotor = 65;
  const driverAssistsMotor = 0;

  const deliveryFeePerKmSedan = 35;
  const minDelFeeSedan = 110;
  const maxWeightSedan = 200;
  const driverAssistsSedan = 80;

  const deliveryFeePerKmMPV = 40;
  const minDelFeeMPV = 130;
  const maxWeightMPV = 300;
  const driverAssistsMPV = 200;

  const deliveryFeePerKmPickUp = 55;
  const minDelFeePickUp = 230;
  const maxWeightPickUp = 600;
  const driverAssistsPickUp = 200;

  const deliveryFeePerKmVan = 70;
  const minDelFeeVan = 320;
  const maxWeightVan = 1000;
  const driverAssistsVan = 200;

  const deliveryFeePerKmClosedVan = 260;
  const minDelFeeClosedVan = 1500;
  const maxWeightClosedVan = 2000;
  const driverAssistsClosedVan = 200;

  function isPointInPolygon(point, polygon) {
    let x = point[0],
      y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0],
        yi = polygon[i][1];
      let xj = polygon[j][0],
        yj = polygon[j][1];

      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  function checkDeliveryArea(deliveryPoint) {
    const lalamoveServiceArea = [
      [10.5106404, 124.0283181],
      [10.5073913, 124.024039],
      [10.4023906, 123.899694],
      [10.2399245, 123.7643573],
      [10.224045, 123.7674487],
      [10.2287751, 123.8183204],
      [10.2181322, 123.9000467],
      [10.2259033, 123.9393427],
      [10.2426273, 123.9778026],
      [10.3250523, 124.0510901],
      [10.3696339, 124.0407987],
      [10.4034036, 124.0050801],
      [10.4472988, 124.0177852],
      [10.5036359, 124.0356452],
      [10.5106404, 124.0283181],
    ];

    // const cebuArea = [
    //   [11.2888542, 124.0869422],
    //   [10.7975602, 124.0603545],
    //   [10.3122171, 124.0658611],
    //   [10.017539, 123.7142828],
    //   [9.3826772, 123.408205],
    //   [9.3962261, 123.2750932],
    //   [10.0310623, 123.3522823],
    //   [10.8656758, 123.8389352],
    //   [11.2780802, 123.9378615],
    //   [11.3157874, 124.03404],
    // ];

    const iloiloArea = [
      [10.6754531, 122.5729976],
      [11.3858018, 123.373662],
      [11.9291651, 121.980449],
      [10.3041103, 121.8842706],
      [10.6687054, 122.5742131],
      [10.6754531, 122.5729976],
    ];

    const bacolodArea = [
      [10.9870314, 123.1879019],
      [10.876465, 122.9488298],
      [10.3716602, 122.7234976],
      [10.1608568, 123.2840803],
      [10.833306, 123.5808594],
      [11.0274722, 123.303316],
      [10.9870314, 123.1879019],
    ];

    const dumagueteArea = [
      [9.5831467, 123.1704431],
      [9.3013726, 122.8491444],
      [9.0315779, 122.9262429],
      [9.0193713, 123.1405834],
      [9.2918858, 123.3741596],
      [9.576376, 123.1749328],
    ];

    const boholArea = [
      [10.2149223, 124.1304064],
      [9.8958044, 123.7856548],
      [9.5167881, 123.6467664],
      [9.6576155, 124.6167944],
      [10.2095162, 124.6442739],
      [10.2149223, 124.1304064],
    ];

    const masbateArea = [
      [12.6188973, 123.2153018],
      [11.8592872, 123.1053836],
      [12.1521159, 123.4818534],
      [11.6683758, 124.0918994],
      [12.1977577, 123.9874771],
      [12.6376583, 123.3032364],
      [12.6188973, 123.2153018],
    ];

    const manilaArea = [
      [18.5004475, 120.5111635],
      [16.161921, 119.5768589],
      [14.7323861, 119.8606477],
      [13.613956, 120.906869],
      [13.5925998, 121.7422472],
      [18.5317003, 123.2261427],
      [18.7815167, 121.5993535],
      [18.5004475, 120.5111635],
    ];

    const samarArea = [
      [12.42853, 124.1874807],
      [11.9184158, 124.5419668],
      [11.7867027, 125.6354085],
      [12.4768054, 125.5297371],
      [12.8225139, 124.9483525],
      [12.7368005, 124.3410546],
      [12.42853, 124.1874807],
    ];

    const leytePalomponArea = [
      [11.7167884, 124.5924087],
      [11.7114096, 124.5858902],
      [11.7383024, 124.3707152],
      [11.5984316, 124.2039245],
      [11.2134279, 124.3515605],
      [10.8467938, 124.3185699],
      [10.8360036, 124.7415161],
      [10.8791622, 125.1657086],
      [11.7167884, 124.5924087],
    ];

    const leyteMaasinArea = [
      [10.5634221, 124.7301798],
      [10.0851497, 124.7219359],
      [9.80921, 125.0806167],
      [9.947209, 125.4036263],
      [10.8009326, 125.2497409],
      [10.7091892, 124.9474878],
      [10.5634221, 124.7301798],
    ];

    const cagayanDeOroArea = [
      [8.8932124, 124.7002982],
      [8.3174946, 124.0545288],
      [7.871544, 124.2661213],
      [7.9640375, 125.1756943],
      [8.7955112, 125.3021002],
      [8.9257738, 125.1811902],
      [8.8932124, 124.7002982],
    ];

    const surigaoArea = [
      [10.2014068, 126.1305468],
      [10.5148177, 125.6524027],
      [10.2338431, 125.3666154],
      [9.644077, 125.2292177],
      [9.3298314, 125.2457054],
      [9.1509093, 125.7128577],
      [9.0858244, 126.0096368],
      [9.1617557, 126.3393913],
      [10.2014068, 126.1305468],
    ];

    const butuanArea = [
      [8.8552206, 125.1432597],
      [8.7385069, 125.302641],
      [8.7357922, 125.5527049],
      [8.8307952, 125.728574],
      [9.0234402, 125.8082647],
      [9.2403817, 125.7807851],
      [9.3271211, 125.4043154],
      [9.2620686, 125.1569994],
      [8.8552206, 125.1432597],
    ];

    const dapitanArea = [
      [8.7520801, 123.3577535],
      [8.4832386, 122.9840317],
      [8.197898, 122.8960971],
      [8.0619491, 123.8331496],
      [8.2957525, 123.9705474],
      [8.6896391, 123.7617028],
      [8.7520801, 123.3577535],
    ];

    const zamboangaArea = [
      [7.9313951, 122.1268675],
      [7.403324, 121.8740186],
      [6.8828002, 121.8875978],
      [6.8391696, 122.2310921],
      [7.3079848, 122.3904213],
      [7.7327651, 122.6295455],
      [8.002117, 122.1871248],
      [7.9313951, 122.1268675],
    ];

    const pagadianArea = [
      [7.7082699, 123.7448617],
      [7.953157, 123.9866817],
      [8.1557587, 123.4082372],
      [7.6688025, 123.1073362],
      [7.5068119, 123.0922224],
      [7.3011741, 123.3862536],
      [7.4169423, 123.5236513],
      [7.7994391, 123.5209034],
      [7.7667838, 123.6995204],
      [7.7082699, 123.7448617],
    ];

    const davaoArea = [
      [6.645511, 125.4518102],
      [6.8746198, 125.9381982],
      [7.596663, 125.9162146],
      [7.6619974, 125.6634027],
      [6.871893, 125.0890802],
      [6.645511, 125.4518102],
    ];

    const generalSantosArea = [
      [6.3739884, 125.1552713],
      [6.2743482, 124.9776673],
      [5.9821437, 125.0206216],
      [5.9534609, 125.2390839],
      [6.0272136, 125.3682378],
      [6.468151, 125.3174007],
      [6.4531407, 125.1566453],
      [6.3739884, 125.1552713],
    ];

    const locations = [
      [lalamoveServiceArea, "lalamoveServiceArea"],
      // [cebuArea, "cebuArea"],
      [iloiloArea, "iloiloArea"],
      [leyteMaasinArea, "leyteMaasinArea"],
      [cagayanDeOroArea, "cagayanDeOroArea"],
      [surigaoArea, "surigaoArea"],
      [butuanArea, "butuanArea"],
      [dapitanArea, "dapitanArea"],
      [zamboangaArea, "zamboangaArea"],
      [pagadianArea, "pagadianArea"],
      [davaoArea, "davaoArea"],
      [generalSantosArea, "generalSantosArea"],
      [bacolodArea, "bacolodArea"],
      [dumagueteArea, "dumagueteArea"],
      [boholArea, "boholArea"],
      [masbateArea, "masbateArea"],
      [manilaArea, "manilaArea"],
      [samarArea, "samarArea"],
      [leytePalomponArea, "leytePalomponArea"],
    ];

    const locationsInDeliveryPoint = [];

    locations.map((location) => {
      const polygon = location[0];
      const name = location[1];
      const result = isPointInPolygon(deliveryPoint, polygon);

      if (result) {
        locationsInDeliveryPoint.push(name);
      }
    });
    console.log(locationsInDeliveryPoint);
    setArea(locationsInDeliveryPoint);
    return locationsInDeliveryPoint;
  }

  useEffect(() => {
    const latitudedifference = Math.abs(paperboylatitude - locallatitude);
    const longitudedifference = Math.abs(paperboylongitude - locallongitude);
    const totaldifference = latitudedifference + longitudedifference;
    const kilometers = totaldifference * 111.1;
    const deliveryLocation = [locallatitude, locallongitude];
    const areasInsideDeliveryLocation = checkDeliveryArea(deliveryLocation);

    if (areasInsideDeliveryLocation.includes("lalamoveServiceArea")) {
      if (totalWeight <= maxWeightMotor) {
        let deliveryfee = kilometers * deliveryFeePerKmMotor;
        if (deliveryfee < minDelFeeMotor) {
          deliveryfee = minDelFeeMotor;
        }

        setDeliveryFee(Math.round(deliveryfee));
        setDeliveryVehicle(["Motorcycle", maxWeightMotor]);
      }

      if (totalWeight > maxWeightMotor && totalWeight <= maxWeightSedan) {
        const assistance = needAssistance ? driverAssistsSedan : 0;
        let deliveryfee = kilometers * deliveryFeePerKmSedan;

        if (deliveryfee < minDelFeeSedan) {
          deliveryfee = minDelFeeSedan;
        }

        setDeliveryFee(Math.round(deliveryfee + assistance));
        setDeliveryVehicle(["Sedan", maxWeightSedan]);
      }

      if (totalWeight > maxWeightSedan && totalWeight <= maxWeightMPV) {
        const assistance = needAssistance ? driverAssistsMPV : 0;
        let deliveryfee = kilometers * deliveryFeePerKmMPV;

        if (deliveryfee < minDelFeeMPV) {
          deliveryfee = minDelFeeMPV;
        }
        setDeliveryFee(Math.round(deliveryfee + assistance));
        setDeliveryVehicle(["MPV", maxWeightMPV]);
      }

      if (totalWeight > maxWeightMPV && totalWeight <= maxWeightPickUp) {
        const assistance = needAssistance ? driverAssistsPickUp : 0;
        let deliveryfee = kilometers * deliveryFeePerKmPickUp;

        if (deliveryfee < minDelFeePickUp) {
          deliveryfee = minDelFeePickUp;
        }

        setDeliveryFee(Math.round(deliveryfee + assistance));
        setDeliveryVehicle(["Pick Up", maxWeightPickUp]);
      }

      if (totalWeight > maxWeightPickUp && totalWeight <= maxWeightVan) {
        const assistance = needAssistance ? driverAssistsVan : 0;

        let deliveryfee = kilometers * deliveryFeePerKmVan;

        if (deliveryfee < minDelFeeVan) {
          deliveryfee = minDelFeeVan;
        }

        setDeliveryFee(Math.round(deliveryfee + assistance));
        setDeliveryVehicle(["Van", maxWeightVan]);
      }

      if (totalWeight > maxWeightVan && totalWeight <= maxWeightClosedVan) {
        const assistance = needAssistance ? driverAssistsClosedVan : 0;
        let deliveryfee = kilometers * deliveryFeePerKmClosedVan;

        if (deliveryfee < minDelFeeClosedVan) {
          deliveryfee = minDelFeeClosedVan;
        }

        setDeliveryFee(Math.round(deliveryfee + assistance));
        setDeliveryVehicle(["Closed Van", maxWeightClosedVan]);
        // }
      }
    }

    if (
      !areasInsideDeliveryLocation.includes("lalamoveServiceArea") &&
      area.length > 0
    ) {
      setDeliveryFee(500);
      setDeliveryVehicle(["Shipping Lines", 0]);
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
      "-" +
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
    let message =
      "Unfortunately someone else might have bought the stocks listed below. \n \n";
    let outOfStockDetected = false;
    const count = countStrings(cart);
    const countEntries = Object.entries(count);
    const calculations = new businessCalculations();
    const products = await firestore.readAllProducts();
    
    countEntries.map(([itemid, quantity]) => {
      console.log(itemid, quantity);
      products.map((dataitem) => { 
        if (dataitem.itemid === itemid) {
          const stocksAvailableLessSafetyStock = calculations.getStocksAvailableLessSafetyStock(dataitem.stocksAvailable,dataitem.averageSalesPerDay)
          if (stocksAvailableLessSafetyStock < quantity) {
      
            message = message + `${dataitem.itemname} - ${stocksAvailableLessSafetyStock} stocks left \n`;
            console.log(
              itemid,
              "firestore:",
              stocksAvailableLessSafetyStock,
              "order:",
              quantity
            );
            outOfStockDetected = true
            
          }
        }
      });
      message += "\nPlease refresh the page to see the updated stocks."
    });
    

    if (outOfStockDetected) {
      console.log(message);
      return [true,message] }
    else {
      return [false,message]
    }
    
  }

  useEffect(() => {
    console.log(cart);
  }, []);

  function onPlaceOrder() {
    // setLaunchPayMayaCheckout(true)

    // CHECK FOR OUT OF STOCKS
    console.log('ran')
    checkStocksIfAvailableInFirestore().then((result) => {
      const [outOfStockDetected,message] = result
      if (outOfStockDetected) {
        alert(message)
        return
      }
    })
    
    console.log('ran ran ran ran')
    if (userstate === "userloaded") {
      try {
        // setLaunchPayMayaCheckout(true);
        if (securityOrderDataIsValid()) {
          firestore
            .transactionPlaceOrder(
              userdata.uid,
              localDeliveryAddress,
              locallatitude,
              locallongitude,
              localphonenumber,
              localname,
              userdata.orders,
              new Date(),
              localname,
              localDeliveryAddress,
              localphonenumber,
              latitude,
              longitude,
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
              needAssistance
            )
            .then(() => {
              setCart([]);
            });
        } else {
          alert("Please fill up all the fields.");
        }
      } catch (error) {
        console.log("error");
        alert("Failed to place order. Please try again.");
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

    if (!area.includes("lalamoveServiceArea") && area.length > 0) {
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
    if (deliveryVehicle[0] == "Motorcycle") {
      return driverAssistsMotor;
    }

    if (deliveryVehicle[0] == "Sedan") {
      return driverAssistsSedan;
    }
    if (deliveryVehicle[0] == "MPV") {
      return driverAssistsMPV;
    }
    if (deliveryVehicle[0] == "Pick Up") {
      return driverAssistsPickUp;
    }
    if (deliveryVehicle[0] == "Van") {
      return driverAssistsVan;
    }
    if (deliveryVehicle[0] == "Closed Van") {
      return driverAssistsClosedVan;
    }
  }

  return (
    <div className="flex flex-col">
      <CheckoutPageContext.Provider
        value={[payMayaCardSelected, setPayMayaCardSelected]}
      >
        {/* <PaymentMethods /> */}
        {launchPayMayaCheckout ? (
          <PaymentMenuCard
            firstname={localname.split(" ")[0]}
            lastname={localname.split(" ")[1]}
            email={localemail}
            phonenumber={localphonenumber}
            totalprice={grandtotal}
          />
        ) : null}
      </CheckoutPageContext.Provider>

      <div className="flex flex-row my-5 ">
        <div className="flex justify-center w-full mt-5 ml-5 ">
          <Typography variant="h5" className="bold" sx={{ fontWeight: "bold" }}>
            Delivery Address
          </Typography>
        </div>
        <div className="flex justify-center w-full">
          <button data-testid="selectFromSavedAddressButton"
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
            <Typography
              variant="h5"
              className="bold"
              sx={{ fontWeight: "bold" }}
            >
              Contact Details
            </Typography>
          </div>
          <div className="flex justify-center w-full">
            <button
              className="bg-blue-300 p-3 rounded-lg mt-2 mx-5"
              onClick={handleOpenContactModal}
            >
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
          value={localphonenumber || ""}
          sx={{ marginTop: 1 }}
        />
        <TextField
          id="filled-basic"
          label="Name"
          variant="filled"
          className="w-full"
          onChange={(event) => setLocalName(event.target.value)}
          value={localname || ""}
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
              {area.includes("lalamoveServiceArea") ? (
                <div>
                  <div className="flex justify-center mt-5">
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Assistance
                    </Typography>
                  </div>
                  <div className="flex justify-center mt-5">
                    <Typography variant="h6">
                      Driver helps unload items?
                      {deliveryVehicle != null
                        ? " ₱" + responsiveAssistancePrice()
                        : null}
                    </Typography>
                    <Switch
                      {...label}
                      color="success"
                      onClick={() => setNeedAssistance(!needAssistance)}
                    />
                  </div>
                </div>
              ) : null}

              {area.includes("lalamoveServiceArea") ||
              area.length == 0 ? null : (
                <div className="flex justify-center mt-5 mb-5">
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    Shipping Option
                  </Typography>
                </div>
              )}

              {area.includes("davaoArea") ? (
                <div className="flex flex-col justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Davao Port via Sulpicio Lines
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    When we ship to your place we will charge 500 pesos to
                    deliver it to the port. This includes Cebu Port Authority,
                    and Handling Charges.
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    In order to claim the items from the Port you need to pay
                    the shipping fee in their office.
                  </Typography>
                </div>
              ) : null}

              {area.includes("iloiloArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Iloilo Port via Cokaliong or Trans Asia
                  </Typography>
                </div>
              ) : null}

              {area.includes("leyteMaasinArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Leyte Maasin Port via Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("cagayanDeOroArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Cagayan De Oro Port cia Trans Asia, Cokaliong
                    or Sulpicio.
                  </Typography>
                </div>
              ) : null}

              {area.includes("surigaoArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Surigao Port via Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("butuanArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Butuan Port via Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("dapitanArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Dapitan Port via Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("zamboangaArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Zamboanga Port via Alison.
                  </Typography>
                </div>
              ) : null}

              {area.includes("pagadianArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Pagadian Port via Roble.
                  </Typography>
                </div>
              ) : null}

              {area.includes("generalSantosArea text-center mx-10") ? (
                <div className="flex justify-center">
                  <Typography variant="h6">
                    We can ship to General Santos Port via Sulpicio.
                  </Typography>
                </div>
              ) : null}

              {area.includes("bacolodArea text-center mx-10") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Bacolod Port via Diamante trucking, or your
                    preferred logistics company.
                  </Typography>
                </div>
              ) : null}

              {area.includes("dumagueteArea text-center mx-10") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Dumaguete using Matiao Trucking, or your
                    preferred logistics company.
                  </Typography>
                </div>
              ) : null}

              {area.includes("boholArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Bohol Port via Lite Shipping.
                  </Typography>
                </div>
              ) : null}

              {area.includes("masbateArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Masbate Port via Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("manilaArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Manila Port via 2GO, or Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("samarArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Samar Port via Cokaliong.
                  </Typography>
                </div>
              ) : null}

              {area.includes("leytePalomponArea") ? (
                <div className="flex justify-center text-center mx-10">
                  <Typography variant="h6">
                    We can ship to Leyte Palompon Port via Cokaliong
                  </Typography>
                </div>
              ) : null}

              {/* {area.includes("lalamoveServiceArea") ||
              area.length == 0 ? null : (
               
              )} */}

              <div className="flex justify-center my-5">
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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
                  deliveryVehicle={deliveryVehicle}
                  setDeliveryVehicle={setDeliveryVehicle}
                  area={area}
                />
              )}
              <Divider sx={{ marginTop: 3 }} />

              <div className="flex justify-center mt-5">
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
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
                  {" "}
                  Place Order{" "}
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
