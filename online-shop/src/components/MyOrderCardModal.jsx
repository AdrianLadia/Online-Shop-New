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
    googleMapsApiKey: 'AIzaSyAM-GEFgvP7ge4_P15OOSjYslrC-Seroro',
  });

  const datamanipulation = new dataManipulation();
  const { storage, userId, cloudfirestore,userdata } = useContext(AppContext);
  const open = props.open;
  const handleClose = props.handleClose;
  const order = props.order;
  const orderDate = datamanipulation.convertDateTimeStampToDateString(order.orderDate);
  const [linkCount, setLinkCount] = useState(order.proofOfPaymentLink.length);

  const { width } = useWindowDimensions();
  const [screenMobile, setScreenSizeMobile] = useState(null);

  useEffect(() => {
    if (width < 550) {
      return setScreenSizeMobile(false);
    } else {
      return setScreenSizeMobile(true);
    }
  }, [width]);

  function getPaymentStatus(x, y, z) {
    if (order.paid) {
      return x;
    } else {
      if (linkCount > 0) {
        return y;
      }
      if (linkCount === 0) {
        return z;
      }
    }
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

            <MyOrderCardModalTable order={order} />

            <div className="mt-5 flex flex-col">
              <List
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                  marginLeft: -2,
                }}
              >
                <Divider />
                <ListItem>
                  <ListItemText primary="Items Total" secondary={order.itemsTotal} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="VAT" secondary={order.vat} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Shipping" secondary={order.shippingTotal} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Grand Total" secondary={order.grandTotal} />
                </ListItem>
                <Divider />
              </List>
            </div>

            <Typography variant="h7" fontFamily="roboto" sx={{ marginTop: 1 }}>
              Delivery Point
            </Typography>
            {isLoaded ? (
              <div className="mt-2 flex flex-col h-56">
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

              {order.proofOfPaymentLink.length > 0 ? (
                <ListItem>
                  <ListItemText primary="Payments Made" />
                </ListItem>
              ) : null}

              {order.proofOfPaymentLink.map((link) => {
                return (
                  <div className="w-full mb-10">
                    <Image imageUrl={link} />
                  </div>
                );
              })}
            </List>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default MyOrderCardModal;
