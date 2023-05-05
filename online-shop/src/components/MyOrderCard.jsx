import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { AiFillQuestionCircle } from 'react-icons/ai';
import MyOrderCardModal from './MyOrderCardModal';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import AppContext from '../AppContext';
import dataManipulation from '../../utils/dataManipulation';
import UseWindowDimensions from './useWindowDimensions';
import { BsFileImage } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import { doc, onSnapshot } from 'firebase/firestore';

function MyOrderCard(props) {
  const datamanipulation = new dataManipulation();
  const { storage, userId, cloudfirestore, setSelectedChatOrderId, firestore, db, selectedChatOrderId } = React.useContext(AppContext);
  const order = props.order;
  const orderDate = datamanipulation.convertDateTimeStampToDateString(order.orderDate);
  const [proofOfPaymentLinkCount, setProofOfPaymentLinkCount] = useState(order.proofOfPaymentLink.length);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const { width } = UseWindowDimensions();
  const [screenMobile, setScreenSizeMobile] = useState(null);
  const navigateTo = useNavigate()
  const [ownerRead, setOwnerRead] = useState(null);
  const [test, setTest] = useState(0);
  // console.log(order);

  function getPaymentStatus(x, y, z) {
    if (order.paid) {
      return x;
    } else {
      if (proofOfPaymentLinkCount > 0) {
        return y;
      }
      if (proofOfPaymentLinkCount === 0) {
        return z;
      }
    }
  }

  function responsiveCssPaperColorIfDelivered() {
    if (order.delivered && order.paid) {
      return 'bg-green-300';
    }
    if (order.delivered && !order.paid) {
      return 'bg-orange-300';
    }
    if (!order.delivered && order.paid) {
      return 'bg-yellow-200';
    }
    if (!order.delivered && !order.paid) {
      return 'bg-red-400';
    }
  }

  function onQuestionMarkClick() {
    handleOpenModal();
  }

  function onUpload(proofOfPaymentLink) {
    cloudfirestore.updateOrderProofOfPaymentLink(order.reference, userId, proofOfPaymentLink);
    setProofOfPaymentLinkCount(1);
  }

  useEffect(() => {
    if (width < 770) {
      return setScreenSizeMobile(false);
    } else {
      return setScreenSizeMobile(true);
    }
  }, [width]);

  function onMessageClick() {
    setSelectedChatOrderId(order.reference)
    navigateTo("/orderChat")
  }

  // useEffect(()=>{
  //   const docRef = doc(db, 'ordersMessages', "1521442023-160929");
  //     onSnapshot(docRef, (doc)=>{
  //       const data = doc.data();
  //       const ownerReadAll = data.ownerReadAll
        
  //       if(ownerReadAll === false){
  //         setOwnerRead(true)
  //       }else{
  //         setOwnerRead(false)
  //       }
  //   })
  // },[])

  return (
    <div
      className={
        'self-center w-full xs:w-11/12 lg:w-10/12 mb-3 sm:mb-5 rounded-xl ' + responsiveCssPaperColorIfDelivered()
      }
    >
      <div className="flex flex-col p-2 xs:p-5 m-5 rounded-lg bg-white ">
        <div className="flex justify-end mb-4">
          <AiFillQuestionCircle className="cursor-pointer" onClick={onQuestionMarkClick} size="2em" />
        </div>

        <div className="flex flex-row">
          <div className="flex w-full justify-between ">
            <div className="flex h-22  sm:h-full mb-4 sx:mb-0 ">
              <Typography variant="h5" component="p" className=" md:ml-2 tracking-tighter xs:tracking-normal">
                Order # : {order.reference}
              </Typography>
            </div>
            <div className="flex w-3/4 sm:w-4/12 justify-end text-end lg:justify-center lg:text-start ">
              <Typography variant="h5" component="span" className="tracking-tighter xs:tracking-normal lg:ml-8">
                Date : {orderDate}
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex flex-row mt-5 w-full justify-between">
          <div className="flex flex-col w-full">
            <Typography
              variant="h5"
              component="div"
              color={order.delivered ? 'green' : 'red'}
              className="tracking-tighter xs:tracking-normal"
            >
              {order.delivered ? 'Delivered' : 'Not Delivered'}
            </Typography>

            <Typography variant="h5" component="div" color={getPaymentStatus('green', 'blue', 'red')}>
              {getPaymentStatus('Paid', 'Reviewing Payment', 'Not Paid')}
            </Typography>
          </div>

            <div className="flex w-full sm:w-6/12 justify-end text-end lg:justify-center lg:text-start sm:mr-7">
              <Typography variant="h5" component="div" className="tracking-tighter xs:tracking-normal">
                Total : ₱{order.grandTotal}
              </Typography>
            </div>
        </div>

        <div className="w-full border-t-2 mt-4 mb-1"/>

          <div className='flex flex-col lg:flex-row mt-5 gap-10 items-center'>
            <div className='w-5/12 flex gap-5 '>
              <button className=" w-max rounded-lg px-3 py-2 text-blue1 border border-blue1 hover:border-color10b">Cancel Order</button>
              <button className="w-max rounded-lg px-8 py-2 text-white border border-blue1 bg-blue1 hover:bg-color10b">Pay</button> 
            </div>
            <div className='w-full lg:w-9/12 flex gap-5 flex-col sm:flex-row justify-center items-center lg:justify-end '>
              <button 
                  onClick={onMessageClick} className='p-3 w-max rounded-lg bg-blue1 text-white font-semibold hover:bg-color10b' 
                  > <p className='flex gap-1 justify-center'>
                    <HiChatBubbleLeftEllipsis className='mt-1'/>Message
                    {/* {ownerRead ? (<p className='bg-red-500 p-1 rounded-full h-1 w-1'> </p>):null} */}
                    </p>
              </button>
              <ImageUploadButton
                id = {`order-${order.reference}`}
                onUploadFunction={onUpload}
                storage={storage}
                folderName={'Orders/' + userId + '/' + order.reference}
                buttonTitle={'Upload Proof of Payment'}
                variant="outlined"
              />
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
