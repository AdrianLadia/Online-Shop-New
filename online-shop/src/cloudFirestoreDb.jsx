import cloudFirestoreFunctions from './cloudFirestoreFunctions';
import axios from 'axios';
import Joi from 'joi';

class cloudFirestoreDb extends cloudFirestoreFunctions {
  constructor() {
    super();
  }

  async checkIfUserIdAlreadyExist(userId) {
    try {
      console.log('RAN');
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/checkIfUserIdAlreadyExist?userId=${userId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error);
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
      throw new Error(error.message);
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/transactionPlaceOrder?data=${encodedData}`
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default cloudFirestoreDb;
