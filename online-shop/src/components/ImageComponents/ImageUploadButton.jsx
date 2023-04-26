import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CircularProgress from '@mui/material/CircularProgress';

// import { storage } from './firebaseConfig';






const ImageUploadButton = (props) => {
  
  const folderName = props.folderName
  let fileName = props.fileName
  const buttonTitle = props.buttonTitle
  const storage = props.storage
  const setPreviewImage = props.setPreviewImage
  const onUploadFunction = props.onUploadFunction

  const [buttonColor, setButtonColor] = useState('primary')
  const [buttonText, setButtonText] = useState(buttonTitle)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    setLoading(true)
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
        fileName = file.name
      }

    
      const ordersRefStorage = ref(storage, folderName + '/' + fileName);
      
      uploadBytes(ordersRefStorage, file).then(async (snapshot) => {
        console.log(snapshot)
        console.log('Uploaded a blob or file!');
        setButtonColor('success')
        setButtonText('Uploaded Successful')
        setLoading(false)
        
        // GET IMAGE URL
        const downloadURL = await getDownloadURL(ordersRefStorage)
        console.log(downloadURL)
        
        if (onUploadFunction !== undefined) {
          onUploadFunction(downloadURL)
        }
      
      });
    }
    else {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (buttonText === 'Uploaded Successful') {
      setTimeout(() => {
        setButtonColor('primary')
        setButtonText(buttonTitle)
      }, 3000);
    }
  }, [buttonText]);

  // function

  return (
    <div>
      <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor="imageUpload">
        <Button variant="contained" component="span" color={buttonColor} sx={{width:250, height:45}}>
          {loading ? <CircularProgress size={30} color='inherit'/> : buttonText } 
        </Button>
        {/* <button type="button">Upload Image</button> */}
      </label>
      
    
    </div>
  );
};

export default ImageUploadButton;
