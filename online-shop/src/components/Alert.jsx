import * as React from 'react';
import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const CustomizedSnackbars = React.forwardRef(function CustomizedSnackbars(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Alert({ message, severity, open, setOpen, autoHideDuration }) {
  let duration = autoHideDuration || 6000;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
      >
        <CustomizedSnackbars onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </CustomizedSnackbars>
      </Snackbar>
    </Stack>
  );
}
