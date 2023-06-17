import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FaImage } from 'react-icons/fa';
import AppContext from '../../AppContext';
import Joi from 'joi';

const ImageUploadButton = (props) => {
  const { selectedChatOrderId, payments } = useContext(AppContext);
  const id = props.id;
  const folderName = props.folderName;
  let fileName = props.fileName;
  const buttonTitle = props.buttonTitle;
  const storage = props.storage;
  const setPreviewImage = props.setPreviewImage;
  const onUploadFunction = props.onUploadFunction;
  const disableButton = props.disabled;

  const [buttonColor, setButtonColor] = useState(false);
  const [buttonText, setButtonText] = useState(buttonTitle);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (setPreviewImage !== undefined) {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
      // Perform image upload operations here
      if (fileName === undefined) {
        fileName = file.name;
      }

      const ordersRefStorage = ref(storage, folderName + '/' + fileName);

      try {
        uploadBytes(ordersRefStorage, file).then(async (snapshot) => {
          setButtonColor(true);
          setButtonText('Uploaded Successfuly');
          setLoading(false);
  
          // GET IMAGE URL
          const downloadURL = await getDownloadURL(ordersRefStorage);
  
          if (onUploadFunction !== undefined) {
            onUploadFunction(downloadURL);
          }

          const downloadUrlSchema = Joi.string().uri().required();

          const {error} = downloadUrlSchema.validate(downloadURL);
          if (error) {
            alert('Error uploading image. Please try again.');
          }
          else {
            alert('Image uploaded successfully.');
          }

          
        });
      }
      catch {
        alert('Error uploading image. Please try again.');
      }
    } else {
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
    <div className="flex justify-center h-3/4 ml-0.5">
      <Button
        id={id}
        className={
          'w-max shadow-md focus:outline-none tracking-tightest 3xs:tracking-tighter py-2 hover:bg-blue1 rounded-lg ' +
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
            <span className="gap-2 flex">
              <CloudUploadIcon /> {buttonText}
            </span>
          ) : (
            <FaImage className="text-2xl xl:text-4xl 2xl:text-6xl" />
          )}
        </label>
      </Button>
    </div>
  );
};

export default ImageUploadButton;
