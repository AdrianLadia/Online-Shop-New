import React, { useEffect, useContext, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import firestoredb from '../firestoredb';
// import fireststore from firestored
import AppContext from '../AppContext';

const GoogleMapsModalSelectContactModalButton = (props) => {

  const contact = props.contact;
  const contactPerson = props.contactPerson;
  const name = props.contact.name;
  const phonenumber = props.contact.phoneNumber;
  const setContactPerson = props.setContactPerson;

  const { firestore, userId, refreshUser, setRefreshUser } = React.useContext(AppContext);

  function handleContactClick() {
   
    props.setLocalPhoneNumber(phonenumber);
    props.setLocalName(name);
    props.handleCloseModal();
  }

  async function handleDeleteClick() {
    setRefreshUser(!refreshUser);
    const filtered = props.contactPerson.filter((c) => {
      if (c.name !== name || c.phoneNumber !== phonenumber) {

        return true
      }
    });
    

    await firestore.deleteUserContactPersons(userId, name, phonenumber);
    setContactPerson(filtered);

  }

  return (
    <React.Fragment>
      <div className="flex flex-row w-full mt-5 justify-center">
        <button id='savedContactButton'onClick={handleContactClick} className="border-2 border-color10b hover:border-blue1 tracking-tighter xs:tracking-normal bg-color10b hover:bg-blue1 text-white text-lg p-3 rounded-lg w-3/5 mr-1 xs:mr-5">
          {phonenumber + ' , ' + name}
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

export default GoogleMapsModalSelectContactModalButton;
