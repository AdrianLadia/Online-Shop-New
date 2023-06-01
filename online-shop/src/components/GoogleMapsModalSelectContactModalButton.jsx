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
      console.log(c.name)
      console.log(name)
      console.log(c.phoneNumber)
      console.log(phonenumber)
      if (c.name !== name || c.phoneNumber !== phonenumber) {
        console.log('true')
        return true
      }
    });
    
    console.log(filtered);
    await firestore.deleteUserContactPersons(userId, name, phonenumber);
    setContactPerson(filtered);

  }

  return (
    <React.Fragment>
      <div className="flex flex-row w-full mt-5 justify-center">
        <button id='savedContactButton'onClick={handleContactClick} className="tracking-tighter xs:tracking-normal bg-blue1 hover:bg-color10b text-white text-lg p-3 rounded-lg w-3/5 mr-1 xs:mr-5">
          {phonenumber + ' , ' + name}
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

export default GoogleMapsModalSelectContactModalButton;
