import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AppContext from "../AppContext";
import GoogleMapsModalSelectSaveAddressButton from "./GoogleMapsModalSelectSaveAddressButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  height: "80%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  height: "auto",
  maxHeight: "80%",
  overflow: 'auto',

  "@media (min-width: 1024px)": {
    width: "50%",
  },

  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const GoogleMapsModalSelectSaveAddress = (props) => {
  const [
    userdata,
    setUserData,
    isadmin,
    firestore,
    cart,
    setCart,
    favoriteitems,
    setFavoriteItems,
    userId,
    setUserId,
    refreshUser,
    setRefreshUser,
    userLoaded,
    setUserLoaded,
    deliveryaddress,
    setDeliveryAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    userstate,
    setUserState,
    phonenumber,
    setPhoneNumber,
    orders,
    setOrders,
    payments,
    setPayments,
  ] = React.useContext(AppContext);

  const setLocalLatitude = props.setLocalLatitude
  const setLocalLongitude = props.setLocalLongitude  
  const setLocalDeliveryAddress = props.setLocalDeliveryAddress
  const setZoom = props.setZoom

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {userdata
            ? userdata.deliveryaddress.map((address, index) => {
                  return (
                    <GoogleMapsModalSelectSaveAddressButton
                      handleClose={props.handleClose}
                      address = {address.address}
                      savedlongitude={address.longitude}
                      savedlatitude={address.latitude}
                      setLocalLatitude={setLocalLatitude}
                      setLocalLongitude={setLocalLongitude}
                      setLocalDeliveryAddress={setLocalDeliveryAddress}
                      setZoom={setZoom}
                      
                    ></GoogleMapsModalSelectSaveAddressButton>
                  );
              })
            : <>Create an account to save</>}
            </Box>
      </Modal>
    </div>
  );
};

export default GoogleMapsModalSelectSaveAddress;
