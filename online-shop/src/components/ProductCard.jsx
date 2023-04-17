import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import { Snackbar } from '@material-ui/core';
import { useState, useContext, useEffect,useRef } from 'react';
import UseWindowDimensions from './UseWindowDimensions';
import TextField from '@mui/material/TextField';
import ProductCardModal from './ProductCardModal';
import businessCalculations from '../../utils/businessCalculations';
import AppContext from '../AppContext';
import { FaImage } from 'react-icons/fa';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { FaHandPointDown } from 'react-icons/fa';

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
  const safetyStock = calculations.getSafetyStock(product.averageSalesPerDay);
  const { cart } = useContext(AppContext);
  const [iconVisible, setIconVisible] = useState(true);
  const ref = useRef(null);
  const showTutorial = props.showTutorial
  const setShakeCartAnimation = props.setShakeCartAnimation

  function ClearForm() {
    document.getElementById('inputquantity' + props.product.itemName).value = '';
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
    const cartCount = calculations.getCartCount(cart);
    let cartQuantity = cartCount[props.product.itemId];
    if (cartQuantity == undefined) {
      cartQuantity = 0;
    }
    const totalOrder = cartQuantity + parseInt(quantity);

    if (
      totalOrder >
      calculations.getStocksAvailableLessSafetyStock(props.product.stocksAvailable, props.product.averageSalesPerDay)
    ) {
      setQuantity('');
      alert('Not enough stocks available');
      return;
    }

    if (quantity > 0) {
      // opens snackbar
      setOpen(true);
      // adds to cart
      props.addtocart(props.product.itemId, quantity);
      //back to 0
      setQuantity('');
      //shake cart
      setShakeCartAnimation(true)
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
    if (product.stocksAvailable <= safetyStock) {
      setOutOfStock(true);
    }
    if (product.stocksAvailable <= 50 + safetyStock && product.unit != 'pack') {
      setLowStock(true);
    }
  }, [product.stocksAvailable]);

  function responsiveStyle() {
    if (width < 640) {
      return '18px';
    } else if (width < 768) {
      return '18px';
    } else if (width < 1024) {
      return '19px';
    } else if (width < 1736) {
      return '19px';
    } else if (width < 1836) {
      return '21px';
    } else {
      return '23px';
    }
  }

  function responsivePrice() {
    if (width < 640) {
      return '14px';
    } else if (width < 768) {
      return '14px';
    } else if (width < 1024) {
      return '15px';
    } else if (width < 1536) {
      return '17px';
    } else {
      return '19px';
    }
  }

  function responsiveFont() {
    if (width < 640) {
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


  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-center h-full w-96">
        <Paper
          elevation={12}
          sx={{ borderRadius: '20px' }}
          // className="flex flex-row w-11/12 justify-center my-5 h-60 bg-color30 "
          className="flex flex-row w-11/12 justify-center my-5 h-60 bg-gradient-to-r from-color60 to-color10c"
        >
          {/* IMAGE */}
          <div className=" w-3/5 relative">
            <div className="absolute inset-0 flex  justify-center mt-12 p-2" onClick={() => setModal(true)}>
              {(iconVisible && showTutorial) ? (
                <div>
                  <FaHandPointDown
                    onClick={() => setModal(true)}
                    color="#6bd0ff"
                    size={40}
                    className="animate-bounce-fade-5 mt-5"

                  />
                  <h1 className="absolute text-sm -top-20  left-7 whitespace-nowrap">
                    <span className="text-transparent font-bold bg-clip-text bg-color10b">
                      
                    TAP FOR MORE INFO
                    </span>
                  </h1>
                </div>
              ) : null}
            </div>
            <img
              src={props.product.imageLinks[0]}
              alt={props.product.itemName}
              className="h-full w-full object-cover rounded-lg"
              onClick={() => setModal(true)}
            ></img>
          </div>
          {/* IMAGE */}
          {/* DETAILS */}
          <div className="flex flex-col ml-4 w-2/5 m-1 ">
            {outofstock === true ? (
              <div className="flex flex-row h-1/12">
                <Typography fontSize={responsiveFont()} color="red">
                  Out of Stock
                </Typography>
                <span className="flex h-3 w-3 mt-1 ml-2 flex-grow-0"></span>
              </div>
            ) : (
              <>
                {lowstock === true && product.unit != 'Pack' ? (
                  <div className="flex flex-row h-1/12">
                    <Typography fontSize={responsiveFont()} color="red">
                      Stocks left
                    </Typography>
                    <span className="flex h-3 w-3 ml-1 flex-grow-0">
                      <span className="inline-flex items-center justify-center mt-1 py-2 px-1 text-xs font-semibold leading-none text-red-100 bg-red-600 rounded-full">
                        {props.product.stocksAvailable - safetyStock}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="h-1/12"> </div>
                )}
              </>
            )}
            <div className="h-2/5 ">
              <Typography
                sx={{ fontSize: responsiveStyle(), mr: 1, color: 'black', cursor: 'pointer' }}
                onClick={() => setModal(true)}
              >
                {props.product.itemName}
              </Typography>
            </div>

            <div className="h-1/6  flex items-center ">
              <Typography sx={{ fontSize: responsivePrice(), mt: 3, mb: 1 }}>{'₱ ' + props.product.price}</Typography>
            </div>

            <div className="flex flex-row h-1/6 w-full ">
              <button
                id="addtocartbutton"
                className="mt-4  h-full text-black border-2 border-color10a bg-color10a text-xs py-1 px-2 rounded"
                // className= "mt-5 h-full text-black bg-gradient-to-t from-color30 to-color10a ease-out delay-75 hover:bg-color60 hover:border-color10a text-xs py-1 px-2 rounded"
                type="button"
                onClick={AddToCart}
              >
                Add
              </button>
              <TextField
                id="entryquantity"
                type="number"
                color="enter"
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                }}
                className="m-2 h-max rounded-xl"
                label="Qty."
                InputLabelProps={{
                  style: {
                    color: '#6ab15d',
                    fontSize:15
                  },
                }}
                sx={{
                    backgroundColor:"#fff4d1",
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 2 ,
                        color:"#F49C5C",
                        borderRadius:2,
                      },
                      '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        color: '#FEC868',
                        border:2
                      }
                }}
              />
          </div>
        </div>
      </Paper>
      <div>
        <ProductCardModal
          modal={modal}
          closeModal={closeModal}
          product={product}
        />
      </div>
      <div>
        <Snackbar
          className="mb-5 lg:mb-5"
          variant="success"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={handleClose}
          message={DisplayItem()}
          action={
            <Button color="success" size="small" onClick={handleClose}>
              {" "}
              Close{" "}
            </Button>
          }
        />
      </div>
    </div>
    </ThemeProvider>
  );
};

export default ProductCard;
