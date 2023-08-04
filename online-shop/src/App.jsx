import './App.css';
import NavBar from './components/NavBar';
import HomePage from './HomePage';
import Shop from './components/Shop';
import { useEffect, useState } from 'react';
import AppContext from './AppContext';
import { Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AdminSecurity from './components/AdminSecurity';
import firebaseConfig from './firebase_config';
import firestoredb from './firestoredb';
import PersonalInfoForm from './components/PersonalInfoForm';
import { CircularProgress, Typography } from '@mui/material';
import MyOrders from './components/MyOrders';
import AccountStatement from './components/AccountStatement';
import cloudFirestoreDb from './cloudFirestoreDb';
import { useNavigate } from 'react-router-dom';
import AppConfig from './AppConfig';
import './App.css';
import CheckoutSuccess from './components/CheckoutSuccess';
import CheckoutFailed from './components/CheckoutFailed';
import CheckoutCancelled from './components/CheckoutCancelled';
import Checkout from './components/Checkout';
import AccountStatementPayment from './components/AccountStatementPayment';
import ChatApp from './components/ChatApp/src/ChatApp';
import useWindowDimensions from './components/UseWindowDimensions';
import businessCalculations from '../utils/businessCalculations';
import ProfileUpdaterModal from './components/ProfileUpdaterModal';
import AffiliateSignUpPage from './components/AffiliateSignUpPage';
import AffiliatePage from './components/AffiliatePage';
import AffiliateForm from './components/AffiliateForm';


const devEnvironment = true;

function App() {
  const appConfig = new AppConfig();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // Get Authentication
  const auth = getAuth(app);
  // add captcha for phone auth

  // Get Storage
  const storage = getStorage(app);

  const [authEmulatorConnected, setAuthEmulatorConnected] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (appConfig.getIsDevEnvironment() == true) {
      if (!authEmulatorConnected) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        setAuthEmulatorConnected(true);
      }
    }
  }, [authEmulatorConnected]);

  // Initialize firestore class
  const firestore = new firestoredb(app, appConfig.getIsDevEnvironment());
  const db = firestore.db;
  const cloudfirestore = new cloudFirestoreDb();
  const businesscalculation = new businessCalculations();

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [userdata, setUserData] = useState(null);
  const [isadmin, setIsAdmin] = useState(false);
  const [favoriteitems, setFavoriteItems] = useState([]);
  const [cart, setCart] = useState({});
  const [refreshUser, setRefreshUser] = useState(false);
  const [userLoaded, setUserLoaded] = useState(null);
  const [deliveryaddress, setDeliveryAddress] = useState(null);
  const [contactPerson, setContactPerson] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [userstate, setUserState] = useState('guest');
  const [phonenumber, setPhoneNumber] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [guestLoginClicked, setGuestLoginClicked] = useState(false);
  const [products, setProducts] = useState([]);
  const [goToCheckoutPage, setGoToCheckoutPage] = useState(false);
  const [categories, setCategories] = useState(null);
  const [selectedChatOrderId, setSelectedChatOrderId] = useState(null);
  const [mayaRedirectUrl, setMayaRedirectUrl] = useState(null);
  const [mayaCheckoutId, setMayaCheckoutId] = useState(null);
  const { width, height } = useWindowDimensions;
  const [chatSwitch, setChatSwitch] = useState(false);
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(null);
  const [updateCartInfo, setUpdateCartInfo] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);
  const [isGoogleChrome, setIsGoogleChrome] = useState(false);
  const [cardSelected, setCardSelected] = useState(null);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(null);
  const [changeCard, setChangeCard] = useState(false);
  const [allUserData, setAllUserData] = useState(null);
  const [inquiryMessageSwitch, setInquiryMessageSwitch] = useState(false);
  const [unreadOrderMessages, setUnreadOrderMessages] = useState(0);
  const [unreadCustomerServiceMessages, setUnreadCustomerServiceMessages] = useState(0);
  const [openProfileUpdaterModal, setOpenProfileUpdaterModal] = useState(false);
  const [affiliate, setAffiliate] = useState(null);

  useEffect(() => {
    if (userdata != null) {
      let unreadCustomerServiceMessages = 0;
      firestore.readOrderMessageByReference(userdata.uid).then((messages) => {
        messages.messages.forEach((message) => {
          if (message.userId != userdata.uid) {
            if (message.read === false) {
              unreadCustomerServiceMessages += 1;
            }
          }
        });

        setUnreadCustomerServiceMessages(unreadCustomerServiceMessages);
      });

      let unreadOrderMessages = 0;
      orders.map((order) => {
        firestore.readOrderMessageByReference(order.reference).then((messages) => {
          messages.messages.forEach((message) => {
            if (message.userId != userdata.uid) {
              if (message.read === false) {
                unreadOrderMessages += 1;
              }
            }
          });

          setUnreadOrderMessages(unreadOrderMessages);
        });
      });
    }
  }, [userdata, orders]);

  useEffect(() => {
    if (userdata != null) {
      if (userdata.userRole == 'admin' || userdata.userRole == 'superAdmin') {
        firestore.readAllDataFromCollection('Users').then((users) => {
          setAllUserData(users);
        });
      }
    }
  }, [userdata]);

  useEffect(() => {
    let paymentState = {};
    firestore.readAllPaymentProviders().then((providers) => {
      providers.map((provider) => {
        if (provider.enabled === true) {
          paymentState[provider.id] = false;
        }
      });
    });
    setCardSelected(paymentState);
  }, []);

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // GET IF APPLE USER
  // IF APPLE USER USE AUTH POP UP IF NOT USE REDIRECT
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsAppleDevice(/iphone|ipad|ipod|macintosh/.test(userAgent));
    setIsAndroidDevice(/android/.test(userAgent));
    setIsGoogleChrome(/chrome/.test(userAgent));
  }, []);

  // GET USER BROWSER
  function checkIfBrowserSupported() {
    let userAgent = navigator.userAgent;
    if (document.documentElement.classList.contains('in-app-browser')) {
      return false;
    }
    if (typeof FB_IAB !== 'undefined') {
      return false;
    }

    if (userAgent.match(/FBAN|FBAV/i)) {
      return false;
    }

    if (userAgent.indexOf('FBAN') > -1) {
      return false;
    }
    if (
      userAgent.indexOf('Chrome') > -1 ||
      userAgent.indexOf('Firefox') > -1 ||
      userAgent.indexOf('Safari') > -1 ||
      userAgent.indexOf('Edge') > -1 ||
      userAgent.indexOf('MSIE ') > -1 ||
      userAgent.indexOf('Trident/') > -1
    ) {
      return true;
    }

    return false;
  }

  useEffect(() => {
    setIsSupportedBrowser(checkIfBrowserSupported());
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      
      if (user) {
        setUserState('userloading');
        setUser(user);
        cloudfirestore.checkIfUserIdAlreadyExist(user.uid).then((userExists) => {
          if (userExists) {
            setUserId(user.uid);
          } else {
            async function createNewUser() {
              await cloudfirestore.createNewUser(
                {
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                  emailVerified: user.emailVerified,
                  phoneNumber: user.phoneNumber,
                  deliveryAddress: [],
                  contactPerson: [],
                  isAnonymous: user.isAnonymous,
                  orders: [],
                  cart: {},
                  favoriteItems: [],
                  payments: [],
                  userRole: 'member',
                  affiliate: affiliate,
                  affiliateClaims : [],
                  affiliateDeposits : [],
                  affiliateCommissions : [],
                },
                user.uid
              );
            }

            createNewUser().then(() => {
              delay(1000).then(() => {
                setUserId(user.uid);
              });
            });
          }
        });

        //
        // ...
      } else {
        // User is signed out
        // ...
        setUser(null);
        setUserId(null);
        setUserData(null);
        setUserLoaded(true);
        setUserState('guest');
      }
    });
  }, [affiliate]);

  useEffect(() => {
    // GET ALL PRODUCTS
    async function readAllProductsForOnlineStore() {
      await cloudfirestore.readAllProductsForOnlineStore().then((products) => {
        setProducts(products);
      });
    }
    readAllProductsForOnlineStore();
  }, []);

  useEffect(() => {
    if (userdata) {
      if (userdata.name == null) {
      }
      if (userdata.name != null) {
        setUserLoaded(true);
        setUserState('user');
      }
    }
  }, [userdata]);

  useEffect(() => {
    // FLOW FOR GUEST LOGIN
    async function setAllUserData() {
      const localStorageCart = JSON.parse(localStorage.getItem('cart'));
      if (userId) {
        const data = await cloudfirestore.readSelectedUserById(userId);
        setUserData(data);
        setFavoriteItems(data.favoriteItems);

        if (guestLoginClicked === true) {
          setCart(localStorageCart);
          firestore.createUserCart(localStorageCart, userId).then(() => {
            localStorage.removeItem('cart');
            setGuestLoginClicked(false);
            setGoToCheckoutPage(true);
          });
        }
        if (guestLoginClicked === false) {
          setCart(data.cart);
        }
        // FLOW FOR GUEST LOGIN
        // ADMIN CHECK
        const adminRoles = ['admin', 'superAdmin'];

        const userRole = await cloudfirestore.readUserRole(data.uid);
        if (adminRoles.includes(userRole)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        if (userRole === 'affiliate') {
          setIsAffiliate(true);
        } else {
          setIsAffiliate(false);
        }
        // ADMIN CHECK

        setDeliveryAddress(data.deliveryAddress);
        setPhoneNumber(data.phoneNumber);
        setOrders(data.orders);
        setPayments(data.payments);
        setContactPerson(data.contactPerson);
        // LAST TO RUN
        setUserState('userloaded');
        setUserLoaded(true);
      }
    }
    setAllUserData();
  }, [userId, refreshUser]);

  useEffect(() => {
    if (goToCheckoutPage) {
      delay(2000).then(() => {
        navigateTo('/checkout/checkoutPage');
        setGoToCheckoutPage(false);
      });
    }
  }, [goToCheckoutPage]);

  // Checks if userdata is incomplete if it is show update profile modal
  useEffect(() => {
    if (userdata) {
      if (userdata.name == null) {
        setOpenProfileUpdaterModal(true);
      }
      if (userdata.email == null) {
        setOpenProfileUpdaterModal(true);
      }
      if (userdata.phoneNumber == null || userdata.phoneNumber == '') {
        setOpenProfileUpdaterModal(true);
      }
    }
  }, [userdata]);

  const appContextValue = {
    cardSelected: cardSelected,
    setCardSelected: setCardSelected,
    changeCard: changeCard,
    setChangeCard: setChangeCard,
    paymentMethodSelected: paymentMethodSelected,
    setPaymentMethodSelected: setPaymentMethodSelected,
    categories: categories,
    setCategories: setCategories,
    firebaseApp: app,
    db: db,
    user: user,
    userdata: userdata,
    setUserData: setUserData,
    isadmin: isadmin,
    firestore: firestore,
    cloudfirestore: cloudfirestore,
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
    setContactPerson: setContactPerson,
    auth: auth,
    setIsAdmin: setIsAdmin,
    setGuestLoginClicked: setGuestLoginClicked,
    products: products,
    setProducts: setProducts,
    goToCheckoutPage: goToCheckoutPage,
    setGoToCheckoutPage: setGoToCheckoutPage,
    storage: storage,
    selectedChatOrderId: selectedChatOrderId,
    setSelectedChatOrderId: setSelectedChatOrderId,
    mayaRedirectUrl: mayaRedirectUrl,
    setMayaRedirectUrl: setMayaRedirectUrl,
    mayaCheckoutId: mayaCheckoutId,
    setMayaCheckoutId: setMayaCheckoutId,
    width: width,
    chatSwitch: chatSwitch,
    setChatSwitch: setChatSwitch,
    isSupportedBrowser: isSupportedBrowser,
    updateCartInfo: updateCartInfo,
    setUpdateCartInfo: setUpdateCartInfo,
    isAppleDevice: isAppleDevice,
    allUserData: allUserData,
    setAllUserData: setAllUserData,
    inquiryMessageSwitch: inquiryMessageSwitch,
    setInquiryMessageSwitch: setInquiryMessageSwitch,
    unreadOrderMessages: unreadOrderMessages,
    setUnreadOrderMessages: setUnreadOrderMessages,
    unreadCustomerServiceMessages: unreadCustomerServiceMessages,
    setUnreadCustomerServiceMessages: setUnreadCustomerServiceMessages,
    isAndroidDevice: isAndroidDevice,
    isGoogleChrome: isGoogleChrome,
    affiliate: affiliate,
    setAffiliate: setAffiliate,
    updateCartInfo:updateCartInfo,
    setUpdateCartInfo:setUpdateCartInfo,
    isAppleDevice : isAppleDevice,
    allUserData : allUserData,
    setAllUserData:setAllUserData,
    inquiryMessageSwitch : inquiryMessageSwitch,
    setInquiryMessageSwitch : setInquiryMessageSwitch,
    unreadOrderMessages : unreadOrderMessages,
    setUnreadOrderMessages : setUnreadOrderMessages,
    unreadCustomerServiceMessages : unreadCustomerServiceMessages,
    setUnreadCustomerServiceMessages : setUnreadCustomerServiceMessages,
    isAndroidDevice : isAndroidDevice,
    isGoogleChrome : isGoogleChrome,
    affiliate : affiliate,
    setAffiliate : setAffiliate,
    isAffiliate: isAffiliate
  };

  return (
    <div id="app">
      <Routes>
        <Route
          path="/"
          element={
            <AppContext.Provider value={appContextValue}>
              <HomePage />
            </AppContext.Provider>
          }
        />
        <Route
          path="/shop"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {products != [] || categories != null ? (
                <Shop />
              ) : (
                <div className="flex w-full h-96 justify-center mt-80">
                  <CircularProgress size={150} />
                </div>
              )}
              {userdata ? (
                <ProfileUpdaterModal
                  userdata={userdata}
                  openProfileUpdaterModal={openProfileUpdaterModal}
                  setOpenProfileUpdaterModal={setOpenProfileUpdaterModal}
                />
              ) : null}
            </AppContext.Provider>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AppContext.Provider value={appContextValue}>
              <AdminSecurity />
            </AppContext.Provider>
          }
        />
        <Route
          path="/profile"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              <PersonalInfoForm />
            </AppContext.Provider>
          }
        />
        <Route
          path="/affiliate"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              <AffiliatePage />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkout/*"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {userstate === 'userloading' || cart == {} ? (
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
                <Checkout />
              )}
            </AppContext.Provider>
          }
        />
        <Route
          path="/myorders/*"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {userstate === 'userloading' ? (
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
          path="/orderChat"
          element={
            <AppContext.Provider value={appContextValue}>
              <ChatApp />
            </AppContext.Provider>
          }
        />
        <Route
          path="/accountstatement"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              {userstate === 'userloading' ? (
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
        <Route
          path="/AccountStatementPayment"
          element={
            <AppContext.Provider value={appContextValue}>
              <NavBar />
              <AccountStatementPayment />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutSuccess"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutSuccess />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutFailed"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutFailed />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutCancelled"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutCancelled />
            </AppContext.Provider>
          }
        />
        <Route
          path="/checkoutProofOfPayment"
          element={
            <AppContext.Provider value={appContextValue}>
              <CheckoutCancelled />
            </AppContext.Provider>
          }
        />
        <Route
          path="/signUp"
          element={
            <AppContext.Provider value={appContextValue}>
              <AffiliateSignUpPage setAffiliate={setAffiliate} />
            </AppContext.Provider>
          }
        />
        <Route
          path="/affiliateForm"
          element={
            <AppContext.Provider value={appContextValue}>
              <AffiliateForm />
            </AppContext.Provider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
