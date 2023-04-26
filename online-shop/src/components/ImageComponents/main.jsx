import React from 'react';
import ImageUploadButton from './ImageUploadButton';
import Image from './Image';
import firebaseConfig from '../../firebase_config';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';

const ImageUpload = (props) => {
  const folderName = props.folderName;

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <div>
      <ImageUploadButton
        setPreviewImage={setPreviewImage}
        storage={storage}
        folderName={'orderChat'}
        buttonTitle={'Upload Image'}
      />
      <Image previewImage={previewImage} />
    </div>
  );
};

export default ImageUpload;
