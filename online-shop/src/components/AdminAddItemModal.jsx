import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import firestoredb from './firestoredb';
import useWindowDimensions from './UseWindowDimensions';
import AddCategoryModal from './AddCategoryModal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
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

const AdminAddItemModal = (props) => {
  const { firestore } = React.useContext(AppContext);
  const { width, height } = useWindowDimensions();
  const [itemID, setItemID] = React.useState('');
  const [itemName, setItemName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [dimensions, setDimensions] = React.useState('');
  const [color, setColor] = React.useState('');
  const [material, setMaterial] = React.useState('');
  const [size, setSize] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [pieces, setPieces] = React.useState('');
  const [unit, setUnit] = React.useState('');
  const [imageLink1, setImageLink1] = React.useState('');
  const [imageLink2, setImageLink2] = React.useState('');
  const [imageLink3, setImageLink3] = React.useState('');
  const [imageLink4, setImageLink4] = React.useState('');
  const [imageLink5, setImageLink5] = React.useState('');
  const [imageLink6, setImageLink6] = React.useState('');
  const [imageLink7, setImageLink7] = React.useState('');
  const [imageLink8, setImageLink8] = React.useState('');
  const [imageLink9, setImageLink9] = React.useState('');
  const [imageLink10, setImageLink10] = React.useState('');
  const [startingInventory, setStartingInventory] = React.useState('');
  const [isThisRetail, setIsThisRetail] = React.useState(false);
  const [parentProductID, setParentProductID] = React.useState('');
  const [openAddCategoryModal, setOpenAddCategoryModal] = React.useState(false);
  const [parentProducts, setParentProducts] = React.useState([]);
  const categories = props.categories;

  async function addItem() {
    // FORM CHECKER
    if (itemID === '') {
      alert('Item ID is required');
      return;
    }

    if (itemName === '') {
      alert('Item Name is required');
      return;
    }

    if (price === '') {
      alert('Price is required');
      return;
    }

    let imageLinks = [
      imageLink1,
      imageLink2,
      imageLink3,
      imageLink4,
      imageLink5,
      imageLink6,
      imageLink7,
      imageLink8,
      imageLink9,
      imageLink10,
    ];
    const filteredimageLinks = imageLinks.filter((link) => link !== '');

    firestore.createProduct(
      {
        itemId: itemID,
        itemName: itemName,
        unit: unit,
        price: price,
        description: description,
        weight: weight,
        dimensions: dimensions,
        category: category,
        imageLinks: filteredimageLinks,
        brand: brand,
        pieces: pieces,
        color: color,
        material: material,
        size: size,
        stocksAvailable: parseInt(startingInventory),
        stocksOnHold: [],
        averageSalesPerDay: 0,
        parentProductID: parentProductID,
        stocksOnHoldCompleted: []
      },
      itemID
    );

    props.setRefresh(!props.refresh);
  }

  function onAddCategoryClick() {
    setOpenAddCategoryModal(true);
  }

  useEffect(() => {
    firestore.readAllParentProducts().then((data) => {
      console.log(data);
      setParentProducts(data);
    });

    // setParentProducts(parentProducts);
  }, []);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col space-y-5 overflow-y-auto h-full w-full">
            <TextField
              required
              id="outlined-basic"
              label="Item ID"
              variant="outlined"
              sx={{ width: '90%', marginTop: 3 }}
              onChange={(event) => setItemID(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Item Name"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setItemName(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Price"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setPrice(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Weight"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setWeight(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Starting Inventory"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setStartingInventory(event.target.value)}
            />

            <TextField
              id="outlined-basic"
              label="Unit"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setUnit(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Color"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setColor(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Material"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setMaterial(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Size"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setSize(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Brand"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setBrand(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Pieces"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setPieces(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Dimensions"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setDimensions(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setDescription(event.target.value)}
            />

            <div className="flex flex-row">
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel required={true} id="demo-simple-select-label">
                    Category
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Category"
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {categories.map((c) => (
                      <MenuItem value={c.category}>{c.category}</MenuItem>
                    ))}
                    {/* <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
              <button onClick={onAddCategoryClick} className="ml-5 bg-blue-500 text-white px-2 rounded-lg h-full">
                Add Category
              </button>
            </div>
            <AddCategoryModal
              openAddCategoryModal={openAddCategoryModal}
              setOpenAddCategoryModal={setOpenAddCategoryModal}
              setRefresh={props.setRefresh}
              refresh={props.refresh}
            />

            <div className="flex flex-row">
              <Checkbox
                onClick={() => {
                  setIsThisRetail(!isThisRetail);
                }}
              />
              <Typography sx={{ marginTop: 1 }}> Is this for retail?</Typography>
            </div>

            {isThisRetail ? (
              // <TextField
              //   id="outlined-basic"
              //   label="Parent Product ID (if for retail)"
              //   variant="outlined"
              //   sx={{ width: "90%" }}
              //   onChange={(event) => setParentProductID(event.target.value)}
              // />
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={parentProducts}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Parent ID" />}
              />
            ) : null}

            <TextField
              id="outlined-basic"
              label="Image Link 1"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink1(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 2"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink2(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 3"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink3(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 4"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink4(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 5"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink5(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 6"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink6(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 7"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink7(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 8"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink8(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 9"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink9(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Image Link 10"
              variant="outlined"
              sx={{ width: '90%' }}
              onChange={(event) => setImageLink10(event.target.value)}
            />
            <Button className="w-2/5 lg:w-1/5" sx={{ height: 100 }} variant="contained" onClick={addItem}>
              Add Item
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminAddItemModal;
