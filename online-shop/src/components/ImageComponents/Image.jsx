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
    const imageUrl = props.imageUrl;
    const className = props.className;
    const onLoad = props.onLoad;
    const divClassName = props.divClassName
  
    const handleClose = () => setIsFullScreen(false);

    console.log(imageUrl)

    return (
    <div className={divClassName}>
      {imageUrl && (
        <img
          onClick={() => {
            setIsFullScreen(!isFullScreen);
          }}
          src={imageUrl}
          alt="Uploaded preview"
          className={className}
          onLoad={onLoad}
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
                src={imageUrl}
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
