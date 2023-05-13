import React, { useEffect } from "react";
import { useState, useContext } from "react";
import PaymentCheckoutCard from "./PaymentCheckoutCard";
import CheckoutContext from "../context/CheckoutContext";
import useWindowDimensions from "./UseWindowDimensions";

function PaymentMethods() {

  const { bdoselected, setBdoselected, unionbankselected, setUnionbankselected, gcashselected, setGcashselected, mayaselected, setMayaselected, visaselected, setVisaselected, mastercardselected, setMastercardselected, bitcoinselected, setBitcoinselected, ethereumselected, setEthereumselected, solanaselected, setSolanaselected } = useContext(CheckoutContext);
  const { width } = useWindowDimensions();


  useEffect(() => {
    if (bdoselected === true) {
      setUnionbankselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }
    if (unionbankselected === true) {
      setBdoselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }
    if (gcashselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }

    if (mayaselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setGcashselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }

    if (visaselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }

    if (mastercardselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }

    if (bitcoinselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setEthereumselected(false);
      setSolanaselected(false);
    }

    if (ethereumselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setSolanaselected(false);
    }

    if (solanaselected === true) {
      setBdoselected(false);
      setUnionbankselected(false);
      setGcashselected(false);
      setMayaselected(false);
      setVisaselected(false);
      setMastercardselected(false);
      setBitcoinselected(false);
      setEthereumselected(false);
    }

  }, [bdoselected, unionbankselected, gcashselected, mayaselected, visaselected, mastercardselected, bitcoinselected, ethereumselected, solanaselected]);

  function overFlow(){
    if (width < 366) {
      return " grid-flow-col overflow-x-auto bg-color2 rounded-2xl "
    }else{
      return " 3xl:grid-cols-9 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 2xs:grid-cols-2"
    }
  }


  return (
    <div className={"self-center w-11/12 gap-2 grid " + overFlow()} >
      <PaymentCheckoutCard paymentOption={"bdo"} cardSelected={bdoselected} setCardSelected={setBdoselected} />
      <PaymentCheckoutCard paymentOption={"unionbank"} cardSelected={unionbankselected} setCardSelected={setUnionbankselected} />

      <PaymentCheckoutCard paymentOption={"gcash"}  cardSelected={gcashselected} setCardSelected={setGcashselected} />
      {/* <PaymentCheckoutCard paymentOption={"maya"}  cardSelected={mayaselected} setCardSelected={setMayaselected}/>

      <PaymentCheckoutCard paymentOption={"visa"}  cardSelected={visaselected} setCardSelected={setVisaselected}/>
      <PaymentCheckoutCard paymentOption={"mastercard"}  cardSelected={mastercardselected} setCardSelected={setMastercardselected}/>

      <PaymentCheckoutCard paymentOption={"bitcoin"}  cardSelected={bitcoinselected} setCardSelected={setBitcoinselected}/>
      <PaymentCheckoutCard paymentOption={"ethereum"}  cardSelected={ethereumselected} setCardSelected={setEthereumselected}/>
      <PaymentCheckoutCard paymentOption={"solana"}  cardSelected={solanaselected} setCardSelected={setSolanaselected}/> */}
    </div>
  );
}

export default PaymentMethods;
