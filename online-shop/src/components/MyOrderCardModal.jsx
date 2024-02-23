import React, { useEffect, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MyOrderCardModalTable from './MyOrderCardModalTable';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { GoogleMap, MarkerF, useLoadScript } from '@react-google-maps/api';
import AppContext from '../AppContext';
import dataManipulation from '../../utils/dataManipulation';
import useWindowDimensions from './UseWindowDimensions';
import Image from './ImageComponents/Image';
import firebaseConfig from '../firebase_config';
import isUrl from '../../utils/isUrl';
import DeliveryReceipt from './DeliveryReceipt';

const MyOrderCardModal = (props) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '80%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    overflow: 'scroll',

    '@media (min-width: 1024px)': {
      width: '60%',
    },

    bgcolor: 'background.paper',
    border: '2px solid #69b05c',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  let { isLoaded } = useLoadScript({
    googleMapsApiKey: firebaseConfig.apiKey,
  });

  const hidePricing = props.hidePricing;
  const { datamanipulation, cloudfirestore } = useContext(AppContext);
  const open = props.open;
  const handleClose = props.handleClose;
  const order = props.order;
  const firstOrderDiscount = order.firstOrderDiscount;

  const orderDate = datamanipulation.convertDateTimeStampToDateString(order.orderDate);
  const [linkCount, setLinkCount] = useState(order.proofOfPaymentLink.length);
  const { width } = useWindowDimensions();
  const [screenMobile, setScreenSizeMobile] = useState(null);
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    const fetchCartProductsData = async () => {
      const cartProductPromises = Object.keys(order.cart).map(async (key) => {
        const productData = await cloudfirestore.readSelectedDataFromOnlineStore(key);
        return productData;
      });

      const data = await Promise.all(cartProductPromises);
      console.log('data', data);
      const productsCombined = data;

      console.log('productsCombined', productsCombined);
      setProducts(productsCombined);
    };

    fetchCartProductsData();
  }, [order]);

  useEffect(() => {
    if (width < 550) {
      return setScreenSizeMobile(false);
    } else {
      return setScreenSizeMobile(true);
    }
  }, [width]);

  function countOrderProofOfPaymentLinks() {
    let count = 0;
    order.proofOfPaymentLink.map((link) => {
      if (isUrl(link)) {
        count++;
      }
    });
    return count;
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="overflow-x-hidden">
          <div className="flex flex-col justify-center p-0 md:p-6">
            <div className="flex flex-row w-full justify-evenly ">
              <div className="w-full">
                <Typography
                  color={order.paid ? 'green' : 'red'}
                  fontFamily="roboto"
                  // variant="h5"
                  className="text-lg xs:text-2xl"
                >
                  {order.paid ? (
                    'Paid'
                  ) : (
                    <div className="flex flex-col gap-1 md:flex-row justify-start">
                      <a className="">Unpaid</a>
                    </div>
                  )}
                </Typography>
              </div>

              <div className="w-3/4 text-end ">
                <Typography
                  color={order.delivered ? 'green' : 'red'}
                  fontFamily="roboto"
                  // variant="h5"
                  className="text-lg xs:text-2xl"
                >
                  {order.delivered ? 'Delivered' : 'Not Delivered'}
                </Typography>
              </div>
            </div>

            <div className="w-full border-t-2 mt-4" />

            <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                marginLeft: -2,
              }}
            >
              <ListItem>
                <ListItemText primary="Order Reference Number" secondary={order.reference} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Order Date" secondary={order != [] ? orderDate : null} />
              </ListItem>
              <Divider />
            </List>

            <div className="flex mt-2 mb-2">
              <Typography variant="h7" fontFamily="roboto">
                Orders
              </Typography>
            </div>

            <MyOrderCardModalTable id={order.id} key={order.id} order={order} products={products} />

            <div className="mt-5 flex flex-col">
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  marginLeft: -2,
                }}
              >
                <Divider />

                {hidePricing ? null : (
                  <ListItem>
                    <ListItemText
                      primary="Items Total"
                      secondary={'₱' + (order.itemsTotal + order.vat).toLocaleString()}
                    />
                  </ListItem>
                )}
                <Divider />
                <Divider />
                {hidePricing ? null : (
                  <ListItem>
                    <ListItemText primary="Shipping" secondary={'₱' + order.shippingTotal.toLocaleString()} />
                  </ListItem>
                )}
                <Divider />
                {hidePricing ? null : firstOrderDiscount == undefined || firstOrderDiscount == 0 ? null : (
                  <ListItem>
                    <ListItemText primary="First Order Discount" secondary={'₱' + firstOrderDiscount} />
                  </ListItem>
                )}
                {hidePricing ? null : (
                  <ListItem>
                    <ListItemText primary="Grand Total" secondary={'₱' + order.grandTotal.toLocaleString()} />
                  </ListItem>
                )}
                <Divider />
              </List>
            </div>

            <Typography variant="h7" fontFamily="roboto" sx={{ marginTop: 1 }}>
              Delivery Point
            </Typography>
            {isLoaded ? (
              <div className="mt-2 flex flex-col h-96">
                <GoogleMap
                  clickableIcons={false}
                  zoom={16}
                  center={{ lat: order.deliveryAddressLatitude, lng: order.deliveryAddressLongitude }}
                  mapContainerClassName="w-full h-[calc(100vh-200px)]"
                  disableDefaultUI={true}
                  mapTypeControl={false}
                >
                  <MarkerF position={{ lat: order.deliveryAddressLatitude, lng: order.deliveryAddressLongitude }} />
                </GoogleMap>
              </div>
            ) : null}

            <List
              sx={{
                width: '100%',
                bgcolor: 'background.paper',
                marginLeft: -2,
              }}
            >
              <Divider />
              <ListItem>
                <ListItemText primary="Address" secondary={order.deliveryAddress} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Contact Person" secondary={order.contactName} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Contact Number" secondary={order.contactPhoneNumber} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Delivery Notes" secondary={order.deliveryNotes} />
              </ListItem>
              <Divider />

              {countOrderProofOfPaymentLinks() > 0 ? (
                <ListItem>
                  <ListItemText primary="Payments Made" />
                </ListItem>
              ) : null}

              {order.proofOfPaymentLink.map((link) => {
                if (!isUrl(link)) {
                  return;
                }
                if (hidePricing) {
                  return;
                }
                return (
                  <div className="w-full mb-10">
                    <Image imageUrl={link} />
                  </div>
                );
              })}

              <Divider />

              {order.proofOfDeliveryLink.length > 0 ? (
                <ListItem>
                  <ListItemText primary="Delivery Proof" />
                </ListItem>
              ) : null}

              {order.proofOfDeliveryLink.map((link) => {
                return (
                  <div className="w-full mb-10">
                    <Image imageUrl={link} />
                  </div>
                );
              })}
            </List>
          </div>
          <div className="flex justify-center">
            <DeliveryReceipt order={order} products={products} />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default MyOrderCardModal;
