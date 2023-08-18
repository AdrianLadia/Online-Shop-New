import React, { useEffect } from 'react'
import { useState,useContext } from 'react'
import CategorySelector from './CategorySelector'
import WholesaleOrRetail from './WholesaleOrRetail'
import ProductList from './ProductList'
import CountdownTimer from './CountDownTimer'
import OpeningSoonModal from './OpeningSoonModal'
import UnsupportedBrowserRedirect from './UnsupportedBrowserRedirect'
import AppContext from '../AppContext'
import { CircularProgress } from '@mui/material'
import useWindowDimensions from './UseWindowDimensions'

const Shop = () => {

  const {width} = useWindowDimensions();
  const [wholesale, setWholesale] = useState(false);
  const [retail, setRetail] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const {isSupportedBrowser,selectedCategory,setSelectedCategory,products} = useContext(AppContext);

  useEffect(() => {
    if (products != []) {
      setLoading(false);
    }
  }, [products]);

  return (
    <div className='flex flex-col w-full justify-center bg-gradient-to-r from-colorbackground via-color2 to-color1 '>
      {/* <OpeningSoonModal /> */}
      
      {/* <div className='flex flex-col w-full justify-center bg-green1'> */}
      {/* WHOLESALE RETAIL */}
      <WholesaleOrRetail setWholesale={setWholesale} setRetail={setRetail} wholesale={wholesale} retail={retail}/>
      {/* CATEGORY */}
      <CategorySelector setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory}/>
      {/* PRODUCTS */}

      {loading ? <div className='flex justify-center mt-24'>
        
        <CircularProgress size={200} /> 
        </div>
        :
      <ProductList  wholesale={wholesale} retail={retail} selectedCategory={selectedCategory} />
      
      }
    </div>
  )
}

export default Shop
