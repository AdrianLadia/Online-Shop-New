import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSupportedBrowser == false) {
        console.log('browser is Unsupported')
        const timer = setTimeout(() => {
          setOpen(true);
        }, 5000);
    
        return () => clearTimeout(timer);
    }
  }, [isSupportedBrowser]);


  const handleClose = () => setOpen(false);

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
            Unsupported Browser
          </Typography>
          <Typography variant="body1" gutterBottom className="mb-4 text-center">
            Our website does not support the <strong>Facebook in-app browser</strong>. Please open this page in Authorized Browsers for the best
            experience.
          </Typography>
            <Typography variant="body1" gutterBottom className="mb-4 text-center">
            <strong>Authorized Browsers</strong>
            </Typography>
            <Typography variant="body1" gutterBottom className="mb-4 text-center">
                <ul>
                    <li>Safari</li>
                    <li>Chrome</li>
                    <li>Firefox</li>
                    <li>Edge</li>
                </ul>
            </Typography>
            <Typography variant="body1" gutterBottom className="mb-4 text-center">
                <strong>www.starpack.ph</strong>
            </Typography>
            <Typography variant="body1" gutterBottom className="mb-4 text-center">
                You cannot login with the facebook in-app browser. Please open this page in Authorized Browsers for the best experience.
            </Typography>
          {/* <Button variant="contained" color="primary" href="https://starpack.ph" target="_blank" className="text-white">
            Open in Authorized Browser
          </Button> */}
        </Box>
      </Modal>
    </div>
  );
}

export default UnsupportedBrowserRedirect;
