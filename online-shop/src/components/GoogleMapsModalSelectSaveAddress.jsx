import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AppContext from '../AppContext';
import GoogleMapsModalSelectSaveAddressButton from './GoogleMapsModalSelectSaveAddressButton';

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

  bgcolor: 'background.paper',
  border: '2px solid #69b05c',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const GoogleMapsModalSelectSaveAddress = (props) => {
  const { userdata } = React.useContext(AppContext);

  const setLocalLatitude = props.setLocalLatitude;
  const setLocalLongitude = props.setLocalLongitude;
  const setLocalDeliveryAddress = props.setLocalDeliveryAddress;
  const setZoom = props.setZoom;

  return (
    <div className='flex flex-col '>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className=''
      >
        <Box sx={style} className="bg-colorbackground">
          <div className="flex flex-col ">
            <div className="flex items-center justify-between my-3">
              <div className='xs:ml-2 text-2xl xs:text-3xl font-semibold tracking-wider xs:tracking-widest'>
                Saved Addresses
              </div>
              <button
                id="closeModalButton"
                onClick={props.handleClose}
                className="bg-red-500 hover:bg-red-800 p-2 rounded-full w-10 text-white"
              > X
              </button>
            </div>

            <div className='border-b-2 w-full border-color60 mt-4'/>
            
            <div className="flex flex-col justify-center mt-6">
              {userdata ? (
                userdata.deliveryAddress.map((address, index) => {
                  return (
                    <GoogleMapsModalSelectSaveAddressButton
                      handleClose={props.handleClose}
                      address={address.address}
                      savedlongitude={address.longitude}
                      savedlatitude={address.latitude}
                      setLocalLatitude={setLocalLatitude}
                      setLocalLongitude={setLocalLongitude}
                      setLocalDeliveryAddress={setLocalDeliveryAddress}
                      setZoom={setZoom}
                    ></GoogleMapsModalSelectSaveAddressButton>
                  );
                })
              ) : (
                <>Create an account to save</>
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default GoogleMapsModalSelectSaveAddress;
