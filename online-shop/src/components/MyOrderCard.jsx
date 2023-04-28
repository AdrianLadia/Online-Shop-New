import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {AiFillQuestionCircle} from "react-icons/ai"
import MyOrderCardModal from "./MyOrderCardModal";
import ImageUploadButton from "./ImageComponents/ImageUploadButton";
import AppContext from "../AppContext";
import dataManipulation from "../../utils/dataManipulation";

function MyOrderCard(props) {

  const datamanipulation = new dataManipulation()
  const {storage,userId,cloudfirestore} = React.useContext(AppContext)
  const order = props.order;
  const orderDate = datamanipulation.convertDateTimeStampToDateString(order.orderDate) 
  const [proofOfPaymentLinkCount,setProofOfPaymentLinkCount] = useState(order.proofOfPaymentLink.length)

  console.log(order)

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  function getPaymentStatus(x,y,z) {
    if (order.paid) {
      return x;
    }
    else {
      if (proofOfPaymentLinkCount > 0) {
        return y
      }
      if (proofOfPaymentLinkCount === 0) {
        return z
      }
    }
  }

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

  function onQuestionMarkClick() {
    handleOpenModal()
  }

  function onUpload(proofOfPaymentLink) {
    cloudfirestore.updateOrderProofOfPaymentLink(order.reference,userId,proofOfPaymentLink)
    setProofOfPaymentLinkCount(1)
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
                {orderDate}
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
              color={getPaymentStatus("green", "blue", "red")}
            >
              {getPaymentStatus("Paid", "Reviewing Payment", "Not Paid")}
            
            </Typography>
          </div>
          <div className="flex flex-col w-full ">
            <div className="flex text-center justify-end">
              <Typography variant="h5" component="div">
                Total
              </Typography>
            </div>
            <div className="flex justify-end align-text-bottom">
              <Typography variant="h5">₱ {order.grandTotal}</Typography>
            </div>
            <ImageUploadButton onUploadFunction={onUpload} storage={storage} folderName={'Orders/' + userId + '/' + order.reference}  buttonTitle={'Upload Proof of Payment'} />
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
