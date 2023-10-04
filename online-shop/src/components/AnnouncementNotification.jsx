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
            <CardMedia sx={{ height: 210, backgroundColor: '#e1fadd' }} image={'https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/announcementPhotos%2FYellow%20Simple%20Special%20Offer%20Instagram%20Post.png?alt=media&token=5dc02577-c6c2-485c-84bf-9a6019b90faf&_gl=1*1ay4iug*_ga*MTQxNzMzMTk4Ny4xNjk1MDg5NTAy*_ga_CW55HF8NVT*MTY5NjM5NjEwMC4yNy4xLjE2OTYzOTYyMDcuMjIuMC4w'} title="auto calculate" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                10% off on all items
              </Typography>
              <Typography
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                variant="body2"
                color="text.secondary"
              >
               Shop now and enjoy the savings on all items! Offer ends soon. 
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
