import React, { useEffect } from 'react';
// import products from './product_info'
import { useContext, useState, createContext } from 'react';
import SelectedCategoryContext from './SelectedCategoryContext';
import ProductCard from './ProductCard';
import OpenCartButton from './OpenCartButton';
import { CartContext } from './CartContext';
import firestoredb from './firestoredb';
import AppContext from '../AppContext';
import CircularProgress from '@mui/material/CircularProgress';
import dataManipulation from '../../utils/dataManipulation';
import businessCalculations from '../../utils/businessCalculations';

const ProductList = () => {
  const datamanipulation = new dataManipulation();
  const businesscalculations = new businessCalculations();
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selected, wholesale, retail] = useContext(SelectedCategoryContext);
  const [productdataloading, setProductDataLoading] = useState(true);
  // const [cart, setCart] = useState([])
  const {
    userdata,
    firestore,
    cart,
    setCart,
    favoriteitems,
 } = React.useContext(AppContext);
  const favorites = favoriteitems;

  useEffect(() => {
    firestore.readAllProducts().then((products) => {
      setProducts(products);
      setProductDataLoading(false);
    });
  }, [refresh]);

  function RenderSelectedProducts(product_category) {
    const selected_products = datamanipulation.getAllProductsInCategory(products, product_category,wholesale,retail,favorites);
    return selected_products;
  }

  function AddToCart(item, quantity) {
    const newCart = businesscalculations.addToCartWithQuantity(item,quantity,cart)
    setCart(newCart);
  }

  useEffect(() => {
    if (cart != [] && userdata != null) {
      firestore.createUserCart(cart, userdata.uid);
    }
  }, [cart]);

  function divCssIfProductNoteLoaded() {
    if (productdataloading) {
      ('w-full');
    }
    if (productdataloading === false) {
      return 'lg:grid lg:grid-cols-3 lg:ml-10 md:grid md:grid-cols-2 xl:grid xl:grid-cols-4 2xl:grid 2xl:grid-cols-5';
    }
  }

  return (
    <div>
      <div className={'flex flex-col justify-center items-center  ' + divCssIfProductNoteLoaded()}>
        {productdataloading ? (
          <div className="flex w-full justify-center items-center mt-40">
            <CircularProgress size={150} className="" />
          </div>
        ) : RenderSelectedProducts(selected).length === 0 && selected === 'Favorites' ? (
          <div>
            <h1 className="text-3xl font-bold text-center mt-10">No Favorites</h1>
            <h3 className="text-1xl font-bold text-center mt-10 mx-10">
              Add items to your favorites by clicking on the product card then clicking the heart icon
            </h3>
          </div>
        ) : (
          RenderSelectedProducts(selected).map((product, index) => {
            return (
              <div>
                <ProductCard addtocart={AddToCart} product={product} key={'productCard-' + product.itemid} />
              </div>
            );
          })
        )}
      </div>
      <CartContext.Provider value={[cart, setCart, products]}>
        <OpenCartButton />
      </CartContext.Provider>
    </div>
  );
};

export default ProductList;
