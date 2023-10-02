import React from 'react';
import { useState, useContext } from 'react';
import { useEffect, useRef } from 'react';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../colorPalette/MaterialUITheme';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppConfig from '../AppConfig';
import { set } from 'date-fns';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CategorySelector = (props) => {
  const location = useLocation();
  const featuredCategory = new AppConfig().getFeaturedCategory();

  const setSelectedCategory = props.setSelectedCategory;
  const selectedCategory = props.selectedCategory;
  const [categoryFromUrl, setCategoryFromUrl] = useState(null);
  const { firestore, categories, setCategories, categoryValue, setCategoryValue } = useContext(AppContext);
  const datamanipulation = new dataManipulation();
  const { wholesale, retail, setWholesale, setRetail, setCategorySelectorInView } = props;
  const [categoryClickCount, setCategoryClickCount] = useState(0);
  const myElement = useRef(null);

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
        let categoryToUse;

        if (categoryFromUrl != null) {
          categoryToUse = categoryFromUrl;
        } else {
          categoryToUse = featuredCategory;
        }

        if (category === categoryToUse) {
          setCategoryValue(index);
        }
      });
    }
  }, [categories, categoryFromUrl]);

  const handleChange = (event, newValue) => {
    if (wholesale == false && retail == false) {
      setRetail(true);
    }
    setCategoryValue(newValue);
  };

  useEffect(() => {
    if (categories != null && categoryValue != null) {
      setSelectedCategory(categories[categoryValue]);
      setCategoryClickCount(categoryClickCount + 1);
      if (categoryClickCount > 0) {
        console.log('clicked category')
      }
    }
  }, [categoryValue]);

  function isElementOutOfView(el) {
    if (!el) return true;

    const rect = el.getBoundingClientRect();

    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
  }

  useEffect(() => {}, []);

  useEffect(() => {
    const handleScroll = () => {
      if (myElement.current) {
        const outOfView = isElementOutOfView(myElement.current);
        setCategorySelectorInView(!outOfView);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // The empty dependency array ensures the useEffect runs once when the component mounts and not on every re-render.


  useEffect(() => {
    if (myElement.current) {
      const outOfView = isElementOutOfView(myElement.current);
      setCategorySelectorInView(!outOfView);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div ref={myElement} className="w-full">
        {categories && categories[categoryValue] ? (
          <Helmet>
            <title>{categories[categoryValue]} - Star Pack: Packaging Supplies</title>
            <meta
              name="description"
              content={`Browse our selection of packaging supplies in the ${categories[categoryValue]} category.`}
            />
          </Helmet>
        ) : null}
        <div className="flex flex-col items-center mt-5 from-colorbackground via-color2 to-color1">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', justifyContent: 'center' }}>
              <Tabs
                value={categoryValue}
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
