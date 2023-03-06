import React from "react";
import { useNavigate } from "react-router-dom";
import ContextOpenCart from "./ContextOpenCart";
import { useContext } from "react";

const CheckoutButton = () => {
  const navigateTo = useNavigate();
  const [openCart, setOpenCart, finalCartData, totalPrice] =
    useContext(ContextOpenCart);

  function onCheckoutButtonClick() {
    navigateTo("/checkout", { state: { finalCartData: "testtest" } });
  }
  

  return (
    <button
      id="cartcheckoutbutton"
      onClick={onCheckoutButtonClick}
      className="bg-blue-500 hover:bg-blue-700 hover:animate-bounce text-white p-2 rounded-md mt-5"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;
