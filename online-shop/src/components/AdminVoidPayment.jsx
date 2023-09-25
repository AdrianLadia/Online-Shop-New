import React from 'react';
import { useEffect, useContext, useState } from 'react';
import textFieldStyle from '../colorPalette/textFieldStyle';
import textFieldLabelStyle from '../colorPalette/textFieldLabelStyle';
import AppContext from '../AppContext';
import dataManipulation from '../../utils/dataManipulation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { CircularProgress, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import menuRules from '../../utils/classes/menuRules';
import { set } from 'date-fns';

const AdminVoidPayment = ({ users }) => {
  const { cloudfirestore, userdata } = useContext(AppContext);
  const style = textFieldStyle();
  const labelStyle = textFieldLabelStyle();
  const [allUsersData, setAllUsersData] = useState([]);
  const [allUserNames, setAllUserNames] = useState([]);
  const [selectedName, setSelectedName] = useState(''); //selectedName is the customer name
  const [selectedUserPayments, setSelectedUserPayments] = useState({}); //selectedUserData is the customer data
  const [allUserPaymentsIds, setAllUserPaymentsIds] = useState([]); //allUserPayments is the customer data
  const [selectedPaymentReference, setSelectedPaymentReference] = useState(''); //selectedPaymentId is the payment id
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null); //selectedPaymentDetails is the payment details
  const datamanipulation = new dataManipulation();
  const [loading, setLoading] = useState(false);
  const rules = new menuRules(userdata.userRole);

  useEffect(() => {
    if (users) {
      setAllUsersData(users);
      setAllUserNames(datamanipulation.getAllCustomerNamesFromUsers(users).sort());
    }
  }, [users]);


  useEffect(() => {
    if (selectedName != '') {
      const selectedUserData = allUsersData.filter((data) => {
        if (data.name === selectedName) {
          return data;
        }
      })[0];

      const payments = selectedUserData.payments;
      const filteredPayments = payments.filter((data) => {
        // do not include if payment is more than 7 days old from today
        const today = new Date();
        const paymentDate = datamanipulation.convertDateTimeStampToDateString(data.date);
        const paymentDateObject = new Date(paymentDate);
        const difference = today - paymentDateObject;
        const days = difference / (1000 * 3600 * 24);
        if (days < 7) {
          return data;
        }
      });

      setSelectedUserPayments(filteredPayments);

      setAllUserPaymentsIds(filteredPayments.map((data) => data.reference));
    }
  }, [selectedName]);

  useEffect(() => {
    if (selectedPaymentReference != '') {
      const selectedPayment = selectedUserPayments.filter((data) => {
        if (data.reference === selectedPaymentReference) {
          return data;
        }
      })[0];

      setSelectedPaymentDetails(selectedPayment);
    }
  }, [selectedPaymentReference]);

  async function onVoidButtonClick() {
    setLoading(true);
    try {
      const res = await cloudfirestore.voidPayment({
        orderReference: selectedPaymentDetails.reference,
        userId: selectedPaymentDetails.userId,
        proofOfPaymentLink: selectedPaymentDetails.proofOfPaymentLink,
      });

      setSelectedName('')
      setSelectedPaymentReference('')
      setSelectedPaymentDetails(null)
      setSelectedPaymentReference('')
      alert('Void Payment Successful');
      setLoading(false);
    } catch {
      console.log('Void Payment Failed');
      alert('Void Payment Failed');
      setLoading(false);
    }
  }

  return (
    <>
      {rules.checkIfUserAuthorized('voidPayment') ? (
        <div >
            <div className='flex items-center justify-center mt-10'>
                <Typography variant='h3'>
                    Void Payment
                </Typography>
            </div>
            <div className="flex flex-col lg:flex-row items-center lg:justify-evenly">
            <div>
                <div className="flex w-72 flex-col items-center mt-10">
                <Typography sx={{ marginBottom: 2 }} variant="h6">
                    Select Customer
                </Typography>
                <Autocomplete
                    onChange={(event, value) => setSelectedName(value)}
                    disablePortal
                    id="customerName"
                    options={allUserNames}
                    renderInput={(params) => <TextField {...params} label="Customer Name" InputLabelProps={labelStyle} />}
                    className="flex w-full"
                    sx={style}
                />
                </div>
                <div className="flex items-center flex-col w-72 mt-10">
                {selectedName != '' ? (
                    <>
                    <Typography sx={{ marginBottom: 2 }} variant="h6">
                        Select Payment
                    </Typography>
                    <Autocomplete
                        onChange={(event, value) => setSelectedPaymentReference(value)}
                        disablePortal
                        id="paymentReference"
                        options={allUserPaymentsIds}
                        renderInput={(params) => (
                        <TextField {...params} label="Payment Reference" InputLabelProps={labelStyle} />
                        )}
                        className="flex w-full"
                        sx={style}
                    />
                    </>
                ) : null}
                </div>
            </div>
            <div>
                <div className="flex flex-col w-full items-center mt-10">
                {selectedPaymentDetails ? (
                    <>
                    <Typography sx={{ marginBottom: 2 }} variant="h6">
                        Payment Details
                    </Typography>
                    <List
                        sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        }}
                    >
                        <ListItem>
                        <ListItemText primary="Payment Reference Number" secondary={selectedPaymentDetails.reference} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                        <ListItemText primary="Amount" secondary={selectedPaymentDetails.amount} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                        <ListItemText
                            primary="Date"
                            secondary={datamanipulation.convertTimestampToDateStringWithoutTime(
                            selectedPaymentDetails.date
                            )}
                        />
                        </ListItem>
                        <Divider />
                        <ListItem>
                        <ListItemText primary="Payment Provider" secondary={selectedPaymentDetails.paymentprovider} />
                        </ListItem>
                        <Divider />
                        <ListItem>
                        <ListItemText
                            primary="Image"
                            secondary={
                            <img
                                onClick={() => {
                                window.open(selectedPaymentDetails.proofOfPaymentLink, '_blank');
                                }}
                                className="mt-3 h-70per"
                                src={selectedPaymentDetails.proofOfPaymentLink}
                            />
                            }
                        />
                        </ListItem>
                        <Divider />
                    </List>
                    </>
                ) : null}
                </div>
                {selectedPaymentDetails ? (
                <div className="flex mt-10  mb-32 justify-center">
                    <button disabled={loading} onClick={onVoidButtonClick} className="p-3 bg-red-500 rounded-lg w-36 ">
                    {' '}
                    {loading ? <CircularProgress size={20} /> : <>VOID PAYMENT</>}{' '}
                    </button>
                </div>
                ) : null}
            </div>
            </div>
        </div>
      ) : (
        <>NOT AUTHORIZED</>
      )}
    </>
  );
};

export default AdminVoidPayment;
