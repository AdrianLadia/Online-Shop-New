import cloudFirestoreFunctions from './cloudFirestoreFunctions';
import axios from 'axios';
import Joi from 'joi';
import schemas from './schemas/schemas';
import AppConfig from './AppConfig';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';



class cloudFirestoreDb extends cloudFirestoreFunctions {
  constructor(app, test = false) {
    super();
    const appConfig = new AppConfig();

    if (appConfig.getIsDevEnvironment() || test) {
      this.url = 'http://127.0.0.1:5001/online-store-paperboy/asia-southeast1/';
    } else {
      this.url = 'https://asia-southeast1-online-store-paperboy.cloudfunctions.net/';
    }

    this.functions = getFunctions(app);
    connectFunctionsEmulator(this.functions, 'localhost', 5001);
    this.functions.region = 'asia-southeast1';

    // if (appConfig.getIsDevEnvironment() || test) {
    //   this.functions.emulatorOrigin = 'http://localhost:5001';
    // }
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
      await this.updateDocumentFromCollection('Users', userId, { userRole: role });
    } catch (error) {
      throw new Error(error);
    }
  }

  async checkIfUserIdAlreadyExist(userId) {
    const userIdSchema = Joi.string();

    const { error } = userIdSchema.validate(userId);

    if (error) {
      throw new Error(error.message);
    }

    try {
      const response = await axios.get(`${this.url}checkIfUserIdAlreadyExist?userId=${userId}`);

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
    console.log(data);

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }

    try {
      await this.createDocument(data, userId, 'Users');
      await this.createDocument({
        messages: [],
        ownerUserId: userId,
        ownerName: data.name,
        referenceNumber: userId,
        isInquiry : true,
        adminReadAll : true,
        ownerReadAll : true,
      },userId,'ordersMessages')
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
      cart: Joi.object().required(),
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
      eMail: Joi.string().required(),
      sendEmail: Joi.boolean().required(),
      testing : Joi.boolean().required(),
      isInvoiceNeeded : Joi.boolean().required(),
      urlOfBir2303 : Joi.string().allow('',null),
    }).unknown(false);

    if (data['testing'] == null) {
      data['testing'] = false;
    }
    const { error } = schema.validate(data);


    const encodedData = encodeURIComponent(JSON.stringify(data));

    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }

   

    try {
      const response = await axios.post(`${this.url}transactionPlaceOrder?data=${encodedData}`);
      alert('Order placed successfully');
      return response;
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
      const response = await axios.get(`${this.url}readUserRole?data=${userId}`);

      const toReturn = response.data;
      const userRoleSchema = Joi.string().required();
      const { error2 } = userRoleSchema.validate(toReturn);

      if (error2) {
        alert(error2.message);
        throw new Error(error2.message);
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
      const response = await axios.request(`${this.url}readAllProductsForOnlineStore`);
      const toReturn = response.data;
      const schema = Joi.array().items(schemas.productSchema());

      const { error } = schema.validate(toReturn);

      // console.log(toReturn)
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

  async createPayment(data) {
    const paymentSchema = Joi.object({
      userId: Joi.string().required(),
      amount: Joi.number().required(),
      reference: Joi.string().required(),
      paymentprovider: Joi.string().required(),
    });

    const { error } = paymentSchema.validate(data);

    if (error) {
      console.log(error);
      return res.json({ status: 'error invlid data submitted' });
    }

    try {
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const response = await axios.post(`${this.url}createPayment?data=${encodedData}`);
      return response;
    } catch {
      console.log(error);
      alert('An error occurred. Please try again later.');
    }
  }

  async testPayMayaWebHookSuccess(data) {
    const dataSchema = schemas.mayaSuccessRequestSchema();

    const { error } = dataSchema.validate(data);

    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }

    try {
      const response = await axios.post(`${this.url}payMayaWebHookSuccess`, data);
      return response;
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

  async updateOrdersAsPaidOrNotPaid(userId) {
    const userIdSchema = Joi.string().required();

    const { error } = userIdSchema.validate(userId);

    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }

    try {
      const response = await axios.post(`${this.url}updateOrdersAsPaidOrNotPaid?data=${userId}`);
      return response;
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

  async transactionCreatePayment(data) {
    const dataSchema = Joi.object({
      userId: Joi.string().required(),
      amount: Joi.number().required(),
      reference: Joi.string().required(),
      paymentprovider: Joi.string().required(),
      proofOfPaymentLink: Joi.string(),
    });

    const { error } = dataSchema.validate(data);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const jsonData = JSON.stringify(data);

    // const res = await axios.post(`${this.url}sendEmail`, jsonData, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });

    try {
      const encodedData = encodeURIComponent(JSON.stringify(data));
      const response = await axios.post(`${this.url}transactionCreatePayment`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch {
      console.log(error);
      alert('An error occurred. Please try again later.');
    }
  }

  async updateOrderProofOfPaymentLink(
    orderReference,
    userId,
    proofOfPaymentLink,
    userName,
    paymentMethod,
    forTesting = false
  ) {
    try {
      const json = {
        orderReference: orderReference,
        userId: userId,
        proofOfPaymentLink: proofOfPaymentLink,
        userName: userName,
        paymentMethod: paymentMethod,
        forTesting: forTesting,
      };
      // const encodedData = encodeURIComponent(JSON.stringify({ orderReference,userId}));
      const res = await axios.post(`${this.url}updateOrderProofOfPaymentLink`, json);
      // const res = await axios.post(`${this.url}updateOrderProofOfPaymentLink?data=${encodedData}&proofOfPaymentLink=${proofOfPaymentLink}`)
      const data = res.data;
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendEmail(data) {
    const dataSchema = Joi.object({
      to: Joi.string().required(),
      subject: Joi.string().required(),
      text: Joi.string().required(),
    }).unknown(false);

    const { error } = dataSchema.validate(data);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const jsonData = JSON.stringify(data);

    try {

      const res = await axios.post(`${this.url}sendEmail`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resData = res.data;
      return resData;
    } catch (error) {
      console.log(error);
      alert('Error sending email.');
      return { status: 'error' };
    }
  }

  async deleteOldOrders() {
    try {
      const res = await axios.get(`${this.url}deleteOldOrders`);
      const data = res.data;
      return data;
    } catch (error) {
      console.log(error);
      alert('Error deleting old orders.');
      return { status: 'error' };
    }
  }

  async transactionCancelOrder(data) {
    const dataSchema = Joi.object({
      orderReference: Joi.string().required(),
      userId: Joi.string().required(),
    });

    const { error } = dataSchema.validate(data);

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }

    const jsonData = JSON.stringify(data);

    try {
      const res = await axios.post(`${this.url}transactionCancelOrder`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resData = res.data;
      alert('Order cancelled successfully');
      return resData;
    } catch (error) {
      console.log(error);
      alert('Error cancelling order.');
      return { status: 'error' };
    }
  }

  async addDepositToAffiliate(data) {
    const jsonData = JSON.stringify(data);
    const res = await axios.post(`${this.url}addDepositToAffiliate`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res
  }

  async onAffiliateClaim(data) {
    const jsonData = JSON.stringify(data);
    const res = await axios.post(`${this.url}onAffiliateClaim`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res
  }

  // async addClaimsToAffiliate(data) {
  //   const jsonData = JSON.stringify(data);
  //   const res = await axios.post(`${this.url}addClaimsToAffiliate`, jsonData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   return res
  // }

  // async changeCommissionStatusToPending(data) {
  //   const jsonData = JSON.stringify(data);
  //   const res = await axios.post(`${this.url}changeCommissionStatusToPending`, jsonData, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   return res
  // }

  async addDepositToAffiliateDeposits(data) {
    const jsonData = JSON.stringify(data);
    const res = await axios.post(`${this.url}addDepositToAffiliateDeposits`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res
  }

  async markAffiliateClaimDone(data) {
    const jsonData = JSON.stringify(data);
    const res = await axios.post(`${this.url}markAffiliateClaimDone`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res
  }

}

export default cloudFirestoreDb;
