import React from 'react'
import { useState,useContext } from 'react'
import CategorySelector from './CategorySelector'
import WholesaleOrRetail from './WholesaleOrRetail'
import ProductList from './ProductList'
import CountdownTimer from './CountDownTimer'
import OpeningSoonModal from './OpeningSoonModal'
import UnsupportedBrowserRedirect from './UnsupportedBrowserRedirect'
import AppContext from '../AppContext'

const Shop = () => {

  const [wholesale, setWholesale] = useState(false);
  const [retail, setRetail] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Paper Bag');
  const {isSupportedBrowser} = useContext(AppContext);

  return (
    <div className='flex flex-col w-full justify-center bg-gradient-to-r from-colorbackground via-color2 to-color1 '>
      {/* <OpeningSoonModal /> */}
      <UnsupportedBrowserRedirect isSupportedBrowser={isSupportedBrowser}/>
      {/* <div className='flex flex-col w-full justify-center bg-green1'> */}
      {/* WHOLESALE RETAIL */}
      {/* <WholesaleOrRetail setWholesale={setWholesale} setRetail={setRetail}/> */}
      {/* CATEGORY */}
      <CategorySelector setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory}/>
      {/* PRODUCTS */}
      <ProductList key={'ProductList'} wholesale={wholesale} retail={retail} selectedCategory={selectedCategory} />
    </div>
  )
}

export default Shop
