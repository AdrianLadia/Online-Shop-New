import React from 'react'
import { useState } from 'react'
import CategorySelector from './CategorySelector'
import WholesaleOrRetail from './WholesaleOrRetail'
import ProductList from './ProductList'

const Shop = () => {

  const [wholesale, setWholesale] = useState(true);
  const [retail, setRetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Paper Bag');

  return (
    <div className='flex flex-col w-full justify-center bg-gradient-to-r from-colorbackground via-color2 to-color1 '>
      {/* <div className='flex flex-col w-full justify-center bg-green1'> */}
      {/* WHOLESALE RETAIL */}
      <WholesaleOrRetail setWholesale={setWholesale} setRetail={setRetail}/>
      {/* CATEGORY */}
      <CategorySelector setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory}/>
      {/* PRODUCTS */}
      <ProductList wholesale={wholesale} retail={retail} selectedCategory={selectedCategory} />
      {/* CART BUTTON */}
    </div>
  )
}

export default Shop
