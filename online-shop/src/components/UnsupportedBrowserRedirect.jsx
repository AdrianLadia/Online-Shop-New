import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, Button, Divider } from '@mui/material';
import AppContext from '../AppContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '80%',
  maxHeight: '80%',
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

  const open = props.open;
  // const open = true
  const setOpen = props.setOpen;

  const { alertSnackbar, affiliateUid, firestore } = useContext(AppContext);

  const handleClose = () => setOpen(false);
  const [urlToShare, setUrlToShare] = useState('');

  async function getUrlToShare() {
    let url;
    if (affiliateUid) {
      const user = await firestore.readSelectedDataFromCollection('Users', affiliateUid);
      const affiliateId = user.affiliateId;
      url = 'starpack.ph/shop?aid=' + affiliateId;
    } else {
      url = 'starpack.ph/shop';
    }
    setUrlToShare(url);
    return url;
  }
  useEffect(() => {
    getUrlToShare();
  }, []);
  async function copyLink() {
    // /* Get the text field */
    // var copyText = document.getElementById("myInput");

    // /* Select the text field */
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    const url = await getUrlToShare();
    try {
      navigator.clipboard.writeText(url);
    } catch (error) {
      console.log(error);
      navigator.clipboard.writeText('www.starpack.ph');
    }

    /* Alert the copied text */
    alertSnackbar('info', 'Copied the url: www.starpack.ph');
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
            mb: 4,
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
            <strong>Copy the URL below</strong>
          </Typography>

          <TextField
            id="myInput"
            variant="outlined"
            value={urlToShare}
            sx={{ width: '100%', background:'white', marginBottom: 1, marginTop: 1 }}
          />
          <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />

          <Button variant="contained" className="bg-color10a" onClick={copyLink} sx={{ mb: 1 }}>
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
          {/* <Typography variant="h5" gutterBottom className="mb-5 font-bold text-center">
            Video Tutorial
          </Typography> */}
          <Typography variant="body1" gutterBottom className="mb-2 text-center">
            Google Authentication is not supported by Facebook in-app browser. Please use authorized browsers to login.
          </Typography>
          <div className="w-full flex justify-center h-20 mb-20"></div>
        </Box>
      </Modal>
    </div>
  );
}

export default UnsupportedBrowserRedirect;
