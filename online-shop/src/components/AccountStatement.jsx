import { Typography } from '@mui/material';
import React from 'react';
import AppContext from '../AppContext';
import { useContext, useState, useEffect, useRef } from 'react';
import AccountStatementTable from './AccountStatementTable';
import MyOrderCardModal from './MyOrderCardModal';
import { useNavigate } from 'react-router-dom';
import { BsBookHalf } from 'react-icons/bs';
import UseWindowDimensions from './useWindowDimensions';
import DatePicker from 'react-datepicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import 'react-datepicker/dist/react-datepicker.css';
import html2pdf from 'html2pdf.js';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import signature from '../images/signature.png';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  width: '8.27in',
  overflowY: 'scroll',
  height: '80%',
};

const AccountStatementPrintModal = ({
  companyName,
  fullName,
  startDate,
  endDate,
  tableData,
  orders,
  setOrderInfoData,
  setOpen,
  open,
  firstName,
}) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const printRef = useRef();
  const date = new Date();
  const formattedDate = ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2) + ('' + date.getFullYear()).slice(-2);

  const downloadPdfDocument = () => {
    setTimeout(() => {
      const content = printRef.current;
      const opt = {
        margin: 0,
        filename: firstName + formattedDate + 'AccountStatement.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: 'mm',
          format: 'a4', // Set format to A4 size
          orientation: 'portrait',
        },
      };
      html2pdf().from(content).set(opt).save();
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      if (tableData.length > 12) {
        alert('Please filter the account statment to less than 10 rows to fit the document in the page');
      } else {
        downloadPdfDocument();
      }
    }
  }, [open]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div ref={printRef} className="flex  flex-col w-full justify-between" style={{ height: '11in' }}>
            <div className="mx-10">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Account Statement
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Company : {companyName}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Customer Name : {fullName}
              </Typography>
              {startDate == '' ? null : (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Start Date : {startDate}
                </Typography>
              )}
              {endDate == '' ? null : (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  End Date : {endDate}
                </Typography>
              )}
              <AccountStatementTable
                tableData={tableData}
                orders={orders}
                setOrderInfoData={setOrderInfoData}
                setOpen={setOpen}
              />
            </div>
            <div className="flex justify-center flex-row gap-5 pb-5 h-20 w-full ">
              <div className="flex items-center w-auto">
                <span className="mr">Approved by :</span>
                <img
                  src={signature}
                  alt="Signature"
                  style={{
                    top: 0,
                    left: 20,
                    width: '200px',
                    height: '54px',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div className="flex justify-center mt-5">Date : {new Date().toDateString()}</div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

const AccountStatement = () => {
  const { orders, payments, userdata, datamanipulation, manualCustomerOrderProcess } = useContext(AppContext);
  const navigateTo = useNavigate();

  const [orderInfoData, setOrderInfoData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [buttonClicked, setButtonClicked] = useState(null);
  const { width } = UseWindowDimensions();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [companyName, setCompanyName] = useState('Star Pack');

  if (userdata == null) {
    return;
  }
  const fullName = userdata.name;
  let firstName = fullName.split(' ')[0];
  let lastName = fullName.split(' ')[1];
  if (firstName === undefined) {
    firstName = '';
  }
  if (lastName === undefined) {
    lastName = '';
  }

  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    const dataToUse = datamanipulation.accountStatementData(orders, payments, startDate, endDate);
    let remainingBalance = 0;
    if (dataToUse.length > 0) {
      remainingBalance = dataToUse[dataToUse.length - 1][4];
    }
    setRemainingBalance(remainingBalance);

    setTableData(dataToUse);
  }, [orders, startDate, endDate]);

  useEffect(() => {
    let total = 0;
    orders.map((s) => {
      total += s.grandTotal;
    });
  }, [orders]);

  useEffect(() => {
    setButtonClicked(true);
  }, [buttonClicked]);

  function onPayButtonClick() {
    if (buttonClicked) {
      startTransition(() =>
        navigateTo('/AccountStatementPayment', {
          state: {
            firstName: firstName,
            lastName: lastName,
            eMail: userdata.email,
            phoneNumber: userdata.phoneNumber,
            totalPrice: remainingBalance,
            userId: userdata.uid,
          },
        })
      );
    }
  }

  function responsiveVariant() {
    if (width < 366) {
      return 'h3';
    } else {
      return 'h2';
    }
  }

  return (
    <div className="overflow-x-hidden flex flex-col justify-center items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      <div className="flex ml-5 mt-10 w-11/12 md:flex-row flex-row-reverse justify-center">
        <Typography variant={responsiveVariant()} className=" flex justify-center ">
          Account Statement
        </Typography>
        <BsBookHalf size={22} />
      </div>
      <div className="flex flex-col w-full gap-5">
        {manualCustomerOrderProcess ? (
          <div className="flex flex-col w-96 ml-20">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Company Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={companyName}
                label="Company"
                onChange={(event) => setCompanyName(event.target.value)}
              >
                <MenuItem value={'Pustanan Printers Cebu'}>Pustanan Printers Cebu</MenuItem>
                <MenuItem value={'Star Pack'}>Star Pack</MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : null}
        <div className="flex ml-20 w-full">
          <TextField
            id="outlined-read-only-input"
            label="Customer Name"
            defaultValue={fullName}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="flex ml-20 w-full">
          <TextField
            id="outlined-read-only-input"
            label="Date Today"
            defaultValue={new Date().toDateString()}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="flex flex-row gap-5 justify-items-start w-full ml-20">
          <div className="flex flex-col">
            Start Date
            <DatePicker
              className="h-14 w-44 sm:w-56 rounded-md outline-color10b border-2 border-color10a indent-5 hover:border-color10b bg-white 
                      placeholder:text-lg placeholder:text-color10b"
              placeholderText="Date"
              selected={startDate}
              onChange={(date) => {
                date.setHours(0, 0, 0, 0);
                setStartDate(date);
              }}
            />
          </div>
          <div className="flex flex-col">
            End Date
            <DatePicker
              className="h-14 w-44 sm:w-56 rounded-md outline-color10b border-2 border-color10a indent-5 hover:border-color10b bg-white 
                      placeholder:text-lg placeholder:text-color10b"
              placeholderText="Date"
              selected={endDate}
              onChange={(date) => {
                date.setHours(0, 0, 0, 0);
                setEndDate(date);
              }}
            />
          </div>
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="p-3 rounded-lg bg-color10a text-white h-14 mt-6"
          >
            Reset Filter
          </button>
        </div>
        <div className="flex w-full">
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="bg-color10a rounded-lg p-3 ml-20 text-white"
          >
            Print Statement
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full 2xs:w-11/12 justify-center my-4 xs:my-8">
        <AccountStatementTable
          tableData={tableData}
          orders={orders}
          setOrderInfoData={setOrderInfoData}
          setOpen={setOpen}
        />
      </div>

      <AccountStatementPrintModal
        companyName={companyName}
        fullName={fullName}
        startDate={startDate == '' ? '' : startDate.toDateString()}
        endDate={endDate == '' ? '' : endDate.toDateString()}
        tableData={tableData}
        orders={orders}
        setOrderInfoData={setOrderInfoData}
        setOpen={setOpen}
        open={open}
        firstName={firstName}
      />

      {orderInfoData ? <MyOrderCardModal order={orderInfoData} open={open} handleClose={handleClose} /> : null}
    </div>
  );
};

export default AccountStatement;
