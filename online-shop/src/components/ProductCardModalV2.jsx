import React, { useEffect,useState,useContext } from 'react';
import ImageCarousel from './ImageCarousel';
import { Modal } from '@mui/material';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import ProductCardModalRadioButton from './ProductCardModalRadioButton';
import AppContext from '../AppContext';
import ProductCardModalTableV2 from './ProductCardModalTableV2';
import ProductCardModalAddToCart from './ProductCardModalAddToCart';

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

  //   '@media (min-width: 366px)': {
  //     p: 3,
  //   },

  //   '@media (min-width: 700px)': {
  //     width: '80%',
  //     p: 4,
  //   },

  //   '@media (min-width: 1024px)': {
  //     width: '60%',
  //     p: 5,
  //   },
};

const ProductCardModalV2 = ({setShakeCartAnimation,addtocart, product, setModal, modal,setOpenSnackbar }) => {
  const images = product.imageLinks;
  const { products } = useContext(AppContext);
  const retailData = product;
  const [wholesaleData, setWholesaleData] = useState(null);
  const [radioButtonSelected, setRadioButtonSelected] = useState('Pack');
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('productItemId', product.itemId);
    const wholesaleItemId = product.itemId.replace(/-RET$/, '');
    console.log('wholesaleItemId', wholesaleItemId);
    const find = products.find((product) => product.itemId === wholesaleItemId);
    setWholesaleData(find);
  }, [product]);

  const [itemDataSelected, setItemDataSelected] = useState(null); //this is the data of the item selected in the radio button

  useEffect(() => {
    console.log('wholesaleData', wholesaleData);
    console.log('retailData', retailData);
  }, [wholesaleData,retailData]);

  useEffect(() => {
    if (radioButtonSelected === 'Pack') {
      setItemDataSelected(retailData);
    } else {
      setItemDataSelected(wholesaleData);
    }
  }, [radioButtonSelected]);

  return (
    <>
      {wholesaleData ? (
        <Modal
          open={modal}
          onClose={() => {
            setModal(false);
          }}
        >
          <Fade in={modal}>
            <Box sx={style} className="bg-colorbackground border-color60 overflow-x-hidden overflow-y-auto">
              <ImageCarousel images={images} />

              <ProductCardModalRadioButton
                className={'ml-5 mt-2'}
                retailData={retailData}
                wholesaleData={wholesaleData}
                setRadioButtonSelected={setRadioButtonSelected}
                radioButtonSelected={radioButtonSelected}
              />
              <ProductCardModalTableV2
                radioButtonSelected={radioButtonSelected}
                wholesaleData={wholesaleData}
                retailData={retailData}
              />
              <ProductCardModalAddToCart setShakeCartAnimation={setShakeCartAnimation} setModal={setModal} addtocart={addtocart} count={count} setCount={setCount} itemData={itemDataSelected} setOpenSnackbar={setOpenSnackbar}/>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  );
};

export default ProductCardModalV2;
