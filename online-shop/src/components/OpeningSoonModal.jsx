import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    overflow: "scroll",

    "@media (min-width: 1024px)": {
      width: "70%",
    },

    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  export default function BasicModal() {
    const [open, setOpen] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 5000);
  
      return () => clearTimeout(timer);
    }, []);
  
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              We are on <strong>SOFT OPENING!</strong> Launching <strong> More Products Soon </strong>.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              
            </Typography>
            <Typography id="modal-modal-features" sx={{ mt: 5 }}>
              How to place an order:
            </Typography>
            <List>
              <ListItem><ListItemText primary="Quick ordering - Because we know your time is valuable" /></ListItem>
              <ListItem><ListItemText primary="Pinpoint delivery location - Get your orders exactly where you want them" /></ListItem>
              <ListItem><ListItemText primary="Automatic total of order - No more manual calculations" /></ListItem>
              <ListItem><ListItemText primary="View orders - Keep track of all your purchases" /></ListItem>
              <ListItem><ListItemText primary="View account statement - All your transactions at a glance" /></ListItem>
              <ListItem><ListItemText primary="Chat - Need help? We're just a message away!" /></ListItem>
            </List>
          </Box>
        </Modal>
      </div>
    );
  }