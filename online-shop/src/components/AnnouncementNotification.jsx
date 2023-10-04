import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

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
          <Card sx={{ width:'full', flexShrink: 0, height: '100%' }} elevation={20}>
            <CardMedia sx={{ height: 210, backgroundColor: '#e1fadd' }} image={'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2FDALL%C2%B7E%202023-09-28%2015.04.02%20-%20A%20vector%20illustration%20of%20a%20delivery%20truck%20driving%20in%20the%20city.png?alt=media&token=bf03d424-7559-4eb7-9e07-eede1a80e5a0&_gl=1*tdbmg6*_ga*MTQxNzMzMTk4Ny4xNjk1MDg5NTAy*_ga_CW55HF8NVT*MTY5NTg4NDY1Mi4xOS4xLjE2OTU4ODQ2NzguMzQuMC4w'} title="auto calculate" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Free Delivery Until 10/31
              </Typography>
              <Typography
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                variant="body2"
                color="text.secondary"
              >
               Shop now and enjoy the savings on delivery! Offer ends soon. 
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
