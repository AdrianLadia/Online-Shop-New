import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import PhoneInput from 'react-phone-input-2'
const ReactPhoneInput = PhoneInput.default ? PhoneInput.default : PhoneInput;
import 'react-phone-input-2/lib/style.css'
import AppContext from '../AppContext';

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
  const {firestore, userdata} = React.useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
 

  function updateProfile() {
    setOpenProfileUpdaterModal(false);
    if (phoneNumber != '') {
      firestore.updateDocumentFromCollection('Users', userdata.uid, {phoneNumber : '+' + phoneNumber});
    }
    if (email != '') {
      firestore.updateDocumentFromCollection('Users', userdata.uid, {email : email});
    }
    if (name != '') {
      firestore.updateDocumentFromCollection('Users', userdata.uid, {name : name});
    }
  }

  return (
    <div>
      <Modal
        open={openProfileUpdaterModal}
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
            <div className='mt-5'>
              <label className='text-sm'>Phone Number</label>
              <ReactPhoneInput  country={'ph'} value={phoneNumber} onChange={setPhoneNumber} />
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

export default ProfileUpdaterModal;
