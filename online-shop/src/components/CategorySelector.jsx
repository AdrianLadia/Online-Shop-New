import React from 'react';
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import { useLocation } from 'react-router-dom';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CategorySelector = (props) => {
  const location = useLocation();
  const featuredCategory = 'Meal Box';
  const [value, setValue] = React.useState(null);
  const setSelectedCategory = props.setSelectedCategory;
  const [categoryFromUrl, setCategoryFromUrl] = useState(null);
  const { firestore, categories, setCategories } = useContext(AppContext);
  const datamanipulation = new dataManipulation();
  const hiddenCategories = [];

  useEffect(() => {
    // Function to extract the "category" parameter from the URL query string
    const getCategoryFromURL = () => {
      const params = new URLSearchParams(location.search);
      const category = params.get('category');
      setCategoryFromUrl(category);
      // You can now use the "category" value in your component logic
    };

    getCategoryFromURL();
  }, [location.search]);

  useEffect(() => {
    if (categories != null) {
      categories.forEach((category, index) => {

        // This selects the category from the url or from the featured category
        // if there is a url we use the url, if not we use the featured category
        let categoryToUse 
        console.log(categoryFromUrl)
        if (categoryFromUrl != null) {
          categoryToUse = categoryFromUrl
        }
        else {
          categoryToUse = featuredCategory
        }

        console.log('categoryToUse ',categoryToUse)

        if (category === categoryToUse) {
          setValue(index);
        }
      });
    }
  }, [categories,categoryFromUrl]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchCategories() {
      const categories = await firestore.readAllCategories();
      const categoryList = datamanipulation.getCategoryList(categories, hiddenCategories);
      setCategories(categoryList);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories != null) {
      setSelectedCategory(categories[value]);
    }
  }, [value, categories]);

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full">
        <div className="flex flex-col items-center mt-5 from-colorbackground via-color2 to-color1">
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
                {categories &&
                  categories.map((category, index) => {
                    return <Tab sx={{ fontWeight: 'bold' }} label={category} key={index} {...a11yProps(index)} />;
                  })}
              </Tabs>
            </Box>
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CategorySelector;
