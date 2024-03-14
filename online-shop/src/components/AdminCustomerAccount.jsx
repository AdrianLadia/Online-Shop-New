import React from 'react';
import AppContext from '../AppContext';
import { useContext } from 'react';
import menuRules from '../../utils/classes/menuRules';
import UseCustomerAccount from './UseCustomerAccount';
import { Typography } from '@mui/material';


const AdminCustomerAccount = ({products}) => {
  const { userdata } = useContext(AppContext);
  const rules = new menuRules(userdata.userRole);
  return !rules.checkIfUserAuthorized('customerAccount') ? (
    <div>
      <h1>Not Authorized</h1>
    </div>
  ) : (
    <div className="flex flex-col w-full justify-center items-center gap-10 mt-10">
      <Typography variant="h4">Customer Account</Typography>
      <UseCustomerAccount products={products} />
      
    </div>
  );
};

export default AdminCustomerAccount;
