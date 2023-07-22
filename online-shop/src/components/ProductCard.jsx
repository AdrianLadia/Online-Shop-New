import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import { Snackbar } from '@material-ui/core';
import { useState, useContext, useEffect, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress'; 
import UseWindowDimensions from './UseWindowDimensions';
import TextField from '@mui/material/TextField';
import ProductCardModal from './ProductCardModal';
import businessCalculations from '../../utils/businessCalculations';
import AppContext from '../AppContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import { FaHandPointDown } from 'react-icons/fa';
import { Card, CardContent } from '@material-ui/core';
import AppConfig from '../AppConfig';

const ProductCard = (props) => {
  const [quantity, setQuantity] = useState('');
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const { height, width } = UseWindowDimensions();
  const product = props.product;
  const [outofstock, setOutOfStock] = useState(false);
  const [lowstock, setLowStock] = useState(false);
  // const safetyStock = Math.round(product.averageSalesPerDay) * 2;
  const calculations = new businessCalculations();
  const { cart, updateCartInfo, setUpdateCartInfo, firestore, userId } = useContext(AppContext);
  const [iconVisible, setIconVisible] = useState(false);
  const ref = useRef(null);
  const showTutorial = false
  const setShakeCartAnimation = props.setShakeCartAnimation;
  const stocksAvailable = props.stocksAvailable;
  const retailAverageSalesPerDay = props.averageSalesPerDay;
  const isWholesale = props.isWholesale;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState('');
  const retailSafetyStock = new AppConfig().getRetailSafetyStock()



  useEffect(() => {
    setImageLoading(true);
    setQuantity('');
  }, [props.product]);

  useEffect(() => {
    const img = new Image();
    img.src = props.product.imageLinks[0]; // Replace with your image URL

    img.onload = () => {
      setImageSrc(img.src);
      setImageLoading(false);
    };

    img.onerror = () => {
      console.error('An error occurred while loading the image.');
    };
  }, [props]);

  let safetyStock;
  if (product.averageSalesPerDay != undefined) {
    safetyStock = calculations.getSafetyStock(product.averageSalesPerDay);
  }
  if (product.averageSalesPerDay === undefined) {
    safetyStock = calculations.getSafetyStock(retailAverageSalesPerDay);
  }

  const customStyles = {
    content: {
      height: '50%',
      width: '80%',
    },
  };

  const handleClose = () => {
    setOpen(false);
  };

  function AddToCart() {
    
    setUpdateCartInfo(!updateCartInfo);
    let cartQuantity = cart[props.product.itemId];
    if (cartQuantity === undefined) {
      cartQuantity = 0;
    }
    const totalOrder = cartQuantity + parseInt(quantity);

    function getStocksAvailable() {
      if (props.product.unit === 'Pack') {
     
        return stocksAvailable;
      }
      if (props.product.unit != 'Pack') {
        return props.product.stocksAvailable;
      }
    }

    function getAverageSalesPerDay() {
      if (props.product.unit === 'Pack') {
        return retailAverageSalesPerDay;
      }
      if (props.product.unit != 'Pack') {
        return props.product.averageSalesPerDay;
      }
    }

    if (isWholesale) {
      if (totalOrder > calculations.getStocksAvailableLessSafetyStock(getStocksAvailable(), getAverageSalesPerDay())) {
        setQuantity('');
        alert('Not enough stocks available');
        return;
      }
    } else {
  
       if (
        totalOrder >
        calculations.getStocksAvailableLessSafetyStock(getStocksAvailable(), getAverageSalesPerDay(),true)
      ) {
        setQuantity('');
        alert('Not enough stocks available');
        return;
      }
    }

    if (quantity > 0) {
      // opens snackbar
      setOpen(true);
      // adds to cart
      props.addtocart(props.product.itemId, quantity);
      //back to 0
      setQuantity('');
      //shake cart
      setShakeCartAnimation(true);
    }
  }

  function DisplayItem() {
    return props.product.itemName + ' added to cart';
  }

  function closeModal() {
    setModal(false);
  }

  React.useEffect(() => {
    if (quantity < 0) {
      setQuantity(0);
    }
  }, [quantity]);

  React.useEffect(() => {
    if (product.unit === 'Pack') {
      if (stocksAvailable <= retailSafetyStock) {
        setOutOfStock(true);
      }
    }
    if (product.unit != 'Pack') {
      if (product.stocksAvailable <= safetyStock) {
        setOutOfStock(true);
      }
    }
    if (product.unit == 'Pack') {
  
      if (stocksAvailable <= 50) {
        setLowStock(true);
     
      }
    }
    else {
      if (product.stocksAvailable <= 50 + safetyStock && product.unit) {
        setLowStock(true);
      }
    }
  }, [product.stocksAvailable]);

  function showModal() {
    setModal(true);
    firestore.updateProductClicks(product.itemId, userId);
  }

  function responsiveStyle() {
    if (width < 396) {
      return '19px';
    } else if (396 < width < 415) {
      return '19px';
    } else {
      return '23px';
    }
  }

  function responsivePrice() {
    if (width < 300) {
      return '13px';
    } else if (width < 768) {
      return '16px';
    } else if (width < 1024) {
      return '16px';
    } else if (width < 1536) {
      return '18px';
    } else {
      return '20px';
    }
  }

  function responsiveFont() {
    if (width < 250) {
      return '10px';
    } else if (width < 640) {
      return '12px';
    } else if (width < 768) {
      return '12px';
    } else if (width < 1024) {
      return '13px';
    } else if (width < 1536) {
      return '13px';
    } else {
      return '16px';
    }
  }

  // TURORIAL TAP IMAGE FOR MORE INFO
  useEffect(() => {
    if (!showTutorial) {
      return;
    }
    
    const timer = setTimeout(() => {
      setIconVisible(false);
    }, 3750);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  function responsiveWidth() {
    return 'max-w-lg';
  }


  if (product.imageLinks.length === 0) {
    return (
      <div className={' flex justify-center h-80 lg:w-11/12 2xs:w-96 ' + responsiveWidth()}>
        {/* <div className="flex justify-center h-80 w-full 2xs:w-96 2xs:max-w-lg"> */}
        <Paper
          elevation={10}
          className="flex flex-row rounded-4xl w-11/12 justify-center my-5 
                      bg-gradient-to-r from-color60 via-color60 to-color10c shadow-lg shadow-slate-500"
        >
          <div className="flex flex-col justify-center items-center">
            <Typography className="flex justify-center items-center text-2xl font-bold text-color10c">
              {product.itemName}
            </Typography>

            <Typography className="flex justify-center items-center text-2xl font-bold text-color10c">
              COMING SOON
            </Typography>
          </div>
        </Paper>
      </div>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <div id={product.itemId} className={' flex justify-center h-80 lg:w-11/12 2xs:w-96 hover:mb-5' + responsiveWidth()}>
          {/* <div className="flex justify-center h-80 w-full 2xs:w-96 2xs:max-w-lg"> */}
          <Paper
            elevation={10}
            className="flex flex-row rounded-4xl w-11/12 justify-center my-5 
                          bg-gradient-to-r from-color60 via-color60 to-color10c shadow-lg shadow-slate-500"
          >
            {/* IMAGE */}
            <div className=" w-8/12 relative rounded-4xl cursor-pointer">
              <div className="absolute inset-0 flex justify-center mt-12 p-2" onClick={showModal}>
                {iconVisible && showTutorial ? (
                  <div className="">
                    <FaHandPointDown
                      onClick={showModal}
                      color="#6bd0ff"
                      size={40}
                      className="animate-bounce-fade-5 mt-4"
                    />
                    <h1 className="absolute text-sm -top-20 left-14 whitespace-nowrap">
                      <span className="text-transparent font-bold bg-clip-text bg-color10b">TAP FOR MORE INFO</span>
                    </h1>
                  </div>
                ) : null}
              </div>
              {props.product.imageLinks.length > 0 ? (
                imageLoading ? (
                  <div className="flex justify-center items-center mt-24">
                    <CircularProgress size="10vh" />
                  </div>
                ) : (
                  <img
                    id={props.product.itemId}
                    src={imageSrc}
                    alt={props.product.itemName}
                    className={'h-full object-cover rounded-4xl 3xs:w-60 border-color60'}
                    onClick={showModal}
                    onLoad={() => setImageLoading(false)}
                  />
                )
              ) : (
                <div className="w-60"> </div>
              )}
            </div>

            {/* IMAGE */}
            {/* DETAILS */}
            <div className="flex flex-col ml-3 w-5/12 m-1 ">
              {outofstock === true ? (
                <div className="flex flex-row h-1/12">
                  <Typography fontSize={responsiveFont()} color="red">
                    Out of Stock
                  </Typography>
                  <span className="flex h-3 w-3 mt-1 ml-2 flex-grow-0"></span>
                </div>
              ) : (
                <>
                  {lowstock === true ? (
                    <div className="flex flex-row h-1/12">
                      <Typography fontSize={responsiveFont()} color="red">
                        Stocks left
                      </Typography>
                      <span className="flex h-3 w-3 ml-1 ">
                        <span className="inline-flex items-center justify-center mt-0 2xl:mt-1 py-2 px-1.5 text-xs font-semibold text-white bg-red-600 rounded-full">
                          {(product.unit == 'Pack') ? product.stocksAvailable - retailSafetyStock : product.stocksAvailable - safetyStock}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div className="h-1/12"> </div>
                  )}
                </>
              )}

              <div className="h-2/6 ">
                <Typography sx={{ fontSize: responsiveStyle(), mr: 1, cursor: 'help' }} onClick={showModal}>
                  {props.product.itemName}
                </Typography>
              </div>

              <div className="h-1/9 w-max mt-2 2xs:mt-0 ">
                <Typography
                  sx={{ fontSize: responsivePrice(), mt: 2, cursor: 'help' }}
                  className="tracking-tight"
                  onClick={showModal}
                >
                  Pieces: {props.product.pieces}
                </Typography>
              </div>

              <div className="h-1/6 flex items-center">
                <Typography sx={{ fontSize: responsivePrice(), mb: 1, cursor: 'text' }} className="tracking-tight">
                  Price : 
                </Typography>
                <Typography sx={{ fontSize: responsivePrice(), mb: 1,ml:1, cursor: 'text' }} className="tracking-tight">
                  {'₱ ' + props.product.price}
                </Typography>
              </div>

              <div className="flex flex-row items-center">
                <button
                  id="addtocartbutton"
                  className=" h-max w-5/12 2xs:w-5/12 py-3 2xs:px-2 rounded-lg text-xs text-black border-2 border-color60 bg-color10c hover:bg-color1"
                  // className=" h-max w-5/12 2xs:w-1/3 py-3 2xs:px-2 rounded text-xs text-black border-2 border-color10a bg-color10a hover:bg-color10c hover:border-4 hover:border-double"
                  type="button"
                  onClick={AddToCart}
                >
                  Add
                </button>
                <TextField
                  id={'entryquantity' + props.product.itemName}
                  type="number"
                  color="enter"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                  }}
                  className="m-2 h-max w-7/12 rounded-xl "
                  label="Qty."
                  InputLabelProps={{
                    style: {
                      color: '#6ab15d',
                      fontSize: 15,
                    },
                  }}
                  sx={{
                    backgroundColor: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 2,
                      color: '#6ab15d',
                      borderRadius: 2,
                    },
                    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      color: '#6ab15d',
                      border: 2,
                    },
                  }}
                />
              </div>
            </div>
          </Paper>
          <div>
            <ProductCardModal modal={modal} closeModal={closeModal} product={product} />
          </div>
          <div>
            <Snackbar
              className="mb-5 lg:mb-5"
              variant="success"
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              open={open}
              onClose={handleClose}
              message={DisplayItem()}
              action={
                <Button color="success" size="small" onClick={handleClose}>
                  {' '}
                  Close{' '}
                </Button>
              }
            />
          </div>
        </div>
      </ThemeProvider>
    );
  }
};

export default ProductCard;
