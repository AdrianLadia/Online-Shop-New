import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@mui/material';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FaImage } from 'react-icons/fa';
import AppContext from '../../AppContext';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import uploadFileToFirebaseStorage from './ImageUploadFunction';

const ImageUploadButton = (props) => {
  const { alertSnackbar } = useContext(AppContext);
  const id = props.id;
  const folderName = props.folderName;
  let fileName = props.fileName;
  const buttonTitle = props.buttonTitle;
  const storage = props.storage;
  const setPreviewImage = props.setPreviewImage;
  const onUploadFunction = props.onUploadFunction;
  const disableButton = props.disabled;
  const resize = props.resize;

  const [buttonColor, setButtonColor] = useState(false);
  const [buttonText, setButtonText] = useState(buttonTitle);
  const [loading, setLoading] = useState(false);

  

  const handleFileChange = async (event) => {
    setLoading(true);
    try {
      const file = event.target.files[0];
      const url = await uploadFileToFirebaseStorage({file, fileName, folderName, storage, resize});
      console.log('url',url);
      if (onUploadFunction) {
        try {
          onUploadFunction(url);
        } catch (error) {
          alertSnackbar('error', error.message);
        }
      }
      if (setPreviewImage) {
        try {
          setPreviewImage(url);
        } catch (error) {
          alertSnackbar('error', error.message);
        }
      }
    } catch (error) {
      alertSnackbar('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setButtonText(buttonTitle);
      setButtonColor(false);
    }, 3000);
  }, [buttonText]);

  function disable() {
    if (disableButton) {
      return ' bg-gray-300 hover:bg-gray-300 border-0 drop-shadow-md cursor-not-allowed text-white';
    } else if (buttonColor == false) {
      return ' bg-color10b';
    }
  }

  return (
    <Button
      id={id}
      className={
        'w-max h-full shadow-md focus:outline-none tracking-tightest 3xs:tracking-tighter py-2 hover:bg-color10c rounded-lg ' +
        disable()
      }
      variant="contained"
      component="span"
      disabled={disableButton}
    >
      <input
        type="file"
        id={`imageUpload-${id}`}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <label htmlFor={`imageUpload-${id}`}>
        {loading ? (
          <CircularProgress size={30} color="inherit" />
        ) : buttonText ? (
          <span className="flex gap-2">
            <CloudUploadIcon /> {buttonText}
          </span>
        ) : (
          <FaImage className="text-2xl xl:text-4xl 2xl:text-5xl" />
        )}
      </label>
    </Button>
  );
};

export default ImageUploadButton;