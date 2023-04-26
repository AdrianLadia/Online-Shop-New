import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

const Image = (props) => {
    
    const [isFullScreen, setIsFullScreen] = useState(false);
    const previewImage = props.previewImage;
  
    const handleClose = () => setIsFullScreen(false);

    return (
    <div>
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
                className="bg-red-500 hover:bg-red-800 p-2 rounded-full w-10 text-white absolute
                "
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
                  maxWidth: '100vw',
                  maxHeight: '94vh',
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

export default Image;
