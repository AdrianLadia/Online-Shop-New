import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { AiFillQuestionCircle } from 'react-icons/ai';
import MyOrderCardModal from './MyOrderCardModal';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import AppContext from '../AppContext';
import dataManipulation from '../../utils/dataManipulation';
import UseWindowDimensions from './useWindowDimensions';
import { useNavigate } from 'react-router-dom';
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import CountdownTimer from './CountDownTimer';

function MyOrderCard(props) {
  const datamanipulation = new dataManipulation();
  const { storage, userId, cloudfirestore, setSelectedChatOrderId, firestore, selectedChatOrderId, userdata, setUserState, setRefreshUser, refreshUser  } = React.useContext(AppContext);
  const order = props.order;
  const orderDate = datamanipulation.convertDateTimeStampToDateString(order.orderDate);
  const [proofOfPaymentLinkCount, setProofOfPaymentLinkCount] = useState(order.proofOfPaymentLink.length);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const { width } = UseWindowDimensions();
  const [screenMobile, setScreenSizeMobile] = useState(null);
  const navigateTo = useNavigate()
  const [unRead, setUnRead] = useState();
  const [disable, setDisable] = useState(null);

  const orderDateObject = new Date(orderDate)
  const orderExpiryDate = new Date(orderDateObject.getTime() + 86400000)
  const dateNow = new Date()
  const dateDifference = datamanipulation.getSecondsDifferenceBetweentTwoDates(dateNow ,orderExpiryDate);

  console.log(order.reference)
  console.log(dateDifference)


  async function readMessages(){
    firestore.readOrderMessageByReference(order.reference).then((s)=>{
      let unReadCount = 0;
      s.messages.map((q)=>{
        if(q.userRole === "superAdmin" || q.userRole === "Admin" ){
          if(q.read === false){
            unReadCount += 1 ;
          }
        };
      });
      setUnRead(unReadCount)
    })
  }

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

  function onUpload(proofOfPaymentLink) {
    cloudfirestore.updateOrderProofOfPaymentLink(order.reference, userId, proofOfPaymentLink,userdata.name,'');
    setProofOfPaymentLinkCount(1);
  }

  function onMessageClick() {
    setSelectedChatOrderId(order.reference)
    navigateTo("/orderChat",{state:{orderReference:order.reference}})
  };

  function handleCancel(){
    firestore.deleteCancelledOrder(userdata.uid, order.reference);
  }

  function handlePay(){
    let price;
    userdata.orders.map((s)=>{
      if(order.reference === s.reference){
        price = s.grandTotal;
      }
    });


    navigateTo(
      '/AccountStatementPayment',
      {state : {
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        fullname: userdata.name,
        eMail: userdata.email,
        phoneNumber: userdata.contactPerson[0].phoneNumber,
        totalPrice: price,
        userId: userdata.uid,
        orderReference: order.reference
      }})
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

  function disabledColor(){
    if(dateDifference <= 0){
      return " bg-gray-300 text-gray-500 hover:bg-gray-300 border-0 drop-shadow-lg cursor-not-allowed"
    }
  }

  function disableButton(){
    if(dateDifference > 0){
      return false
    }else{
      return true
    }
  }
  
  useEffect(()=>{
    readMessages()
  },[firestore])
  
  useEffect(()=>{
    disableButton()
    disabledColor()
  },[])

  useEffect(() => {
    if (width < 770) {
      return setScreenSizeMobile(false);
    } else {
      return setScreenSizeMobile(true);
    }
  }, [width]);

  return (
    <div className={'self-center w-full xs:w-11/12 lg:w-10/12 mb-3 sm:mb-5 rounded-xl ' + responsiveCssPaperColorIfDelivered()}>
      <div className="flex flex-col p-2 xs:p-5 m-5 rounded-lg bg-white ">
    
        <div className="flex flex-row justify-between mb-4">
          {(proofOfPaymentLinkCount <= 0) ? <CountdownTimer className='ml-2 mt-1' size={3} initialTime={dateDifference} expiredText='Order Expired' id={order.reference} /> : <div> </div>  }
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

        <div className="w-full border-t-2 mt-4 mb-1 "/>

          <div className='flex flex-col lg:flex-row mt-5 gap-5 items-center '>
            <div className='w-full lg:w-5/12 flex gap-5 justify-evenly'>
              <button 
                className={" w-max rounded-lg px-3 py-2 text-red-500 border border-red-500 hover:bg-red-50 " + disabledColor()}
                onClick={handleCancel}
                disabled={disableButton()}
                >Cancel Order
              </button>
              <button 
                className={"w-max rounded-lg px-8 py-2 text-white border border-blue1 bg-blue1 hover:bg-color10b " + disabledColor()}
                onClick={handlePay}
                disabled={disableButton()}
                >Pay
              </button> 
            </div>

        <div className="w-full border-t-2 mb-0.5 lg:border-t-0 "/>

            <div className='w-full lg:w-9/12 flex gap-5 flex-col-reverse sm:flex-row justify-center items-center lg:justify-end '>
              <button 
                  onClick={onMessageClick} 
                  className={"px-3 py-2 w-max rounded-lg text-white font-semibold bg-color60 hover:bg-color10c " + disabledColor()}
                  disabled={disableButton()}
                  > <p className='flex gap-1 justify-center'>
                    <HiChatBubbleLeftEllipsis className='mt-1'/>Message
                    {unRead ? 
                    (<div className='relative flex h-3 w-3'>
                      <span className='bg-red-500 absolute inline-flex rounded-full h-2 w-2 animate-ping opacity-150'>
                      </span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-red-400 ">
                      </span>
                    </div>)
                    :null}
                    </p>
              </button>
                <ImageUploadButton
                  id = {`order-${order.reference}`}
                  onUploadFunction={onUpload}
                  storage={storage}
                  folderName={'Orders/' + userId + '/' + order.reference}
                  buttonTitle={'Upload Proof of Payment'}
                  variant="outlined"
                  disabled={disableButton()}
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
