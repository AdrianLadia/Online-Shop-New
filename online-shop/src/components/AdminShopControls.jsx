import React from 'react';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import theme from '../colorPalette/MaterialUITheme';
import { ThemeProvider, alpha, styled } from '@mui/material/styles';
import AppContext from '../AppContext';
import { useContext,useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Button, Typography } from '@mui/material';

// const GreenSwitch = styled(Switch)(({ theme }) => ({
//   '& .MuiSwitch-switchBase.Mui-checked': {
//     color: '#69b05c',
//     '&:hover': {
//       backgroundColor: alpha('#69b05c', theme.palette.action.hoverOpacity),
//     },
//   },
//   '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//     backgroundColor: '#69b05c',
//   },
// }));

const AdminShopControls = () => {
  const { useDistributorPrice, setUseDistributorPrice } = useContext(AppContext);
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };

  const [disabled, setDisabled] = React.useState(false);

  function handleSwitchChange() {
    setUseDistributorPrice(!useDistributorPrice);
    setDisabled(true);
  }

  return (
    <div className="flex flex-row items-center">
      {/* <ThemeProvider theme={theme}> */}
      <Button disabled={disabled} variant="contained" sx={{backgroundColor:'#69b05c'}} onClick={handleSwitchChange}>
        Use Distributor Price
      </Button>
      
      {/* <Checkbox
        checked={useDistributorPrice}
        onChange={handleSwitchChange}
        sx={{
          color: '#69b05c',
          '&.Mui-checked': {
            color: '#69b05c',
          },
        }}
      />
      <Typography>Use Distributor Price</Typography> */}
      {/* <GreenSwitch {...label} checked={useDistributorPrice} onChange={handleSwitchChange} /> */}
      {/* </ThemeProvider> */}
    </div>
  );
};

export default AdminShopControls;
