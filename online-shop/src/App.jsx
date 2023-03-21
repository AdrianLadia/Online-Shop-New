import "./App.css";
import NavBar from "./components/NavBar";
import Shop from "./components/Shop";
import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { Routes, Route } from "react-router-dom";
import firebase from "firebase/compat/app";
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AdminSecurity from "./components/AdminSecurity";
import firebaseConfig from "./firebase_config";
import firestoredb from "./components/firestoredb";
import PersonalInfoForm from "./components/PersonalInfoForm";
import CheckoutPage from "./components/CheckoutPage";
import { CircularProgress, Typography } from "@mui/material";
import MyOrders from "./components/MyOrders";
import AccountStatement from "./components/AccountStatement";

function App() {
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  // Get Authentication
  const auth = getAuth();
  
  // Initialize firestore class
  const firestore = new firestoredb(app);

  const [userId, setUserId] = useState(null);
  const [userdata, setUserData] = useState(null);
  const [isadmin, setIsAdmin] = useState(false);
  const [favoriteitems, setFavoriteItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [refreshUser, setRefreshUser] = useState(false);
  const [userLoaded, setUserLoaded] = useState(null);
  const [deliveryaddress, setDeliveryAddress] = useState(null);
  const [contactPerson, setContactPerson] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [userstate, setUserState] = useState("guest");
  const [phonenumber, setPhoneNumber] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged ran");
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("FOUND USER", user.uid);
        setUserState("userloading");
        
        if (user.uid === "PN4JqXrjsGfTsCUEEmaR5NO6rNF3") {
          setIsAdmin(true);
        }
        firestore.readAllUserIds().then((ids) => {
          console.log('ids in firestore', ids);
          if (ids.includes(user.uid)) {
            console.log("user exists");
            setUserId(user.uid);
          } else {
            console.log("user does not exist");
            function delay(ms) {
              return new Promise((resolve) => setTimeout(resolve, ms));
            }

            async function createNewUser() {
              await firestore.createNewUser(
                {
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                  emailVerified: user.emailVerified,
                  phoneNumber: '',
                  deliveryAddress: [],
                  contactPerson: [],
                  isAnonymous: user.isAnonymous,
                  orders: [],
                  cart: [],
                  favoriteItems: [],
                  payments: [],
                },
                user.uid
              );
            }
            console.log("creating new user");
            createNewUser();
            delay(1000).then(() => {
              setUserId(user.uid);
            })
          }
        });

        //
        // ...
      } else {
        // User is signed out
        // ...
        setUserId(null);
        setUserData(null);
        setUserLoaded(true);
        setUserState("guest");
      }
    });
  }, []);

  useEffect(() => {
    console.log(userId)

    if (userId) {
      firestore.readUserById(userId).then((data) => {
        console.log(data)
        setUserData(data);
        setFavoriteItems(data.favoriteItems);
        setCart(data.cart);
        setDeliveryAddress(data.deliveryAddress);
        setPhoneNumber(data.phoneNumber);
        setOrders(data.orders);
        setPayments(data.payments);
        setContactPerson(data.contactPerson);
        // LAST TO RUN
        setUserState("userloaded");
        setUserLoaded(true); 
      });
    }
  }, [userId, refreshUser]);

  const appContextValue = {
    userdata : userdata,
    setUserData : setUserData,
    isadmin : isadmin,
    firestore: firestore,
    cart: cart,
    setCart: setCart,
    favoriteitems: favoriteitems,
    setFavoriteItems: setFavoriteItems,
    userId: userId,
    setUserId: setUserId,
    refreshUser: refreshUser,
    setRefreshUser: setRefreshUser,
    userLoaded: userLoaded,
    setUserLoaded: setUserLoaded,
    deliveryaddress: deliveryaddress,
    setDeliveryAddress: setDeliveryAddress,
    latitude: latitude,
    setLatitude: setLatitude,
    longitude: longitude,
    setLongitude: setLongitude,
    userstate: userstate,
    setUserState: setUserState,
    phonenumber: phonenumber,
    setPhoneNumber: setPhoneNumber,
    orders: orders,
    setOrders: setOrders,
    payments: payments,
    setPayments: setPayments,
    contactPerson: contactPerson,
    setContactPerson : setContactPerson,
    auth: auth,
    setIsAdmin: setIsAdmin
  }

  return (
    <div data-testid='app' >
      <Routes>
        <Route
          path="/"
          element={
            <AppContext.Provider
              value={appContextValue}
            >
              <NavBar />
              <Shop />
            </AppContext.Provider>
          }
        />
        <Route
          path="/admin"
          element={
            <AppContext.Provider
              value={appContextValue}
            >
              <AdminSecurity />
            </AppContext.Provider>
          }
        />
        <Route
          path="/profile"
          element={
            <AppContext.Provider
              value={appContextValue}
            >
              <NavBar />
              <PersonalInfoForm />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkout"
          element={
            <AppContext.Provider
              value={appContextValue}
            >
              <NavBar />
              {userstate === "userloading" ? (
                <div className="flex h-screen">
                  <div className="flex flex-col justify-center m-auto">
                    <div className="flex justify-center ">
                      <CircularProgress size="20vh" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-center">
                        Fetching data...
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <CheckoutPage />
              )}
            </AppContext.Provider>
          }
        />
        <Route
          path="/myorders"
          element={
            <AppContext.Provider
              value={appContextValue}
            >
              <NavBar />
              {userstate === "userloading" ? (
                <div className="flex h-screen">
                  <div className="flex flex-col justify-center m-auto">
                    <div className="flex justify-center ">
                      <CircularProgress size="20vh" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-center">
                        Fetching data...
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <MyOrders />
                </div>
              )}
            </AppContext.Provider>
          }
        />
        <Route
          path="/accountstatement"
          element={
            <AppContext.Provider
              value={appContextValue}
            >
              <NavBar />
              {userstate === "userloading" ? (
                <div className="flex h-screen">
                  <div className="flex flex-col justify-center m-auto">
                    <div className="flex justify-center ">
                      <CircularProgress size="20vh" />
                    </div>
                    <div>
                      <Typography variant="h4" className="text-center">
                        Fetching data...
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <AccountStatement />
                </div>
              )}
            </AppContext.Provider>
            
          }
        />
      </Routes>
    </div>
  );
}

export default App;
