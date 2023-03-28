import React, { useEffect } from "react";
import { Modal, Typography } from "@material-ui/core";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import useWindowDimensions from "./UseWindowDimensions";
import CheckoutButton from "./CheckoutButton";
import CartTable from "./CartTable";
import Fade from "@mui/material/Fade";
import AppContext from "../AppContext";


const CartModal = (props) => {
  const openCart = props.openCart;
  const setOpenCart = props.setOpenCart;
  const finalCartData = props.finalCartData;
  const totalPrice = props.totalPrice;

  const [cartisempty, setCartisempty] = useState(true);
  const { width, height } = useWindowDimensions();
  const {
    userdata,
    firestore,
    setCart,
   } = React.useContext(AppContext);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    overflow: 'scroll',

    "@media (min-width: 1024px)": {
      width: "50%",
    },

    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let rows = finalCartData;

  function CloseCart() {
    setOpenCart(false);
  }

  function CheckIfCartIsEmpty() {
    if (finalCartData.length >= 1) {
      setCartisempty(false);
    } else {
      setCartisempty(true);
    }
  }

  function clearCart() {
    setCart([]);
    firestore.createUserCart({cart:[]},userdata.uid)
    }

  useEffect(() => {
    CheckIfCartIsEmpty();
  }, [finalCartData]);

  return (
    <Modal open={openCart} onClose={CloseCart}>
      <Fade in={openCart}>
        <Box sx={style}>
          <div className="flex flex-row justify-between pb-5">
            <FaShoppingCart size={35} />
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              className="ml-auto"
            >
              Cart Total: {totalPrice.toLocaleString()}
            </Typography>
            <button
              onClick={CloseCart}
              className="bg-red-500 hover:bg-red-800 p-2 rounded-full w-10 text-white"
            >
              X
            </button>
          </div>

          {/* TABLE  */}
          {cartisempty ? <> Cart is empty</> : <CartTable rows={rows} />}

          <div className="flex justify-center">
            {cartisempty ? (
              <> </>
            ) : (
              <div className="flex flex-row justify-between w-full ">
                <div>
                  <button
                    onClick={clearCart}
                    className="bg-red-500 h-10 mt-5 hover:bg-red-800 p-2 rounded-lg  text-white ml-5"
                  >
                    Clear Cart
                  </button>
                </div>

                <div>
                  <CheckoutButton className="items-center" />
                </div>
                <div className="flex w-20"></div>
              </div>
            )}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CartModal;
