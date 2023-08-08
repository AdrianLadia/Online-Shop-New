import React, { useEffect, useState } from 'react';
import dataManipulation from './dataManipulation';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';

const CustomerDropdown = ({ data, setChosen, customerTotalValueRanking }) => {
  console.log(data)
  const datamanipulation = new dataManipulation();
  const [customers, setCustomers] = useState([]);
  const [chosenCustomer, setChosenCustomer] = useState([]);
  const [inputText, setInputText] = useState([]);

  useEffect(() => {
    setCustomers(datamanipulation.getAllCustomers(data));
  }, [data]);

  useEffect(()=>{
    setChosen(customerTotalValueRanking[0])
    setChosenCustomer(customerTotalValueRanking[0])
  },[customerTotalValueRanking])

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

  return (
    <div className="h-full w-full ">
      <div className="h-9/10 w-full flex justify-center items-end ">
        <Autocomplete
          onChange={(event, newValue) => {
            setChosenCustomer(newValue), setChosen(newValue)
          }}
          disablePortal
          id="combo-box-demo"
          options={customerTotalValueRanking}
          InputLabelProps={{
            style: {
              color: '#6ab15d',
              fontSize: 15,
            },
          }}
          className='text-color60 w-full xs:w-11/12'
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              border: 2,
              color: '#6ab15d',
              borderRadius: 2,
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              color: '#6ab15d',
              border: 2,
            },
            '& .MuiOutlinedInput-root:focus .MuiOutlinedInput-notchedOutline': {
              color: '#6ab15d',
              border: 2,
            },
          }}
          value={chosenCustomer}
          renderInput={(params) => <TextField {...params} label="Customer Name" />}
        />
        </div>
    </div>
  );
};

export default CustomerDropdown;
