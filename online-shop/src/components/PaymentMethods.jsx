import React, { useEffect } from "react";
import { useState, useContext } from "react";
import PaymentCheckoutCard from "./PaymentCheckoutCard";

function PaymentMethods() {

  const [bdoselected, setBdoselected] = useState(false);
  const [unionbankselected, setUnionbankselected] = useState(false);
  const [gcashselected, setGcashselected] = useState(false);
  const [mayaselected, setMayaselected] = useState(false);
  const [visaselected, setVisaselected] = useState(false);
  const [mastercardselected, setMastercardselected] = useState(false);
  const [bitcoinselected, setBitcoinselected] = useState(false);
  const [ethereumselected, setEthereumselected] = useState(false);
  const [solanaselected, setSolanaselected] = useState(false);

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

  return (
    <div className=" h-full grid grid-cols-2 2xl:grid-cols-9 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 place-items-center " >
      <PaymentCheckoutCard paymentOption={"bdo"} cardSelected={bdoselected} setCardSelected={setBdoselected} />
      <PaymentCheckoutCard paymentOption={"unionbank"} cardSelected={unionbankselected} setCardSelected={setUnionbankselected} />

      <PaymentCheckoutCard paymentOption={"gcash"}  cardSelected={gcashselected} setCardSelected={setGcashselected} />
      <PaymentCheckoutCard paymentOption={"maya"}  cardSelected={mayaselected} setCardSelected={setMayaselected}/>

      <PaymentCheckoutCard paymentOption={"visa"}  cardSelected={visaselected} setCardSelected={setVisaselected}/>
      <PaymentCheckoutCard paymentOption={"mastercard"}  cardSelected={mastercardselected} setCardSelected={setMastercardselected}/>

      <PaymentCheckoutCard paymentOption={"bitcoin"}  cardSelected={bitcoinselected} setCardSelected={setBitcoinselected}/>
      <PaymentCheckoutCard paymentOption={"ethereum"}  cardSelected={ethereumselected} setCardSelected={setEthereumselected}/>
      <PaymentCheckoutCard paymentOption={"solana"}  cardSelected={solanaselected} setCardSelected={setSolanaselected}/>
    </div>
  );
}

export default PaymentMethods;
