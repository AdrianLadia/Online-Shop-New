import React, { useEffect } from "react";
import { useState, useContext } from "react";
import PaymentCheckoutCard from "./PaymentCheckoutCard";

import useWindowDimensions from "./UseWindowDimensions";
import AppContext from "../AppContext"

function PaymentMethods() {
  const { width } = useWindowDimensions();
  const {firestore,cardSelected,setCardSelected,setPaymentMethodSelected} = useContext(AppContext)
  const [paymentMethods,setPaymentMethods] = useState([])
  

  useEffect(() => {
     firestore.readAllPaymentProviders().then((providers) => {
   
      setPaymentMethods(providers)
     })
  },[])


  function overFlow(){
    if (width < 366) {
      return " grid-flow-col overflow-x-auto bg-color2 rounded-2xl "
    }else{
      return " 3xl:grid-cols-8 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 2xs:grid-cols-2"
    }
  }

  return (
    <div className={"self-center w-11/12 gap-2 grid " + overFlow()} >
      {paymentMethods.map((payments) => {
        // ONLY SHOW CARD IF ENABLED
        if (payments.enabled === true) {
          const id = payments.id
    
          return(
            <PaymentCheckoutCard paymentOption={payments.id} cardSelected={cardSelected} setCardSelected={setCardSelected} setPaymentMethodSelected={setPaymentMethodSelected} />
          )
        }

      })}
      {/* <PaymentCheckoutCard paymentOption={"bdo"} cardSelected={bdoselected} setCardSelected={setBdoselected} />
      <PaymentCheckoutCard paymentOption={"unionbank"} cardSelected={unionbankselected} setCardSelected={setUnionbankselected} />

      <PaymentCheckoutCard paymentOption={"gcash"}  cardSelected={gcashselected} setCardSelected={setGcashselected} />
      <PaymentCheckoutCard paymentOption={"maya"}  cardSelected={mayaselected} setCardSelected={setMayaselected}/>

      <PaymentCheckoutCard paymentOption={"visa"}  cardSelected={visaselected} setCardSelected={setVisaselected}/>
      <PaymentCheckoutCard paymentOption={"mastercard"}  cardSelected={mastercardselected} setCardSelected={setMastercardselected}/> */}

      {/* <PaymentCheckoutCard paymentOption={"bitcoin"}  cardSelected={bitcoinselected} setCardSelected={setBitcoinselected}/> */}
      {/* <PaymentCheckoutCard paymentOption={"ethereum"}  cardSelected={ethereumselected} setCardSelected={setEthereumselected}/> */}
      {/* <PaymentCheckoutCard paymentOption={"solana"}  cardSelected={solanaselected} setCardSelected={setSolanaselected}/> */} 
    </div>
  );
}

export default PaymentMethods;
