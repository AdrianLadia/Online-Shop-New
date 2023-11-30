import React, { useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { set } from 'date-fns';

const ProductCardModalTableV2 = ({ wholesaleData, retailData, radioButtonSelected }) => {
  const [specs, setSpecs] = React.useState(null);

  function createDividerData(itemData) {
    const price = itemData.price;
    const brand = itemData.brand;
    const color = itemData.color;
    const dimensions = itemData.dimensions;
    const material = itemData.material;
    const pieces = itemData.pieces;
    const size = itemData.size;
    const weight = itemData.weight;
    const packsPerBox = itemData.packsPerBox;
    const piecesPerPack = itemData.piecesPerPack;

    return { brand, color, dimensions, material, size, weight, packsPerBox, piecesPerPack };
  }

  useEffect(() => {
    if (radioButtonSelected === 'Pack') {
      const dividerData = createDividerData(retailData);
      setSpecs(dividerData);
    }
    if (radioButtonSelected === 'Box') {
      const dividerData = createDividerData(wholesaleData);
      setSpecs(dividerData);
    }
  }, [radioButtonSelected]);


  function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
}

  return (
    <div>
    {specs ?
      Object.keys(specs).map((key) => {

        let title = key
        let value = specs[key]
        if (specs[key]) {
            if (key == 'dimensions') {
                title = 'Box Dimensions'
                value = `${specs[key]} inches`
            }
            if (key == 'piecesPerPack') {
                title = 'Pieces Per Pack'
            }
            if (key == 'weight' && radioButtonSelected == 'Box') {
                title = 'Box Weight'
                value = `${specs[key]} kg`
            }
            if (key == 'weight' && radioButtonSelected == 'Pack') {
                title = 'Box Weight'
                value = `${specs[key]} kg`
            }
            if (key == 'packsPerBox') {
                title = 'Packs Per Box'
            }
            return(
            <React.Fragment key={key}>
              <ListItem>
                <ListItemText primary={toTitleCase(title)} secondary={value} />
              </ListItem>
              <Divider />
            </React.Fragment>
            )
        }
      }
      )
      : null}
  </div>
  );
};

export default ProductCardModalTableV2;
