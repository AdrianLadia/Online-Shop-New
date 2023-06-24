import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

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

const ProfileUpdaterModal = (props) => {
  const openProfileUpdaterModal = props.openProfileUpdaterModal;
  const setOpenProfileUpdaterModal = props.setOpenProfileUpdaterModal;

  return (
    <div>
      <Modal
        open={openProfileUpdaterModal}
        onClose={() => setOpenProfileUpdaterModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Hey there!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            We have noticed that you registered through phone number. Please update your profile to get the best
            experience.
          </Typography>
          <TextField
            required
            label="Name"
            variant="outlined"
            sx={{ width: '90%', marginTop: 3 }}
            onChange={(event) => setItemID(event.target.value)}
          />
          <TextField
            required
            label="Email"
            variant="outlined"
            sx={{ width: '90%', marginTop: 3 }}
            onChange={(event) => setItemID(event.target.value)}
          />
          <TextField
            required
            label="Phone Number"
            variant="outlined"
            sx={{ width: '90%', marginTop: 3 }}
            onChange={(event) => setItemID(event.target.value)}
          />
          <Button 
          >
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileUpdaterModal;
