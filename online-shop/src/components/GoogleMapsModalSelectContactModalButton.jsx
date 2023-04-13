import React, { useEffect } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import firestoredb from '../firestoredb';
// import fireststore from firestored
import AppContext from '../AppContext';

const GoogleMapsModalSelectContactModalButton = (props) => {
  const { firestore, userId, refreshUser, setRefreshUser } = React.useContext(AppContext);

  const name = props.contact.name;
  const phonenumber = props.contact.phoneNumber;

  function handleContactClick() {
   
    props.setLocalPhoneNumber(phonenumber);
    props.setLocalName(name);
    props.handleCloseModal();
  }

  function handleDeleteClick() {

    firestore.deleteUserContactPersons(userId, name, phonenumber);
    setRefreshUser(!refreshUser);
  }

  return (
    <React.Fragment>
      <div className="flex flex-row w-full mt-5">
        <button id='savedContactButton'onClick={handleContactClick} className="bg-blue-300 p-3 rounded-lg w-4/5 mr-5">
          {' '}
          {name + ', ' + phonenumber}{' '}
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

export default GoogleMapsModalSelectContactModalButton;
