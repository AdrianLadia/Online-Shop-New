import { Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {AiFillQuestionCircle} from "react-icons/ai"
import MyOrderCardModal from "./MyOrderCardModal";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

function MyOrderCard(props) {
  const order = props.order;
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  function responsiveCssPaperColorIfDelivered() {
    if (order.delivered && order.paid) {
      return "bg-green-300";
    }
    if (order.delivered && !order.paid) {
      return "bg-orange-300";
    }
    if (!order.delivered && order.paid) {
      return "bg-yellow-200";
    }
    if (!order.delivered && !order.paid) {
      return "bg-red-400";
    }
  }

  useEffect(() => {console.log(order)}, [])

  function onQuestionMarkClick() {
    handleOpenModal()
  }



  return (
    <div
      className={"overflow-y-scroll " + responsiveCssPaperColorIfDelivered() }
    >
      <div className="p-5 m-5 rounded-lg bg-white hover:cursor-pointer">
        <div className="flex flex-row">
          <div className="flex flex-col w-full">
            <Typography variant="h5" component="div">
              Order # :
            </Typography>
            <Typography variant="h5" component="div">
              {order.reference}
            </Typography>
          </div>
          <div className="flex flex-col h-full ">
            <div className="flex justify-end hover:cursor-pointer">
              <AiFillQuestionCircle onClick={onQuestionMarkClick} size="2em" />
            </div>
            <div className="flex w-full justify-end mt-8 ">
              <Typography variant="h5" component="div">
                {order.orderdate.toDate().toLocaleDateString()}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-row mt-5 ">
          <div className="flex flex-col  w-full">
            <Typography
              variant="h5"
              component="div"
              color={order.delivered ? "green" : "red"}
            >
              {order.delivered ? "Delivered" : "Not Delivered"}
            </Typography>
            <Typography
              variant="h5"
              component="div"
              color={order.paid ? "green" : "red"}
            >
              {order.paid ? "Paid" : "Unpaid"}
            </Typography>
          </div>
          <div className="flex flex-col w-full ">
            <div className="flex text-center justify-end">
              <Typography variant="h5" component="div">
                Total
              </Typography>
            </div>
            <div className="flex justify-end align-text-bottom">
              <Typography variant="h5">₱ {order.grandtotal}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div>
        <MyOrderCardModal open={openModal} handleClose={handleClose} order={order} />
      </div>
    </div>
  );
}

export default MyOrderCard;
