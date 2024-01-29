import cloudFirestoreFunctions from './cloudFirestoreFunctions';
import axios from 'axios';
import Joi from 'joi';
import schemas from './schemas/schemas';
import AppConfig from './AppConfig';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import mayaCheckoutPaymentOptions from './data/mayaCheckoutPaymentOptions';
import App from './App';

class cloudFirestoreDb extends cloudFirestoreFunctions {
  constructor(app, test = false, fbclid = undefined, userdata = undefined) {
    super();
    this.fbclid = fbclid;
    this.userdata = userdata;
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

  async updateProductSearchIndex() {
    const res = await axios.get(`${this.url}updateProductSearchIndex`,{
      headers: {
        'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
      }
    });
    // return res;
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
      const response = await axios.get(`${this.url}checkIfUserIdAlreadyExist?userId=${userId}`,{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }
      });

      const toReturn = response.data;

      const toReturnSchema = Joi.boolean();

      const { error } = toReturnSchema.validate(toReturn);

      if (error) {
        alert(error.message);
        throw new Error(error.message);
      } else {
        return toReturn;
      }
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
      await this.createDocument(
        {
          messages: [],
          ownerUserId: userId,
          ownerName: data.name,
          referenceNumber: userId,
          isInquiry: true,
          adminReadAll: true,
          ownerReadAll: true,
          delivered: false,
        },
        userId,
        'ordersMessages'
      );
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
      userid: Joi.string().required().allow(null),
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
      userphonenumber: Joi.string().required().allow('',null),
      deliveryNotes: Joi.string().allow(''),
      totalWeight: Joi.number().required(),
      deliveryVehicle: Joi.string().required(),
      needAssistance: Joi.boolean().required(),
      eMail: Joi.string().required().allow(null),
      sendEmail: Joi.boolean().required(),
      testing: Joi.boolean().required(),
      isInvoiceNeeded: Joi.boolean().required(),
      urlOfBir2303: Joi.string().allow('', null),
      countOfOrdersThisYear: Joi.number().required(),
      deliveryDate: Joi.date().required(),
      paymentMethod: Joi.string().required(),
      userRole : Joi.string().required(),
      affiliateUid : Joi.string().required().allow(null),
      kilometersFromStore : Joi.number().required(),
    }).unknown(false);

    if (data['testing'] == null) {
      data['testing'] = false;
    }
    const { error } = schema.validate(data);

    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
    
    
    
    
    const encodedData = encodeURIComponent(JSON.stringify(data));
    
    if (error) {
      alert(error.message);
      throw new Error(error.message);
    }
    
    try {
      const response = await axios.post(
        `${this.url}transactionPlaceOrder?data=${encodedData}`,
        {}, // This is the body, which is empty in this case
        {
          headers: {
            'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
          }
        }
      );
      
      const paymentOptions = new mayaCheckoutPaymentOptions().getMayaCheckoutPaymentOptions()
      if (!paymentOptions.includes(data.paymentMethod)) {
        const paymentId = generateRandomString(30);
        await this.updateOrderProofOfPaymentLink(data.reference,data.userid ? data.userid : 'GUEST',paymentId,data.localname,data.paymentMethod,data.grandTotal)
      }
      return response;
    } catch (error) {
      // Handle other errors
      return error.response;
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
      const response = await axios.get(`${this.url}readUserRole?data=${userId}`,{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }
      });

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

  async readSelectedDataFromOnlineStore(productId) {
    if (productId == 'null') {
      return;
    }

    try {
      const jsonData = JSON.stringify({ productId: productId });
      const res = await axios.post(`${this.url}readSelectedDataFromOnlineStore`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg',
        },
      });
      return res.data;
    } catch (error) {
      console.log(productId);
      console.log(error);
      // throw new Error(error);
    }
  }

  async readAllProductsForOnlineStore(category) {
    try {
      const response = await axios.request(`${this.url}readAllProductsForOnlineStore?category=${category}`,{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }});
      const toReturn = response.data;
      const schema = Joi.array().items(schemas.productSchema());

      const { error } = schema.validate(toReturn);

      if (error) {
        console.log(error);
        const indexMatch = error.message.match(/\[(\d+)\]/);
        let index;
        if (indexMatch) {
          index = parseInt(indexMatch[1], 10);
        } else {
          console.log('Index not found in the error message.');
        }

        const jsonString = JSON.stringify(toReturn[index]);
        const message = error.message + ' |||||| ' + jsonString;
        new AppConfig().getFirestoreDeveloperEmail().forEach((email) => {
          this.sendEmail({ to: email, subject: 'Error on productData', text: message });
        });
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
      const response = await axios.post(`${this.url}createPayment?data=${encodedData}`,{},{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }});
      return response;
    } catch {
      console.log(error);
      alert('An error occurred. Please try again later.');
    }
  }

  async testPayMayaEndpoint(data) {
    const response = await axios.post(`${this.url}payMayaEndpoint`, data);
    return response;
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
      const response = await axios.post(`${this.url}updateOrdersAsPaidOrNotPaid?data=${userId}`,{},{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }});
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

    try {
      const jsonData = JSON.stringify(data);
      const response = await axios.post(`${this.url}transactionCreatePayment`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg',
        },
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateOrderProofOfPaymentLink(
    orderReference,
    userId,
    proofOfPaymentLink,
    userName,
    paymentMethod,
    amount = null,
    forTesting = false
  ) {
    const json = {
      orderReference: orderReference,
      userId: userId,
      proofOfPaymentLink: proofOfPaymentLink,
      userName: userName,
      paymentMethod: paymentMethod,
      amount: amount,
      forTesting: forTesting,
    };

    const jsonData = JSON.stringify(json);

    try {
      const res = await axios.post(`${this.url}updateOrderProofOfPaymentLink`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg',
        },
      });
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
          'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
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
      const res = await axios.get(`${this.url}deleteOldOrders`,{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }});
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
          'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
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
        'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
      },
    });
    return res;
  }

  async onAffiliateClaim(data) {
    const jsonData = JSON.stringify(data);
    try {
      const res = await axios.post(`${this.url}onAffiliateClaim`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
        },
      });
      console.log(res);
      return res;
    }
    catch (error) {
      return error
    }
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
        'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
      },
    });
    return res;
  }

  async markAffiliateClaimDone(data) {
    const jsonData = JSON.stringify(data);
    const res = await axios.post(`${this.url}markAffiliateClaimDone`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
      },
    });
    return res;
  }

  async getIpAddress() {
    if ( window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      const res = await axios.get(`https://api64.ipify.org/?format=json`,{
        headers: {
          'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
        }});
      return res.data.ip;
    }
  }

  async getAllAffiliateUsers() {
    const res = await axios.get(`${this.url}getAllAffiliateUsers`,{
      headers: {
        'apikey': 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' // Replace 'YOUR_API_KEY' with your actual API key
      }});
    return res.data;
  }

  async readSelectedOrder(reference, userId) {
    const jsonData = JSON.stringify({ reference, userId });
    try {
      const res = await axios.post(`${this.url}readSelectedOrder`, jsonData, {
        headers: { 'Content-Type': 'application/json',
        'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg' },
      });
      return res.data;
    }
    catch (error) {
      console.log(error);
      return
    }
  }

  async voidPayment(data) {
    const jsonData = JSON.stringify(data);
    try {
      const res = await axios.post(`${this.url}voidPayment`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
        },
      });
      return res.data;
    } catch {
      throw new Error('Error voiding payment');
    }
  }

  async editCustomerOrder(data) {
    const jsonData = JSON.stringify(data);
    try {
      const res = await axios.post(`${this.url}editCustomerOrder`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
        },
      });
      return res.data;
    } catch {
      throw new Error('Error editing order');
    }
  }
  async postToConversionApi(event_name, custom_parameters, guestEmail, guestPhone, guestName) {
    // get fbp
    let fbp;
    try {
      fbp = document.cookie
        .split('; ')
        .find((row) => row.startsWith('_fbp='))
        .split('=')[1];
    } catch {
      fbp = undefined;
    }

    // // get fbc
    let fbc;
    if (this.fbclid == null) {
      fbc = undefined;
    } else {
      const unixTimestamp = Math.round(+new Date() / 1000);
      fbc = 'fb.1.' + unixTimestamp.toString() + '.' + this.fbclid;
    }

    const data = {
      event_name: event_name,
      event_source_url: window.location.href,
      custom_parameters: custom_parameters,
      fbc: fbc,
      fbp: fbp,
      email: this.userdata?.email || guestEmail,
      phone: this.userdata?.phoneNumber || guestPhone,
      name: this.userdata?.name || guestName,
    };

    if (new AppConfig().getIsDevEnvironment() == false) {
    const res = await axios.post(`${this.url}postToConversionApi`, data, {
      headers: {
        'Content-Type': 'application/json',
        'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
      },
    });    
    return res;
  }
  }

  async payMayaCheckout({ payload, isSandbox }) {
    const data = {
      payload: payload,
      isSandbox: isSandbox,
    };

    const res = await axios.post(`${this.url}payMayaCheckout`, data, {
      headers: {
        'Content-Type': 'application/json',
        'apikey' : 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg'
      },
    });

    return res;
  }


}

export default cloudFirestoreDb;
