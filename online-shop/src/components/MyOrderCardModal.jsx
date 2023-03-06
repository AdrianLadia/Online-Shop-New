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

  useEffect(() => {
    console.log(order);
  }, []);

  function responsiveCssPaperColorIfPaid() {
    if (order.paid) {
      return "bg-green-300";
    }
    if (!order.paid) {
      return "bg-red-400";
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
        <Box sx={style}>
          <div className="flex flex-col">
            <div className="flex flex-row w-full justify-between">
              <div className="w-full">
                <Typography
                  variant="h5"
                  color={order.paid ? "green" : "red"}
                  fontFamily="roboto"
                >
                  {order.paid ? "Paid" : "Not Paid"}
                </Typography>
              </div>
              <div className="w-full">
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
                    order !== [] ? order.orderdate.toDate().toString() : null
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
                    secondary={order.itemstotal}
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
                    secondary={order.shippingtotal}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Grand Total"
                    secondary={order.grandtotal}
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
                  center={{ lat: order.latitude, lng: order.longitude }}
                  mapContainerClassName="w-full h-[calc(100vh-200px)]"
                  disableDefaultUI={true}
                  mapTypeControl={false}
                >
                  <MarkerF
                    position={{ lat: order.latitude, lng: order.longitude }}
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
                <ListItemText primary="Address" secondary={order.address} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Contact Person" secondary={order.name} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Contact Number"
                  secondary={order.phonenumber}
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
