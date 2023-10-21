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
import ShopHero from './ShopHero';
import AnnouncementNotification from './AnnouncementNotification';


const Shop = () => {
  const { width } = useWindowDimensions();
  const [wholesale, setWholesale] = useState(false);
  const [retail, setRetail] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categorySelectorInView, setCategorySelectorInView] = useState(true);
  const {fbclid, isSupportedBrowser, selectedCategory, setSelectedCategory, products,analytics } = useContext(AppContext);
  const wholesaleOrRetailRef = useRef();
  const [shopHeroInView, setShopHeroInView] = useState(true);



   useEffect(() => {
    if (fbclid !== undefined && analytics.cloudFirestoreDb.fbclid !== undefined) {
      analytics.logOpenStorePageEvent()
    }
  }, [fbclid,analytics]);

  useEffect(() => {
    if (products != []) {
      setLoading(false);
    }
  }, [products]);

  return (
    <div className="flex flex-col w-full justify-center h-full ">
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
      <ShopHero shopHeroInView={shopHeroInView} setShopHeroInView={setShopHeroInView} />
      

      {/* <div className='flex flex-col w-full justify-center bg-green1'> */}
      <ScrollTopButton categorySelectorInView={categorySelectorInView} wholesaleOrRetailRef={wholesaleOrRetailRef} shopHeroInView={shopHeroInView}/>
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
      <AnnouncementNotification/>
    </div>
  );
};

export default Shop;
