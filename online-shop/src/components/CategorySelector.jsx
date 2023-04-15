import React from 'react';
import CategoryButton from './CategoryButton';
import ProductList from './ProductList';
import { useState, useContext } from 'react';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CategorySelector = (props) => {
  const [value, setValue] = React.useState(4);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const setSelectedCategory = props.setSelectedCategory;

  const { firestore } = useContext(AppContext);

  const datamanipulation = new dataManipulation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const categories = await firestore.readAllCategories();
      const categoryList = datamanipulation.getCategoryList(categories)
      
      setCategories(categoryList);
    }
    fetchCategories();
  }, []);

  const featured_category = 'Paper Bag';

  useEffect(() => {
    setSelectedCategory(categories[value]);
  }, [value, categories]);

  // const sample = ['test','test2','test3', 'test4', 'test5']

  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: '#9bfab5',
  //     }
  //   },
  // });

  return (
    <ThemeProvider theme={theme}>
    <div className="w-full ">
      <div className="flex flex-col items-center from-colorbackground via-color2 to-color1">
        <div className="mt-5">
          {/* <typ className='text-2xl font-bold mt-5'>Categories</h1> */}
          <Typography sx={{ fontSize:"20px"}}>Select A Category</Typography>
        </div>
        {/* <div className="flex flex-row overflow-scroll">
          {categories.map((category, index) => {
            return <CategoryButton onCategoryClick={OnCategoryClick} category={category} key={index} />;
          })}
        </div> */}
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', justifyContent: 'center' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              {categories.map((category, index) => {
                return <Tab sx={{fontWeight:"bold"}} label={category} {...a11yProps(index)} />;
              })}
              {/* <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} /> */}
            </Tabs>
          </Box>
        </Box>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default CategorySelector;
