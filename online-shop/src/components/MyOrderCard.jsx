import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {AiFillQuestionCircle} from "react-icons/ai"
import MyOrderCardModal from "./MyOrderCardModal";
import UseWindowDimensions from "./UseWindowDimensions";

function MyOrderCard(props) {
  const order = props.order;
  const orderDate = new Date(order.orderDate).toLocaleDateString();

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const {width } = UseWindowDimensions();
  const [screenMobile, setScreenSizeMobile] = useState(null);

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

  useEffect(()=>{
    if (width < 770) {
      return setScreenSizeMobile(false);
     }else {
      return setScreenSizeMobile(true);
     }
  },[width])

{/* <div className="flex justify-end ">
              <AiFillQuestionCircle className="cursor-pointer" onClick={onQuestionMarkClick} size="2em" />
  </div> */}

  //flex-col md:flex-row 

  return (
    <div
      className={" self-center w-full lg:w-11/12 mb-2 rounded-xl overflow-y-scroll " + responsiveCssPaperColorIfDelivered() }
    >
      <div className="flex flex-col p-2 xs:p-5 m-5 rounded-lg bg-white ">

        <div className="flex justify-end mb-4">
          <AiFillQuestionCircle className="cursor-pointer" onClick={onQuestionMarkClick} size="2em" />
        </div> 

        <div className="flex flex-row">
          <div className="flex w-full justify-between ">
            <div className="flex">
              <Typography variant="h5" component="p" className=" md:ml-2">
                 Order # : { order.reference}
              </Typography>
            </div>

            <div className="flex w-1/4 justify-end text-end ">
              <Typography variant="h5" component="span">
                {orderDate}
              </Typography>
            </div>

          </div>
        </div>

        <div className="flex flex-row mt-5">
          <div className="flex flex-col w-full">
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
              className="mt-2"
              color={order.paid ? "green" : "red"}
            >
              {order.paid ? "Paid" 
              : 
              <div className="flex flex-col gap-1 md:flex-row justify-start"> 
                  <a className="mt-1">Unpaid</a> 
                {screenMobile ?(
                  <div className="flex flex-col gap-2 md:gap-0 xs:flex-row ">
                    <button className="w-max rounded-lg mt-1 xs:mt-0 md:ml-7 px-2 py-1 text-blue1 border border-blue1 hover:border-color10b">Cancel Order</button>
                    <button className="w-max rounded-lg mt-1 xs:mt-0 md:ml-3 px-2 py-1 text-white border border-blue1 bg-blue1 hover:bg-color10b">Pay</button> 
                  </div>):null
                }
              </div>}
            </Typography>
          </div>
          <div className="flex flex-col w-1/2 ">
            <div className="flex text-center justify-end">
              <Typography variant="h5" component="div">
                Total :
              </Typography>
            </div>
            <div className="flex justify-end text-end">
              <Typography variant="h5" className="mt-4">
                ₱{order.grandTotal}
              </Typography>
            </div>
          </div>
        </div>

        {screenMobile === false ? (<div className="w-full border-t-4 mt-4 mb-2"></div>):null}

        {screenMobile === false ? (
          <div className="w-full 2xs:w-11/12 flex self-center justify-center gap-5 mt-5 font-bold text-lg ">
           <button className=" w-max rounded-lg xs:mt-0 md:ml-7 px-3 py-2 text-blue1 border border-blue1 hover:border-color10b">Cancel Order</button>
           <button className="w-max rounded-lg xs:mt-0 md:ml-3 px-3 py-2 text-white border border-blue1 bg-blue1 hover:bg-color10b">Pay</button> 
          </div>):null
        }

      </div>
      <div>
        <MyOrderCardModal open={openModal} handleClose={handleClose} order={order} />
      </div>
    </div>
  );
}

export default MyOrderCard;
