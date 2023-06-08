import React, { useEffect } from 'react';
// import products from './product_info'
import { useContext, useState, createContext } from 'react';
import SelectedCategoryContext from './SelectedCategoryContext';
import ProductCard from './ProductCard';
import OpenCartButton from './OpenCartButton';
import { CartContext } from './CartContext';
import firestoredb from '../firestoredb';
import AppContext from '../AppContext';
import CircularProgress from '@mui/material/CircularProgress';
import dataManipulation from '../../utils/dataManipulation';
import businessCalculations from '../../utils/businessCalculations';
import cloudFirestoreDb from '../cloudFirestoreDb';
import UseWindowDimensions from './UseWindowDimensions';

const ProductList = (props) => {
  const wholesale = props.wholesale
  const retail = props.retail;
  const selectedCategory = props.selectedCategory;
  const datamanipulation = new dataManipulation();
  const businesscalculations = new businessCalculations();
  const cloudfirestoredb = new cloudFirestoreDb();

  const [productdataloading, setProductDataLoading] = useState(true);
  const { userdata, firestore, cart, setCart, favoriteitems, products, setProducts,updateCartInfo } = React.useContext(AppContext);
  const favorites = favoriteitems;
  const [shakeCartAnimation, setShakeCartAnimation] = useState(true);

  const { width } = UseWindowDimensions();

  useEffect(() => {
    if (products != []) {
      setProductDataLoading(false);}
  }, [products]);

  function RenderSelectedProducts(product_category) {
    const selected_products = datamanipulation.getAllProductsInCategory(
      products,
      product_category,
      wholesale,
      retail,
      favorites
    );
    return selected_products;
  }

  function AddToCart(item, quantity) {
    const newCart = businesscalculations.addToCartWithQuantity(item, quantity, cart);
    setCart(newCart);
  }

  useEffect(() => {
    if (cart != [] && userdata != null) {
      firestore.createUserCart(cart, userdata.uid);
    }
  }, [cart,updateCartInfo]);

  function divCssIfProductNoteLoaded() {
    if (productdataloading) {
      ('w-full');
    }
    if (productdataloading === false) {
      if (width < 640) {
        return 'grid ';
      }else if(width < 1070) {
        return 'grid grid-cols-2 ';
      }else if(width < 1500) {
        return 'grid grid-cols-3 ';
      }else if(width < 1921) {
        return 'grid grid-cols-4';
      }else{
        return 'grid grid-cols-5';
      }
    }
  }

  return (
    <div className='mb-16 mt-5'>
      <div id='productList' className={'flex justify-center ' + divCssIfProductNoteLoaded()}>
        {productdataloading ? (
          <div className="flex w-full justify-center items-center mt-40">
            <CircularProgress size={150} className="" />
          </div>
        ) : RenderSelectedProducts(selectedCategory).length === 0 && selectedCategory === 'Favorites' ? (
          <div className='flex flex-col align-center w-screen tracking-widest'>
              <h1 className="text-3xl font-bold text-center mt-10">No Favorites</h1>
              <h3 className="text-1xl font-bold text-center mt-10 mx-10">
              Add items to your favorites by clicking on the product card then clicking the heart icon
            </h3>
          </div>
        ) : (
          RenderSelectedProducts(selectedCategory).map((product, index) => {
            let stocksAvailable = null
            let averageSalesPerDay = null
            let product_chosen = null
            if (product.unit !== 'Bale') {
              product_chosen = product
              products.map((p, index) => {
                if (p.itemId == product.parentProductID) {
                  stocksAvailable = p.stocksAvailable;
                  averageSalesPerDay = p.averageSalesPerDay;
                }
              });
            }
            return (
              <div className='flex justify-evenly'>
                <ProductCard id={product.itemId} addtocart={AddToCart} product={product} showTutorial={product.forTutorial} setShakeCartAnimation={setShakeCartAnimation} stocksAvailable={stocksAvailable} averageSalesPerDay={averageSalesPerDay} />
              </div>
            );
          })
        )}
      </div>
      <OpenCartButton shakeCartAnimation={shakeCartAnimation} setShakeCartAnimation={setShakeCartAnimation} />
    </div>
  );
};

export default ProductList;
