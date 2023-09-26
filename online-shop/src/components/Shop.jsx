import React, { useEffect } from 'react';
import { useState, useContext,useRef } from 'react';
import CategorySelector from './CategorySelector';
import WholesaleOrRetail from './WholesaleOrRetail';
import ProductList from './ProductList';
import AppContext from '../AppContext';
import { CircularProgress, Typography } from '@mui/material';
import useWindowDimensions from './UseWindowDimensions';
import { Helmet } from 'react-helmet';
import ScrollTopButton from './ScrollTopButton';
import ReactPlayer from 'react-player';

const Shop = () => {
  const { width } = useWindowDimensions();
  const [wholesale, setWholesale] = useState(false);
  const [retail, setRetail] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categorySelectorInView, setCategorySelectorInView] = useState(true);
  const { isSupportedBrowser, selectedCategory, setSelectedCategory, products } = useContext(AppContext);
  const wholesaleOrRetailRef = useRef();

  useEffect(() => {
    if (products != []) {
      setLoading(false);
    }
  }, [products]);

  return (
    <div className="flex flex-col w-full justify-center bg-gradient-to-r from-colorbackground via-color2 to-color1 ">
      <Helmet>
        <meta
          name="description"
          content="Explore a wide range of packaging supplies at Star Pack. From Paper Bags to Meal Boxes, Plastic Containers, and more. Quality products at reasonable prices. Your one-stop packaging solution!"
        />
        <meta property="og:title" content="Shop Packaging Supplies - Star Pack: Quality, Service, & Value" />
        <meta
          property="og:description"
          content="Explore a wide range of packaging supplies at Star Pack. From Paper Bags to Meal BOxes, Plastic Containers, and more. Quality products at reasonable prices. Your one-stop packaging solution!"
        />
        <meta property="og:url" content="https://www.starpack.ph/shop" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Flogo%2Fstarpack.png?alt=media&token=e108388d-74f7-45a1-8344-9c6af612f053"
        />
      </Helmet>

      {/* <OpeningSoonModal /> */}
      {/* HOW TO ORDER */}
      <div className="flex w-full text-gray-700 flex-col gap-5 mt-5  justify-center">
        <Typography variant="h5"  className="text-center text font-bold">
          How to order
        </Typography>
        <div className="w-full flex justify-center">
          <ReactPlayer
            url="https://youtu.be/Gf_teseuqGE"
            controls={true}
            // ... other props
          />
        </div>
      </div>

      {/* <div className='flex flex-col w-full justify-center bg-green1'> */}
      <ScrollTopButton categorySelectorInView={categorySelectorInView} wholesaleOrRetailRef={wholesaleOrRetailRef} />
      {/* WHOLESALE RETAIL */}
      <WholesaleOrRetail wholesaleOrRetailRef={wholesaleOrRetailRef} setWholesale={setWholesale} setRetail={setRetail} wholesale={wholesale} retail={retail} />
      {/* CATEGORY */}
      <CategorySelector
      
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        setWholesale={setWholesale}
        wholesale={wholesale}
        setRetail={setRetail}
        retail={retail}
        setCategorySelectorInView={setCategorySelectorInView}
      />
      {/* PRODUCTS */}

      {loading ? (
        <div className="flex justify-center mt-24">
          <CircularProgress size={200} />
        </div>
      ) : (
        <ProductList wholesale={wholesale} retail={retail} selectedCategory={selectedCategory} />
      )}
    </div>
  );
};

export default Shop;
