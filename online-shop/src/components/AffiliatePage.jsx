import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../AppContext';
import useWindowDimensions from './UseWindowDimensions';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField, Paper, Button, Typography } from '@mui/material';
import AffiliateAddPaymentMethodModal from './AffiliateAddPaymentMethodModal';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import Modal from '@mui/material/Modal';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MyOrderCardModal from './MyOrderCardModal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import StockManagementTable from './CompanyDashboard/StockManagementTable';
import { set } from 'date-fns';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import UseCustomerAccount from './UseCustomerAccount';

const isSmallScreen = () => {
  return window.innerWidth <= 480; // iPhone screen width or similar
};

const LineChart = ({ affiliateCommissions }) => {
  const values = [];
  const months = [];
  const x = {};

  affiliateCommissions.forEach((item) => {
    const date = new Date(item.dateOrdered);
    if (isNaN(date)) {
      console.error('Invalid date:', item.dateOrdered);
      return;
    }

    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = month + ' ' + year;
    if (!x[key]) {
      x[key] = 0; // Initialize to 0 if not already set
    }

    const commission = parseFloat(item.commission);
    if (isNaN(commission)) {
      console.error('Invalid commission value:', item.commission);
      return;
    }

    x[key] += commission;
  });

  for (const [key, value] of Object.entries(x)) {
    months.push(key);
    values.push(value);
  }

  const data = {
    labels: months,

    datasets: [
      {
        label: 'Sales Over Months',
        data: values,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, // this will hide the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: isSmallScreen() ? '90%' : '400px', // Use 90% width for small screens
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const AdminAffiliatePage = () => {
  const { userdata, db, cloudfirestore, refreshUser, firestore, alertSnackbar } = useContext(AppContext);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // affiliate claim Id should be handled by backend
  const affiliateClaimId = [...Array(20)].map(() => Math.random().toString(36)[2]).join('');
  const [chosenMethod, setChosenMethod] = useState(null);
  const [paymentMethodData, setPaymentMethodData] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0); // total unclaimed commissions
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const currentDate = new Date().toDateString();
  const [openAddPaymentMethodModal, setOpenAddPaymentMethodModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openClaimModal, setOpenClaimModal] = useState(false);
  const [affiliateCommissions, setAffiliateCommissions] = useState([]);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [order, setOrder] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openHowToEarnModal, setOpenHowToEarnModal] = useState(false);
  const [onlineStoreProductsData, setOnlineStoreProductsData] = useState([]);

  const navigateTo = useNavigate();

  useEffect(() => {
    cloudfirestore.readAllDataFromCollection('Products').then((res) => {
      // console.log(res);
      setOnlineStoreProductsData(res);
    });
  }, []);

  useEffect(() => {
    if (userdata) {
      firestore.readAllAvailableAffiliateBankAccounts(userdata.uid).then((bankAccounts) => {
        setPaymentMethodData(bankAccounts);

        const bankNames = [];
        bankAccounts.forEach((bank) => {
          bankNames.push(bank.bank);
        });

        setPaymentMethods(bankNames);
      });
      console.log(userdata.affiliateCommissions);
      setAffiliateCommissions(userdata.affiliateCommissions);

      // const mockCommissions = []
      // for (let i = 0; i < 100; i++) {

      //   // create a function that returns 10% of the time claimable and 90% of the time claimed
      //   const status = Math.random() < 0.1 ? 'claimable' : 'claimed';

      //   // create a function that randomly generates a date within the last 365 days
      //   const randomDate = new Date(new Date('2024-01-31').getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      //   // create a function that randomly generates a commission amount

      //   const randomNumber10digits = Math.floor(1000000000 + Math.random() * 9000000000);

      //   function getMultiplier(month,year) {
      //     console.log(month,year)
      //     if (month == 0 && year == 2023) {
      //       return 1.5
      //     }
      //     if (month == 1 && year == 2023) {
      //       return 2
      //     }
      //     if (month == 2 && year == 2023) {
      //       return 2.5
      //     }
      //     if (month == 3 && year == 2023) {
      //       return 3
      //     }
      //     if (month == 4 && year == 2023) {
      //       return 3.5
      //     }
      //     if (month == 5 && year == 2023) {
      //       return 4
      //     }
      //     if (month == 6 && year == 2023) {
      //       return 4.5
      //     }
      //     if (month == 7 && year == 2023) {
      //       return 5
      //     }
      //     if (month == 8 && year == 2023) {
      //       return 5.5
      //     }
      //     if (month == 9 && year == 2023) {
      //       return 6
      //     }
      //     if (month == 10 && year == 2023) {
      //       return 6.5
      //     }
      //     if (month == 11 && year == 2023) {
      //       return 7
      //     }
      //     if (month == 0 && year == 2024) {
      //       return 7.5
      //     }
      //     if (month == 1 && year == 2024) {
      //       return 8
      //     }
      //   }

      //   const commission = Math.random() * 1000 * getMultiplier(randomDate.getMonth(),randomDate.getFullYear())

      //   mockCommissions.push({
      //     claimCode: "",
      //     commission: commission,
      //     customer: 'test',
      //     dateOrdered: randomDate,
      //     orderReference: randomNumber10digits.toString(),
      //     status: status
      //   });
      // }

      // const sorted = mockCommissions.sort((a, b) => a.dateOrdered - b.dateOrdered);

      // setAffiliateCommissions(mockCommissions);
    }
  }, [userdata]);

  function onClaimClick() {
    if (chosenMethod && total > 0 && userdata) {
      setLoading(true);
      const data = {
        date: new Date().toDateString(),
        affiliateUserId: userdata.uid,
        affiliateClaimId: affiliateClaimId,
        method: chosenMethod,
        accountNumber: accountNumber,
        accountName: accountName,
        amount: total,
        totalDeposited: 0,
        isDone: false,
      };
      cloudfirestore.onAffiliateClaim(data).then((res) => {
        if (res.status == 200) {
          alertSnackbar('success', 'Your Claim Request is Submitted Successfully.');
          window.location.reload();
          setLoading(false);
        } else {
          alertSnackbar('error', res.response.data);
          console.log(res);
          setLoading(false);
        }
      });
    }
  }

  useEffect(() => {
    if (userdata) {
      const claimables = affiliateCommissions.filter((item) => item.status == 'claimable');
      let totalUnclaimed = 0;
      claimables.forEach((item) => {
        totalUnclaimed += parseFloat(item.commission);
      });

      setTotal(totalUnclaimed.toFixed(2));

      let totalEarned = 0;

      affiliateCommissions.forEach((item) => {
        totalEarned += parseFloat(item.commission);
      });

      setTotalEarned(totalEarned.toFixed(2));
    }
  }, [affiliateCommissions, refreshUser]);

  function disableColor() {
    if (chosenMethod && total != 0) {
      return ' bg-color10b hover:bg-blue1';
    } else {
      return ' bg-gray-300 cursor-not-allowed';
    }
  }

  function disableButton() {
    if (chosenMethod && total != 0) {
      return false;
    } else if (loading == false) {
      return false;
    } else {
      return true;
    }
  }

  useEffect(() => {
    if (order) {
      setOpenOrderModal(true);
    }
  }, [order]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    function chunkArrayInGroups(arr, size) {
      let result = [];

      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }

      return result;
    }

    let data = chunkArrayInGroups(affiliateCommissions, rowsPerPage);
    data = data[page];
    if (data) {
      setTableData(data);
    }
  }, [rowsPerPage, page, affiliateCommissions]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * affiliateCommissions - affiliateCommissions.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col justify-center items-center tracking-widest  font-sans">
        <Typography className="text-4xl font-bold mt-10 mb-5">Affiliate Dashboard</Typography>

        <div className="flex flex-col justify-evenly my-10  w-full  ">
          <div className="flex flex-col gap-1.5 items-center justify-center ">
            <Box sx={{ minWidth: isSmallScreen() ? '90%' : '400px' }}>
              <Card variant="outlined">
                {' '}
                <React.Fragment>
                  <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      Claimable Commissions
                    </Typography>
                    <Typography variant="h5" component="div">
                      ₱ {total.toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: 14, marginTop: 2 }} color="text.secondary" gutterBottom>
                      Total Earned
                    </Typography>
                    <Typography variant="h5" component="div">
                      ₱ {totalEarned.toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <div className="flex flex-row justify-between w-full">
                      <Button
                        onClick={() => {
                          if (paymentMethods.length == 0) {
                            setOpenAddPaymentMethodModal(true);
                          } else {
                            setOpenClaimModal(true);
                          }
                        }}
                        size="small"
                      >
                        Claim Commissions
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenHowToEarnModal(true);
                        }}
                        size="small"
                      >
                        How to Earn?
                      </Button>
                    </div>
                  </CardActions>
                </React.Fragment>
              </Card>
            </Box>
          </div>
          <div className="flex lg:flex-row flex-col items-center gap-8 justify-center "></div>
        </div>

        <div className="flex items-center flex-col justify-center w-9/10 lg:w-400px mb-10">
          <Typography className="text-2xl font-bold">Commissions</Typography>
          <LineChart affiliateCommissions={affiliateCommissions} />
        </div>

        <TableContainer
          className=" "
          component={Paper}
          sx={{ width: isSmallScreen() ? '90%' : '600px', marginBottom: 8 }}
        >
          <Table style={{ tableLayout: 'auto' }} aria-label="simple table">
            <TableHead className="bg-color10c bg-opacity-100 h-16">
              <TableRow>
                <TableCell className="font-sans text-lg tracking-wider text-white">Reference</TableCell>
                <TableCell className="font-sans text-lg tracking-wider text-white">Status</TableCell>
                <TableCell className="font-sans text-lg tracking-wider text-white">Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span
                      style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                      onClick={async () => {
                        const order = await firestore.readSelectedDataFromCollection('Orders', data.orderReference);
                        setOrder(order);

                        /* handle click event if needed */
                      }}
                    >
                      {data.orderReference}
                    </span>
                  </TableCell>

                  <TableCell
                    style={{
                      color:
                        data.status === 'claimable' ? 'limegreen' : data.status === 'claimed' ? '#429eff' : 'orange',
                    }}
                  >
                    {data.status}
                  </TableCell>
                  <TableCell className="text-green-500">₱ {data.commission.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={affiliateCommissions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        {/* <StockManagementTable products={onlineStoreProductsData} /> */}
        <Typography className="text-2xl font-bold mb-10">Input Customer Order</Typography>

        <UseCustomerAccount />

        <AffiliateAddPaymentMethodModal
          paymentMethodData={paymentMethodData}
          open={openAddPaymentMethodModal}
          setOpen={setOpenAddPaymentMethodModal}
        />

        <Modal
          open={openHowToEarnModal}
          onClose={() => {
            setOpenHowToEarnModal(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="flex flex-col gap-2">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                How to Earn?
              </Typography>

              <Typography id="modal-modal-description">1. Share your affiliate link below to customers.</Typography>

              <div className="flex flex-row">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://starpack.ph/shop?aid=' + userdata.affiliateId);
                    alertSnackbar('success', 'Copied to clipboard');
                  }}
                  className="p-3 bg-color10c rounded-lg text-white"
                >
                  Copy
                </button>
                <TextField
                  value={userdata ? 'https://starpack.ph/shop?aid=' + userdata.affiliateId : ''}
                  className="ml-3"
                  // disabled
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ width: 'full' }}
                  label="Affiliate Link"
                />
              </div>
              <Typography id="modal-modal-description">
                2. When they purchase, you will get 1% of the total amount they paid less delivery fee and taxes.
              </Typography>
              <Divider />
              <Typography id="modal-modal-description">Notes</Typography>
              <Typography id="modal-modal-description">
                - To ensure your commission stays locked in, make sure they sign up for an account using your affiliate
                link. Once they're registered, they'll always be connected to your affiliate account, so you don't have
                to worry about them using another link when they make a purchase. They just need to keep using the same
                account.
              </Typography>
              <Typography id="modal-modal-description">
                - You can still earn a commission even if they don't create an account. Just share the affiliate link,
                and we will place a cookie on their device. They only need to make their purchase using the same device
                to ensure you receive your commission.
              </Typography>
            </div>
          </Box>
        </Modal>
        <Modal
          open={openClaimModal}
          onClose={() => {
            setOpenClaimModal(false);
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className=" flex flex-col">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Claim Commissions
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                Please choose a bank account to send your commissions to.
              </Typography>
              <div className="flex flex-row gap-5 mt-5">
                <Autocomplete
                  value={chosenMethod}
                  options={paymentMethods}
                  className="w-full"
                  disablePortal
                  id="combo-box-demo"
                  onChange={(event, newValue) => {
                    // console.log(paymentMethodData)
                    let found = false;
                    for (let i of paymentMethodData) {
                      if (i.bank == newValue) {
                        setAccountNumber(i.accountNumber);
                        setAccountName(i.accountName);
                        found = true;
                        break;
                      }
                    }
                    if (!found) {
                      setAccountNumber('');
                      setAccountName('');
                    }
                    setChosenMethod(newValue);
                  }}
                  renderInput={(params) => <TextField required {...params} label="Bank / Wallet" />}
                />
                <Button
                  onClick={() => {
                    setOpenAddPaymentMethodModal(true);
                  }}
                  className="text-white h-14 text-sm"
                  variant="contained"
                >
                  Add Bank
                </Button>
              </div>
              <div className="flex flex-col -ml-3 mt-3">
                {accountNumber == '' ? null : (
                  <>
                    <ListItem>
                      <ListItemText primary={'Account Number'} secondary={accountNumber} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={'Account Name'} secondary={accountName} />
                    </ListItem>
                  </>
                )}
              </div>
              <Button
                disabled={disableButton()}
                onClick={onClaimClick}
                className={'mt-4' + disableColor()}
                variant="contained"
              >
                Claim
              </Button>
            </div>
            <div className="h-full  flex"></div>
          </Box>
        </Modal>
        {order ? (
          <MyOrderCardModal
            open={openOrderModal}
            order={order}
            handleClose={() => {
              setOpenOrderModal(false);
            }}
          />
        ) : null}
      </div>
    </ThemeProvider>
  );
};

export default AdminAffiliatePage;
