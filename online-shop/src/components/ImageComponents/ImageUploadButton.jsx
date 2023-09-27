import React, { useEffect, useState, useContext } from 'react';
import { Button } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { FaImage } from 'react-icons/fa';
import AppContext from '../../AppContext';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

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
  const setImageProof = props.setImageProof;

  const [buttonColor, setButtonColor] = useState(false);
  const [buttonText, setButtonText] = useState(buttonTitle);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      console.log(`Original file size: ${file.size / 1024} KB`); // Logging the original file size
      const reader = new FileReader();
      reader.onloadend = () => {
        if (setPreviewImage !== undefined) {
          setPreviewImage(reader.result);
        }
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            async (blob) => {
              console.log(`Compressed file size: ${blob.size / 1024} KB`); // Logging the compressed file size
              if (fileName === undefined) {
                fileName = file.name;
              }
              const ordersRefStorage = ref(storage, folderName + '/' + uuidv4() + fileName);
              try {
                await uploadBytes(ordersRefStorage, blob);

                const downloadURL = await getDownloadURL(ordersRefStorage);

                if (onUploadFunction !== undefined) {
                  try {
                    await onUploadFunction(downloadURL);
                    setButtonText('Uploaded Successfully');
                    setLoading(false);
                  } catch (error) {
                    alert('Error uploading image. Please try again.');
                    return;
                  }
                }

                const downloadUrlSchema = Joi.string().uri().required();
                const { error } = downloadUrlSchema.validate(downloadURL);
                if (error) {
                  alert('Error uploading image. Please try again.');
                } else {
                  alert('Image uploaded successfully.');
                }
              } catch {
                alert('Error uploading image. Please try again.');
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
      reader.readAsDataURL(file);
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
            <FaImage className="text-2xl xl:text-4xl 2xl:text-5xl" />
          )}
        </label>
      </Button>
    </div>
  );
};

export default ImageUploadButton;
