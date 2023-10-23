import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { BiExit } from 'react-icons/bi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const AnnouncementNotification = () => {
  const [open, setOpen] = React.useState(true);
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
              <button onClick={handleClose} className="bg-red-500 text-white rounded-full px-3 py-1.5">
                X
              </button>
            </div>
            <div style={{ height: 210, backgroundColor: '#e1fadd', display: 'flex' }}>
              <img
                src={
                  'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2FCODorCOP.png?alt=media&token=71d22fc9-475f-4f40-b898-f83f455f5d71&_gl=1*1d5kl93*_ga*NDM5ODMxODMzLjE2ODQ0MTcyMTE.*_ga_CW55HF8NVT*MTY5Nzg2NDM1Ni4xNjAuMS4xNjk3ODY0NDE1LjEuMC4w'
                }
                alt="auto calculate"
                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
              />
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Cash On Delivery
              </Typography>
              <Typography
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                variant="body2"
                color="text.secondary"
              >
                Cash on delivery is now available. Enjoy this method together with our FREE DELIVERY promo. The free
                delivery promo lasts until November.
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* </Box> */}
      </Modal>
    </div>
  );
};

export default AnnouncementNotification;
