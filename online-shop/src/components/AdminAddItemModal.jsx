import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import useWindowDimensions from './UseWindowDimensions';
import AddCategoryModal from './AddCategoryModal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import AppContext from '../AppContext';
import cloudFirestoreDb from '../cloudFirestoreDb';
import businessCalculations from '../../utils/businessCalculations';
import ImageUploadButton from './ImageComponents/ImageUploadButton';

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
  const { firestore, products, storage,categories } = React.useContext(AppContext);
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
  const [isCustomized, setIsCustomized] = React.useState(false);
  const [retailPrice, setRetailPrice] = React.useState(0);
  const [packWeight, setPackWeight] = React.useState(0);
  const [piecesPerPack, setPiecesPerPack] = React.useState(0);
  const [packsPerBox, setPacksPerBox] = React.useState(0);
  const [manufactured, setManufactured] = React.useState(false);
  const [cbm, setCbm] = React.useState('');
  const [machines, setMachines] = React.useState([]);
  const [machineFormat, setMachineFormat] = React.useState('');

  console.log('categories', categories);

  useEffect(() => {
    firestore.readAllMachines().then((machines) => {
      setMachines(machines);
    });
  }, []);

  const cloudfirestore = new cloudFirestoreDb();
  const businesscalculations = new businessCalculations();

  async function addItem() {
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

    if (piecesPerPack * packsPerBox !== pieces) {
      alert('Pieces per pack * Packs per box must be equal to total pieces');
      return;
    }

    await firestore.createProduct(
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
        stocksOnHoldCompleted: [],
        forOnlineStore: true,
        isCustomized: isCustomized,
        stocksIns: [],
        piecesPerPack: piecesPerPack,
        packsPerBox: packsPerBox,
        cbm: cbm,
        manufactured: manufactured,
        machinesThatCanProduce: machineFormat,
      },
      itemID,
      products
    );

    if (isThisRetail) {
      await firestore.createProduct(
        {
          itemId: itemID + '-RET',
          itemName: itemName,
          unit: 'Pack',
          price: retailPrice,
          description: description,
          weight: packWeight,
          dimensions: dimensions,
          category: category,
          imageLinks: filteredimageLinks,
          brand: brand,
          pieces: piecesPerPack,
          color: color,
          material: material,
          size: size,
          stocksAvailable: 0,
          stocksOnHold: null,
          averageSalesPerDay: 0,
          parentProductID: itemID,
          stocksOnHoldCompleted: null,
          forOnlineStore: true,
          isCustomized: isCustomized,
          stocksIns: null,
          cbm: null,
          manufactured: manufactured,
          machinesThatCanProduce: machineFormat,
        },
        itemID + '-RET',
        products
      );
    }

    props.setRefresh(!props.refresh);
  }

  function onAddCategoryClick() {
    setOpenAddCategoryModal(true);
  }

  function createMachineFormat(checked, machine) {
    if (checked) {
      const newMachineFormat = machineFormat + machine.machineCode + '-';
      setMachineFormat(newMachineFormat);
    } else {
      const newMachineFormat = machineFormat.replace('-' + machine.machineCode, '');
      setMachineFormat(newMachineFormat);
    }
  }

  useEffect(() => {
    const parentProductsList = businesscalculations.readAllParentProductsFromOnlineStoreProducts(products);
    setParentProducts(parentProductsList);
  }, []);

  function onRetailCheckBoxClick(result) {
    if (result) {
      setIsThisRetail(true);
    } else {
      setIsThisRetail(false);
    }
  }

  function setImageURL1(imageLink) {
    setImageLink1(imageLink);
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col space-y-5 w-9/10 lg:w-1/2 xl:w-1/2 2xl::w-1/2 ">
        <TextField
          required
          id="outlined-basic123"
          label="Item ID"
          variant="outlined"
          sx={{ marginTop: 3 }}
          onChange={(event) => setItemID(event.target.value)}
        />
        <TextField
          required
          id="outlined-basic"
          label="Item Name"
          variant="outlined"
          onChange={(event) => setItemName(event.target.value)}
        />
        <TextField
          required
          id="outlined-basic"
          label="Price"
          variant="outlined"
          onChange={(event) => setPrice(event.target.value)}
        />
        <TextField
          required
          id="outlined-basic"
          label="Weight"
          variant="outlined"
          onChange={(event) => setWeight(event.target.value)}
        />
        <TextField
          required
          id="outlined-basic"
          label="Starting Inventory"
          variant="outlined"
          onChange={(event) => setStartingInventory(event.target.value)}
        />

        <TextField
          required
          id="outlined-basic"
          label="Pieces"
          variant="outlined"
          onChange={(event) => setPieces(parseFloat(event.target.value))}
        />

        <TextField
          required
          id="outlined-basic"
          label="Packs Per Box"
          variant="outlined"
          onChange={(event) => setPacksPerBox(parseFloat(event.target.value))}
          typeof="number"
        />
        <TextField
          required
          id="outlined-basic"
          label="Pieces Per Pack"
          variant="outlined"
          sx={{ mt: 3 }}
          onChange={(event) => setPiecesPerPack(parseFloat(event.target.value))}
          typeof="number"
        />

        {/* <TextField
              id="outlined-basic"
              label="Unit"
              variant="outlined"
              
              onChange={(event) => setUnit(event.target.value)}
              
            /> */}
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <InputLabel required={true} id="demo-simple-select-label">
              Unit
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={unit}
              label="Unit"
              onChange={(event) => setUnit(event.target.value)}
            >
              <MenuItem value={'Bale'}>Bale</MenuItem>
              <MenuItem value={'Box'}>Box</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel required={true} id="demo-simple-select-label">
              Did we manufacture this product?
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={manufactured}
              label="manufactured"
              onChange={(event) => setManufactured(event.target.value)}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {manufactured ? (
          <>
            Which machines can produce this product?
            {machines.map((machine) => {
              return (
                <div className="flex flex-row">
                  <Checkbox
                    onClick={() => {
                      createMachineFormat(event.target.checked, machine);
                    }}
                  />
                  <Typography sx={{ marginTop: 1 }}> {machine.machineName}</Typography>
                </div>
              );
            })}
          </>
        ) : null}

        <TextField
          id="outlined-basic"
          label="Cubic Meter"
          variant="outlined"
          sx={{ mt: 3 }}
          onChange={(event) => setCbm(parseFloat(event.target.value))}
          typeof="number"
        />

        <TextField
          id="outlined-basic"
          label="Color"
          variant="outlined"
          onChange={(event) => setColor(event.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Material"
          variant="outlined"
          onChange={(event) => setMaterial(event.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Size"
          variant="outlined"
          onChange={(event) => setSize(event.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Brand"
          variant="outlined"
          onChange={(event) => setBrand(event.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Box Dimensions"
          variant="outlined"
          onChange={(event) => setDimensions(event.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="Description"
          variant="outlined"
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
                {categories.map((c) => {
                  if (c != 'Favorites') {
                    return <MenuItem value={c}>{c}</MenuItem>;
                  }
                }
                  
                )}
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
          <Checkbox onChange={(event) => onRetailCheckBoxClick(event.target.checked)} />
          <Typography sx={{ marginTop: 1 }}> Is this also for retail?</Typography>
        </div>

        {isThisRetail ? (
          // <TextField
          //   id="outlined-basic"
          //   label="Parent Product ID (if for retail)"
          //   variant="outlined"
          //   sx={{ width: "90%" }}
          //   onChange={(event) => setParentProductID(event.target.value)}
          // />
          <div>
            <TextField
              required
              id="outlined-basic"
              label="Retail Price"
              variant="outlined"
              sx={{ mt: 1 }}
              onChange={(event) => setRetailPrice(parseFloat(event.target.value))}
            />
            <TextField
              required
              id="outlined-basic"
              label="Pack Weight"
              variant="outlined"
              sx={{ mt: 3 }}
              onChange={(event) => setPackWeight(parseFloat(event.target.value))}
            />
          </div>
        ) : null}

        <div className="flex flex-row">
          <Checkbox
            onClick={() => {
              setIsCustomized(!isCustomized);
            }}
          />
          <Typography sx={{ marginTop: 1 }}> Is this Customized?</Typography>
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink1'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink1}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 1"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink1}
            onChange={(event) => setImageLink1(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink2'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink2}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 2"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink2}
            onChange={(event) => setImageLink2(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink3'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink3}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 3"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink3}
            onChange={(event) => setImageLink3(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink4'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink4}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 4"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink4}
            onChange={(event) => setImageLink4(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink5'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink5}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 5"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink5}
            onChange={(event) => setImageLink5(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink6'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink6}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 6"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink6}
            onChange={(event) => setImageLink6(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink7'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink7}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 7"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink7}
            onChange={(event) => setImageLink7(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink8'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink8}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 8"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink8}
            onChange={(event) => setImageLink8(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink9'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink9}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 9"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink9}
            onChange={(event) => setImageLink9(event.target.value)}
          />
        </div>

        <div className="flex flex-row ">
          <ImageUploadButton
            id={'imageLink10'}
            folderName={'ProductImages'}
            storage={storage}
            onUploadFunction={setImageLink10}
          />
          <TextField
            id="outlined-basic"
            label="Image Link 10"
            variant="outlined"
            sx={{ width: '90%' }}
            value={imageLink10}
            onChange={(event) => setImageLink10(event.target.value)}
          />
        </div>
        <Button className="w-2/5 lg:w-1/5" sx={{ height: 50,marginBottom:10 }} variant="contained" onClick={addItem}>
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default AdminAddItemModal;
