import React, { useEffect } from 'react';
import { useState, useContext, useRef } from 'react';
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
import ProductsSearchBar from './ProductsSearchBar';

// Use `searchAlgolia` in your React component to get search results

const Shop = () => {
  const { width } = useWindowDimensions();
  const [wholesale, setWholesale] = useState(false);
  const [retail, setRetail] = useState(true);
  const [loading, setLoading] = useState(true);
  const [categorySelectorInView, setCategorySelectorInView] = useState(true);
  const [selectedName, setSelectedName] = useState('');
  const { fbclid, isSuperAdmin, selectedCategory, setSelectedCategory, products, analytics } = useContext(AppContext);
  // const wholesaleOrRetailRef = useRef();
  const categoryRef = useRef();
  const [shopHeroInView, setShopHeroInView] = useState(true);
  const [searchedItemId, setSearchedItemId] = useState(null);

  useEffect(() => {
    if (fbclid !== undefined && analytics.cloudFirestoreDb.fbclid !== undefined) {
      analytics.logOpenStorePageEvent();
    }
  }, [fbclid, analytics]);

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

      <ShopHero shopHeroInView={shopHeroInView} setShopHeroInView={setShopHeroInView} />


      {/* <div className='flex flex-col w-full justify-center bg-green1'> */}
      <ScrollTopButton
        categorySelectorInView={categorySelectorInView}
        // wholesaleOrRetailRef={wholesaleOrRetailRef}
        categoryRef={categoryRef}
        shopHeroInView={shopHeroInView}
      />

      {/* CATEGORY */}
      <CategorySelector
        categoryRef={categoryRef}
        setSearchedItemId={setSearchedItemId}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        setWholesale={setWholesale}
        wholesale={wholesale}
        setRetail={setRetail}
        retail={retail}
        setCategorySelectorInView={setCategorySelectorInView}
        setSelectedName={setSelectedName}
      />

      <ProductsSearchBar
        selectedName={selectedName}
        setSelectedName={setSelectedName}
        searchedItemId={searchedItemId}
        setSearchedItemId={setSearchedItemId}
        setSelectedCategory={setSelectedCategory}
        setWholesale={setWholesale}
        setRetail={setRetail}
      />

      {/* PRODUCTS */}

      {loading ? (
        <div className="flex justify-center mt-24">
          <CircularProgress size={200} />
        </div>
      ) : (
        <ProductList
          searchedItemId={searchedItemId}
          wholesale={wholesale}
          retail={retail}
          selectedCategory={selectedCategory}
        />
      )}
      {/* <AnnouncementNotification /> */}
    </div>
  );
};

export default Shop;
