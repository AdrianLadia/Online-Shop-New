import React from 'react';
import { useContext } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import AppContext from '../AppContext';
import { Typography } from '@mui/material';

const ProductCardModalRadioButton = ({
  className,
  radioButtonSelected,
  setRadioButtonSelected,
  retailData,
  wholesaleData,
  setCount,
}) => {
  const { businesscalculations} = useContext(AppContext);
  const packPieces = retailData.pieces;
  const boxPieces = wholesaleData.pieces;
  const packPrice = retailData.price;
  const boxPrice = wholesaleData.price;
  const packStocksAvailable = businesscalculations.getStocksAvailableLessSafetyStock(
    retailData.stocksAvailable,
    retailData.averageSalesPerDay,
    true
  );

  const boxStocksAvailable = wholesaleData.stocksAvailable;

  // if (!['distributor','superAdmin'].includes(userdata ? userdata.userRole : 'GUEST') ) {
  //   boxStocksAvailable = businesscalculations.getStocksAvailableLessSafetyStock(
  //     wholesaleData.stocksAvailable,
  //     wholesaleData.averageSalesPerDay,
  //     false
  //   );
  // }
  // else {
  //   boxStocksAvailable = wholesaleData.stocksAvailable
  // }
 
  const handleChange = (event) => {
    setCount(0)
    setRadioButtonSelected(event.target.value);
  };
  return (
    <ThemeProvider theme={theme}>
      <div className={className}>
        <FormControl>
          <FormLabel sx={{ marginBottom: 1 }} id="demo-controlled-radio-buttons-group">
            Purchase item by
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={radioButtonSelected}
            onChange={handleChange}
          >
            <FormControlLabel value="Pack" control={<Radio />} label={`Pack, ${packPieces} Pieces, ₱${packPrice}`} />
            <FormControlLabel value="Box" control={<Radio />} label={`Box, ${boxPieces} Pieces, ₱${boxPrice}`} />
          </RadioGroup>
        </FormControl>
        <div className="flex flex-col ml-7 mt-1">
          {radioButtonSelected === 'Pack' ? 
          <Typography color={'red'}>{packStocksAvailable} packs on hand</Typography>
          : 
          <Typography color={'red'}>{boxStocksAvailable < 0 ? 0 : boxStocksAvailable} boxes on hand</Typography>
          }
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ProductCardModalRadioButton;
