import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MyOrderCardModalTable from "./MyOrderCardModalTable";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";

const MyOrderCardModal = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "80%",
    transform: "translate(-50%, -50%)",
    width: "95%",
    overflow: "scroll",

    "@media (min-width: 1024px)": {
      width: "50%",
    },

    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAM-GEFgvP7ge4_P15OOSjYslrC-Seroro",
  });

  const open = props.open;
  const handleClose = props.handleClose;
  const order = props.order;
  const orderDate = new Date(order.orderDate).toLocaleDateString();


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col">
            <div className="flex flex-row w-full justify-between">
              <div className="w-full">
                <Typography
                  variant="h5"
                  color={order.paid ? "green" : "red"}
                  fontFamily="roboto"
                >
                  {order.paid ? "Paid" 
                  : 
                  <div className="flex flex-col gap-1 md:flex-row justify-start"> 
                      <a className="mt-1">Unpaid</a> 
                    <div className="flex flex-col gap-2 md:gap-0 xs:flex-row ">
                      <button className="w-max rounded-lg mt-1 xs:mt-0 md:ml-5 px-2 py-1 text-blue1 border border-blue1 hover:border-color10b">Cancel Order</button>
                      <button className="w-max rounded-lg mt-1 xs:mt-0 md:ml-3 px-2 py-1 text-white border border-blue1 bg-blue1 hover:bg-color10b">Pay</button> 
                    </div>
                  </div>
                  }
                </Typography>
              </div>
              <div className="w-1/2 text-end ">
                <Typography
                  variant="h5"
                  color={order.delivered ? "green" : "red"}
                  fontFamily="roboto"
                >
                  {order.delivered ? "Delivered" : "Not Delivered"}
                </Typography>
              </div>
            </div>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                marginLeft: -2,
              }}
            >
              <ListItem>
                <ListItemText
                  primary="Order Reference Number"
                  secondary={order.reference}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Order Date"
                  secondary={
                    order !== [] ? orderDate : null
                  }
                />
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
                  width: "100%",
                  bgcolor: "background.paper",
                  marginLeft: -2,
                }}
              >
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Items Total"
                    secondary={order.itemsTotal}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="VAT" secondary={order.vat} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Shipping"
                    secondary={order.shippingTotal}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Grand Total"
                    secondary={order.grandTotal}
                  />
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
                  <MarkerF
                    position={{ lat: order.deliveryAddressLatitude, lng: order.deliveryAddressLongitude }}
                  />
                </GoogleMap>
              </div>
            ) : null}

            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
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
                <ListItemText
                  primary="Contact Number"
                  secondary={order.contactPhoneNumber}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Delivery Notes"
                  secondary={order.deliveryNotes}
                />
              </ListItem>
            </List>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default MyOrderCardModal;
