import React, { useEffect, useState } from 'react';
import dataManipulation from './dataManipulation';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';

const CustomerDropdown = ({ data, setChosen,customerTotalValueRanking }) => {
  // const data = props.data
  const datamanipulation = new dataManipulation();
  const [customers, setCustomers] = useState([]);
  const [chosenCustomer, setChosenCustomer] = useState([]);
  const [inputText, setInputText] = useState([]);

  useEffect(() => {
    setCustomers(datamanipulation.getAllCustomers(data));
  }, [data]);

  // const handleInputText = (event) => {
  //   const input = event.target.value;
  //   const suggestions = customers.filter((s) => {
  //     return s.toLowerCase().includes(input.toLowerCase());
  //   });
  //   if (input === '') {
  //     setInputText([]);
  //   } else {
  //     setInputText(suggestions);
  //   }
  // };

  console.log(customers)

  return (
    <div className="h-full w-full ">
      <div className="h-9/10 w-full flex justify-center items-end p-1">
        <Autocomplete
          onChange={(event, newValue) => {
            setChosenCustomer(newValue), setChosen(newValue)
          }}
          disablePortal
          id="combo-box-demo"
          options={customerTotalValueRanking}
          sx={{ width: '100vh' }}
          value={chosenCustomer}
          renderInput={(params) => <TextField {...params} label="Item Name" />}
        />
        </div>
    </div>
  );
};

export default CustomerDropdown;
