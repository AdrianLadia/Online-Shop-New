import cloudFirestoreFunctions from './cloudFirestoreFunctions';
import axios from 'axios';
import Joi from 'joi';

class cloudFirestoreDb extends cloudFirestoreFunctions {
  constructor() {
    super();
  }

  async checkIfUserIdAlreadyExist(userId) {
    const userIdSchema = Joi.string();

    const { error } = userIdSchema.validate(userId);

    if (error) {
      throw new Error(error.message);
    }

    try {
      console.log('RAN');
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/checkIfUserIdAlreadyExist?userId=${userId}`
      );

      const toReturn = response.data;

      const toReturnSchema = Joi.boolean();

      const { error } = toReturnSchema.validate(toReturn);

      if (error) {
        alert(error.message);
        throw new Error(error.message);
      } else {
        return toReturn;
      }

      return response.data;
    } catch (error) {
      // Handle the 400 error messages
      const errorMessage = error.response.data;
      console.error('Error:', errorMessage);
      alert(errorMessage);
    }
  }

  async createNewUser(data, userId) {
    const schema = Joi.object({
      uid: Joi.string().required(),
      name: Joi.string(),
      email: Joi.string(),
      emailVerified: Joi.boolean(),
      phoneNumber: Joi.string().allow(''),
      deliveryAddress: Joi.array(),
      contactPerson: Joi.array(),
      isAnonymous: Joi.boolean(),
      orders: Joi.array(),
      cart: Joi.array(),
      favoriteItems: Joi.array(),
      payments: Joi.array(),
    }).unknown(false);

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }

    try {
      await this.createDocument(data, userId, 'Users');
    } catch (error) {
      // Handle the 400 error messages
      const errorMessage = error.response.data;
      console.error('Error:', errorMessage);
      alert(errorMessage);
    }
  }

  async readSelectedUserById(userId) {
    const userIdSchema = Joi.string();

    const { error } = userIdSchema.validate(userId);

    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }

    try {
      const res = await this.readSelectedDataFromCollection('Users', userId);
      return res;
    } catch (error) {
      // Handle the 400 error messages
      const errorMessage = error.response.data;
      console.error('Error:', errorMessage);
      alert(errorMessage);
    }
  }

  async transactionPlaceOrder(data) {
    const schema = Joi.object({
      userid: Joi.string().required(),
      username: Joi.string().required(),
      localDeliveryAddress: Joi.string().required(),
      locallatitude: Joi.number().required(),
      locallongitude: Joi.number().required(),
      localphonenumber: Joi.string().required(),
      localname: Joi.string().required(),
      orderDate: Joi.date().required(),
      cart: Joi.array().required(),
      itemstotal: Joi.number().required(),
      vat: Joi.number().required(),
      shippingtotal: Joi.number().required(),
      grandTotal: Joi.number().required(),
      reference: Joi.string().required(),
      userphonenumber: Joi.string().allow(''),
      deliveryNotes: Joi.string().allow(''),
      totalWeight: Joi.number().required(),
      deliveryVehicle: Joi.string().required(),
      needAssistance: Joi.boolean().required(),
    }).unknown(false);

    const { error } = schema.validate(data);

    const encodedData = encodeURIComponent(JSON.stringify(data));

    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/transactionPlaceOrder?data=${encodedData}`
      );
      alert('Order placed successfully');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle the 400 error messages
        const errorMessage = error.response.data;
        console.error('Error:', errorMessage);
        alert(errorMessage);
      } else {
        // Handle other errors
        console.error('An error occurred:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  }

  async readAllProductsForOnlineStore() {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/readAllProductsForOnlineStore`
      );
      const toReturn = response.data;
      const toReturnSchema = Joi.array().items(
        Joi.object({
          averageSalesPerDay: Joi.number().required(),
          brand: Joi.string().allow('').required(),
          category: Joi.string().required(),
          color: Joi.string().required().allow(''),
          description: Joi.string().required().allow(''),
          dimensions: Joi.string().required().allow(''),
          imageLinks: Joi.array(),
          itemId: Joi.string().required(),
          isCustomized: Joi.boolean().required(),
          itemName: Joi.string().required(),
          material: Joi.string().required().allow(''),
          parentProductID: Joi.string().required().allow(''),
          pieces: Joi.number().required(),
          price: Joi.number().required(),
          size: Joi.string().required().allow(''),
          stocksAvailable: Joi.number().required(),
          unit: Joi.string().required(),
          weight: Joi.number().required(),
        }).unknown(false))

        const {error} = toReturnSchema.validate(toReturn);

        if(error) {
          alert(error.message);
          throw new Error(error.message);
        }

        return toReturn;
    }



    catch(error) {
      if (error.response && error.response.status === 400) {
        // Handle the 400 error messages
        const errorMessage = error.response.data;
        console.error('Error:', errorMessage);
        alert(errorMessage);
      } else {
        // Handle other errors
        console.error('An error occurred:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  }

}

export default cloudFirestoreDb;
