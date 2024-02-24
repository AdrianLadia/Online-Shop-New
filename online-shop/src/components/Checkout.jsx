import { React, useState, useContext } from 'react';
import CheckoutPage from './CheckoutPage';
import CheckoutProofOfPayment from './CheckoutProofOfPayment';
import { Routes, Route } from 'react-router-dom';
import CheckoutContext from '../context/CheckoutContext';
import AppContext from '../AppContext';

const Checkout = () => {
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [area, setArea] = useState([]);
  const [referenceNumber, setReferenceNumber] = useState('');
  
  const checkoutContextValues = {
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
              <CheckoutProofOfPayment referenceNumber={referenceNumber} />
            </CheckoutContext.Provider>
          }
        />
      </Routes>
    </div>
  );
};

export default Checkout;
