import React from 'react';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';




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
              <button onClick={handleClose} className="bg-gray-200 text-black rounded-full text-2xl h-10 w-10">
                x
              </button>
            </div>
            <div style={{ height: 210, backgroundColor: '#e1fadd', display: 'flex' }}>
              <img
                src={
                  "https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/announcementPhotos%2FDALL%C2%B7E%202023-12-19%2012.43.05%20-%20A%20festive%20and%20eye-catching%20design%20suitable%20for%20a%20food%20packaging%20supplier's%20holiday%20closure%20notice.%20The%20background%20depicts%20a%20charming%20winter%20landscape%20.png?alt=media&token=ddab97d4-ffe0-460f-97e5-70bf8c98fef9"                }
                alt="auto calculate"
                style={{ width: '100%', height: '100%', objectFit: 'fill' }}
              />
            </div>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Happy Holidays!
              </Typography>
              <Typography
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                variant="body2"
                color="text.secondary"
              >
                We will resume our operations on January 5, 2024. Thank you
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
