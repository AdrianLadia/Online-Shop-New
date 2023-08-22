import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AppContext from '../AppContext';
import { useContext, useState } from 'react';
import MyOrderCardModal from './MyOrderCardModal';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import Image from './ImageComponents/Image';
import { set } from 'date-fns';
import menuRules from '../../utils/classes/menuRules';

const AdminDelivery = () => {
  const { firestore, storage,userdata } = useContext(AppContext);
  const [undeliveredOrders, setUndeliveredOrders] = useState([]);
  const [references, setReferences] = useState([]);
  const [selectedOrderReference, setSelectedOrderReference] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const randomString = Math.random().toString(36).substring(7);
  const [imageLink, setImageLink] = useState(null);
  const rules = new menuRules(userdata.userRole);

  useEffect(() => {
    firestore.readAllNotDeliveredOrders().then((data) => {
      setUndeliveredOrders(data);
    });
  }, []);

  useEffect(() => {
    if (undeliveredOrders.length > 0) {
      const references = [];
      undeliveredOrders.forEach((order) => {
        references.push([order.userName, order.reference]);
      });
      setReferences(references);
    }
  }, [undeliveredOrders]);

  function onViewDeliveryClick() {
    if (selectedOrderReference) {
      setOpenModal(true);
    } else {
      alert('Please select a delivery');
    }
  }

  useEffect(() => {
    if (selectedOrderReference) {
      const order = undeliveredOrders.find((order) => {
        return order.reference === selectedOrderReference;
      });
      setSelectedUserId(order.userId);
      setSelectedOrder(order);
    }
  }, [selectedOrderReference]);

  function onUploadFunction(imageLink) {
    console.log('uploading');
    setImageLink(imageLink);
  }

  async function onCloseOrderClick() {
    if (imageLink == null) {
      alert('Please upload a delivery photo proof');
    } else {
      try {
        await firestore.updateOrderAsDelivered(selectedOrderReference, imageLink,userdata);
        // const newReference = references.filter((reference) => reference[1] !== selectedOrderReference)
        setImageLink(null);
        alert('Uploaded Proof of Delivery');
      } catch (error) {
        console.log(error);
        alert('Failed to upload image');
      }
    }
  }

  return (
    <>
      {rules.checkIfUserAuthorized('delivery') ? (
        <div>
          <div className="flex justify-center w-full mt-5">
            <Typography fontFamily="roboto" variant="h3">
              Delivery
            </Typography>
          </div>
          <div className="flex w-full flex-col lg:flex-row lg:justify-evenly mt-5">
            <div className="flex flex-col  w-full lg:mt-40">
              <div className="flex justify-center ">SELECT A DELIVERY</div>
              <div className="flex justify-center mt-5">
                <Autocomplete
                  onChange={(event, value) => {
                    setSelectedOrderReference(value[1]);
                  }}
                  disablePortal
                  id="combo-box-demo"
                  options={references}
                  value={selectedOrderReference}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Reference" />}
                />
              </div>
              <div className="flex justify-center mt-5">
                <button
                  onClick={onViewDeliveryClick}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Order
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full lg:mt-32">
              <div className="flex justify-center mt-5">UPLOAD DELIVERY PHOTO PROOF</div>
              <div className="flex flex-col items-center justify-center mt-5">
                <ImageUploadButton
                  buttonTitle={'Upload Proof Of Delivery'}
                  onUploadFunction={onUploadFunction}
                  folderName={`Deliveries/${selectedUserId}/${selectedOrderReference}/${randomString}`}
                  storage={storage}
                />
                <div className="mt-5">
                  <Image imageUrl={imageLink} />
                </div>
                <button
                  onClick={onCloseOrderClick}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
          {openModal ? (
            <MyOrderCardModal
              open={openModal}
              handleClose={() => {
                setOpenModal(false);
              }}
              order={selectedOrder}
              hidePricing={true}
            />
          ) : null}
        </div>
      ) : (
        <>UNAUTHORIZED</>
      )}
    </>
  );
};

export default AdminDelivery;
