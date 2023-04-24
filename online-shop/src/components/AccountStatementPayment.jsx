import React, {useState, useEffect, AppContext, useContext} from 'react'
import PaymentMethods from './PaymentMethods';
import PaymentMethodContext from '../context/PaymentMethodContext';
import { Typography, Button } from '@mui/material';
import businessCalculations from '../../utils/businessCalculations';
import { HiCash } from "react-icons/hi";

const AccountStatementPayment = () => {

    // const { userdata, firestore, cart, setCart, refreshUser, setRefreshUser, userstate, products } = useContext(AppContext);
    // const { userdata, cart, setCart, userstate } = React.useContext(AppContext);

    const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
    const [bdoselected, setBdoselected] = useState(false);
    const [unionbankselected, setUnionbankselected] = useState(false);
    const [gcashselected, setGcashselected] = useState(false);
    const [mayaselected, setMayaselected] = useState(false);
    const [visaselected, setVisaselected] = useState(false);
    const [mastercardselected, setMastercardselected] = useState(false);
    const [bitcoinselected, setBitcoinselected] = useState(false);
    const [ethereumselected, setEthereumselected] = useState(false);
    const [solanaselected, setSolanaselected] = useState(false);
    const [mayaRedirectUrl, setMayaRedirectUrl] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState('SUCCESS');
    const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
    const businesscalculations = new businessCalculations();

const paymentMethodValues = {
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
  };

  useEffect(() => {
    if (
      bdoselected == false &&
      unionbankselected == false &&
      gcashselected == false &&
      mayaselected == false &&
      visaselected == false &&
      mastercardselected == false &&
      bitcoinselected == false &&
      ethereumselected == false &&
      solanaselected == false
    ) {
      setPaymentMethodSelected(false);
    } else {
      setPaymentMethodSelected(true);
    }
  }, [
    bdoselected,
    unionbankselected,
    gcashselected,
    mayaselected,
    visaselected,
    mastercardselected,
    bitcoinselected,
    ethereumselected,
    solanaselected,
  ]);

  return (
    <div>
      <div className='flex flex-col justify-center gap-16 mb-8'>
        <div className='flex md:flex-row flex-row-reverse justify-center mt-7'>
          <Typography variant="h2" className="mt-1  flex justify-center"><span>Payment Method</span></Typography>
          <HiCash size={25}/>
        </div>

        <PaymentMethodContext.Provider value={paymentMethodValues}>
            <PaymentMethods />
        </PaymentMethodContext.Provider>

        <Button className='self-center mt-10 w-1/5 p-3 bg-blue1 hover:bg-color10b rounded-lg text-white font-semibold text-xl'>Pay</Button>
      </div>
    </div>
  )
}

export default AccountStatementPayment