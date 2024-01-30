import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../AppContext';
import useWindowDimensions from './UseWindowDimensions';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import { FaRegImage } from 'react-icons/fa';
import {
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Modal,
  Box,
  Divider,
} from '@mui/material';
import { arEG } from 'date-fns/locale';
import menuRules from '../../utils/classes/menuRules';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AffiliateClaimRequest = () => {
  const { storage, cloudfirestore, userdata, firestore } = useContext(AppContext);
  const { height, width } = useWindowDimensions();
  const [imageProof, setImageProof] = useState(null);
  const [affiliateClaimId, setAffiliateClaimId] = useState(null);
  const [affiliateUserId, setAffiliateUserId] = useState(null);
  const [depositMethod, setDepositMethod] = useState(null);
  const [amountDeposited, setAmountDeposited] = useState(0);
  const [open, setOpen] = useState(false);
  const rules = new menuRules(userdata.userRole);

  function onUploadImage(imageUrl) {
    setImageProof(imageUrl);
  }

  const handleOpen = (data) => {
    setOpen(true);
    setAffiliateClaimId(data.affiliateClaimId);
    setAffiliateUserId(data.affiliateUserId);
    setDepositMethod(data.Method);
  };

  const handleClose = () => {
    setOpen(false);
    setAffiliateClaimId(null);
    setDepositMethod(null);
    setAmountDeposited(null);
  };

  function handleModalDepositClick() {
    const data = {
      depositImageUrl: imageProof,
      amountDeposited: parseFloat(amountDeposited),
      affiliateClaimId: affiliateClaimId,
      affiliateUserId: affiliateUserId,
      depositMethod: depositMethod,
      depositorUserId: userdata.uid,
      depositorUserRole: userdata.userRole,
      transactionDate: new Date().toDateString(),
    };
    cloudfirestore.addDepositToAffiliate(data).then((res) => {
      if (res.request.status == 200) {
        alert('You have successfully made a deposit.');
        window.location.reload();
      }
    });
  }

  const [allClaims, setAllClaims] = useState([]);

  useEffect(() => {
    async function readAllClaims() {
      const ids = [];
      const users = await cloudfirestore.getAllAffiliateUsers();
      users.forEach((doc) => {
        console.log(doc.uid);
        ids.push(doc.uid);
      });

      const claims = await firestore.readAllClaims(ids);
      console.log(claims);
      const toSet = [];
      claims.map((info) => {
        info.map((claim) => {
          if (claim.isDone == false) {
            toSet.push(claim);
          }
        });
      });
      setAllClaims(toSet);
    }
    readAllClaims();
  }, []);

  const transactionData = allClaims ? allClaims : null;

  function onDoneClick(claimId, userId, date) {
    const data = {
      claimId: claimId,
      userId: userId,
      date: date,
    };
    cloudfirestore.markAffiliateClaimDone(data).then((res) => {
      if (res.request.status == 200) {
        alert('The Claim is Marked Done.');
        window.location.reload();
      } else {
        console.error('error');
      }
    });
  }

  return (
    <>
      {rules.checkIfUserAuthorized('affiliateClaimRequest') ? (
        <div className="flex flex-col justify-center items-center py-5 gap-5">
          {/* <div className='bg-color30 p-5 rounded-lg text-white text-3xl tracking-widest'>Affiliate Claim Requests</div> */}
          <div className=" p-5 rounded-lg text-color30 text-3xl tracking-widest shadow-md border-t border-x border-color30 shadow-color30">
            Affiliate Claim Requests
          </div>
          <div className="w-19/20 md:w-11/12">
            <TableContainer
              className="border-2 border-color30 overflow-auto"
              component={Paper}
              sx={{ maxHeight: height }}
            >
              <Table style={{ tableLayout: 'auto' }} fixedHeader={true} aria-label="simple table">
                <TableHead className="bg-color30 bg-opacity-100 h-16">
                  <TableCell className="font-sans text-lg tracking-wider text-white">Affiliate User Id</TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Affiliate Claim Id</TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Method </TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Account Number</TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Account Name</TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Date of Request</TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Amount </TableCell>
                  <TableCell className="font-sans text-lg tracking-wider text-white">Total Deposited</TableCell>
                  <TableCell className="font-sans text-center text-lg tracking-wider text-white">--</TableCell>
                  <TableCell className="font-sans text-center text-lg tracking-wider text-white">--</TableCell>
                </TableHead>
                <TableBody>
                  {transactionData != 0
                    ? transactionData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell>{data.affiliateUserId}</TableCell>
                          <TableCell>{data.affiliateClaimId}</TableCell>
                          <TableCell>{data.method}</TableCell>
                          <TableCell className="lg:indent-5 xl:indent-10">{data.accountNumber}</TableCell>
                          <TableCell>{data.accountName}</TableCell>
                          <TableCell>{data.transactionDate}</TableCell>
                          <TableCell className="text-green-500">₱{data.amount.toLocaleString()}</TableCell>
                          <TableCell style={{ color: data.amount <= data.totalDeposited ? 'mediumseagreen' : 'red' }}>
                            ₱{data.totalDeposited.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                handleOpen(data);
                              }}
                              disabled={data.amount <= data.totalDeposited ? true : false}
                              className={
                                data.amount <= data.totalDeposited ? 'bg-gray-200' : 'bg-color10b hover:bg-blue1'
                              }
                              variant="contained"
                            >
                              Deposit
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => {
                                onDoneClick(data.affiliateClaimId, data.affiliateUserId, data.transactionDate);
                              }}
                              disabled={data.totalDeposited >= data.amount ? false : true}
                              variant="outlined"
                            >
                              Done
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : 'No Claim Requests'}
                </TableBody>
              </Table>
            </TableContainer>
            <Modal
              open={open}
              onClose={() => handleClose()}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="max-h-9/10 sm:max-h-7/10 overflow-auto rounded-xl border-color30 bg-green4">
                {/* <Divider className='mt-5'/> */}
                <div className="flex justify-center items-center w-full p-5 mt-5 border border-color30 rounded-lg">
                  {imageProof ? (
                    <img className="h-full" alt="Upload" src={imageProof} />
                  ) : (
                    <FaRegImage className=" text-color30 h-28 w-24" />
                  )}
                </div>
                <div className="mt-5">
                  <ImageUploadButton
                    buttonTitle="Upload Proof"
                    onUploadFunction={onUploadImage}
                    storage={storage}
                    folderName={`affiliateDeposits/${affiliateUserId}/`}
                  />
                </div>
                <Divider className="my-6" />
                <div className="flex justify-center items-center w-full">
                  <TextField
                    color="primary"
                    type="number"
                    onChange={(e) => setAmountDeposited(e.target.value)}
                    label="Amount"
                  />
                </div>
                <Divider className="mt-6" />
                <div className="flex justify-center items-center w-full p-5">
                  <Button
                    disabled={imageProof && amountDeposited ? false : true}
                    variant="contained"
                    className="rounded-md p-3 px-6"
                    onClick={() => handleModalDepositClick()}
                  >
                    Deposit
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      ) : (
        <>UNAUTHORIZED</>
      )}
    </>
  );
};

export default AffiliateClaimRequest;
