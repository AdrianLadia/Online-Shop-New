import React, {useRef, useEffect, useState, useContext} from 'react'
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions from './components/UseWindowDimensions';
import { BsBookHalf, BsList, BsArrowLeftShort, BsArrowRightShort, BsX } from "react-icons/bs";
import { FaFacebookF, FaViber, FaInstagram, FaGoogle, FaPhoneAlt, FaMapMarkerAlt, FaShoppingBag } from "react-icons/fa";
import { FaPlay, FaPause, FaPenSquare, FaForward, FaBackward } from "react-icons/fa";
import AppContext from './AppContext';
import GoogleMaps from './components/GoogleMaps'
import { useLocation } from 'react-router-dom';
import { AiFillMessage } from "react-icons/ai";
import LoginButton from './components/LoginButton';
import AccountMenu from './components/AccountMenu';
import onLogoutClick from '../utils/classes/onLogoutClick';

const HomePage = () => {

  const navigateTo = useNavigate()
  const { userdata, setUserData, auth, setUserLoaded, setUserState, setUserId, setCart} = useContext(AppContext)
  const favorites = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F0590b1d4-7351-40e2-b012-a1f408d9dc93customerchat-1.png?alt=media&token=5f77540f-f0cb-4d61-81a2-e61f2394f9ba";
  const pinpoint = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F1f812257-6879-4bbb-b534-2bd83e254f12customerchat-2.png?alt=media&token=14f9a6cb-c643-49c0-a985-332dae1f040b";
  const customerChat = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F10621e7b-77ae-461b-a6d4-314ccff59d55customerchat-3.png?alt=media&token=2711c910-92c5-4257-ade1-4e94c7489f71";
  const backgroundImageUrl = 'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FkMz46WMzlexoqIBGHaHX2gQ2lZo9%2F11584182023-107801%2Fpaper%20products.jpg?alt=media&token=895a3219-b509-4dcf-bdd8-ee8d86327f69';
  const affiliateImg = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F9544222023-173230%2Fpexels-anna-shvets-3986993.jpg?alt=media&token=6966d658-0d0f-45ed-bfb8-61f78c3988a0"
  const contactsImage = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F11114222023-906350%2Fpexels-resource-boy-13031765.jpg?alt=media&token=2573bad4-dd7d-4387-a241-a565ac237123"
  const logo = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fstarpack.png?alt=media&token=e108388d-74f7-45a1-8344-9c6af612f053"
  const videoAd = "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Videos%2FStarpack_Trimmed.mp4?alt=media&token=bc6b257e-7ba9-4568-b843-b32c4927a5fb&_gl=1*1pcfpf3*_ga*MTk5NDU4NTY2OC4xNjc4NDI0NDg0*_ga_CW55HF8NVT*MTY4NjE5NjY5Ny4xOC4xLjE2ODYxOTY3NjguMC4wLjA"
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
  const tutorial = [
    {step:["Sign up for an Affiliate Program:", "Affiliates join a program offered by a company and receive a unique affiliate link."]},
    {step:["Share the Affiliate Link:", "Affiliates share their special link through their website, social media, or other online channels."]},
    {step:["People Click and Make Purchases:", "When someone clicks on the affiliate link and buys a product or service, the company tracks the sale back to the affiliate."]},
    {step:["Earn Commissions:", "Based on the program's terms, the affiliate receives a commission or a percentage of the sale as their reward for driving customers to the company."]}
  ];
  const categories = ["Paper Bags", "Food Wrappers", "Roll Bags", "Meal Boxes", "Sando Bags"];
  const [selectedCategory, setSelectedCategory] = useState("Paper Bags")
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState("./vids/PPB.png");
  const [selectedAddress, setSelectedAddress] = useState(false);
  const [locallatitude, setLocalLatitude] = useState(10.359790);
  const [locallongitude, setLocalLongitude] = useState(123.939840);
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
  const {pathname} = useLocation();

    function handleCategory(item){
      if(item === "Paper Bags"){
        setSelectedCategoryImage("./vids/PPB.png")
        setSelectedCategory(item)
      }else if(item === "Food Wrappers"){
        setSelectedCategoryImage("./vids/AF.JPG")
        setSelectedCategory(item)
      }else if(item === "Roll Bags"){
        setSelectedCategoryImage("./vids/RB.png")
        setSelectedCategory(item)
      }else if(item === "Meal Boxes"){
        setSelectedCategoryImage("./vids/MB.png")
        setSelectedCategory(item)
      }else if(item === "Sando Bags"){
        setSelectedCategoryImage("./vids/SB.png")
        setSelectedCategory(item)
      }else if(item === "Trash Bags"){
        setSelectedCategoryImage("./vids/TB.png")
        setSelectedCategory(item)
      }
    }

    function handleShop(){
      navigateTo("/shop")
    }

    function previousSlide(){
      if(selectedSlide > 0){
        setSelectedSlide(selectedSlide - 1);
      }else if(selectedSlide == 0){
        setSelectedSlide(3);
      }
    }

    function nextSlide(){
      if(selectedSlide < 3){
        setSelectedSlide(selectedSlide + 1);
      }else if(selectedSlide == 3){
        setSelectedSlide(selectedSlide * 0);
      }
    }

    function sliderButton(number){
        if(number == selectedSlide){
          return 'w-2 md:w-3 h-2 md:h-3 rounded-full bg-color60 ease-in-out duration-400'
        }else{
          return 'w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white hover:bg-color10c ease-in-out duration-400'
        }
    }
    
    function productButtonStyle(product){
      if(product === selectedCategory){
        return 'h-10 md:h-12 text-xs xs:text-sm text-center w-full p-1 border border-color60 bg-color60 text-color60 text-bold text-white rounded-full font-semibold ease-in-out duration-100 '
      }else{
        return 'h-10 md:h-12 text-xs xs:text-sm text-center w-full p-1 text-green2 border border-green2 hover:bg-green2 rounded-full text-color60 text-bold hover:text-white font-semibold ease-in-out duration-100 '
      }
    }

    function buttonStyle(page){
      if(p1inView == true && p2inView == false && page == "page1"){
        return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold'
      }else if (p2inView == true && p3inView == false && page == "page2"){
        return 'w-28 lg:lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold '
      }else if (p3inView == true && p4inView == false && page == "page3"){
        return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold'
      }else if (p4inView == true && p5inView == false && page == "page4"){
        return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold'
      }else if (p5inView == true && p4inView == false && page == "page5"){
        return 'w-28 lg:w-32 h-20 border-b-4 text-white border-white ease-in-out duration-100 font-semibold'
      }else{
        return 'w-28 lg:w-32 h-20 hover:text-white ease-in-out duration-50 font-semibold '
      }
    }

    function scroll(page){
      if(page === "page1"){
        page1.current.scrollIntoView({ behavior: 'instant' })
      }else if(page === "page2"){
        page2.current.scrollIntoView({ behavior: 'instant' })
      }else if(page === "page3"){
        page3.current.scrollIntoView({ behavior: 'instant' })
      }else if(page === "page4"){
        page4.current.scrollIntoView({ behavior: 'instant' })
      }else if(page === "page5"){
        page5.current.scrollIntoView({ behavior: 'instant' })
      }
    }

    function navStyle(){
      if(p1inView && p2inView === false){
        return ' fixed flex justify-between items-center p-1 lg:p-10 h-1/10 bg-green3 bg-opacity-70 ease-in-out duration-300 w-full z-50'
      }else if(p5inView ) {
        return ' hidden'
      }else{
        return ' fixed flex justify-between items-center p-1 lg:p-10 h-1/10 bg-green3 bg-opacity-100 ease-in-out duration-300 w-full z-50'
      }
    }

    function menuButtonStyle(page){
      if(p1inView == true && p2inView == false && page == "page1"){
        return ' w-full h-14 text-green2 bg-black rounded-t-xl'
      }else if (p2inView == true && p3inView == false && page == "page2"){
        return ' w-full h-14 text-green2 bg-black'
      }else if (p3inView == true && p4inView == false && page == "page3"){
        return ' w-full h-14 text-green2 bg-black'
      }else if (p4inView == true && p5inView == false && page == "page4"){
        return ' w-full h-14 text-green2 bg-black rounded-b-xl'
      }else{
        return ' w-full h-14 hover:text-white hover:bg-green2'
      }
    }

    function spanFooterStyle(){
      return 'p-1 xs:p-2 rounded-full bg-color60 hover:bg-green1 cursor-pointer'
    }
    
    function menuStyle(){
      if(showMenu == false ){
        return 'h-12 w-10 sm:h-14 sm:w-12 bg-black text-white hover:text-color60 mt-1 p-1 rounded-sm'
      }else{
        return 'h-12 w-10 sm:h-14 sm:w-12 bg-black text-color60 hover:text-red-300 mt-1 p-1 rounded-sm'
      }
    }

    function togglePlay(toDo) {
      const video = videoRef.current;
      const forward = video.currentTime + 1.5;
      const back = video.currentTime - 1.5;

      if(toDo == 3){
        video.currentTime = forward;
      }else if(toDo == 1){
        video.currentTime = back;
      }else if (toDo == 2){
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    function footerCardStyle(){
      return " hover:bg-green1 hover:bg-opacity-20 hover:border-none w-full h-full p-2 gap-1 flex flex-col justify-center items-center border border-color60 rounded-t-xl"
    }

    function handleMessageClick(){
      if (userdata) {
        console.log('Has userdata')
        navigateTo('/orderChat',{ state: { orderReference: userdata.uid,isInquiry: true,backButtonRedirect:pathname,fromHomePage:false } })
      }
      else {
        navigateTo('/orderChat',{ state: { orderReference: null,isInquiry: true,backButtonRedirect:pathname,fromHomePage:true } })
      }
    }

    function responsiveMessageText() {
      if (width <= 767) {
        return 'Message'
      }
      else {
        return 'Message Us'
      }
    }

    return (
    <div className="snap-y snap-proximity h-screen w-screen overflow-y-scroll overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}>
        {/* Navigation Bar */}
        <div className={ navStyle() }>
          {/* Logo */}
          <div className='w-3/12 sm:w-2/12 xl:w-1/12 h-full flex justify-center items-center gap-4 '>
            <img src={logo} alt="logo"
                className=" h-14 w-14 sm:h-16 sm:w-16 2xl:h-20 2xl:w-20 rounded-full border-2 border-color30 cursor-pointer"
                onClick={()=>{scroll("page1")}}
                />
          </div>
          {/* Menu */}
          <div className='w-full sm:w-8/12 md:w-11/12 flex-row-reverse md:flex-row justify-start md:justify-between flex'>
            {/* SMall Screen Menu */}
            <div className='block md:hidden w-3/12 sm:w-2/12 text-3xl h-20 p-2 '> 
              <div className=' flex justify-center items-center w-full h-full'>
                {showMenu == false ? 
                  <BsList className={menuStyle()} onClick={()=>{setShowMenu(true)}}/> : <BsX className={menuStyle()} onClick={()=>{setShowMenu(false)}}/>}
              </div>
              {showMenu === true ?
                <div className='absolute top-20 sm:top-20 right-4 h-9/10 w-3/5 xs:w-1/2 sm:w-1/3 ease-in-out duration-300'>
                  <ul className="py-2 px-0.5 gap-2 divide-y divide-green3 rounded-xl flex flex-col w-full justify-start items-center bg-green2 border border-green3 bg-opacity-90">
                    <button onClick={()=>{scroll("page1")}} className={"text-xl  " + menuButtonStyle("page1")}>Home</button>
                    <button onClick={()=>{scroll("page2")}} className={"text-xl  " + menuButtonStyle("page2")}>About</button>
                    <button onClick={()=>{scroll("page3")}} className={"text-xl  " + menuButtonStyle("page3")}>Products</button>
                    <button onClick={()=>{scroll("page4")}} className={"text-xl  " + menuButtonStyle("page4")}>Affiliate</button>
                  </ul>
                </div> : null
              }
            </div> 
            {/* LarGe screen menu */}
            <div className='hidden md:block w-11/12 lg:w-2/3 xl:w-1/2 text-base md:text-lg xl:text-xl h-20 gap-0.5 justify-evenly items-start '>
              <button onClick={()=>{scroll("page1")}} className={buttonStyle("page1")}>Home</button>
              <button onClick={()=>{scroll("page2")}} className={buttonStyle("page2")}>About</button>
              <button onClick={()=>{scroll("page3")}} className={buttonStyle("page3")}>Products</button>
              <button onClick={()=>{scroll("page4")}} className={buttonStyle("page4")}>Affiliate</button>
            </div>
            {/* {(userdata == null) ? <div className='flex items-center '> <LoginButton/></div> : }  */}
            {p1inView == true && p2inView == false && width >= 768 ? 
              (userdata == null) ? 
                <div className=' px-2 flex items-center'>
                  <LoginButton />
                </div> : <AccountMenu />
            : p1inView == false && p2inView || p3inView || p4inView ?
            <div className=' gap-3 flex justify-end w-1/3 sm:w-1/4'>
              {/* Message Button */}
              <div className='w-1/2 sm:w-4/12 xl:w-2/12 flex justify-end sm:justify-center items-center mr-1 '>
                <button
                  onClick={handleMessageClick}
                  className="text-3xl lg:text-4xl h-12 w-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mt-1 rounded-full 
                                relative flex justify-center items-center bg-black text-color10b hover:text-blue1"
                  onMouseEnter={()=>{setShowMessageToolTip(true)}} onMouseLeave={()=>{setShowMessageToolTip(false)}}
                >
                  <AiFillMessage />
                </button>
                {showMessageToolTip ? 
                <div className='absolute top-20 mt-1 h-1/2 px-4 flex justify-center items-center rounded-xl 
                                bg-opacity-75 bg-black text-white ease-in-out duration-300'
                                >Message Us!</div> : null}
              </div> 
              {/* Shop Button */}
              <div className='w-1/2 sm:w-4/12 xl:w-2/12 flex justify-end sm:justify-center items-center mr-1 ' 
                >
                <button onClick={()=>{handleShop()}} 
                    className="text-2xl lg:text-3xl xl:text-4xl h-12 w-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mt-1 rounded-full 
                                relative flex justify-center items-center bg-black text-color60 hover:text-color30"
                    onMouseEnter={()=>{setShowShopToolTip(true)}} onMouseLeave={()=>{setShowShopToolTip(false)}}
                    ><FaShoppingBag />
                </button>  
                {showShopToolTip ? 
                <div className='absolute top-20 mt-1 h-1/2 px-4 flex justify-center items-center rounded-xl 
                                bg-opacity-75 bg-black text-white ease-in-out duration-300'
                                >Shop Now!</div> : null}
              </div>
            </div> : null}
          </div> 
        </div>

        {/* Page 1 Home*/}
        <div ref={page1} className="snap-start w-screen h-screen bg-cover bg-center " 
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),' + `url(${backgroundImageUrl})`}}
          >
            <div className='h-1/10 p-10 w-full flex'/>
            <div ref={p1} className='w-screen h-9/10 flex flex-col my-6 md:mt-0 md:flex-row '>
              {/* Header */}
              <div className='h-1/2 md:h-full w-full md:w-4/10 items-start xs:items-center gap-5 flex flex-col justify-center '>
                <div className='mt-2 md:mt-0 justify-end md:justify-center items-center md:items-end h-full w-5/6 flex flex-col '>
                    <div className='w-full sm:w-11/12 md:w-full lg:w-5/6 2xl:w-8/12 gap-2 ml-16 md:ml-0 p-3  flex flex-col '>
                      <h1 className='text-4xl 2xs:text-5xl sm:text-6xl md:text-7xl text-color60 font-bold'>Star Pack</h1>
                      <h2 className='text-lg 2xs:text-xl sm:text-2xl md:text-3xl text-color30 tracking-tighter md:tracking-normal'>Cebu's Leading Online Packaging Supplier.</h2>
                      <ul className='text-xs 2xs:text-md text-gray-400 mt-2 ml-2'>
                        <li><a className=' text-color60'>✓</a> High Quality Products.</li>
                        <li><a className=' text-color60'>✓</a> Unparalleled Service.</li>
                        <li><a className=' text-color60'>✓</a> Reasonable Price Points.</li>
                      </ul>
                      <span className='hover:w-32 md:hover:w-36 h-10 md:h-14 w-0 mt-3 bg-color60 rounded-r-full ease-in-out duration-300'> 
                        <button 
                          className='w-32 md:w-36 h-10 md:h-14 font-normal md:font-semibold text-sm md:text-normal border-color60 text-color60 hover:text-white hover:border-color60 p-3 flex justify-start items-center border-2 rounded-r-full ease-in-out duration-300'
                          onClick={handleShop}
                            ><FaShoppingBag className='text-xl '/> Shop Now!
                        </button>
                      </span>
                      <span className='hover:w-32 md:hover:w-36 h-10 md:h-14 w-0 mt-3 bg-color10b rounded-r-full ease-in-out duration-300'> 
                        <button 
                          className='w-32 md:w-36 h-10 md:h-14 font-normal md:font-semibold text-sm md:text-normal border-color10b text-color10b hover:text-white hover:border-color10b p-3 flex justify-start items-center border-2 rounded-r-full ease-in-out duration-300'
                          onClick={handleMessageClick}
                            ><AiFillMessage className='-ml-0.5 text-xl '/> {responsiveMessageText()}
                        </button>
                      </span>
                    </div>
                </div>
              </div>
              {/* Video  */}
              <div className='h-1/2 md:h-full w-full md:w-6/10 items-start xs:items-center flex justify-center '>
                  <div className='h-7/10 w-full flex justify-center items-center relative' >
                    <video ref={videoRef} autoPlay loop muted plays-inline="true" onClick={()=>{setShowButton(!showButton)}}
                          className='h-full w-11/12 xl:w-10/12 flex justify-center items-center'>
                      <source src={videoAd} />
                    </video>
                    {showButton ?
                    (<div className='absolute flex justify-center items-center gap-12 2xs:gap-16 lg:gap-20 ' >
                      <button onClick={() => togglePlay(1)} className='h-10 w-10 z-40 bg-opacity-40 text-white bg-black rounded-full flex justify-center items-center '
                        ><FaBackward className='mr-1'/>
                      </button>
                      <button onClick={() => togglePlay(2)} className='h-10 w-10 z-40 bg-opacity-50 text-white bg-black rounded-full flex justify-center items-center '
                        >{isPlaying ? <FaPause />:<FaPlay className='ml-1'/>}
                      </button>
                      <button onClick={() => togglePlay(3)} className='h-10 w-10 z-40 bg-opacity-40 text-white bg-black rounded-full flex justify-center items-center '
                        ><FaForward className='ml-1'/>
                      </button>
                    </div>
                    ):null}
                  </div>
              </div>
            </div>
        </div>

        {/* Page 2 About*/}
        <div ref={page2} className="mt-10 snap-start w-screen h-screen bg-cover bg-center"
        //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}
         >
          <div className='h-1/10 w-full flex'/>
          <div ref={p2} className='flex h-9/10 w-full justify-center items-center '>
            <div className=' w-11/12 h-9/10 flex-col md:flex-row p-5 sm:p-16 md:p-5 gap-2 sm:gap-4 flex items-center justify-evenly rounded-3xl bg-local bg-cover bg-center'
              //  style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),' + "url('./vids/pexel.jpg')"}}
               >
              {/* Header */}
              <div className='w-19/20 sm:w-9/10 md:w-4/10 h-1/2 md:h-1/2 p-5 gap-3 flex flex-col justify-start items-start rounded-2xl border border-gray-100'>
                <h1 className='h-2/10 text-2xl sm:text-4xl font-bold'>Star Pack is</h1>
                <p className='h-6/10 tracking-tighter sm:tracking-normal text-sm w-full md:w-10/12 text-white indent-2 overflow-y-auto'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                  Quisquam facilis sapiente reprehenderit quis exercitationem corporis obcaecati. 
                </p>
                <div className='h-2/10 flex justify-start'>
                  <span className='w-28 xs:w-32 md:w-32 h-10 md:h-12 hover:w-0 ease-in-out duration-300 rounded-r-full bg-black'>
                    <button className='w-28 xs:w-32 md:w-32 h-10 md:h-12 text-xs sm:text-md text-white hover:text-black border-black border font-normal md:font-semibold ease-in-out duration-300 rounded-r-full flex items-center p-3 '>
                      <BsBookHalf className='text-xl'/>  Read More
                    </button>
                  </span>
                </div>
              </div>
              {/* Image */}
              <div className='w-19/20 sm:w-9/10 md:w-1/2 h-1/2 md:h-full flex justify-center items-center'>
                <img className='w-full h-full rounded-3xl  text-white'  
                   alt='About Image' 
                  //  src='./vids/STAR-DELIVERY.png'
                  src='https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/Orders%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2FqVTOh9OFWYh4myliIFXYIkr5D7H2%2F24f9d0f1-529e-45ce-8830-4bfcfc4f2aa1STAR-DELIVERY.png?alt=media&token=5bdefdfe-8c25-4260-aa75-f753adb5e74f'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Page 3 Products*/}
        <div ref={page3} className="snap-start w-screen h-screen bg-cover bg-center"
        //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}
         >
          <div className='h-1/10 w-full flex'/>
          <div ref={p3} className='flex flex-col md:flex-row h-9/10 justify-center items-center p-5 gap-1 xs:gap-2 sm:gap-5 '>
            {/* Header & Image */}
            <div className=' w-11/12 md:w-7/12 h-1/2 xs:h-1/2 md:h-9/10 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl gap-1 sm:gap-5 flex flex-col justify-center items-center border border-green2'>
              <div className='h-1/5 text-2xl md:text-5xl w-10/12 sm:w-7/12 flex items-center font-bold text-white'>{selectedCategory ? selectedCategory : "Paper Bags"}</div>
              <img className='w-10/12 sm:w-8/12 h-3/5 rounded-xl xs:rounded-3xl ease-in-out border border-green2 ' src={selectedCategoryImage}/>
            </div>
            {/* Products & CTA*/}
            <div className='w-11/12 md:w-4/12 h-1/2 xs:h-1/2 md:h-9/10 rounded-b-3xl md:rounded-bl-none md:rounded-r-3xl flex flex-col justify-center items-center border border-green2 p-2'>
              <div className='h-full w-full flex flex-col justify-center xs:justify-between gap-2 items-center '>
                <div className='w-10/12 h-2/10 text-2xl md:text-4xl items-center flex text-white font-bold '>Products We Offer:</div>
                <div className='w-11/12 h-6/10 flex flex-col justify-between items-center gap-4 '>
                  <div className='w-full h-9/10 grid grid-cols-3 sm:grid-cols-2 p-3 justify-start items-start gap-2 overflow-y-auto'>
                    {categories && categories.map((s, index)=>{
                      return(<button key={index} onClick={()=>handleCategory(s)} className={" " + productButtonStyle(s)}><p className='overflow-x-auto'>{s}</p></button>)
                    })}
                  </div>
                </div>
                <div className='h-2/10 w-full flex justify-center'>
                  <div className='w-32 md:w-36 lg:w-48 flex justify-start '>
                    <span className='w-32 md:w-36 lg:w-48 h-10 md:h-14 hover:w-0 bg-blue1 hover:bg-color10b mt-3 rounded-full ease-in-out duration-300'> 
                      <button 
                        className=' w-32 md:w-36 lg:w-48 h-10 md:h-14 p-3 text-xs sm:text-sm flex justify-center items-center font-normal md:font-semibold rounded-full border border-blue1 text-white hover:text-color10b hover:border-color10b ease-in-out duration-300'
                        onClick={handleShop}
                        ><FaShoppingBag className=' text-xl '/> Shop Now!
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 4 Affiliate*/}
        <div ref={page4} className="snap-start w-screen h-screen bg-cover bg-center "
        //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.1)),' + `url(${contactsImage})`}}
         >
          <div className='h-1/10 md:p-10 w-full'/>
          <div ref={p4} className='flex flex-col md:flex-row h-9/10 w-screen items-center divide-y md:divide-y-0 md:divide-x divide-color60 '>
          {tutorial.map((state, index)=>{
           if(selectedSlide === index){
            return (
              <div key={index} className='h-1/2 md:h-5/6 w-full md:w-7/12 md:ml-5 flex flex-col justify-center items-center p-5 relative '>
                   <button className='absolute top-30 left-9 md:left-10 lg:left-12 xl:left-14 text-2xl p-0.5 md:p-2 rounded-full bg-color60 hover:bg-color10c ease-in-out duration-300 '
                    onClick={previousSlide} ><BsArrowLeftShort className='text-lg md:text-2xl text-white'/>
                  </button>
                  <button className='absolute top-30 right-9 md:right-10 lg:right-12 xl:right-14 text-2xl p-0.5 md:p-2 rounded-full bg-color60 hover:bg-color10c ease-in-out duration-300' 
                    onClick={nextSlide} ><BsArrowRightShort className='text-lg md:text-2xl text-white'/>
                  </button>
                <div className="h-full w-19/20 p-5 md:p-10 flex flex-col justify-evenly items-center rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl border border-color60 bg-local bg-cover bg-center "
                    // style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.70),rgba(0,0,0,0.70)),' + "url('./vids/bg.jpg')"}}
                    >
                    {/* Steps */}
                  <div className='h-9/10 md:h-3/10 w-full flex justify-start items-center p-5 gap-2 '>
                    <div className='h-full w-full flex flex-col gap-2 overflow-y-auto '>
                      <h1 className='sm:text-lg md:text-xl tracking-wide text-white font-bold '
                        ><p className=' decoration-color60'>Step {index + 1} - {state.step[0]}</p> <div className='border-color60 border-b w-11/12'></div>
                        {/* <p className='underline underline-offset-4 decoration-color60'>{state.step[0]}</p> */}
                      </h1>
                      <p className='text-sm lg:text-md tracking-tighter md:tracking-wide indent-3 text-gray-200 '
                        >{state.step[1]}
                      </p>
                    </div>
                  </div>
                  <img className='hidden md:block w-11/12 h-6/10 rounded-3xl border border-color60 mb-3 text-white' alt='Affiliate Image' src='./' />
                  <div className='w-full h-1/10 flex justify-center items-center gap-5'>
                    <button className={sliderButton(0)} onClick={()=>{setSelectedSlide(0)}}></button>
                    <button className={sliderButton(1)} onClick={()=>{setSelectedSlide(1)}}></button>
                    <button className={sliderButton(2)} onClick={()=>{setSelectedSlide(2)}}></button>
                    <button className={sliderButton(3)} onClick={()=>{setSelectedSlide(3)}}></button>
                  </div>
                </div>
              </div>
            )}})}
            {/* Affiliate Description */}
            <div className='h-1/2 md:h-5/6 w-full md:w-5/12 flex flex-col justify-center items-center md:items-start p-5 gap-5 '>
              <div className='h-full md:h-full w-19/20 md:w-11/12 p-5 md:p-10 gap-8 md:gap-5 flex flex-col 
                              justify-evenly md:justify-center items-center md:items-start border border-color60 
                              rounded-b-4xl md:rounded-r-3xl lg:rounded-l-none lg:rounded-r-semifull bg-cover bg-center '
              // style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.90),rgba(0,0,0,0.55)),' + `url(${affiliateImg})`}}
              >
                <h1 className='w-full lg:w-9/12 h-3/20 md:h-2/6 lg:h-3/10 text-lg 2xs:text-2xl sm:text-3xl md:text-4xl text-white p-1 font-bold 
                               tracking-tight md:tracking-wide underline underline-offset-8 decoration-color60'
                  >Become an Affiliate
                </h1>
                <div className='font-thin w-full h-7/10 md:h-6/10 text-sm md:text-md xl:text-lg text-gray-200 tracking-tight indent-5 ml-0.5 overflow-y-auto'>
                    An affiliate is someone who helps sell or promote a product or service. 
                    They are like a partner to the company that makes the product. 
                    When the affiliate tells others about the product and those people buy it because of the affiliate's recommendation,
                    the affiliate gets a reward, like a small percentage of the money from the sale. 
                    It's a way for people to earn a little bit of money by sharing things they like with others.
                </div>
                <div className='flex justify-start items-center h-1/10 md:h-2/6 w-full '>
                  <span className='w-30 sm:w-32 md:w-36 h-10 md:h-14 hover:w-0 md:mt-3 bg-color30 rounded-r-full ease-in-out duration-300'> 
                    <button 
                      className='w-30 sm:w-32 md:w-36 h-10 md:h-14 text-xs sm:text-sm p-2 text-white border-color30 hover:text-yellow-500 hover:border-yellow-500 tracking-tighter sm:tracking-normal font-normal lg:font-semibold border flex justify-start items-center rounded-r-full ease-in-out duration-300'
                      ><FaPenSquare className='ml-1 text-xl'/> <a className=' ml-2'>Register</a>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <> </>
        {/* Last Page*/}
        <div ref={page5} className="snap-start w-screen h-screen flex flex-col justify-center items-center bg-cover bg-center"
        //  style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0)),' + `url(${contactsImage})`}}
         >
          {/* <div className='rounded-full m-1 border-x-2 border-color30 text-white px-0.5 text-6xl font-bold w-fit flex justify-center items-center tracking-wider'>
            <div className=' rounded-full h-full border-color60 border-y-2 flex items-center'>
              <img src={logo} className=" h-14 w-14 rounded-full border-2 border-color30"/>
            </div>
          </div> */}
          <div ref={p5} className='flex flex-col justify-evenly items-end h-screen w-screen mb-2'>
            {/* Why Us */}
            <div className='w-full h-full flex flex-col justify-end items-center gap-3'>
              <div className='h-11/20 w-19/20 md:w-10/12 mt-2.5 rounded-t-3xl p-2 2xs:p-3 bg-opacity-10 bg-color30 border border-color30'>
                <div className='md:grid-cols-2 lg:grid-cols-3 2lg:grid-cols-4 xl:grid-cols-5 grid h-full gap-2 justify-evenly items-stretch overflow-y-auto'>
                  <div className={footerCardStyle()} >
                      <div className='w-full h-6/10 flex justify-center items-center '>
                        <img className='w-full h-full' alt='This should render an image' src="./vids/sample.png"/>
                      </div>
                      <div className=' w-full h-4/10 flex flex-col justify-start items-center rounded-b-2xl p-2 '>
                        <h1 className='h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30'>Favorite Items</h1>
                        <h2 className='h-1/2 text-sm flex text-center p-1 tracking-tighter'
                          >Adding your favorite items to your 'Favorites' list for quick and convenient access.
                        </h2>
                      </div>
                  </div>
                  <div className={footerCardStyle()}>
                      <div className='w-full h-6/10 flex justify-center items-center '>
                        <img className='w-full h-full' alt='This should render an image' src="./vids/sample2.png"/>
                      </div>
                      <div className='w-full h-4/10 flex flex-col justify-start items-center rounded-b-2xl p-2 '>
                        <h1 className='h-1/2 flex text-center items-center font-bold p-1 underline  underline-offset-4 decoration-color30'>Pinpoint Location</h1>
                        <h2 className='h-1/2 text-sm flex text-center p-1 tracking-tighter'>Who needs big signs or landmarks when you can pinpoint your exact location!</h2>
                      </div>
                  </div>
                  <div className={footerCardStyle()}>
                      <div className='w-full h-6/10 flex justify-center items-center '>
                        <img className='w-full h-full' alt='This should render an image' src="./vids/sample3.png"/>
                      </div>
                      <div className='w-full h-4/10 flex flex-col justify-start items-center rounded-b-2xl p-2 '>
                        <h1 className='h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30'>Chat with Customer Service</h1>
                        <h2 className='h-1/2 text-sm flex text-center p-1 tracking-tighter'>Any questions or concerns? There is a chat customer service available to help you out.</h2>
                      </div>
                  </div>
                  <div className={footerCardStyle()}>
                      <div className='w-full h-6/10 flex justify-center items-center '>
                        <img className='w-full h-full' alt='This should render an image' src='./vids/saved.png'/>
                      </div>
                      <div className='w-full h-4/10 flex flex-col justify-start items-center rounded-b-2xl p-2 '>
                        <h1 className='h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30'>Save Location and Contacts</h1>
                        <h2 className='h-1/2 text-sm flex text-center p-1 tracking-tighter'
                          >This makes it quicker and easier to fill in the details for your next order.
                        </h2>
                      </div>
                  </div>
                  <div className={footerCardStyle()}>
                      <div className='w-full h-6/10 flex justify-center items-center '>
                        <img className='w-full h-full' alt='This should render an image' src='./vids/image-icon.png'/>
                      </div>
                      <div className='w-full h-4/10 flex flex-col justify-start items-center rounded-b-2xl p-2 '>
                        <h1 className='h-1/2 flex text-center items-center font-bold p-1 underline underline-offset-4 decoration-color30'>Multiple Payment Methods</h1>
                        <h2 className='h-1/2 text-sm flex text-center p-1 tracking-tighter'
                          >Gives you the flexibility to choose the option that is most convenient and suits your preferences.
                        </h2>
                      </div>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className='h-4/10 w-full 2xs:w-19/20 md:w-10/12 bg-opacity-60 rounded-t-3xl bg-color60 p-2'> 
              <div className='h-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch gap-2 rounded-t-3xl overflow-y-auto'>
                {/* Find Us */}
                <div className='overflow-y-hidden flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch min-h-4/10 row-span-2 col-span-2'>
                  <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Find Us</h1>
                  <div className='flex items-start 2xs:items-center justify-start gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full '>
                    <span className={spanFooterStyle()}><FaMapMarkerAlt className='text-white'/></span>
                    <p className='text-slate-500 text-xs tracking-tighter overflow-x-auto'>9W6M+7GX, P.Sanchez / Pagsabungan Rd, Mandaue City, Cebu.</p>
                  </div>
                    <div className='w-full'>
                      <GoogleMaps
                        selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} locallatitude={locallatitude}
                        setLocalLatitude={setLocalLatitude} locallongitude={locallongitude} setLocalLongitude={setLocalLongitude}
                        setLocalDeliveryAddress={setLocalDeliveryAddress} zoom={zoom} setZoom={setZoom} setAddressText={setAddressText}
                        forFooter={true}
                      />
                    </div>
                </div>
                {/* Menu */}
                
                <div className='flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch '>
                  <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Menu</h1>
                  <div className='flex justify-start items-center gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full h-full text-xs'>
                    <ul className='h-19/20 w-11/12 flex flex-col justify-evenly items- gap-1 md:gap-2'>
                      <li onClick={()=>{scroll("page1")}} className='text-blue1 hover:text-color10b hover:underline cursor-pointer'>Home</li>
                      <li onClick={()=>{scroll("page2")}} className='text-blue1 hover:text-color10b hover:underline cursor-pointer'>About Us</li>
                      <li onClick={()=>{scroll("page3")}} className='text-blue1 hover:text-color10b hover:underline cursor-pointer'>Products</li>
                      <li onClick={()=>{scroll("page4")}} className='text-blue1 hover:text-color10b hover:underline cursor-pointer'>Affiliate Program</li>
                    </ul>
                  </div>
                </div>
                {/* Call Us */}
                <div className=' flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch '>
                  <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Call Us</h1>
                  <div className='flex justify-start items-center gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full h-full'>
                    <span className={spanFooterStyle()}><FaPhoneAlt className='text-white'/></span>
                    <p className='text-slate-500 text-xs tracking-tight overflow-x-auto'>09178927206</p>
                  </div>
                </div>
                {/* Mail Us */}
                <div className=' flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white w-stretch '>
                  <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Mail Us</h1>
                  <div className='flex justify-start items-center gap-2 p-2 mt-1 rounded-t-xl bg-slate-100 w-full h-full'>
                    <span className={spanFooterStyle()}><FaGoogle className='text-white'/></span>
                    <p className='text-slate-500 text-xs tracking-tight hyphens-auto overflow-x-auto'>test@gmail.com</p>
                  </div>
                </div>
                {/* Follow Us */}
                <div className=' flex flex-col justify-start items-start p-3 gap-1 rounded-t-xl bg-white  w-stretch '>
                  <h1 className="text-color60 text-xl 2xs:text-2xl font-bold">Follow Us</h1>
                  <div className='flex justify-around items-center gap-1 bg-slate-100 rounded-t-xl w-full mt-1 p-2 h-full'>
                    <span className={spanFooterStyle()}><FaFacebookF className='text-white'/></span>
                    <span className={spanFooterStyle()}><FaViber className='text-white'/></span>
                    <span className={spanFooterStyle()}><FaInstagram className='text-white'/></span>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className=' h-1/10 w-full flex flex-col justify-start items-center gap-2 bg-color60 bg-opacity-50'>
          <div className='w-11/12 border-b-2 border-black'/>
          <div className='flex h-full justify-center items-center gap-2'>
            <div className='h-9/10 w-full flex justify-center items-center'>Copyright © 2023  | Made by Paper Boy</div>
          </div>
        </div>
    </div>
  )
}

export default HomePage