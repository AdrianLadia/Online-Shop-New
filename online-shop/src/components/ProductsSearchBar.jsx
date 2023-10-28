import React from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../AppContext';
import debounce from 'lodash/debounce';

const ProductsSearchBar = ({setWholesale,setRetail,searchedItemId,setSearchedItemId,selectedName,setSelectedName}) => {

    const {firestore,categories,setCategoryValue,selectedCategory,setSelectedCategory} = useContext(AppContext);
    const [productsData, setProductsData] = useState([])
    const [productNames, setProductNames] = useState([])
    
    // const [selectedProductCategory, setSelectedProductCategory] = useState('')

    useEffect(() => {
        console.log('SELECTED CATEGORY')
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
            setProductsData(data)
        })
    }, [])

    useEffect(() => {
        const newProductNames = productsData.map(product => [product.name, `  (${product.unit})`]);
        setProductNames(newProductNames);
    }, [productsData]);
    

    useEffect(() => {
        return () => {
            deboucedOnSearch.cancel();
        };
    }, []);
    

    const deboucedOnSearch = debounce(
        function(event, value) {
            setSelectedName(value)
            const itemName = value[0];
            const itemUnit = value[1].slice(3, -1);
            console.log(itemName);
            console.log(itemUnit);
            let matchedProduct = false
            productsData.forEach((product) => {
                if (itemName == product.name && itemUnit == product.unit) {
                    matchedProduct = true
                    setSelectedCategory(product.category);
                    setSearchedItemId(product.itemId);
                    if (product.unit != 'Pack') {
                        setWholesale(true);
                        setRetail(false);
                    } else {
                        setWholesale(false);
                        setRetail(true);
                    }
                }
            });
            if (matchedProduct == false) {
                setSearchedItemId(null);
            }
        },500
    )
    


  return (
    <div>
      <Autocomplete
        onChange={(event, value) => {
            deboucedOnSearch(event, value)
        }}
        disablePortal
        value={selectedName}
        id="combo-box-demo"
        options={productNames}
        sx={{ width: 300, margin: 'auto', marginTop: '20px'  }}
        renderInput={(params) => <TextField {...params} label="Search Item" />}
      />
    </div>
  )
}

export default ProductsSearchBar
