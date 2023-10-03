import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, Divider } from '@mui/material';
import ReactPlayer from 'react-player';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '80%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  overflow: 'scroll',

  '@media (min-width: 1024px)': {
    width: '70%',
  },

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function UnsupportedBrowserRedirect(props) {
  const isSupportedBrowser = props.isSupportedBrowser;
  const open = props.open;
  // const open = true
  const setOpen = props.setOpen;


  const handleClose = () => setOpen(false);

  function copyLink() {
    // /* Get the text field */
    // var copyText = document.getElementById("myInput");

    // /* Select the text field */
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText('www.starpack.ph');

    /* Alert the copied text */
    alert('Copied the url: www.starpack.ph');
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#e1fadd',
            borderRadius: '1rem',
            boxShadow: 3,
        
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom className="font-bold mb-6 text-center">
            Browser Not Supported
          </Typography>
          <Typography variant="h5" gutterBottom className="mb-5 font-bold text-center">
            How to solve this problem?
          </Typography>
          {/* <Typography variant="body1" gutterBottom className="mb-2 text-center">
        Our website doesn't support the Facebook in-app browser. 
      </Typography> */}
          <Divider sx={{ width: '100%', marginBottom: 1 }} />
          <Typography variant="body1" gutterBottom className="mb-2 text-center">
            Click the button to <strong>Copy the URL</strong>
          </Typography>

          <Button variant="contained" color="primary" onClick={copyLink} sx={{ mb: 1 }}>
            www.starpack.ph
          </Button>
          <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />
          <Typography variant="body1" gutterBottom className="mb-2 text-center">
            <strong>Open an authorized browser</strong>: Safari / Chrome / Firefox / Edge
          </Typography>
          <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />
          <Typography variant="body1" gutterBottom className="mb-2 text-center">
            <strong>Paste the URL </strong>
            in the address bar and press enter.
          </Typography>
          {/* <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />
          <Typography variant="body1" gutterBottom className="mb-2 text-center">
            Note: Logging in via Facebook / Instagram / Messenger in-app browser isn't supported by Google
            Authentication. Please use authorized browsers to login.
          </Typography> */}
          <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />
          <Typography variant="h5" gutterBottom className="mb-5 font-bold text-center">
            Video Tutorial
          </Typography>
          <div className="w-full flex justify-center h-20 mb-20">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=ogJ1XgR2bQo"
            controls={true}
            // ... other props
          />
        </div>
        </Box>
      </Modal>
    </div>
  );
}

export default UnsupportedBrowserRedirect;
