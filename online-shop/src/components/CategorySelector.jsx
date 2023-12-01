import React from 'react';
import { useState, useContext } from 'react';
import { useEffect, useRef } from 'react';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
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
  const setSearchedItemId = props.setSearchedItemId;
  const setSelectedCategory = props.setSelectedCategory;
  const selectedCategory = props.selectedCategory;
  const setSelectedName = props.setSelectedName;
  const categoryRef = props.categoryRef;
  const [categoryFromUrl, setCategoryFromUrl] = useState(null);
  const { analytics, firestore, categories, setCategories, categoryValue, setCategoryValue, datamanipulation } =
    useContext(AppContext);
  const { wholesale, retail, setWholesale, setRetail, setCategorySelectorInView } = props;
  const [categoryClickCount, setCategoryClickCount] = useState(0);


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
          setSearchedItemId(null);
          setSelectedName('');
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
        analytics.logChangeCategoryEvent(categories[categoryValue]);
      }
    }
  }, [categoryValue]);

  function isElementOutOfView(el) {
    if (!el) return true;

    const rect = el.getBoundingClientRect();

    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (categoryRef.current) {
        const outOfView = isElementOutOfView(categoryRef.current);
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
    if (categoryRef.current) {
      const outOfView = isElementOutOfView(categoryRef.current);
      setCategorySelectorInView(!outOfView);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div ref={categoryRef} className="w-full h-full">
        {categories && categories[categoryValue] ? (
          <Helmet>
            <title>{categories[categoryValue]} - Star Pack: Packaging Supplies</title>
            <meta
              name="description"
              content={`Browse our selection of packaging supplies in the ${categories[categoryValue]} category.`}
            />
          </Helmet>
        ) : null}
        <div className="flex flex-col h-full items-center mt-5 from-colorbackground via-color2 to-color1">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider', justifyContent: 'center' }}>
              <Tabs
                sx={{
                  [`& .${tabsClasses.scrollButtons}`]: {
                    '&.Mui-disabled': { opacity: 0.3 },
                  },
                }}
                value={categoryValue}
                onChange={handleChange}
                aria-label="basic tabs example"
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
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
