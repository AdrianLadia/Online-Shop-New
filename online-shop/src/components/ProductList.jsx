import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import OpenCartButton from './OpenCartButton';
import AppContext from '../AppContext';
import CircularProgress from '@mui/material/CircularProgress';
import UseWindowDimensions from './UseWindowDimensions';
import storeProductsOrganizer from '../../utils/classes/storeProductsOrganizer';
import ProductCardModal from './ProductCardModal';
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import ProductCardV2 from './ProductCardV2';
import ProductCardModalV2 from './ProductCardModalV2';

const ProductList = (props) => {
  const wholesale = props.wholesale;
  const retail = props.retail;
  const searchedItemId = props.searchedItemId;
  const selectedCategory = props.selectedCategory;
  const [isWholesale, setIsWholesale] = useState(false);
  const [modal, setModal] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const modalSelected = query.get('modal') + location.hash;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (wholesale) {
      setIsWholesale(true);
    }
    if (retail) {
      setIsWholesale(false);
    }
  }, [wholesale, retail]);

  const [productdataloading, setProductDataLoading] = useState(true);
  const {
    datamanipulation,
    businesscalculations,
    alertSnackbar,
    userdata,
    firestore,
    cart,
    setCart,
    favoriteitems,
    products,
    updateCartInfo,
    cloudfirestore,
    isAdmin,
    isSuperAdmin,
  } = React.useContext(AppContext);
  const [shakeCartAnimation, setShakeCartAnimation] = useState(true);
  const [clickedProduct, setClickedProduct] = useState(null);

  const { width } = UseWindowDimensions();

  useEffect(() => {
    if (modalSelected != null) {
      cloudfirestore.readSelectedDataFromOnlineStore(modalSelected).then((data) => {
        setClickedProduct(data);
        setModal(true);
      });
    }
  }, [modalSelected]);
  useEffect(() => {
    if (products != []) {
      setProductDataLoading(false);
    }
  }, [products]);

  function RenderSelectedProducts(product_category) {
    const selected_products = datamanipulation.getAllProductsInCategory(
      products,
      product_category,
      wholesale,
      retail,
      favoriteitems
    );
    const spo = new storeProductsOrganizer(selected_products, searchedItemId);
    const organizedProducts = spo.runMain();
    return organizedProducts;
  }

  function AddToCart(item, quantity) {
    const newCart = businesscalculations.addToCartWithQuantity(item, quantity, cart);
    setCart(newCart);
    console.log('newCart', newCart);
  }

  useEffect(() => {
    if (cart != [] && userdata != null) {
      try {
        firestore.createUserCart(cart, userdata.uid);
      } catch (e) {
        alertSnackbar('error', 'Failed to update cart info. Please try again.');
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, updateCartInfo]);

  function divCssIfProductNoteLoaded() {
    if (productdataloading) {
      ('w-full');
    }
    if (productdataloading === false) {
      if (width < 640) {
        return 'grid ';
      } else if (width < 1070) {
        return 'grid grid-cols-2 ';
      } else if (width < 1500) {
        return 'grid grid-cols-3 ';
      } else if (width < 1921) {
        return 'grid grid-cols-4';
      } else {
        return 'grid grid-cols-5';
      }
    }
  }

  function isLastRow(index) {
    if (width < 640) {
    } else if (width < 1070) {
      return 'grid grid-cols-2 ';
    } else if (width < 1500) {
      return 'grid grid-cols-3 ';
    } else if (width < 1921) {
      return 'grid grid-cols-4';
    } else {
      return 'grid grid-cols-5';
    }
  }

  function isAdminOrSuperAdmin() {
    if (isAdmin || isSuperAdmin) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className=" mt-5 mb-40 h-screen">
      <div id="productList" className={'flex justify-center ' + divCssIfProductNoteLoaded()}>
        {productdataloading ? (
          <div className="flex w-full justify-center items-center mt-40">
            <CircularProgress size={150} className="" />
          </div>
        ) : RenderSelectedProducts(selectedCategory).length === 0 && selectedCategory === 'Favorites' ? (
          <div className="flex flex-col align-center w-screen tracking-widest">
            <h1 className="text-3xl font-bold text-center mt-10">No Favorites</h1>
            <h3 className="text-1xl font-bold text-center mt-10 mx-10">
              Add items to your favorites by clicking on the product card then clicking the heart icon
            </h3>
          </div>
        ) : (
          RenderSelectedProducts(selectedCategory).map((product, index) => {
            let isLastItem = index === RenderSelectedProducts(selectedCategory).length - 1;

            let stocksAvailable = null;
            let averageSalesPerDay = null;
            let product_chosen = null;
            if (product.unit !== 'Bale') {
              product_chosen = product;
              products.map((p, index) => {
                stocksAvailable = p.stocksAvailable;

                if (p.itemId == product.parentProductID) {
                  averageSalesPerDay = p.averageSalesPerDay;
                }
              });
            }

            // if ()

            if (!isAdminOrSuperAdmin()) {
              if (product.imageLinks[0] == null) {
                return;
              }
            }

            return (
              <div key={product.itemId} className={'flex justify-evenly '}>
                <ProductCardV2
                  itemData={product}
                  setModal={setModal}
                  setClickedProduct={setClickedProduct}
                  openSnackbar={openSnackbar}
                  setOpenSnackbar={setOpenSnackbar}
                  isLastItem={isLastItem}
                />
                {/* <ProductCard
                  setClickedProduct={setClickedProduct}
                  setModal={setModal}
                  id={product.itemId}
                  addtocart={AddToCart}
                  isWholesale={isWholesale}
                  product={product}
                  showTutorial={product.forTutorial}
                  setShakeCartAnimation={setShakeCartAnimation}
                  stocksAvailable={product.stocksAvailable}
                  averageSalesPerDay={averageSalesPerDay}
                  isLastItem={isLastItem}
                /> */}
              </div>
            );
          })
        )}
      </div>

      <div className="h-20" />
      <OpenCartButton shakeCartAnimation={shakeCartAnimation} setShakeCartAnimation={setShakeCartAnimation} />
      {/* {clickedProduct != null ? <ProductCardModal modal={modal} setModal={setModal} product={clickedProduct} /> : null} */}
      {clickedProduct != null ? (
        <ProductCardModalV2
          modal={modal}
          setModal={setModal}
          product={clickedProduct}
          openSnackbar={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          addtocart={AddToCart}
          setShakeCartAnimation={setShakeCartAnimation}
        />
      ) : null}
    </div>
  );
};

export default ProductList;
