import React, { useEffect, useState, useContext } from 'react';
import ImageCarousel from './ImageCarousel';
import { Modal } from '@mui/material';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import ProductCardModalRadioButton from './ProductCardModalRadioButton';
import AppContext from '../AppContext';
import ProductCardModalTableV2 from './ProductCardModalTableV2';
import ProductCardModalAddToCart from './ProductCardModalAddToCart';
import { set } from 'date-fns';
import { RiShareBoxLine } from 'react-icons/ri';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '90%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  overflowX: 'scroll',
  //   bgcolor: 'background.paper',
  //   border: '2px solid #000',
  boxShadow: 24,
  //   p: 1,
  //   borderRadius: '20px',

  '@media (min-width: 366px)': {},

  '@media (min-width: 700px)': {
    width: '50%',
  },

  '@media (min-width: 1024px)': {
    width: '20%',
  },
};

const ProductCardModalV2 = ({
  setShakeCartAnimation,
  addtocart,
  product,
  setModal,
  modal,
  setOpenSnackbar,
  modalSelected,
}) => {
  const images = product.imageLinks;
  const { alertSnackbar, setProducts, products, cloudfirestore, userdata } = useContext(AppContext);
  const retailData = product;
  const [wholesaleData, setWholesaleData] = useState(null);
  const [radioButtonSelected, setRadioButtonSelected] = useState('Pack');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const wholesaleItemId = product.itemId.replace(/-RET$/, '');
    const find = products.find((product) => product.itemId === wholesaleItemId);

    async function getRetailAndWholesaleDataOfModalProduct() {
      const wholesaleData = await cloudfirestore.readSelectedDataFromOnlineStore(wholesaleItemId);
      const reatailData = await cloudfirestore.readSelectedDataFromOnlineStore(product.itemId);
      setProducts([...products, wholesaleData, reatailData]);
      setWholesaleData(wholesaleData);
    }

    if (find === undefined) {
      getRetailAndWholesaleDataOfModalProduct();
    }

    setWholesaleData(find);
  }, [product, modal]);

  function onModalClose() {
    setModal(false);
    setCount(0);
  }

  function shareButton() {
    let affiliateId = null;
    if (userdata && userdata.affiliateId !== undefined) {
      affiliateId = userdata.affiliateId;
    }

    let url;
    if (affiliateId) {
      url = 'https://starpack.ph/shop?&affiliateId=' + affiliateId + '&modal=' + product.itemId  
    } else {
      url = 'https://starpack.ph/shop?modal=' + product.itemId;
    }

    navigator.clipboard.writeText(url);
    alertSnackbar('success', 'Link copied to clipboard');
  }

  return (
    <>
      {wholesaleData ? (
        <Modal open={modal} onClose={onModalClose}>
          <Fade in={modal}>
            <Box sx={style} className="bg-colorbackground border-color60 overflow-x-hidden overflow-y-auto">
              <button
                className="fixed top-2 right-2 p-2 bg-gray-200 rounded-full z-50 h-10 w-10  text-black "
                onClick={onModalClose}
                aria-label="Close slider"
              >
                {/* Replace with your icon or text */}X
              </button>
              <RiShareBoxLine
                className="fixed cursor-pointer top-2 left-2 p-2 bg-gray-200 rounded-full z-50 h-10 w-10  text-black"
                onClick={shareButton}
              />

              <ImageCarousel images={images} setModal={setModal} />

              <ProductCardModalRadioButton
                className={'ml-5 mt-2'}
                retailData={retailData}
                wholesaleData={wholesaleData}
                setRadioButtonSelected={setRadioButtonSelected}
                radioButtonSelected={radioButtonSelected}
                setCount={setCount}
              />
              <ProductCardModalTableV2
                radioButtonSelected={radioButtonSelected}
                wholesaleData={wholesaleData}
                retailData={retailData}
              />
              <ProductCardModalAddToCart
                setShakeCartAnimation={setShakeCartAnimation}
                setModal={setModal}
                addtocart={addtocart}
                count={count}
                setCount={setCount}
                retailData={retailData}
                wholesaleData={wholesaleData}
                radioButtonSelected={radioButtonSelected}
                setOpenSnackbar={setOpenSnackbar}
              />
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  );
};

export default ProductCardModalV2;
