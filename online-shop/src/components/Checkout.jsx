import { React, useState } from 'react';
import CheckoutPage from './CheckoutPage';
import CheckoutProofOfPayment from './CheckoutProofOfPayment';
import { Link, Routes, Route } from 'react-router-dom';
import CheckoutContext from '../context/CheckoutContext';

const Checkout = () => {
  const [bdoselected, setBdoselected] = useState(false);
  const [unionbankselected, setUnionbankselected] = useState(false);
  const [gcashselected, setGcashselected] = useState(false);
  const [mayaselected, setMayaselected] = useState(false);
  const [visaselected, setVisaselected] = useState(false);
  const [mastercardselected, setMastercardselected] = useState(false);
  const [bitcoinselected, setBitcoinselected] = useState(false);
  const [ethereumselected, setEthereumselected] = useState(false);
  const [solanaselected, setSolanaselected] = useState(false);
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [area, setArea] = useState([]);
  const [referenceNumber, setReferenceNumber] = useState('');

  const checkoutContextValues = {
    bdoselected,
    setBdoselected,
    unionbankselected,
    setUnionbankselected,
    gcashselected,
    setGcashselected,
    mayaselected,
    setMayaselected,
    visaselected,
    setVisaselected,
    mastercardselected,
    setMastercardselected,
    bitcoinselected,
    setBitcoinselected,
    ethereumselected,
    setEthereumselected,
    solanaselected,
    setSolanaselected,
    rows,
    setRows,
    total,
    setTotal,
    totalWeight,
    setTotalWeight,
    vat,
    setVat,
    deliveryFee,
    setDeliveryFee,
    grandTotal,
    setGrandTotal,
    area,
    setArea,
    referenceNumber,
    setReferenceNumber,
  };

  return (
    <div>
      <Routes>
        <Route
          path="checkoutPage"
          element={
            <CheckoutContext.Provider value={checkoutContextValues}>
              <CheckoutPage />
            </CheckoutContext.Provider>
          }
        />
        <Route
          path="proofOfPayment"
          element={
            <CheckoutContext.Provider value={checkoutContextValues}>
              <CheckoutProofOfPayment />
            </CheckoutContext.Provider>
          }
        />
      </Routes>
    </div>
  );
};

export default Checkout;
