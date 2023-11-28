import axios from 'axios';
import Joi from 'joi';
import retryApi from '../utils/retryApi';
import AppConfig from './AppConfig';
import { getFunctions } from 'firebase/functions';

class cloudFirestoreFunctions {
  constructor(app, test = false) {
    const appConfig = new AppConfig();

    if (appConfig.getIsDevEnvironment() || test) {
      this.url = 'http://127.0.0.1:5001/online-store-paperboy/asia-southeast1/';
    } else {
      this.url = 'https://asia-southeast1-online-store-paperboy.cloudfunctions.net/';
    }
    this.functions = getFunctions(app);
  }

  async createDocument(firestoreData, id, collection) {
    const firestoreDataSchema = Joi.object();
    const idSchema = Joi.string();
    const collectionSchema = Joi.string();

    const { error1 } = firestoreDataSchema.validate(firestoreData);
    const { error2 } = idSchema.validate(id);
    const { error3 } = collectionSchema.validate(collection);

    if (error1 || error2 || error3) {
      throw new Error('Data Validation Error');
    }

    const encodedData = encodeURIComponent(JSON.stringify({ collection, id, firestoreData }));
    try {
      let response;
      await retryApi(async () => {
        const response = await axios.post(`${this.url}createDocument?data=${encodedData}`,{},{
          headers: {
            'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
          }});
      });

      return response.data;
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async readAllDataFromCollection(collectionName) {
    const collectionNameSchema = Joi.string();

    const { error1 } = collectionNameSchema.validate(collectionName);

    if (error1) {
      throw new Error('Data Validation Error');
    }

    try {
      let response;
      await retryApi(async () => {
        response = await axios.get(`${this.url}readAllDataFromCollection?collectionName=${collectionName}`,{
          headers: {
            'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
          }});
      });
      const toReturn = response.data;
      const toReturnSchema = Joi.array();
      const { error2 } = toReturnSchema.validate(toReturn);
      if (error2) {
        throw new Error('Data Validation Error');
      } else {
        return toReturn;
      }
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async readAllIdsFromCollection(collectionName) {
    const collectionNameSchema = Joi.string();

    const { error1 } = collectionNameSchema.validate(collectionName);

    if (error1) {
      throw new Error('Data Validation Error');
    }

    try {
      let response;
      await retryApi(async () => {
        response = await axios.get(`${this.url}readAllIdsFromCollection?collectionName=${collectionName}`,{
          headers: {
            'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
          }});
      });

      const toReturn = response.data;
      const toReturnSchema = Joi.array();
      const { error2 } = toReturnSchema.validate(toReturn);
      if (error2) {
        throw new Error('Data Validation Error');
      } else {
        return toReturn;
      }
    } catch (error) {
      console.error('Error reading document:', error);
    }
  }

  async readSelectedDataFromCollection(collectionName, id) {
    const collectionNameSchema = Joi.string();
    const idSchema = Joi.string();

    const { error1 } = collectionNameSchema.validate(collectionName);
    const { error2 } = idSchema.validate(id);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }

    const encodedData = encodeURIComponent(JSON.stringify({ collectionName, id }));
    try {
      let response;
      await retryApi(async () => {
        response = await axios.get(`${this.url}readSelectedDataFromCollection?data=${encodedData}`,{
          headers: {
            'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
          }});
      });

      const toReturn = response.data;
      const toReturnSchema = Joi.object();
      const { error3 } = toReturnSchema.validate(toReturn);
      if (error3) {
        throw new Error('Data Validation Error');
      } else {
        return toReturn;
      }
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async deleteDocumentFromCollection(collectionName, id) {
    const collectionNameSchema = Joi.string();
    const idSchema = Joi.string();

    const { error1 } = collectionNameSchema.validate(collectionName);
    const { error2 } = idSchema.validate(id);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }

    const encodedData = encodeURIComponent(JSON.stringify({ collectionName, id }));
    try {
      let response;
      await retryApi(async () => {
        response = await axios.delete(`${this.url}deleteDocumentFromCollection?data=${encodedData}`,{
          headers: {
            'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
          }});
      });
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  async updateDocumentFromCollection(collectionName, id, firestoreData) {
    const collectionNameSchema = Joi.string();
    const idSchema = Joi.string();
    const firestoreDataSchema = Joi.object();

    const { error1 } = collectionNameSchema.validate(collectionName);
    const { error2 } = idSchema.validate(id);
    const { error3 } = firestoreDataSchema.validate(firestoreData);

    if (error1 || error2 || error3) {
      throw new Error('Data Validation Error');
    }

    const jsonData = JSON.stringify({ collectionName, id, firestoreData });

    try {
      let response;
      await retryApi(async () => {
        response = await axios.post(`${this.url}updateDocumentFromCollection`, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
          },
        });
      });
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }
}

export default cloudFirestoreFunctions;
