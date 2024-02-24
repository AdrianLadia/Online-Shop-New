import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@mui/material';
import { getDownloadURL, ref, uploadBytes,deleteObject } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FaImage } from 'react-icons/fa';
import AppContext from '../../AppContext';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

const ImageUploadButton = (props) => {
  const { selectedChatOrderId, payments, alertSnackbar } = useContext(AppContext);
  const id = props.id;
  const folderName = props.folderName;
  let fileName = props.fileName;
  const buttonTitle = props.buttonTitle;
  const storage = props.storage;
  const setPreviewImage = props.setPreviewImage;
  const onUploadFunction = props.onUploadFunction;
  const disableButton = props.disabled;
  const setImageProof = props.setImageProof;
  const resize = props.resize;

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

      const _uuidv4 = uuidv4();

      const ordersRefStorage = ref(storage, folderName + '/' + _uuidv4 + fileName);

      try {
        uploadBytes(ordersRefStorage, file).then(async (snapshot) => {
          setButtonColor(true);

          // GET IMAGE URL

          const downloadURL = await getDownloadURL(ordersRefStorage);
          let downloadURLResized;

          if (resize) {
            const resizedFileName = fileName.split('.')[0] + '_612x820.' + fileName.split('.')[1];
            const resizedRefStorage = ref(storage, folderName + '/' + _uuidv4 + resizedFileName);
            let retries = 0;
            while (downloadURLResized === undefined) {
              if (retries > 10) {
                alertSnackbar('error', 'Error uploading image. Please try again.');
                setLoading(false);
                return;
              }
              await new Promise((resolve) => setTimeout(resolve, 1000));
              try {
                downloadURLResized = await getDownloadURL(resizedRefStorage);
                deleteObject(ordersRefStorage);
                // throw new Error('Not found');
              }
              catch {
                retries++;
              }
            }
          }

          if (onUploadFunction !== undefined) {
            try {
              if (resize) {
                await onUploadFunction(downloadURLResized);
              } else {
                await onUploadFunction(downloadURL);
              }
              setButtonText('Uploaded Successfully');
              setLoading(false);
            } catch (error) {
              alertSnackbar('error', 'Error uploading image. Please try again.');
              return;
            }
          }

          const downloadUrlSchema = Joi.string().uri().required();

          const { error } = downloadUrlSchema.validate(downloadURL);
          if (error) {
            alertSnackbar('error', 'Error uploading image. Please try again.');
          } else {
            alertSnackbar('success', 'Image uploaded successfully.');
            setLoading(false);
          }
        });
      } catch {
        alertSnackbar('error', 'Error uploading image. Please try again.');
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

  // setImageProof("https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Ficon-star-copy-01.svg?alt=media&token=c1e2cd13-58b4-440f-b01f-1169202c253c")

  return (
    <div className="flex justify-center h-3/4 ml-0.5">
      <Button
        id={id}
        className={
          'w-max shadow-md focus:outline-none tracking-tightest 3xs:tracking-tighter py-2 hover:bg-color10c rounded-lg ' +
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
    </div>
  );
};

export default ImageUploadButton;
