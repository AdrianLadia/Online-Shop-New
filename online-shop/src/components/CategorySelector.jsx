import React from 'react';
import CategoryButton from './CategoryButton';
import ProductList from './ProductList';
import { useState, useContext } from 'react';
import SelectedCategoryContext from './SelectedCategoryContext';
import { Typography } from '@mui/material';
import firestoredb from '../firestoredb';
import { useEffect } from 'react';
import dataManipulation from '../../utils/dataManipulation';
import AppContext from '../AppContext';

const CategorySelector = () => {

  const {
    firestore,
   } = useContext(AppContext);

  const datamanipulation = new dataManipulation()
  const [categories, setCategories] = useState([]);
  const [wholesale, setWholesale] = useState(true);
  const [retail, setRetail] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const categories = await firestore.readAllCategories();
      const categoryList = datamanipulation.getCategoryList(categories)
      setCategories(categoryList);
    }
    fetchCategories();
  }, []);

  const featured_category = 'Paper Bag';
  const [selectedCategory, setSelectedCategory] = useState(featured_category);

  function OnCategoryClick(props) {
    setSelectedCategory(props);
  }

  function onWholesaleClick() {
    setWholesale(true);
    setRetail(false);
  }

  function onRetailClick() {
    setWholesale(false);
    setRetail(true);
  }

  return (
    <div className="w-full">
      <div className="bg-green-300  flex justify-center">
        <button
          onClick={onWholesaleClick}
          className=" mr-2 mt-5 flex-none w-auto p-3 border rounded-full bg-green-100 lg:w-40 hover:bg-green-500 hover:animate-pulse"
        >
          Wholesale
        </button>
        <button
          onClick={onRetailClick}
          className="mt-5 flex-none w-auto p-3 border rounded-full bg-green-100 lg:w-40 hover:bg-green-500 hover:animate-pulse"
        >
          Retail
        </button>
      </div>
      <div className="flex flex-col items-center bg-green-300">
        <div className="mt-5">
          {/* <typ className='text-2xl font-bold mt-5'>Categories</h1> */}
          <Typography>Select A Category</Typography>
        </div>
        <div className="flex flex-row overflow-x-auto mt-3">
          {categories.map((category, index) => {
            return <CategoryButton onCategoryClick={OnCategoryClick} category={category} key={index} />;
          })}
        </div>
      </div>

      <SelectedCategoryContext.Provider value={[selectedCategory, wholesale, retail]}>
        <div>
          <ProductList />
        </div>
      </SelectedCategoryContext.Provider>
    </div>
  );
};

export default CategorySelector;
