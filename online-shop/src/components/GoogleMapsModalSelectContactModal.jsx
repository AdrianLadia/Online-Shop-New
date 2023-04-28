import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import GoogleMapsModalSelectContactModalButton from './GoogleMapsModalSelectContactModalButton';
import AppContext from '../AppContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '80%',
  transform: 'translate(-50%, -50%)',
  width: '95%',
  height: '50vh',
  maxHeight: '80%',
  overflow: 'auto',
  '@media (min-width: 1024px)': {
    width: '50%',
  },
  border: '2px solid #69b05c',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const GoogleMapsModalSelectContactModal = (props) => {
  const { contactPerson } = React.useContext(AppContext);

  return (
    <div class>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="bg-colorbackground ">
          <div className='flex flex-col '>
            <div className='flex flex-row items-center justify-between my-3'>
              <div className='xs:ml-2 text-2xl xs:text-3xl font-semibold tracking-wider xs:tracking-widest'>
                Saved Contacts
              </div>
              <button
                  id="closeModalButton"
                  onClick={props.handleClose}
                  className="bg-red-500 hover:bg-red-800 p-2 rounded-full w-10 text-white"
                  >X
              </button>
            </div>
            <div className='mt-6'>
              {contactPerson.map((contact) => {
                return (
                  <GoogleMapsModalSelectContactModalButton
                    contact={contact}
                    setLocalPhoneNumber={props.setLocalPhoneNumber}
                    setLocalName={props.setLocalName}
                    handleCloseModal={props.handleClose}
                  />
                );
              })}
            </div>

          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default GoogleMapsModalSelectContactModal;
