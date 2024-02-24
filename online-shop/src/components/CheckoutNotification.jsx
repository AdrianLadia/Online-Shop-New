import React from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const CheckoutNotification = ({ allowedDates }) => {

  if (!allowedDates) {
    return null;
  }

  const [open, setOpen] = React.useState(!allowedDates.isStoreOpen);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style}> */}
        <div className="top-2/4 left-2/4 absolute -translate-x-1/2 -translate-y-1/2 w-9/10 md:w-1/2 lg:w-1/6">
          <Card sx={{ width: 'full', flexShrink: 0, height: '100%' }} elevation={20}>
            <div className="flex justify-end absolute right-2 top-2">
              <button onClick={handleClose} className="bg-color10b text-white rounded-full px-3 py-1.5">
                X
              </button>
            </div>
            <div style={{ height: 210, backgroundColor: '#e1fadd', display: 'flex' }}>
              <img
                src={
                  'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Fclosed.PNG?alt=media&token=bcc89f58-5b04-48f2-bb48-0a7bf78904eb&_gl=1*18hoctw*_ga*ODYzNDIyMTI2LjE2OTc3Nzk0MzY.*_ga_CW55HF8NVT*MTY5ODEwNjE4Ni4zLjEuMTY5ODEwNjI2OC4zOS4wLjA.'
                }
                alt="auto calculate"
                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
              />
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Operating Hours Notice
              </Typography>
              <Typography
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                variant="body2"
                color="text.secondary"
              >
                <p>
                  We are currently closed for the day and will reopen on {allowedDates.minDate.toLocaleDateString()}.
                </p>
                <br></br>
                <p>
                  For timely delivery, please place your orders before our daily cutoff time at{' '}
                  {allowedDates.cutOffTime}:00. Your understanding and cooperation are highly appreciated.
                </p>
                <br></br>
                <p>Orders placed now will be scheduled for delivery on {allowedDates.minDate.toLocaleDateString()} or later.</p>
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* </Box> */}
      </Modal>
    </div>
  );
};

export default CheckoutNotification;
