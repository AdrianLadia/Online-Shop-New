import React, { useRef, useEffect, useState, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions from './components/UseWindowDimensions';
import { BsBookHalf, BsList, BsArrowLeftShort, BsArrowRightShort, BsX } from 'react-icons/bs';
import { FaFacebookF, FaViber, FaInstagram, FaGoogle, FaPhoneAlt, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { FaPlay, FaPause, FaPenSquare, FaForward, FaBackward } from 'react-icons/fa';
import AppContext from './AppContext';
import GoogleMaps from './components/GoogleMaps';
import { useLocation } from 'react-router-dom';
import { AiFillMessage } from 'react-icons/ai';
import LoginButton from './components/LoginButton';
import AccountMenu from './components/AccountMenu';
import onLogoutClick from '../utils/classes/onLogoutClick';
import { Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const HomePage = ({ isAffiliateLink }) => {
  const navigateTo = useNavigate();
  const { userdata, setUserData, auth, setUserLoaded, setUserState, setUserId, setCart, categories } =
    useContext(AppContext);
  const favorites =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Ficon-star-copy-01.svg?alt=media&token=c1e2cd13-58b4-440f-b01f-1169202c253c';
  const autoCalculate =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDALL%C2%B7E%202023-08-23%2011.29.52%20-%20A%20vector%20illustration%20of%20a%20person%20using%20a%20calculator.png?alt=media&token=710cc90e-15bf-4ab9-a6d9-8946fc52009c';
  const pinpoint =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Flocation_icon-star-copy-02.svg?alt=media&token=0cc4139c-4e2f-4e24-abe4-b4f34e9a9a8d';
  const customerChat =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Fchaticon-star-copy-03.svg?alt=media&token=51a46c08-a673-4d16-ba73-56c5c1f931a0';
  const saved =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FSave-Map_icon-star-copy-04.svg?alt=media&token=2fa494fc-5387-4e49-9f49-1e2166fe67f3';
  const multiple =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Fmultiplepayment-05%20(1).svg?alt=media&token=3cd6fdfd-9d71-4ce4-afc2-3feec5891d93';
  const backgroundImageUrl =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FkMz46WMzlexoqIBGHaHX2gQ2lZo9%2F11584182023-107801%2Fpaper%20products.jpg?alt=media&token=895a3219-b509-4dcf-bdd8-ee8d86327f69';
  const contactsImage =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F11114222023-906350%2Fpexels-resource-boy-13031765.jpg?alt=media&token=2573bad4-dd7d-4387-a241-a565ac237123';
  const logo =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fstarpack.png?alt=media&token=e108388d-74f7-45a1-8344-9c6af612f053';
  const videoAd =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Videos%2FStarpack_Trimmed.mp4?alt=media&token=bc6b257e-7ba9-4568-b843-b32c4927a5fb&_gl=1*1pcfpf3*_ga*MTk5NDU4NTY2OC4xNjc4NDI0NDg0*_ga_CW55HF8NVT*MTY4NjE5NjY5Ny4xOC4xLjE2ODYxOTY3NjguMC4wLjA';
  const about =
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/affiliateDeposits%2Faffiliate_user_2%2Ff4b3d1ee-cd04-4b70-8255-e4a4594d5aabhome-page-01.svg?alt=media&token=1ee55a4e-4d5f-4035-b907-651d998b774b';
  const page1 = useRef();
  const page2 = useRef();
  const page3 = useRef();
  const page4 = useRef();
  const page5 = useRef();
  const { ref: p1, inView: p1inView } = useInView();
  const { ref: p2, inView: p2inView } = useInView();
  const { ref: p3, inView: p3inView } = useInView();
  const { ref: p4, inView: p4inView } = useInView();
  const { ref: p5, inView: p5inView } = useInView();
  const imageLinks = [
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F219188380_339680914479015_8955674208447247687_n.jpg?alt=media&token=e85ed75b-9834-4034-b45b-26d7374dfa46',
      title: 'Meal Boxes',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F221621321_342180770895696_1602830668534641305_n.jpg?alt=media&token=bdbd5aec-30d7-4d41-a80e-9c6d1ebeddb0',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F228038692_351362533310853_8813176931431024100_n.jpg?alt=media&token=6af11de3-dfb9-4dce-adb9-37538ad610cb',
      title: 'On the way to customer',
    },
    // {
    //   img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F222141374_346206067159833_8448281573669809504_n.jpg?alt=media&token=01acc82d-0deb-40e2-9b0c-ce5afc152c7d',
    //   title: 'Preparing Orders',
    // },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F217634046_336332124813894_7044115875027516288_n.jpg?alt=media&token=7faa3834-5385-4d5d-a470-df9bd6c2b4ef',
      title: 'Bulk Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F230694446_351362509977522_7348059010310207683_n.jpg?alt=media&token=370b0549-5b5c-421b-bcf3-2e138bca48d9',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F231067856_350219846758455_6976017347179805633_n.jpg?alt=media&token=22a1b914-9817-4bef-83f5-1a9608900ae0',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F234171857_352867233160383_8265703320209317540_n.jpg?alt=media&token=c112f337-173e-4eb0-830f-645ee6919d22',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FPack2.jpg?alt=media&token=3fa57a9e-dcdb-405b-8409-ae0a85d22a85',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2F234587905_352867103160396_4680551027091678700_n.jpg?alt=media&token=ec2ee6f6-7ad2-4fcf-962d-672975ef5da6',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FPack1.jpg?alt=media&token=ec918c4b-cf0d-4641-bcbf-79c4b65357d3',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FDeliver1.jpg?alt=media&token=9bec149c-8730-412e-b480-33c973494c06',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FPack3.jpg?alt=media&token=ba8f76cb-55cd-4b95-a9ef-979d7dc44537',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FDeliver2.jpg?alt=media&token=3a2e497a-56fb-4cf3-9524-cc8a73283a2a',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FPack4.jpg?alt=media&token=82eadf91-7f58-4fd2-b413-0767fdee9430',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FDeliver3.jpg?alt=media&token=000a12f1-1420-41ed-9804-1e4c02e8167b',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FPack5.jpg?alt=media&token=307a1810-8fdb-4e5d-a04b-19e1e2befa95',
      title: 'Preparing Orders',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FDeliver4.jpg?alt=media&token=51dc0b36-79fc-4313-a8af-6f1923c994aa',
      title: 'On the way to customer',
    },
    {
      img: 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDelivery%20Photos%2FPack6.jpg?alt=media&token=d717019f-a3a5-4ffb-bd79-bef8260cf22a',
      title: 'Preparing Orders',
    },
    // {
    //   img: ,
    //   title: ,
    // },
  ];
  const tutorial = [
    {
      step: [
        'Sign up for an Affiliate Program:',
        'Affiliates join a program offered by a company and receive a unique affiliate link.',
      ],
    },
    {
      step: [
        'Share the Affiliate Link:',
        'Affiliates share their special link through their website, social media, or other online channels.',
      ],
    },
    {
      step: [
        'People Click and Make Purchases:',
        'When someone clicks on the affiliate link and buys a product or service, the company tracks the sale back to the affiliate.',
      ],
    },
    {
      step: [
        'Earn Commissions:',
        "Based on the program's terms, the affiliate receives a commission or a percentage of the sale as their reward for driving customers to the company.",
      ],
    },
  ];
  // const categories = ['Paper Bags', 'Food Wrappers', 'Roll Bags', 'Meal Boxes', 'Sando Bags'];

  const [selectedCategory, setSelectedCategory] = useState('Paper Bag');
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(
    'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FPaper%20Bag.png?alt=media&token=3312b85b-8ae7-4d8c-83ff-8e5be3424f2f'
  );
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [locallatitude, setLocalLatitude] = useState(10.35979);
  const [locallongitude, setLocalLongitude] = useState(123.93984);
  const [localDeliveryAddress, setLocalDeliveryAddress] = useState('');
  const [zoom, setZoom] = useState(18);
  const [addressText, setAddressText] = useState('');
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const { width } = useWindowDimensions();
  const [showMenu, setShowMenu] = useState(false);
  const [showShopToolTip, setShowShopToolTip] = useState(false);
  const [showMessageToolTip, setShowMessageToolTip] = useState(false);
  const { pathname } = useLocation();
  const [photoUrl, setPhotoUrl] = useState('');

  function handleCategory(item) {
    if (item === 'Aluminum Tray') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FAluminum%20Tray.png?alt=media&token=53e2292b-7669-42a9-bd29-44b4b2afbbd4'
      );
      setSelectedCategory(item);
    }

    if (item === 'Bowls') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FPaper%20Bowls.png?alt=media&token=4fec5edb-9d7f-41cd-9553-ff86bdf7b26d'
      );
      setSelectedCategory(item);
    }

    if (item === 'Cake Box') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FCake%20Box.png?alt=media&token=3b8071ad-d8fc-4473-b61c-addf75edf4d7'
      );
      setSelectedCategory(item);
    }

    if (item === 'Food Wrappers') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FFood%20Wrapper.png?alt=media&token=97288826-8b18-42b6-b53d-38e9f50ee716'
      );
      setSelectedCategory(item);
    }

    if (item === 'Meal Box') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2Fclamshell%20700.png?alt=media&token=bfe9b5c5-a20e-489b-8f7b-94ed71490f59'
      );
      setSelectedCategory(item);
    }

    if (item === 'Paper Bag') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FPaper%20Bag.png?alt=media&token=3312b85b-8ae7-4d8c-83ff-8e5be3424f2f'
      );
      setSelectedCategory(item);
    }
    if (item === 'Plastic Containers') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FMicrowavables.png?alt=media&token=52d29e07-45a6-4338-8d28-81c63dc4ef4d'
      );
      setSelectedCategory(item);
    }
    if (item === 'Plates') {
      setSelectedCategoryImage('./vids/MB.png');
      setSelectedCategory(item);
    }
    if (item === 'Roll Bag') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FRoll%20Bag.png?alt=media&token=62bf8483-59fc-4a80-906f-a26c8b109170'
      );
      setSelectedCategory(item);
    }
    if (item === 'Sando Bag') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FSando%20Bag.png?alt=media&token=b98cefdc-0494-40be-af43-3cf408709651'
      );
      setSelectedCategory(item);
    }
    if (item === 'Sauce Cups') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FSauce%20Cups.png?alt=media&token=a613faa0-4242-43ea-bbb8-ad3d168bbbdb'
      );
      setSelectedCategory(item);
    }
    if (item === 'Sushi Tray') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FSushi%20Tray.png?alt=media&token=474c1626-c3c8-4cfa-937b-16aa3b98ef85'
      );
      setSelectedCategory(item);
    }
    if (item === 'Tissue Paper') {
      setSelectedCategoryImage('./vids/TB.png');
      setSelectedCategory(item);
    }
    if (item === 'Trash Bag') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FTrash%20Bags.png?alt=media&token=e2ac4ce9-5cdf-48c5-a4e4-0ae9ac33fec3'
      );
      setSelectedCategory(item);
    }
    if (item === 'Utensils') {
      setSelectedCategoryImage(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FProduct%20Photos%2FUtensils.png?alt=media&token=03f715b3-5665-4e95-8e63-8c16e67e1abd'
      );
      setSelectedCategory(item);
    }
  }

  function handleShop() {
    navigateTo('/shop');
  }

  function handleAff() {
    navigateTo('/signUp');
  }

  useEffect(() => {
    if (selectedSlide === 0) {
      setPhotoUrl(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Faffiliate-sign-up.png?alt=media&token=bde7a6cb-ecf7-4a46-a97a-9b84b2a41a32'
      );
    }
    if (selectedSlide === 1) {
      setPhotoUrl(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDALL%C2%B7E%202023-08-21%2011.19.12%20-%20an%20afiiliate%20with%20a%20red%20jacket%20happily%20sharing%20information%20to%20a%20restaurant%20owner%20256.png?alt=media&token=220d87f5-5ef0-45ac-853c-5d3b40ef90ec'
      );
    }
    if (selectedSlide === 2) {
      setPhotoUrl(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Faffiliate%20ordering%20254.png?alt=media&token=1eedd6e7-9518-4ac9-976b-47bed43ffd2b'
      );
    }
    if (selectedSlide === 3) {
      setPhotoUrl(
        'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Fearning%20commission%20256.png?alt=media&token=04c535e7-898a-44d1-aeb6-8d5b0e4019b2'
      );
    }
  }, [selectedSlide]);

  function previousSlide() {
    if (selectedSlide > 0) {
      setSelectedSlide(selectedSlide - 1);
    } else if (selectedSlide == 0) {
      setSelectedSlide(3);
    }
  }

  function nextSlide() {
    if (selectedSlide < 3) {
      setSelectedSlide(selectedSlide + 1);
    } else if (selectedSlide == 3) {
      setSelectedSlide(selectedSlide * 0);
    }
  }

  function sliderButton(number) {
    if (number == selectedSlide) {
      return 'w-2 md:w-3 h-2 md:h-3 rounded-full bg-color60 ease-in-out duration-400';
    } else {
      return 'w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white hover:bg-color10c ease-in-out duration-400';
    }
  }

  function productButtonStyle(product) {
    if (product === selectedCategory) {
      return 'h-10 md:h-12 text-xs xs:text-sm text-center w-full p-1 border border-color60 bg-color10b text-color60 text-bold text-white rounded-full font-semibold ease-in-out duration-100 ';
    } else {
      return 'h-10 md:h-12 text-xs xs:text-sm text-center w-full p-1 text-green2 border border-green2 hover:bg-green2 rounded-full text-color60 text-bold hover:text-white font-semibold ease-in-out duration-100 ';
    }
  }

  function buttonStyle(page) {
    if (p1inView == true && p2inView == false && page == 'page1') {
      return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold';
    } else if (p2inView == true && p3inView == false && page == 'page2') {
      return 'w-28 lg:lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold ';
    } else if (p3inView == true && p4inView == false && page == 'page3') {
      return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold';
    } else if (p4inView == true && p5inView == false && page == 'page4') {
      return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold';
    } else if (p5inView == true && p4inView == false && page == 'page5') {
      return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold';
    } else {
      return 'w-28 lg:w-32 h-20 hover:text-white ease-in-out duration-50 font-semibold ';
    }
  }

  function scroll(page) {
    if (page === 'page1') {
      page1.current.scrollIntoView({ behavior: 'instant' });
    } else if (page === 'page2') {
      page2.current.scrollIntoView({ behavior: 'instant' });
    } else if (page === 'page3') {
      page3.current.scrollIntoView({ behavior: 'instant' });
    } else if (page === 'page4') {
      page4.current.scrollIntoView({ behavior: 'instant' });
    } else if (page === 'page5') {
      page5.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function navStyle() {
    if (p1inView && p2inView === false) {
      return ' fixed flex justify-between items-center p-1 lg:p-10 h-1/10 bg-green3 bg-opacity-70 ease-in-out duration-300 w-full z-50';
    } else if (p5inView) {
      return ' hidden';
    } else {
      return ' fixed flex justify-between items-center p-1 lg:p-10 h-1/10 bg-green3 bg-opacity-100 ease-in-out duration-300 w-full z-50';
    }
  }

  function menuButtonStyle(page) {
    if (p1inView == true && p2inView == false && page == 'page1') {
      return ' w-full h-14 text-green2 bg-black rounded-t-xl';
    } else if (p2inView == true && p3inView == false && page == 'page2') {
      return ' w-full h-14 text-green2 bg-black';
    } else if (p3inView == true && p4inView == false && page == 'page3') {
      return ' w-full h-14 text-green2 bg-black';
    } else if (p4inView == true && p5inView == false && page == 'page4') {
      return ' w-full h-14 text-green2 bg-black rounded-b-xl';
    } else if (p5inView == true && p4inView == false && page == 'page5') {
      return ' w-full h-14 text-green2 bg-black rounded-b-xl';
    } else {
      return ' w-full h-14 hover:text-white hover:bg-green2';
    }
  }

  function spanFooterStyle() {
    return 'p-1 xs:p-2 rounded-full bg-color60 hover:bg-green1 cursor-pointer';
  }

  function menuStyle() {
    if (showMenu == false) {
      return 'h-12 w-10 sm:h-14 sm:w-12 bg-black text-white hover:text-color60 mt-1 p-1 rounded-sm';
    } else {
      return 'h-12 w-10 sm:h-14 sm:w-12 bg-black text-color60 hover:text-red-300 mt-1 p-1 rounded-sm';
    }
  }

  function togglePlay(toDo) {
    const video = videoRef.current;
    const forward = video.currentTime + 2;
    const back = video.currentTime - 2;

    if (toDo == 3) {
      video.currentTime = forward;
    } else if (toDo == 1) {
      video.currentTime = back;
    } else if (toDo == 2) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  function handleMessageClick() {
    if (userdata) {
      navigateTo('/orderChat', {
        state: { orderReference: userdata.uid, isInquiry: true, backButtonRedirect: pathname, fromHomePage: false },
      });
    } else {
      navigateTo('/orderChat', {
        state: { orderReference: null, isInquiry: true, backButtonRedirect: pathname, fromHomePage: true },
      });
    }
  }

  function responsiveMessageText() {
    if (width <= 767) {
      return 'Message';
    } else {
      return 'Message Us';
    }
  }

  function responsiveTitleText() {
    if (width <= 850) {
      return 'h4';
    } else if (width <= 1400) {
      return 'h3';
    } else if (width <= 1900) {
      return 'h2';
    } else {
      return 'h1';
    }
  }

  function responsiveText() {
    if (width <= 768) {
      return 'p';
    } else {
      return 'h6';
    }
  }

  return (
    <div
      className=" h-screen w-screen overflow-y-scroll overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})` }}
    >
      <Helmet>
        <title>Star Pack: Cebu's Leading Online Packaging Supplier</title>
        <meta
          name="description"
          content="Star Pack: Cebu's Leading Online Packaging Supplier. High Quality Products, Unparalleled Service, and Reasonable Price Points."
        />
        <meta
          property="og:description"
          content="Star Pack: Cebu's Leading Online Packaging Supplier. High Quality Products, Unparalleled Service, and Reasonable Price Points."
        />
        <meta property="og:url" content="https://www.starpack.ph/" />
      </Helmet>

      {/* Navigation Bar */}
      <nav className={navStyle()}>
        {/* Logo */}
        <div className="w-3/12 sm:w-2/12 xl:w-1/12 h-full flex justify-center items-center gap-4 ">
          <img
            src={logo}
            alt="logo"
            className=" h-14 w-14 sm:h-16 sm:w-16 2xl:h-20 2xl:w-20 rounded-full border-2 border-color30 cursor-pointer"
            // onClick={()=>{scroll("page1")}}
            onClick={() => {
              isAffiliateLink ? navigateTo('/') : scroll('page1');
            }}
          />
        </div>
        {/* Menu */}
        <div className="w-full sm:w-8/12 md:w-11/12 flex-row-reverse md:flex-row justify-start md:justify-between flex">
          {/* SMall Screen Menu */}
          <div className=" block md:hidden w-3/12 sm:w-2/12 text-3xl h-20 p-2 ">
            <div className=" flex justify-center items-center w-full h-full">
              {showMenu == false ? (
                <BsList
                  className={menuStyle()}
                  onClick={() => {
                    setShowMenu(true);
                  }}
                />
              ) : (
                <BsX
                  className={menuStyle()}
                  onClick={() => {
                    setShowMenu(false);
                  }}
                />
              )}
            </div>
            {showMenu === true ? (
              <div className="absolute top-20 sm:top-20 right-4 h-9/10 w-3/5 xs:w-1/2 sm:w-1/3 ease-in-out duration-300">
                <ul className="py-2 px-0.5 gap-2 divide-y divide-green3 rounded-xl flex flex-col w-full justify-start items-center bg-green2 border border-green3 bg-opacity-90">
                  <button
                    onClick={() => {
                      scroll('page1');
                    }}
                    className={'text-xl  ' + menuButtonStyle('page1')}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      scroll('page2');
                    }}
                    className={'text-xl  ' + menuButtonStyle('page2')}
                  >
                    About
                  </button>
                  <button
                    onClick={() => {
                      scroll('page3');
                    }}
                    className={'text-xl  ' + menuButtonStyle('page3')}
                  >
                    Products
                  </button>
                  {isAffiliateLink ? (
                    <button
                      onClick={() => {
                        scroll('page5');
                      }}
                      className={'text-xl  ' + menuButtonStyle('page5')}
                    >
                      Why Us?
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        scroll('page4');
                      }}
                      className={'text-xl  ' + menuButtonStyle('page4')}
                    >
                      Affiliate
                    </button>
                  )}
                </ul>
              </div>
            ) : null}
          </div>
          {/* LarGe screen menu */}
          <div className="hidden md:block w-11/12 lg:w-2/3 xl:w-1/2 text-base md:text-lg xl:text-xl h-20 gap-0.5 justify-evenly items-start ">
            <button
              onClick={() => {
                scroll('page1');
              }}
              className={buttonStyle('page1')}
            >
              Home
            </button>
            <button
              onClick={() => {
                scroll('page2');
              }}
              className={buttonStyle('page2')}
            >
              About
            </button>
            <button
              onClick={() => {
                scroll('page3');
              }}
              className={buttonStyle('page3')}
            >
              Products
            </button>
            {isAffiliateLink ? (
              <button
                onClick={() => {
                  scroll('page5');
                }}
                className={buttonStyle('page5')}
              >
                Why Us?
              </button>
            ) : (
              <button
                onClick={() => {
                  scroll('page4');
                }}
                className={buttonStyle('page4')}
              >
                Affiliate
              </button>
            )}
          </div>

          {p1inView == false && isAffiliateLink ? (
            <div className=" px-2 flex items-center">
              <LoginButton isAffiliateLink={isAffiliateLink} />
            </div>
          ) : p1inView == true && p2inView == false && width >= 768 ? (
            isAffiliateLink != true && userdata == null ? (
              <div className=" px-2 flex items-center">
                <LoginButton />
              </div>
            ) : isAffiliateLink != true ? (
              <AccountMenu
                signout={() => {
                  new onLogoutClick(
                    setUserId,
                    setUserData,
                    setUserLoaded,
                    setUserState,
                    setCart,
                    navigateTo,
                    auth
                  ).runMain();
                }}
              />
            ) : null
          ) : (p1inView == false && p2inView) || p3inView || p4inView ? (
            <div className=" gap-3 flex justify-end w-1/3 sm:w-1/4">
              {/* Message Button */}
              <div className="w-1/2 sm:w-4/12 xl:w-2/12 flex justify-end sm:justify-center items-center mr-1 ">
                <button
                  onClick={handleMessageClick}
                  className="text-3xl lg:text-4xl h-12 w-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mt-1 rounded-full 
                                relative flex justify-center items-center bg-black text-color10b hover:text-blue1"
                  onMouseEnter={() => {
                    setShowMessageToolTip(true);
                  }}
                  onMouseLeave={() => {
                    setShowMessageToolTip(false);
                  }}
                >
                  <AiFillMessage />
                </button>
                {showMessageToolTip ? (
                  <div
                    className="absolute top-20 mt-1 h-1/2 px-4 flex justify-center items-center rounded-xl 
                                bg-opacity-75 bg-black text-white ease-in-out duration-300"
                  >
                    Message Us!
                  </div>
                ) : null}
              </div>
              {/* Shop Button */}
              <div className="w-1/2 sm:w-4/12 xl:w-2/12 flex justify-end sm:justify-center items-center mr-1 ">
                <button
                  onClick={() => {
                    handleShop();
                  }}
                  className="text-2xl lg:text-3xl xl:text-4xl h-12 w-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mt-1 rounded-full 
                                relative flex justify-center items-center bg-black text-color60 hover:text-color30"
                  onMouseEnter={() => {
                    setShowShopToolTip(true);
                  }}
                  onMouseLeave={() => {
                    setShowShopToolTip(false);
                  }}
                >
                  <FaShoppingBag />
                </button>
                {showShopToolTip ? (
                  <div
                    className="absolute top-20 mt-1 h-1/2 px-4 flex justify-center items-center rounded-xl 
                                bg-opacity-75 bg-black text-white ease-in-out duration-300"
                  >
                    Shop Now!
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </nav>

      {/* Page 1 Home*/}
      <div
        ref={page1}
        className=" w-screen h-screen bg-cover bg-center "
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),' + `url(${backgroundImageUrl})`,
        }}
      >
        <div className="h-1/10 p-10 w-full flex" />
        <div ref={p1} className="w-screen h-9/10 flex flex-col my-6 md:mt-0 md:flex-row ">
          {/* Header */}
          <div className="h-1/2 md:h-full w-full md:w-4/10 items-start xs:items-center gap-5 flex flex-col justify-center ">
            <div className="mt-2 md:mt-0 justify-end md:justify-center items-center md:items-end h-full w-5/6 flex flex-col ">
              <div className="w-full sm:w-11/12 md:w-full lg:w-5/6 2xl:w-8/12 gap-2 ml-16 md:ml-0 p-3  flex flex-col ">
                <h1 className="text-4xl 2xs:text-5xl sm:text-6xl md:text-7xl text-color60 font-bold">Star Pack</h1>
                <h2 className="text-lg 2xs:text-xl sm:text-2xl md:text-3xl text-color30 tracking-tighter md:tracking-normal">
                  Cebu's Leading Online Packaging Supplier.
                </h2>
                <ul className="text-xs 2xs:text-md text-gray-400 mt-2 ml-2">
                  <li>
                    <a className=" text-color60">✓</a> High Quality Products.
                  </li>
                  <li>
                    <a className=" text-color60">✓</a> Unparalleled Service.
                  </li>
                  <li>
                    <a className=" text-color60">✓</a> Reasonable Price Points.
                  </li>
                </ul>
                {isAffiliateLink ? (
                  <div className="ml-2 mt-2 xs:mt-3 w-full sm:w-11/12">
                    <LoginButton isAffiliateLink={isAffiliateLink} />
                  </div>
                ) : (
                  <>
                    <span className="hover:w-32 md:hover:w-36 h-10 md:h-14 w-0 mt-3 bg-color10b rounded-r-full ease-in-out duration-300">
                      <button
                        className="w-32 md:w-36 h-10 md:h-14 font-normal md:font-semibold text-sm md:text-normal  border-color10b text-color10b hover:text-white hover:border-color10bp-3 flex justify-start items-center border-2 rounded-r-full ease-in-out duration-300"
                        onClick={handleShop}
                      >
                        <FaShoppingBag className="text-xl ml-3" />
                         Shop Now!
                      </button>
                    </span>
                    <span className="hover:w-32 md:hover:w-36 h-10 md:h-14 w-0 mt-3 bg-color60 rounded-r-full ease-in-out duration-300">
                      <button
                        className="w-32 md:w-36 h-10 md:h-14 font-normal md:font-semibold text-sm md:text-normal  border-color60 text-color60 hover:text-white hover:border-color60 p-3 flex justify-start items-center border-2 rounded-r-full ease-in-out duration-300"
                        onClick={handleMessageClick}
                      >
                        <AiFillMessage className="-ml-0.5 text-xl " /> {responsiveMessageText()}
                      </button>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Video  */}
          <div className="h-1/2 md:h-full w-full md:w-6/10 items-start xs:items-center flex justify-center ">
            <div className="h-7/10 w-full flex justify-center items-center relative">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                plays-inline="true"
                onClick={() => {
                  setShowButton(!showButton);
                }}
                className="h-full w-11/12 xl:w-10/12 flex justify-center items-center"
              >
                <source src={videoAd} />
              </video>
              {showButton ? (
                <div className="absolute flex justify-center items-center gap-12 2xs:gap-16 lg:gap-20 ">
                  <button
                    onClick={() => togglePlay(1)}
                    className="h-10 w-10 z-40 bg-opacity-40 text-white bg-black rounded-full flex justify-center items-center "
                  >
                    <FaBackward className="mr-1" />
                  </button>
                  <button
                    onClick={() => togglePlay(2)}
                    className="h-10 w-10 z-40 bg-opacity-50 text-white bg-black rounded-full flex justify-center items-center "
                  >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                  </button>
                  <button
                    onClick={() => togglePlay(3)}
                    className="h-10 w-10 z-40 bg-opacity-40 text-white bg-black rounded-full flex justify-center items-center "
                  >
                    <FaForward className="ml-1" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {/* Page 2 About*/}
      <div
        ref={page2}
        className="mt-10  w-screen h-screen bg-cover bg-center"
        //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}
      >
        <div className="h-1/10 w-full flex" />
        <div ref={p2} className="flex h-9/10 w-full justify-center items-center ">
          <div
            className=" w-11/12 h-9/10 flex-col md:flex-row p-5 sm:p-16 md:p-5 gap-2 sm:gap-4 flex items-center justify-evenly rounded-3xl bg-local bg-cover bg-center"
            //  style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),' + "url('./vids/pexel.jpg')"}}
          >
            {/* Header */}
            <div className="w-19/20 sm:w-9/10 md:w-4/10 h-1/2 md:h-1/2 p-5 gap-3 flex flex-col justify-start items-start rounded-2xl border border-gray-100">
              {/* <h1 className='h-2/10 text-2xl sm:text-4xl font-bold'>Star Pack is</h1> */}
              <Typography variant={responsiveTitleText()} sx={{ fontWeight: 'bold', color: '#6bd0ff' }}>
                Star Pack is...
              </Typography>
              <p className="h-6/10 tracking-tighter sm:tracking-normal text-sm w-full md:w-10/12 text-white indent-2 overflow-y-auto">
                <Typography variant={responsiveText()}>
                  "Empowering Businesses, Simplifying Success.
                  <br />
                  <br />
                  We pave the way for growth by streamlining operations, allowing companies to focus on what they do
                  best. Your vision, our mission."
                </Typography>
              </p>
              {/* <div className='h-2/10 flex justify-start'>
                  <span className='w-28 xs:w-32 md:w-32 h-10 md:h-12 hover:w-0 ease-in-out duration-300 rounded-r-full bg-black'>
                    <button className='w-28 xs:w-32 md:w-32 h-10 md:h-12 text-xs sm:text-md text-white hover:text-black border-black border font-normal md:font-semibold ease-in-out duration-300 rounded-r-full flex items-center p-3 '>
                      <BsBookHalf className='text-xl mr-1 sm:mr-2'/>Read More
                    </button>
                  </span>
                </div> */}
            </div>
            {/* Image */}
            <div className="w-19/20 sm:w-9/10 md:w-1/2 h-1/2 md:h-full flex justify-center items-center">
              <img
                className="w-full h-full rounded-3xl  text-white"
                alt="About Image"
                //  src='./vids/STAR-DELIVERY.png'
                src={about}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Page 3 Products*/}
      <div
        ref={page3}
        className=" w-screen h-screen bg-cover bg-center"
        //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}
      >
        <div className="h-1/10 w-full flex" />
        <div
          ref={p3}
          className="flex flex-col md:flex-row h-9/10 justify-center items-center p-5 gap-1 xs:gap-2 sm:gap-5 "
        >
          {/* Header & Image */}
          <div className=" w-11/12 md:w-7/12 h-1/2 xs:h-1/2 md:h-9/10 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl gap-1 sm:gap-5 flex flex-col justify-center items-center border border-green2">
            {/* <div className="h-1/5 text-2xl md:text-5xl w-10/12 sm:w-7/12 flex items-center font-bold text-white">
              {selectedCategory ? selectedCategory : 'Paper Bags'}
            </div> */}
            <div className=" w-64 h-64 lg:w-96 lg:h-96 rounded-xl xs:rounded-3xl border border-green2 overflow-hidden flex items-center justify-center">
              <img className="ease-in-out" src={selectedCategoryImage} />
            </div>
          </div>
          {/* Products & CTA*/}
          <div className="w-11/12 md:w-4/12 h-1/2 xs:h-1/2 md:h-9/10 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl flex flex-col justify-center items-center border border-green2 p-2">
            <div className="h-full w-full flex flex-col justify-center xs:justify-between gap-2 items-center ">
              <div className="w-10/12 h-2/10 text-2xl md:text-4xl items-center flex text-color10b font-bold ">
                Products We Offer:
              </div>
              <div className="w-11/12 h-6/10 flex flex-col justify-between items-center gap-4 ">
                <div className="w-full h-9/10 grid grid-cols-3 sm:grid-cols-2 p-3 justify-start items-start gap-2 overflow-y-auto">
                  {categories &&
                    categories.map((s, index) => {
                      if (s == 'Favorites') {
                        return null;
                      }
                      return (
                        <button key={index} onClick={() => handleCategory(s)} className={' ' + productButtonStyle(s)}>
                          <p className="overflow-x-auto">{s}</p>
                        </button>
                      );
                    })}
                </div>
              </div>
              <div className="h-2/10 w-full flex justify-center">
                <div className="w-32 md:w-36 lg:w-48 flex justify-start ">
                  <span className="w-32 md:w-36 lg:w-48 h-10 md:h-14 hover:w-0 bg-blue1 hover:bg-color10b mt-3 rounded-full ease-in-out duration-300">
                    <button
                      className=" w-32 md:w-36 lg:w-48 h-10 md:h-14 p-3 text-xs sm:text-sm flex justify-center items-center font-normal md:font-semibold rounded-full border border-blue1 text-white hover:text-color10b hover:border-color10b ease-in-out duration-300"
                      onClick={handleShop}
                    >
                      <FaShoppingBag className=" text-xl " />
                       Shop Now!
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 4 Affiliate*/}
      {isAffiliateLink ? null : (
        <div
          ref={page4}
          className=" w-screen h-screen bg-cover bg-center "
          //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}
        >
     {/* Last Page*/}
     <div className="flex w-full justify-center pb-20">
        <div className="border w-9/10 flex rounded-lg border-color60 items-center justify-center">
          <div className="flex flex-col  w-full pb-24 lg:pb-48">
            <div className="flex flex-col justify-center items-center w-full mt-20">
              <Typography variant={responsiveTitleText()} sx={{ fontWeight: 'bold', color: '#6bd0ff' }}>
                Shop Features
              </Typography>
            </div>

            <div className="flex flex-col mt-20">
              <div className="flex flex-row justify-evenly">
                <div className="w-1/3 lg:w-60 ">
                  <div className=" flex justify-center items-center ">
                    <img className="w-full h-full" alt="Favorite Items" src={favorites} />
                  </div>
                  <div className="  flex flex-col justify-start items-center rounded-b-2xl p-2 ">
                    <h1 className="h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30 text-white">
                      Favorite Items
                    </h1>
                    <h2 className="h-1/2 text-sm flex text-center p-1 tracking-tighter text-white">
                      Adding your favorite items to your 'Favorites' list for quick and convenient access.
                    </h2>
                  </div>
                </div>
                <div className="w-1/3 lg:w-60">
                  <div className=" flex justify-center items-center ">
                    <img className="w-full h-full" alt="Auto Calculate Cost" src={autoCalculate} />
                  </div>
                  <div className="  flex flex-col justify-start items-center rounded-b-2xl p-2 ">
                    <h1 className="h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30 text-white">
                      Auto Calculate Cost
                    </h1>
                    <h2 className="h-1/2 text-sm flex text-center p-1 tracking-tighter text-white">
                      The delivery fee and total cost of items will be calculated at checkout. There will be no hidden
                      charges after delivery.
                    </h2>
                  </div>
                </div>
                <div className="w-1/3 lg:w-60">
                  <div className=" flex justify-center items-center ">
                    <img className="w-full h-full" alt="This should render an image" src={pinpoint} />
                  </div>
                  <div className=" flex flex-col justify-start items-center rounded-b-2xl p-2 ">
                    <h1 className="h-1/2 flex text-center items-center font-bold p-1 underline  underline-offset-4 decoration-color30 text-white">
                      Pinpoint Location
                    </h1>
                    <h2 className="h-1/2 text-sm flex text-center p-1 tracking-tighter text-white">
                      Who needs big signs or landmarks when you can pinpoint your exact location!
                    </h2>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-evenly">
                <div className="lg:w-60">
                  <div className=" flex justify-center items-center ">
                    <img className="w-full h-full" alt="Chat With Customer Service" src={customerChat} />
                  </div>
                  <div className=" flex flex-col justify-start items-center rounded-b-2xl p-2 ">
                    <h1 className="h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30 text-white">
                      Chat with Customer Service
                    </h1>
                    <h2 className="h-1/2 text-sm flex text-center p-1 tracking-tighter text-white">
                      Any questions or concerns? There is a chat customer service available to help you out.
                    </h2>
                  </div>
                </div>
                <div className="lg:w-60">
                  <div className=" flex justify-center items-center ">
                    <img className="w-full h-full" alt="Save Location and Contacts" src={saved} />
                  </div>
                  <div className=" flex flex-col justify-start items-center rounded-b-2xl p-2 ">
                    <h1 className="h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30 text-white">
                      Save Location and Contacts
                    </h1>
                    <h2 className="h-1/2 text-sm flex text-center p-1 tracking-tighter text-white">
                      This makes it quicker and easier to fill in the details for your next order.
                    </h2>
                  </div>
                </div>
                <div className="lg:w-60">
                  <div className=" flex justify-center items-center ">
                    <img className="w-full h-full" alt="Multiple Payment Methods" src={multiple} />
                  </div>
                  <div className=" flex flex-col justify-start items-center rounded-b-2xl p-2 ">
                    <h1 className="h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30 text-white">
                      Multiple Payment Methods
                    </h1>
                    <h2 className="h-1/2 text-sm flex text-center p-1 tracking-tighter text-white">
                      Gives you the flexibility to choose the option that is most convenient and suits your preferences.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          <div
            ref={p4}
            className="flex flex-col md:flex-row h-9/10 w-screen items-center divide-y md:divide-y-0 md:divide-x divide-color60 "
          >
            {tutorial.map((state, index) => {
              if (selectedSlide === index) {
                return (
                  <div
                    key={index}
                    className="h-1/2  md:h-full xl:h-5/6 w-full md:w-7/12 md:ml-5 flex flex-col justify-center items-center p-5 relative "
                  >
                    <button
                      className="absolute mt-36 top-30 left-9 md:left-10 lg:left-12 xl:left-14 text-2xl p-0.5 md:p-2 rounded-full bg-color60 hover:bg-color10c ease-in-out duration-300 "
                      onClick={previousSlide}
                    >
                      <BsArrowLeftShort className="text-lg md:text-2xl text-white" />
                    </button>
                    <button
                      className="absolute mt-36 top-30 right-9 md:right-10 lg:right-12 xl:right-14 text-2xl p-0.5 md:p-2 rounded-full bg-color60 hover:bg-color10c ease-in-out duration-300"
                      onClick={nextSlide}
                    >
                      <BsArrowRightShort className="text-lg md:text-2xl text-white" />
                    </button>
                    <div
                      className="h-full w-19/20 p-5 md:p-10 flex flex-col justify-evenly items-center rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl border border-color60 bg-local bg-cover bg-center "
                      // style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.70),rgba(0,0,0,0.70)),' + "url('./vids/bg.jpg')"}}
                    >
                      {/* Steps */}
                      <div className="h-9/10 md:h-3/10 w-full flex justify-start items-center p-5 gap-2  ">
                        <div className="h-full w-full flex flex-col gap-2 overflow-y-auto ">
                          <h1 className="sm:text-lg md:text-xl tracking-wide text-white font-bold ">
                            <p className=" decoration-color60">
                              Step {index + 1} - {state.step[0]}
                            </p>{' '}
                            <div className="border-color60 border-b w-11/12"></div>
                            {/* <p className='underline underline-offset-4 decoration-color60'>{state.step[0]}</p> */}
                          </h1>
                          <p className="text-sm lg:text-md tracking-tighter md:tracking-wide indent-3 text-white ">
                            {state.step[1]}
                          </p>
                        </div>
                      </div>
                      <img
                        className="md:block  h-6/10 rounded-3xl border aspect-square border-color60 mb-3 text-white"
                        alt="Affiliate Image"
                        src={photoUrl}
                      />
                      <div className="w-full h-1/10 flex justify-center items-center gap-5">
                        <button
                          className={sliderButton(0)}
                          onClick={() => {
                            setSelectedSlide(0);
                          }}
                        ></button>
                        <button
                          className={sliderButton(1)}
                          onClick={() => {
                            setSelectedSlide(1);
                          }}
                        ></button>
                        <button
                          className={sliderButton(2)}
                          onClick={() => {
                            setSelectedSlide(2);
                          }}
                        ></button>
                        <button
                          className={sliderButton(3)}
                          onClick={() => {
                            setSelectedSlide(3);
                          }}
                        ></button>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {/* Affiliate Description */}
            <div className="h-1/2 md:h-full xl:h-5/6 w-full md:w-5/12 flex flex-col justify-center items-center md:items-start p-5 gap-5 ">
              <div
                className="h-full md:h-full w-19/20 md:w-11/12 p-5 md:p-10 gap-8 md:gap-5 flex flex-col 
                              justify-evenly md:justify-center items-center md:items-start border border-color60 
                              rounded-b-4xl md:rounded-r-3xl lg:rounded-l-none xl:rounded-r-semifull bg-cover bg-center "
                // style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.90),rgba(0,0,0,0.55)),' + `url(${affiliateImg})`}}
              >
                <h1
                  className="w-full lg:w-9/12 h-3/20 md:h-2/6 lg:h-3/10 text-lg 2xs:text-2xl sm:text-3xl md:text-4xl text-color10b p-1 font-bold 
                               tracking-tight md:tracking-wide "
                  //  underline underline-offset-8 decoration-color60
                >
                  Become an Affiliate
                </h1>
                <div className="font-thin w-full h-7/10 md:h-6/10 text-sm md:text-md xl:text-lg text-white tracking-tight indent-5 ml-0.5 overflow-y-auto">
                  An affiliate is someone who helps sell or promote a product or service. They are like a partner to the
                  company that makes the product. When the affiliate tells others about the product and those people buy
                  it because of the affiliate's recommendation, the affiliate gets a reward, like a small percentage of
                  the money from the sale. It's a way for people to earn a little bit of money by sharing things they
                  like with others.
                </div>
                <div className="flex justify-start items-center h-1/10 md:h-2/6 w-full ">
                  <span className="w-30 sm:w-32 md:w-36 h-10 md:h-14 hover:w-0 md:mt-3 bg-color30 rounded-r-full ease-in-out duration-300">
                    <button className="w-30 sm:w-32 md:w-36 h-10 md:h-14 text-xs sm:text-sm p-2 text-white border-color30 hover:text-yellow-500 hover:border-yellow-500 tracking-tighter sm:tracking-normal font-normal lg:font-semibold border flex justify-start items-center rounded-r-full ease-in-out duration-300">
                      <FaPenSquare className="ml-1 text-xl" /> <a className=" ml-2">Register</a>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

 

      {/* <div className="flex h-4/10 w-full 2xs:w-19/20 md:w-10/12 bg-opacity-60 rounded-t-3xl bg-color60 p-2">

      <div className=" h-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch gap-2 rounded-t-3xl overflow-y-auto">
      
        <div className="overflow-y-hidden flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch min-h-4/10 row-span-2 col-span-2">
          <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Find Us</h1>
          <div className="flex items-start 2xs:items-center justify-start gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full ">
            <span className={spanFooterStyle()}>
              <FaMapMarkerAlt className="text-white" />
            </span>
            <p className="text-slate-500 text-xs tracking-tighter overflow-x-auto">
              9W6M+7GX, P.Sanchez / Pagsabungan Rd, Mandaue City, Cebu.
            </p>
          </div>
          <div className="w-full">
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
              forFooter={true}
            />
          </div>
        </div>
     

        <div className="flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch ">
          <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Menu</h1>
          <div className="flex justify-start items-center gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full h-full text-xs">
            <ul className="h-19/20 w-11/12 flex flex-col justify-evenly items- gap-1 md:gap-2">
              <li
                onClick={() => {
                  scroll('page1');
                }}
                className="text-blue1 hover:text-color10b hover:underline cursor-pointer"
              >
                Home
              </li>
              <li
                onClick={() => {
                  scroll('page2');
                }}
                className="text-blue1 hover:text-color10b hover:underline cursor-pointer"
              >
                About Us
              </li>
              <li
                onClick={() => {
                  scroll('page3');
                }}
                className="text-blue1 hover:text-color10b hover:underline cursor-pointer"
              >
                Products
              </li>
              <li
                onClick={() => {
                  scroll('page4');
                }}
                className="text-blue1 hover:text-color10b hover:underline cursor-pointer"
              >
                Affiliate Program
              </li>
            </ul>
          </div>
        </div>
        Call Us
        <div className=" flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch ">
          <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Call Us</h1>
          <div className="flex justify-start items-center gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full h-full">
            <span className={spanFooterStyle()}>
              <FaPhoneAlt className="text-white" />
            </span>
            <p className="text-slate-500 text-xs tracking-tight overflow-x-auto">09178927206</p>
          </div>
        </div>
        Mail Us
        <div className=" flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch ">
          <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Mail Us</h1>
          <div className="flex justify-start items-center gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full h-full">
            <span className={spanFooterStyle()}>
              <FaGoogle className="text-white" />
            </span>
            <p className="text-slate-500 text-xs tracking-tight hyphens-auto overflow-x-auto">test@gmail.com</p>
          </div>
        </div>
        Follow Us
        <div className=" flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white  w-stretch ">
          <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Follow Us</h1>
          <div className="flex justify-around items-center gap-1 bg-slate-100 rounded-t-xl w-full mt-1 p-2 h-full">
            <span className={spanFooterStyle()}>
              <FaFacebookF className="text-white" />
            </span>
            <span className={spanFooterStyle()}>
              <FaViber className="text-white" />
            </span>
            <span className={spanFooterStyle()}>
              <FaInstagram className="text-white" />
            </span>
          </div>
        </div>
      </div>
      </div> */}

      {/* Copyright */}
      {/* <div className=" h-1/10 w-full flex flex-col justify-start items-center gap-2 bg-color60 bg-opacity-50">
        <div className="w-11/12 border-b-2 border-black" />
        <div className="flex h-full justify-center items-center gap-2">
          <div className="h-9/10 w-full flex justify-center items-center">Copyright © 2023 | Made by Paper Boy</div>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
