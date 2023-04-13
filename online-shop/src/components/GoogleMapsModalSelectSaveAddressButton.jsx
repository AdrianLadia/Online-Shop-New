import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import AppContext from '../AppContext';

const GoogleMapsModalSelectSaveAddressButton = (props) => {
  const savedlongitude = props.savedlongitude;
  const savedlatitude = props.savedlatitude;
  const address = props.address;

  const { firestore, userId, refreshUser, setRefreshUser } = React.useContext(AppContext);

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

  return (
    <React.Fragment>
      <div className="flex flex-row w-full mt-5">
        <button id='savedAddressButton' onClick={handleAddressClick} className="bg-blue-300 p-3 rounded-lg w-4/5 mr-5">
          {' '}
          {address}{' '}
        </button>
        <button onClick={handleDeleteClick} className="bg-red-300 p-3 rounded-lg w-1/5">
          <div className="flex justify-center">
            <FaRegTrashAlt size={30} className="flex"></FaRegTrashAlt>
          </div>
        </button>
      </div>
    </React.Fragment>
  );
};

export default GoogleMapsModalSelectSaveAddressButton;
