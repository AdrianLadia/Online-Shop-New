import React,{useEffect, useState} from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import AppContext from '../AppContext';
import Geocode from 'react-geocode';

const GoogleMapsModalSelectSaveAddressButton = (props) => {
  const savedlongitude = props.savedlongitude;
  const savedlatitude = props.savedlatitude;
  const address = props.address;

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
    firestore.deleteAddress(userId, props.savedlatitude, props.savedlongitude, address);
    setRefreshUser(!refreshUser);
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
          <button id='savedAddressButton' onClick={handleAddressClick} className=" bg-blue1 hover:bg-color10b text-lg text-white p-3 rounded-lg w-full mr-3">
            {' '}
            {realAddress}{' '}
          </button>
          <button onClick={handleDeleteClick} className="border-red-400 text-red-400 hover:bg-red-50 border-2 p-3 rounded-lg w-1/5">
          <div className="flex justify-center">
            <FaRegTrashAlt size={30} className="flex"></FaRegTrashAlt>
          </div>
        </button>
      </div>
    </React.Fragment>
  );
};

export default GoogleMapsModalSelectSaveAddressButton;
