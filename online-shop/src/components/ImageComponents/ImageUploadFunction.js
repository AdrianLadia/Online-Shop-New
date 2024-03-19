import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';

const uploadFileToFirebaseStorage = async ({ file, fileName, folderName, storage, resize }) => {
  // Perform image upload operations here
  if (fileName === undefined) {
    fileName = file.name;
  }

  const _uuidv4 = uuidv4();
  const ordersRefStorage = ref(storage, folderName + '/' + _uuidv4 + fileName);
  let downloadURLResized;
  let downloadURL;

  try {
    await uploadBytes(ordersRefStorage, file).then(async (snapshot) => {
      // GET IMAGE URL
      downloadURL = await getDownloadURL(ordersRefStorage);

      if (resize) {
        console.log(resize);
        const resizedFileName = fileName.split('.')[0] + '_612x820.' + fileName.split('.')[1];
        const resizedRefStorage = ref(storage, folderName + '/' + _uuidv4 + resizedFileName);
        let retries = 0;
        while (downloadURLResized === undefined) {
          if (retries > 10) {
            throw new Error('Error uploading image. Please try again.');
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
          try {
            downloadURLResized = await getDownloadURL(resizedRefStorage);
            deleteObject(ordersRefStorage);
          } catch {
            retries++;
          }
        }
      }
    });
  } catch (e) {
    console.log(e);
    throw new Error('Error uploading image. Please try again.');
  }

  if (resize) {
    return downloadURLResized;
  } else {
    return downloadURL;
  }
};

export default uploadFileToFirebaseStorage;
