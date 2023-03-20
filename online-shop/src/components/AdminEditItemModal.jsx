import React from 'react';
import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import firestoredb from './firestoredb';
import TextField from '@mui/material/TextField';
import AppContext from '../AppContext';

// Style for Modal
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '80%',
  transform: 'translate(-50%, -50%)',
  width: '95%',

  '@media (min-width: 1024px)': {
    width: '50%',
  },

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AdminEditItemModal = (props) => {
  const { firestore } = React.useContext(AppContext);
  const products = props.products;
  const [selectedItemToBeEdited, setSelectedItemToBeEdited] = useState('');
  const [itemID, setItemID] = useState('');
  const [itemName, setItemName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [color, setColor] = React.useState('');
  const [material, setMaterial] = React.useState('');
  const [size, setSize] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [dimensions, setDimensions] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [pieces, setPieces] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [imagelink1, setImagelink1] = React.useState('');
  const [imagelink2, setImagelink2] = React.useState('');
  const [imagelink3, setImagelink3] = React.useState('');
  const [imagelink4, setImagelink4] = React.useState('');
  const [imagelink5, setImagelink5] = React.useState('');
  const [imagelink6, setImagelink6] = React.useState('');
  const [imagelink7, setImagelink7] = React.useState('');
  const [imagelink8, setImagelink8] = React.useState('');
  const [imagelink9, setImagelink9] = React.useState('');
  const [imagelink10, setImagelink10] = React.useState('');
  const categories = props.categories;

  function handleChange(event) {
    setSelectedItemToBeEdited(event.target.value);
    console.log(event.target.value);
    firestore.readSelectedProduct(event.target.value).then((product) => {
      setItemID(product.itemid);
      setItemName(product.itemname);
      setDescription(product.description);
      setCategory(product.category);
      setColor(product.color);
      setMaterial(product.material);
      setSize(product.size);
      setWeight(product.weight);
      setDimensions(product.dimensions);
      setPrice(product.price);
      setBrand(product.brand);
      setPieces(product.pieces);
      setUnit(product.unit);
      setImagelink1(product.imagelinks[0]);
      setImagelink2(product.imagelinks[1]);
      setImagelink3(product.imagelinks[2]);
      setImagelink4(product.imagelinks[3]);
      setImagelink5(product.imagelinks[4]);
      setImagelink6(product.imagelinks[5]);
      setImagelink7(product.imagelinks[6]);
      setImagelink8(product.imagelinks[7]);
      setImagelink9(product.imagelinks[8]);
      setImagelink10(product.imagelinks[9]);
    });
  }

  function handleEditItem() {
    function checkifUndefinedAndReturnBlankString(value) {
      if (value === undefined) {
        return '';
      } else {
        return value;
      }
    }

    let imagelinks = [
      imagelink1,
      imagelink2,
      imagelink3,
      imagelink4,
      imagelink5,
      imagelink6,
      imagelink7,
      imagelink8,
      imagelink9,
      imagelink10,
    ];
    let convertedtofirestore = [];
    let index = 0;
    imagelinks.map((imagelink) => {
      index = index + 1;
      if (imagelink === undefined) {
        return;
      }
      if (imagelink === '') {
        return;
      } else {
        convertedtofirestore.push(imagelink);
      }
      console.log(convertedtofirestore);
    });

    console.log(color);

    firestore.updateProduct(selectedItemToBeEdited, {
      itemName: checkifUndefinedAndReturnBlankString(itemName),
      description: checkifUndefinedAndReturnBlankString(description),
      category: checkifUndefinedAndReturnBlankString(category),
      color: checkifUndefinedAndReturnBlankString(color),
      material: checkifUndefinedAndReturnBlankString(material),
      size: checkifUndefinedAndReturnBlankString(size),
      weight: checkifUndefinedAndReturnBlankString(weight),
      dimensions: checkifUndefinedAndReturnBlankString(dimensions),
      price: checkifUndefinedAndReturnBlankString(price),
      brand: checkifUndefinedAndReturnBlankString(brand),
      pieces: checkifUndefinedAndReturnBlankString(pieces),
      unit: checkifUndefinedAndReturnBlankString(unit),
      imageLinks: convertedtofirestore,
    });
    props.setRefresh(!props.refresh);
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col h-full overflow-y-auto space-y-4">
            <Box sx={{ width: '90%', marginTop: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Item</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedItemToBeEdited}
                  label="Age"
                  onChange={handleChange}
                >
                  {products.map((product) => (
                    <MenuItem key={'adminEditItem-' + product.itemid} value={product.itemid}>
                      {product.itemname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              disabled={true}
              required
              id="outlined-basic"
              label="Item ID"
              variant="outlined"
              value={itemID}
              sx={{ width: '90%' }}
              onChange={(event) => setItemID(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Item Name"
              variant="outlined"
              value={itemName || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setItemName(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Price"
              variant="outlined"
              value={price || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setPrice(event.target.value)}
            />
            <Box sx={{ width: '90%', marginTop: 3 }}>
              <FormControl fullWidth>
                <InputLabel required={true} id="demo-simple-select-label">
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={category || ''}
                  label="Age"
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.category} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              value={description || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setDescription(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Color"
              variant="outlined"
              value={color || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setColor(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Material"
              variant="outlined"
              value={material || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setMaterial(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Size"
              variant="outlined"
              value={size || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setSize(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Weight"
              variant="outlined"
              value={weight || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setWeight(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Dimensions"
              variant="outlined"
              value={dimensions || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setDimensions(event.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="Brand"
              variant="outlined"
              value={brand || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setBrand(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Pieces"
              variant="outlined"
              value={pieces || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setPieces(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Unit"
              variant="outlined"
              value={unit || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setUnit(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 1"
              variant="outlined"
              value={imagelink1 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink1(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 2"
              variant="outlined"
              value={imagelink2 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink2(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 3"
              variant="outlined"
              value={imagelink3 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink3(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 4"
              variant="outlined"
              value={imagelink4 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink4(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 5"
              variant="outlined"
              value={imagelink5 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink5(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 6"
              variant="outlined"
              value={imagelink6 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink6(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 7"
              variant="outlined"
              value={imagelink7 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink7(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 8"
              variant="outlined"
              value={imagelink8 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink8(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 9"
              variant="outlined"
              value={imagelink9 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink9(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 10"
              variant="outlined"
              value={imagelink10 || ''}
              sx={{ width: '90%' }}
              onChange={(event) => setImagelink10(event.target.value)}
            />
            <button onClick={handleEditItem} className="bg-yellow-300 hover:bg-yellow-500 rounded-lg p-4">
              Edit Item
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminEditItemModal;
