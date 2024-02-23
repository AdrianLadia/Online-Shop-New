import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import PaymentCheckoutCard from './PaymentCheckoutCard';

import useWindowDimensions from './UseWindowDimensions';
import AppContext from '../AppContext';
import AppConfig from '../AppConfig';
import disableCodHandler from '../../utils/classes/disableCodHandler';

function PaymentMethods({
  pickUpOrDeliver,
  userdata,
  itemsTotalPrice,
  email,
  phoneNumber,
  manualCustomerOrderProcess, //this is a boolean to check if we are manually using the customers account... for exmple our admin is using the customers account to place an order
}) {
  const { width } = useWindowDimensions();
  const { firestore, cardSelected, setCardSelected, setPaymentMethodSelected, setChangeCard, changeCard } =
    useContext(AppContext);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isCodBanned, setIsCodBanned] = useState(false);
  const [reason, setReason] = useState(null);

  useEffect(() => {
    firestore.readAllPaymentProviders().then((providers) => {
      if (manualCustomerOrderProcess === true) {
        providers = providers.filter((provider) => {
          if (!['mastercard','visa','shoppeepay','wechatpay'].includes(provider.id)) {
            return provider;
          }
        });
      }
      console.log('providers', providers);
      setPaymentMethods(providers);
    });
  }, []);

  useEffect(() => {
    if (pickUpOrDeliver === 'deliver') {
      const _disableCodHandler = new disableCodHandler({ userdata, phoneNumber, email, itemsTotalPrice });
      _disableCodHandler.runMain();
      const isCodBanned = _disableCodHandler.isCodBanned;
      setIsCodBanned(isCodBanned);
      if (isCodBanned === true) {
        // setCardSelected(cardSelected['cod'] = false)
        cardSelected['cod'] = false;
        const reason = _disableCodHandler.reason;
        setReason(reason);
        setCardSelected(cardSelected);
        setChangeCard(!changeCard);
        setPaymentMethodSelected(null);
      }
    }
    if (pickUpOrDeliver === 'pickup') {
      // setCardSelected(cardSelected['cod'] = true)
      setIsCodBanned(false);
    }
  }, [userdata, itemsTotalPrice, email, phoneNumber, pickUpOrDeliver]);

  function overFlow() {
    if (width < 366) {
      return ' grid-flow-col overflow-x-auto bg-color2 rounded-2xl pt-14';
    } else {
      return ' 3xl:grid-cols-8 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 2xs:grid-cols-2';
    }
  }

  return (
    <div className={'self-center w-11/12 gap-2 grid ' + overFlow()}>
      {paymentMethods.map((payments) => {
        // ONLY SHOW CARD IF ENABLED
        if (payments.enabled === true) {
          const id = payments.id;
          let disabled = false;
          if (payments.id === 'cod') {
            if (isCodBanned === true) {
              disabled = true;
            }
          }
          return (
            <PaymentCheckoutCard
              key={payments.id}
              reason={reason}
              disabled={disabled}
              paymentOption={payments.id}
              cardSelected={cardSelected}
              setCardSelected={setCardSelected}
              setPaymentMethodSelected={setPaymentMethodSelected}
            />
          );
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
