import React, { useState } from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import { storage } from './firebaseConfig';
import firebaseConfig from '../../firebase_config';
import { initializeApp } from "firebase/app";
import { getStorage,ref , uploadBytes } from "firebase/storage";




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100vw',
  height: '100vh',
  bgcolor: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ImageUploadButton = (props) => {

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const folderName = props.folderName
  const fileName = props.fileName
  const buttonTitle = props.buttonTitle
  const userId = props.userId
  const orderReferenceNumber = props.orderReferenceNumber
  
  const handleClose = () => setIsFullScreen(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      // Perform image upload operations here

      const ordersRefStorage = ref(storage, + folderName + '/' + fileName);
      
      uploadBytes(ordersRefStorage, file).then((snapshot) => {
        console.log(snapshot)
        console.log('Uploaded a blob or file!');
      });
    }
  };

  return (
    <div>
      <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor="imageUpload">
        <Button variant="contained" component="span">
          {buttonTitle}
        </Button>
        {/* <button type="button">Upload Image</button> */}
      </label>
      {previewImage && (
        <img
          onClick={() => {
            setIsFullScreen(!isFullScreen);
          }}
          src={previewImage}
          alt="Uploaded preview"
          style={{
            maxWidth: isFullScreen ? '90vw' : '300px',
            maxHeight: isFullScreen ? '95vh' : '300px',
            objectFit: 'contain',
            cursor: 'pointer',
          }}
        />
      )}

      <Modal
        open={isFullScreen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex flex-col">
            <div className="flex justify-end">
              <button
                className="bg-red-500 hover:bg-red-800 p-2 rounded-full w-10 text-white"
                type="button"
                onClick={handleClose}
              >
                {' '}
                X{' '}
              </button>
            </div>
            <div className='flex justify-center'>
              <img
                src={previewImage}
                alt="Uploaded preview"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '88vh',
                  objectFit: 'contain',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ImageUploadButton;
