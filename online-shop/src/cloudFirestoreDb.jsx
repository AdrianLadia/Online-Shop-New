import cloudFirestoreFunctions from './cloudFirestoreFunctions';
import axios from 'axios';
import Joi from 'joi';
import schemas from './schemas/schemas';
import AppConfig from './AppConfig';

class cloudFirestoreDb extends cloudFirestoreFunctions {
  constructor() {
    super();
    const appConfig = new AppConfig();
    if (appConfig.getIsDevEnvironment()) {
      this.url = 'http://127.0.0.1:5001/online-store-paperboy/asia-southeast1/'
    }
    else {
      this.url = 'https://asia-southeast1-online-store-paperboy.cloudfunctions.net/'
    }
  }

  async changeUserRole(userId, role) {
    const userIdSchema = Joi.string();
    const roleSchema = Joi.string();

    const { error: userIdError } = userIdSchema.validate(userId);
    const { error: roleError } = roleSchema.validate(role);

    if (userIdError || roleError) {
      throw new Error(userIdError || roleError);
    }

    try {
      await this.updateDocumentFromCollection('Users', userId, {userRole: role})
    }
    catch (error) {
      throw new Error(error)
    }
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
        `${this.url}checkIfUserIdAlreadyExist?userId=${userId}`
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
    const schema = schemas.userSchema();

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
        `${this.url}transactionPlaceOrder?data=${encodedData}`
      );
      return response
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

  async readUserRole(userId) {
    const userIdSchema = Joi.string();

    const { error1 } = userIdSchema.validate(userId);

    if (error1) {
      alert(error1.message);
      throw new Error(error1.message);
    }

    try {
      const response = await axios.get(
        `${this.url}readUserRole?data=${userId}`
      );

      const toReturn = response.data;
      const userRoleSchema = Joi.string().required();
      const { error2 } = userRoleSchema.validate(toReturn);

      if (error2) {
        alert(error2.message);
        throw new Error(error.message);
      }

      return toReturn;
    } catch (error) {
      // Handle the 400 error messages
      const errorMessage = error.response.data;
      console.error('Error:', errorMessage);
      alert(errorMessage);
    }
  }


  async readAllProductsForOnlineStore() {
    try {
      const response = await axios.request(
        `${this.url}readAllProductsForOnlineStore`
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
        }).unknown(false)
      );

      const { error } = toReturnSchema.validate(toReturn);

      if (error) {
        alert(error.message);
        throw new Error(error.message);
      }

      return toReturn;
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
}

export default cloudFirestoreDb;
