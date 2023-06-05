import React,{useEffect, useState} from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import AppContext from '../AppContext';
import Geocode from 'react-geocode';
import { set } from 'date-fns';

const GoogleMapsModalSelectSaveAddressButton = (props) => {
  const savedlongitude = props.savedlongitude;
  const savedlatitude = props.savedlatitude;
  const address = props.address;
  const deliveryAddresses = props.deliveryAddresses;
  const setDeliveryAddresses = props.setDeliveryAddresses;

  const { firestore, userId, refreshUser, setRefreshUser } = React.useContext(AppContext);
  const [realAddress, setRealAddress] = useState(null);

  function handleAddressClick() {
    props.handleClose();
    props.setLocalLatitude(savedlatitude);
    props.setLocalLongitude(savedlongitude);
    props.setLocalDeliveryAddress(address);
    props.setZoom(17);
  }

  function handleDeleteClick() {
    setRefreshUser(!refreshUser);
    
    const filtered = deliveryAddresses.filter((address) => {
      if (address.latitude != savedlatitude && address.longitude != savedlongitude) {
        return true
      }
    })
    
    firestore.deleteAddress(userId, savedlatitude, savedlongitude, address)
    setDeliveryAddresses(filtered)

    console.log(filtered)

  }

  useEffect(()=>{
    Geocode.fromLatLng(savedlatitude, savedlongitude)
      .then(response => {
        const address = response.results[0].formatted_address;
        console.log(`Address: ${address}`);
        setRealAddress(address)
      })
      .catch(error => {
        console.log(error);
      });
  },[])

  return (
    <React.Fragment>
      <div className="flex flex-row w-full justify-center mt-5">
          <button id='savedAddressButton' onClick={handleAddressClick} className="border-2 border-blue1 bg-color10b hover:bg-blue1 font-semibold text-lg text-white p-3 rounded-lg w-full mr-3">
            {' '}
            {address}{' '}
          </button>
          <button onClick={handleDeleteClick} className="border-red-600 text-red-600 hover:border-red-400 hover:text-red-400 border-2 p-3 rounded-lg w-1/5">
          <div className="flex justify-center">
            <FaRegTrashAlt size={30} className="flex"></FaRegTrashAlt>
          </div>
        </button>
      </div>
    </React.Fragment>
  );
};

export default GoogleMapsModalSelectSaveAddressButton;
