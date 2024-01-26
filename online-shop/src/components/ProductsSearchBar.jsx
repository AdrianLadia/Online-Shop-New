import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../AppContext';
import debounce from 'lodash/debounce';
import Fuse from 'fuse.js';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';



const ProductsSearchBar = ({
  setWholesale,
  setRetail,
  searchedItemId,
  setSearchedItemId,
  selectedName,
  setSelectedName,
}) => {
  const { searchedItemSwitch,setSearchedItemSwitch, firestore, categories, setCategoryValue, selectedCategory, setSelectedCategory } = useContext(AppContext);
  const [productsData, setProductsData] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [fuse, setFuse] = useState(null);

  // const [selectedProductCategory, setSelectedProductCategory] = useState('')

  // FUSE IS USED TO SEARCH FOR PRODUCTS WITH TYPO ERRORS
  // IT IS ALSO USED TO SEARCH FOR KEYWORDS NOT IN THE PRODUCT NAME
  useEffect(() => {

    if (productsData.length == 0) {
      return;
    }
    const fuse = new Fuse(productsData, {
      keys: ['name', 'category'], // THESE ARE THE KEYS THAT WILL BE SEARCHED
      threshold: 0.3,
      includeScore: true,
    });
    setFuse(fuse);
  }, [productsData]);

  useEffect(() => {

    if (categories != null) {
      categories.forEach((category, index) => {
        // This selects the category from the url or from the featured category
        // if there is a url we use the url, if not we use the featured categor
        if (selectedName != '') {
          if (category === selectedCategory) {
            setCategoryValue(index);
          }
        }
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    firestore.readProductsSearchIndex().then((data) => {
      setProductsData(data);
    });
  }, []);

  // useEffect(() => {
  //   const newProductNames = productsData.map((product) => [product.name, `  (${product.unit})`]);
  //   setProductNames(newProductNames);
  // }, [productsData]);

  useEffect(() => {
    return () => {
      deboucedOnSearch.cancel();
    };
  }, []);

  const deboucedOnSearch = debounce(function (event, value) {
    setSelectedName(value);
    let matchedProduct = false;
    productsData.forEach((product) => {
   
      if (value == product.name) {
        // console.log(value, product)
        matchedProduct = true;
        setSelectedCategory(product.category);
        setSearchedItemId(product.itemId);
        
      }
    });
    if (matchedProduct == false) {
      setSearchedItemId(null);
    }
  }, 500);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Autocomplete
          onChange={(event, value) => {
            deboucedOnSearch(event, value);
          }}

          noOptionsText={'No products found'}
          disablePortal
          ListboxProps={{ style: { maxHeight: 150 } }}
          value={selectedName}
          id="combo-box-demo"
          options={productNames}
          sx={{ width: 300, margin: 'auto', marginTop: '20px' }}
          renderInput={(params) => <TextField  className='bg-white' {...params} label="Search Item" />}
          filterOptions={(options, { inputValue }) => {
            try{
              const results = fuse.search(inputValue);
              return results.map((res) => res.item.name); // Convert back to array format for Autocomplete
            }
            catch{
              return options
            }
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default ProductsSearchBar;
