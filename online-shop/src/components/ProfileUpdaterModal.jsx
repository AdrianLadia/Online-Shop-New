import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField, alertClasses } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
const ReactPhoneInput = PhoneInput.default ? PhoneInput.default : PhoneInput;
import 'react-phone-input-2/lib/style.css';
import AppContext from '../AppContext';
import isValidPhilippinePhoneNumber from '../../utils/isValidPhilippinePhoneNumber';
import AppConfig from '../AppConfig';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ProfileUpdaterModal = (props) => {
  const openProfileUpdaterModal = props.openProfileUpdaterModal;
  const setOpenProfileUpdaterModal = props.setOpenProfileUpdaterModal;
  const manualCustomerOrderProcess = props.manualCustomerOrderProcess;
  const { firestore, userdata, alertSnackbar } = React.useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [userRole, setUserRole] = React.useState(''); // [ADDED
  const isDevEnvironment = new AppConfig().getIsDevEnvironment();

  async function updateProfile() {
    const _phoneNumber = '+' + phoneNumber 
    if (userdata.phoneNumber == null) {
      if (isValidPhilippinePhoneNumber(_phoneNumber) == false) {
        alertSnackbar('error', 'Please Enter A Valid Phone Number');
        return;
      } else {
        try {
          await firestore.updateDocumentFromCollection('Users', userdata.uid, { phoneNumber: _phoneNumber });
        } catch (err) {
          alertSnackbar('error', 'Failed to update phone number');
        }
      }
    }

    if (email != '') {
      try {
        await firestore.updateDocumentFromCollection('Users', userdata.uid, { email: email });
      } catch (err) {
        alertSnackbar('error', 'Failed to update email');
      }
    }
    if (name != '') {
      try {
        await firestore.updateDocumentFromCollection('Users', userdata.uid, { name: name });
      } catch (err) {
        alertSnackbar('error', 'Failed to update name');
      }
    }
    if (userRole != '') { 
      try {
        await firestore.updateDocumentFromCollection('Users', userdata.uid, { userRole: userRole });
      } catch (err) {
        alertSnackbar('error', 'Failed to update user role');
      }
    }

    setOpenProfileUpdaterModal(false);
    window.location.reload();
  }

  function openModal(){
    if (manualCustomerOrderProcess == false) {
      return openProfileUpdaterModal
    }
    else {
      return !manualCustomerOrderProcess
    }

  }

  return (
    
    <div>
      <Modal
        open={openModal()}
        onClose={() => setOpenProfileUpdaterModal(false)}
        aria-labelledby="profile-update-modal-title"
        aria-describedby="profile-update-modal-description"
      >
        <Box sx={style}>
          <Typography id="profile-update-modal-title" variant="h6" component="h2">
            Profile Update Required
          </Typography>
          <Typography id="profile-update-modal-description" sx={{ mt: 2 }}>
            Your profile seems to be incomplete. Please fill in the details below to enhance your shopping experience.
          </Typography>

          {isDevEnvironment ?
                        <TextField
                        required
                        label="User Role"
                        variant="outlined"
                        placeholder="Enter user role"
                        sx={{ width: '90%', marginTop: 3 }}
                        onChange={(event) => setUserRole(event.target.value)}
                      />
          : null} 

          {userdata.name == null ? (
            <TextField
              required
              label="Name"
              variant="outlined"
              placeholder="Enter your name"
              sx={{ width: '90%', marginTop: 3 }}
              onChange={(event) => setName(event.target.value)}
            />
          ) : null}

          {userdata.email == null ? (
            <TextField
              required
              label="Email"
              variant="outlined"
              placeholder="Enter your email"
              sx={{ width: '90%', marginTop: 3 }}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : null}

          {userdata.phoneNumber == null || userdata.phoneNumber == '' ? (
            <div className="mt-5">
              <label className="text-sm">Phone Number</label>
              <ReactPhoneInput country={'ph'} value={phoneNumber} onChange={setPhoneNumber} />
            </div>
          ) : null}

          <div className="flex justify-between mt-5">
            <button className="rounded-lg p-3 bg-grey1" onClick={() => setOpenProfileUpdaterModal(false)}>
              Cancel
            </button>
            <button className="rounded-lg p-3 bg-blue1" onClick={updateProfile}>
              Save Changes
            </button>
          </div>
          <Typography sx={{ mt: 2, fontSize: '0.8em', color: 'grey' }}>
            Your data is safe with us. It will only be used for improving your ordering experience.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileUpdaterModal
