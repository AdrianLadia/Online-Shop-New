import React, { useEffect, useState } from 'react';
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
import { CircularProgress } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import menuRules from '../../utils/classes/menuRules';

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

const AdminAddOrEditItem = (props) => {
  const addOrEditItem = props.addOrEditItem;
  const { firestore, storage, categories: initialCategories, userdata } = React.useContext(AppContext);
  const [categories, setCategories] = React.useState(initialCategories);

  useEffect(() => {
    if (categories == null) {
      const categoryList = [];
      firestore.readAllCategories().then((categories) => {
        categories.map((c) => {
          categoryList.push(c.category);
        });

        setCategories(categoryList);
      });
    }
  }, []);

  const { width, height } = useWindowDimensions();
  const products = props.products;
  const productNames = [];

  products.map((product) => {
    if (product.unit != 'Pack') {
      productNames.push(product.itemName);
    }
  });

  const setSelectedMenu = props.setSelectedMenu;

  const handleCancel = () => setSelectedMenu('Inventory');

  const [itemID, setItemID] = useState('');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [pieces, setPieces] = useState('');
  const [unit, setUnit] = useState('');
  const [imageLink1, setImageLink1] = useState('');
  const [imageLink2, setImageLink2] = useState('');
  const [imageLink3, setImageLink3] = useState('');
  const [imageLink4, setImageLink4] = useState('');
  const [imageLink5, setImageLink5] = useState('');
  const [imageLink6, setImageLink6] = useState('');
  const [imageLink7, setImageLink7] = useState('');
  const [imageLink8, setImageLink8] = useState('');
  const [imageLink9, setImageLink9] = useState('');
  const [imageLink10, setImageLink10] = useState('');
  const [startingInventory, setStartingInventory] = useState('');
  const [isThisRetail, setIsThisRetail] = useState(false);
  const [parentProductID, setParentProductID] = useState('');
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [parentProducts, setParentProducts] = useState([]);
  const [isCustomized, setIsCustomized] = useState(false);
  const [retailPrice, setRetailPrice] = useState(0);
  const [packWeight, setPackWeight] = useState(0);
  const [piecesPerPack, setPiecesPerPack] = useState(0);
  const [packsPerBox, setPacksPerBox] = useState(0);
  const [manufactured, setManufactured] = useState(false);
  const [cbm, setCbm] = useState('');
  const [machines, setMachines] = useState([]);
  const [machineFormat, setMachineFormat] = useState('');
  const [selectedItemToEdit, setSelectedItemToEdit] = useState(null);
  const [boxImage, setBoxImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [costPrice, setCostPrice] = useState(0);
  const [freightCost, setFreightCost] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const rules = new menuRules(userdata.userRole);
  const [forOnlineStore,setForOnlineStore] = useState(true);

  useEffect(() => {
    firestore.readAllMachines().then((machines) => {
      setMachines(machines);
    });
  }, []);

  const businesscalculations = new businessCalculations();

  function checkDimensions(throwError = true) {
    if ([null, ''].includes(dimensions) == false) {
      let count = 0;

      for (let character of dimensions) {
        if (character == 'x' || character == 'X') {
          count += 1;
        }
      }
      if (count != 2) {
        if (throwError) {
          setLoading(false);
          alert('Invalid Dimensions Format');
          throw new Error('Invalid Dimensions Format');
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }

  useEffect(() => {
    const dimensionsCorrect = checkDimensions(false);

    // Split the string by 'x' to get an array of dimensions
    if (dimensionsCorrect) {
      const dimensionsArray = dimensions.split(/x|X/).map((item) => Number(item.trim()));

      const metersPerInch = 0.0254;
      const metersLength = dimensionsArray[0] * metersPerInch;
      const metersWidth = dimensionsArray[1] * metersPerInch;
      const metersHeight = dimensionsArray[2] * metersPerInch;
      const cbm = metersLength * metersWidth * metersHeight;
      setCbm(cbm);
    }

    // Convert inches to cbm
  }, [dimensions]);

  async function addItem() {
    setLoading(true);
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

    if (parseFloat(price) <= 0) {
      alert('Price must be greater than 0');
      setLoading(false);
      return;
    }

    if (itemID.length > 10) {
      alert('Item ID must not exceed 10 characters');
      setLoading(false);
      return;
    }

    if (parseFloat(piecesPerPack) * parseFloat(packsPerBox) !== parseFloat(pieces)) {
      alert('Pieces per pack * Packs per box must be equal to total pieces');
      setLoading(false);
      return;
    }

    checkDimensions();

    await firestore.createProduct(
      {
        itemId: itemID,
        itemName: itemName,
        unit: unit,
        price: parseFloat(price),
        description: description,
        weight: parseFloat(weight),
        dimensions: dimensions,
        category: category,
        imageLinks: filteredimageLinks,
        brand: brand,
        pieces: parseInt(pieces),
        color: color,
        material: material,
        size: size,
        stocksAvailable: parseInt(startingInventory),
        stocksOnHold: [],
        averageSalesPerDay: 0,
        parentProductID: parentProductID,
        stocksOnHoldCompleted: [],
        forOnlineStore: forOnlineStore,
        isCustomized: isCustomized,
        stocksIns: [],
        piecesPerPack: parseInt(piecesPerPack),
        packsPerBox: parseInt(packsPerBox),
        cbm: cbm,
        manufactured: manufactured,
        machinesThatCanProduce: machineFormat,
        boxImage: boxImage,
        costPrice: parseFloat(costPrice),
        freightCost: parseFloat(freightCost),
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
          price: parseFloat(retailPrice),
          description: description,
          weight: parseFloat(packWeight),
          dimensions: dimensions,
          category: category,
          imageLinks: filteredimageLinks,
          brand: brand,
          pieces: parseInt(piecesPerPack),
          color: color,
          material: material,
          size: size,
          stocksAvailable: 0,
          stocksOnHold: [],
          averageSalesPerDay: 0,
          parentProductID: itemID,
          stocksOnHoldCompleted: [],
          forOnlineStore: forOnlineStore,
          isCustomized: isCustomized,
          stocksIns: null,
          cbm: null,
          manufactured: manufactured,
          machinesThatCanProduce: machineFormat,
          boxImage: boxImage,
          costPrice: null,
          freightCost: null,
        },
        itemID + '-RET',
        products
      );
    }
    setLoading(false);
    props.setRefresh(!props.refresh);
  }

  async function editItem() {
    setLoading(true);
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

    if (parseFloat(piecesPerPack) * parseFloat(packsPerBox) !== parseFloat(pieces)) {
      alert('Pieces per pack * Packs per box must be equal to total pieces');
      setLoading(false);
      return;
    }

    
    if (parseFloat(price) <= 0) {
      alert('Price must be greater than 0');
      setLoading(false);
      return;
    }

    checkDimensions();

    await firestore.updateProduct(selectedItemToEdit, {
      itemName: itemName,
      unit: unit,
      price: parseFloat(price),
      description: description,
      weight: parseFloat(weight),
      dimensions: dimensions,
      category: category,
      imageLinks: filteredimageLinks,
      brand: brand,
      pieces: parseInt(pieces),
      color: color,
      material: material,
      size: size,
      parentProductID: parentProductID,
      isCustomized: isCustomized,
      piecesPerPack: parseInt(piecesPerPack),
      packsPerBox: parseInt(packsPerBox),
      cbm: cbm,
      boxImage: boxImage,
      costPrice: parseFloat(costPrice),
      freightCost: parseFloat(freightCost),
    });

    try {
      if (isThisRetail) {
        await firestore.updateProduct(selectedItemToEdit + '-RET', {
          itemName: itemName,
          unit: 'Pack',
          price: parseFloat(retailPrice),
          description: description,
          weight: parseFloat(packWeight),
          dimensions: dimensions,
          category: category,
          imageLinks: filteredimageLinks,
          brand: brand,
          pieces: parseInt(piecesPerPack),
          color: color,
          material: material,
          size: size,
          parentProductID: parentProductID,
          isCustomized: isCustomized,
          cbm: null,
          boxImage: boxImage,
          costPrice: null,
          freightCost: null,
        });
      }
    } catch (error) {
      await firestore.createProduct(
        {
          itemId: itemID + '-RET',
          itemName: itemName,
          unit: 'Pack',
          price: parseFloat(retailPrice),
          description: description,
          weight: parseFloat(packWeight),
          dimensions: dimensions,
          category: category,
          imageLinks: filteredimageLinks,
          brand: brand,
          pieces: parseInt(piecesPerPack),
          color: color,
          material: material,
          size: size,
          stocksAvailable: 0,
          stocksOnHold: [],
          averageSalesPerDay: 0,
          parentProductID: itemID,
          stocksOnHoldCompleted: [],
          forOnlineStore: forOnlineStore,
          isCustomized: isCustomized,
          stocksIns: null,
          cbm: null,
          manufactured: manufactured,
          machinesThatCanProduce: machineFormat,
          boxImage: boxImage,
          costPrice: null,
          freightCost: null,
        },
        itemID + '-RET',
        products
      );
    }

    props.setRefresh(!props.refresh);
    setLoading(false);
    alert(`${itemName} successfully updated`);
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


  useEffect(() => {
    if (addOrEditItem == 'Edit' && selectedItemToEdit !== null) {
      function checkIfItemHasRetailVersion() {
        const filter = products.filter((product) => product.itemId == selectedItemToEdit + '-RET');

        if (filter.length > 0) {
          return true;
        } else {
          return false;
        }
      }

      const hasRetailVersion = checkIfItemHasRetailVersion();

      const selectedItemDetails = products.filter((product) => product.itemId == selectedItemToEdit)[0];
      let selectedItemDetailsRetail = null;
      if (hasRetailVersion) {
        selectedItemDetailsRetail = products.filter((product) => product.itemId == selectedItemToEdit + '-RET')[0];
      }

      setItemID(selectedItemDetails.itemId);
      setItemName(selectedItemDetails.itemName);
      setUnit(selectedItemDetails.unit);
      setPrice(selectedItemDetails.price);
      setDescription(selectedItemDetails.description);
      setWeight(selectedItemDetails.weight);
      setDimensions(selectedItemDetails.dimensions);
      setCategory(selectedItemDetails.category);
      setBrand(selectedItemDetails.brand);
      setPieces(selectedItemDetails.pieces);
      setColor(selectedItemDetails.color);
      setMaterial(selectedItemDetails.material);
      setSize(selectedItemDetails.size);
      setIsThisRetail(hasRetailVersion);
      setPacksPerBox(selectedItemDetails.packsPerBox);
      setPiecesPerPack(selectedItemDetails.piecesPerPack);
      setCostPrice(selectedItemDetails.costPrice);
      setCbm(selectedItemDetails.cbm);
      setForOnlineStore(selectedItemDetails.forOnlineStore);

      if (selectedItemDetails.boxImage == null) {
        setBoxImage('');
      } else {
        setBoxImage(selectedItemDetails.boxImage);
      }

      if (selectedItemDetails.imageLinks[0]) {
        setImageLink1(selectedItemDetails.imageLinks[0]);
      } else {
        setImageLink1('');
      }

      if (selectedItemDetails.imageLinks[1]) {
        setImageLink2(selectedItemDetails.imageLinks[1]);
      } else {
        setImageLink2('');
      }

      if (selectedItemDetails.imageLinks[2]) {
        setImageLink3(selectedItemDetails.imageLinks[2]);
      } else {
        setImageLink3('');
      }

      if (selectedItemDetails.imageLinks[3]) {
        setImageLink4(selectedItemDetails.imageLinks[3]);
      } else {
        setImageLink4('');
      }

      if (selectedItemDetails.imageLinks[4]) {
        setImageLink5(selectedItemDetails.imageLinks[4]);
      } else {
        setImageLink5('');
      }

      if (selectedItemDetails.imageLinks[5]) {
        setImageLink6(selectedItemDetails.imageLinks[5]);
      } else {
        setImageLink6('');
      }

      if (selectedItemDetails.imageLinks[6]) {
        setImageLink7(selectedItemDetails.imageLinks[6]);
      } else {
        setImageLink7('');
      }

      if (selectedItemDetails.imageLinks[7]) {
        setImageLink8(selectedItemDetails.imageLinks[7]);
      } else {
        setImageLink8('');
      }

      if (selectedItemDetails.imageLinks[8]) {
        setImageLink9(selectedItemDetails.imageLinks[8]);
      } else {
        setImageLink9('');
      }

      if (selectedItemDetails.imageLinks[9]) {
        setImageLink10(selectedItemDetails.imageLinks[9]);
      } else {
        setImageLink10('');
      }

      if (hasRetailVersion) {
        setRetailPrice(selectedItemDetailsRetail.price);
        setPackWeight(selectedItemDetailsRetail.weight);
      }
    }
  }, [selectedItemToEdit]);

  return (
    <>
      {rules.checkIfUserAuthorized('addItem') ? (
        <div className="flex justify-center py-5 ">
          <div className="flex flex-col space-y-5 w-9/10 lg:w-1/2 xl:w-1/2 2xl:w-1/2 mt-5 ">
            {addOrEditItem == 'Edit' ? (
              <Autocomplete
                onChange={(event, newValue) => {
                  const selectedProduct = products.filter(
                    (product) => product.itemName == newValue && product.unit != 'Pack'
                  );
                  const id = selectedProduct[0].itemId;
                  setSelectedItemToEdit(id);
                }}
                disablePortal
                id="combo-box-demo"
                options={productNames.sort()}
                sx={{ width: 'fullWidth' }}
                renderInput={(params) => <TextField {...params} label="Item Name" />}
              />
            ) : <TextField
            required
            disabled={addOrEditItem == 'Edit' ? true : false}
            id="outlined-basic123"
            label="Item Name"
            variant="outlined"
            sx={{ marginTop: 3 }}
            value={itemName}
            onChange={(event) => {
              setItemName(event.target.value);
            }}
          />}

            <TextField
              required
              disabled={addOrEditItem == 'Edit' ? true : false}
              id="outlined-basic123"
              label="Item ID"
              variant="outlined"
              sx={{ marginTop: 3 }}
              value={itemID}
              onChange={(event) => {
                setItemID(event.target.value);
              }}
            />

            <TextField
              required
              id="outlined-basic"
              label="Price"
              variant="outlined"
              value={price}
              onChange={(event) => {
                setPrice(event.target.value);
              }}
            />
            <TextField
              required
              id="outlined-basic"
              label="Cost Price"
              variant="outlined"
              value={costPrice}
              onChange={(event) => setCostPrice(event.target.value)}
            />

            <TextField
              required
              id="outlined-basic"
              label="Weight"
              variant="outlined"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
            {addOrEditItem == 'Add' ? (
              <TextField
                required
                id="outlined-basic"
                label="Starting Inventory"
                variant="outlined"
                value={startingInventory}
                onChange={(event) => setStartingInventory(event.target.value)}
              />
            ) : null}

            <TextField
              required
              id="outlined-basic"
              label="Pieces"
              variant="outlined"
              value={pieces}
              onChange={(event) => setPieces(event.target.value)}
            />

            <TextField
              required
              id="outlined-basic"
              label="Packs Per Box"
              variant="outlined"
              value={packsPerBox}
              onChange={(event) => setPacksPerBox(event.target.value)}
            />
            <TextField
              required
              id="outlined-basic"
              label="Pieces Per Pack"
              variant="outlined"
              sx={{ mt: 3 }}
              value={piecesPerPack}
              onChange={(event) => setPiecesPerPack(event.target.value)}
            />

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
            {addOrEditItem == 'Add' ? (
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
            ) : null}

            {manufactured ? (
              <>
                Which machines can produce this product?
                {machines.map((machine) => {
                  if (machine.machineName == '') {
                    return;
                  }

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
              label="Box Dimensions"
              variant="outlined"
              value={dimensions}
              onChange={(event) => setDimensions(event.target.value)}
            />
            <TextField
              disabled
              id="outlined-basic"
              label="Cubic Meter"
              variant="outlined"
              sx={{ mt: 3 }}
              onChange={(event) => setCbm(event.target.value)}
              value={cbm}
            />
            <TextField
              id="outlined-basic"
              label="Freight Cost"
              variant="outlined"
              sx={{ mt: 3 }}
              onChange={(event) => setFreightCost(event.target.value)}
              value={freightCost}
            />

            <TextField
              id="outlined-basic"
              label="Color"
              variant="outlined"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Material"
              variant="outlined"
              value={material}
              onChange={(event) => setMaterial(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Size"
              variant="outlined"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Brand"
              variant="outlined"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <div className="pt-5 gap-3 flex flex-row items-center">
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
                    {categories
                      ? categories.map((c) => {
                          if (c != 'Favorites') {
                            return <MenuItem value={c}>{c}</MenuItem>;
                          }
                        })
                      : null}
                    {/* <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
              <button
                onClick={onAddCategoryClick}
                className=" hover:bg-color10b bg-blue-500 text-white px-2 rounded-lg h-full"
              >
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
              <FormControlLabel
                control={
                  <Switch onChange={(event) => onRetailCheckBoxClick(event.target.checked)} checked={isThisRetail} />
                }
                label="Is this also for retail?"
              />
              {/* <Checkbox id='isret' checked={isThisRetail} onChange={(event) => onRetailCheckBoxClick(event.target.checked)} /> */}
              {/* <label htmlFor='isret' className='mt-2.5'> Is this also for retail?</label> */}
            </div>

            {isThisRetail ? (
              // <TextField
              //   id="outlined-basic"
              //   label="Parent Product ID (if for retail)"
              //   variant="outlined"
              //   sx={{ width: "90%" }}
              //   onChange={(event) => setParentProductID(event.target.value)}
              // />
              <div className="flex flex-col">
                <TextField
                  required
                  id="outlined-basic"
                  label="Retail Price"
                  variant="outlined"
                  sx={{ mt: 1 }}
                  value={retailPrice}
                  onChange={(event) => setRetailPrice(event.target.value)}
                />
                <TextField
                  required
                  id="outlined-basic"
                  label="Pack Weight"
                  variant="outlined"
                  sx={{ mt: 3 }}
                  value={packWeight}
                  onChange={(event) => setPackWeight(event.target.value)}
                />
              </div>
            ) : null}

            <div className="flex flex-row ">
              <FormControlLabel
                control={
                  <Switch
                    onClick={() => {
                      setIsCustomized(!isCustomized);
                    }}
                    checked={isCustomized}
                  />
                }
                label="Is this Customized?"
              />

              {/* <Checkbox
              id='iscustom'
              onClick={() => {
                setIsCustomized(!isCustomized);
              }}
              className='mb-8'
            />
            <label htmlFor="iscustom" className='mt-2.5'> Is this Customized?</label> */}
            </div>


            <div className="flex flex-row ">
              <FormControlLabel
                control={
                  <Switch
                    onClick={() => {
                      setForOnlineStore(!forOnlineStore);
                    }}
                    checked={forOnlineStore}
                  />
                }
                label="Is this For Online Store?"
              />
            </div>

            <div className=" w-full border-b border-dashed border-gray-400"></div>

            <div className="flex flex-row items-center gap-2 py-4 border-y border-dotted border-gray-400">
              <ImageUploadButton
                id={'boxImage'}
                folderName={'ProductImages/' + itemID}
                storage={storage}
                onUploadFunction={setBoxImage}
              />
              <TextField
                id="outlined-basic"
                label="boxImage"
                variant="outlined"
                sx={{ width: '90%' }}
                value={boxImage}
                onChange={(event) => setBoxImage(event.target.value)}
              />
            </div>

            <div className=" w-full border-b border-dashed border-gray-400"></div>

            <div className="flex flex-row items-center gap-2 pt-4">
              <ImageUploadButton
                id={'imageLink1'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink2'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink3'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink4'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink5'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink6'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink7'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink8'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink9'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex flex-row items-center gap-2">
              <ImageUploadButton
                id={'imageLink10'}
                folderName={'ProductImages/' + itemID}
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

            <div className="flex justify-between items-center ">
              <Button
                variant="contained"
                sx={{ height: 50, marginTop: 5, marginBottom: 10 }}
                className="w-2/5 lg:w-1/5 hover:bg-red-400"
                color="error"
                onClick={handleCancel}
              >
                {' '}
                Cancel
              </Button>
              {addOrEditItem == 'Add' ? (
                <Button
                  className="w-2/5 lg:w-1/5  hover:bg-color10b"
                  sx={{ height: 50, marginTop: 5, marginBottom: 10 }}
                  variant="contained"
                  onClick={addItem}
                >
                  {loading ? <CircularProgress size={30} style={{ color: 'white' }} /> : <>Add Item</>}
                </Button>
              ) : null}
              {addOrEditItem == 'Edit' ? (
                <Button
                  className="w-2/5 lg:w-1/5 hover:bg-color10b"
                  sx={{ height: 50, marginTop: 5, marginBottom: 10 }}
                  variant="contained"
                  onClick={editItem}
                >
                  {loading ? <CircularProgress size={30} style={{ color: 'white' }} /> : <>Edit Item</>}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : 'UNAUTHORIZED'}
    </>
  );
};

export default AdminAddOrEditItem;
