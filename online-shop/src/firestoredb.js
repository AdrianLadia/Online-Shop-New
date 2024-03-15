import firestorefunctions from './firestorefunctions.js';
import Joi from 'joi';
import schemas from './schemas/schemas.js';
import retryApi from '../utils/retryApi.js';
import { query, where, collection, getDocs, runTransaction, doc } from 'firebase/firestore';


class firestoredb extends firestorefunctions {
  constructor(app, emulator = false) {
    super(app, emulator);
  }

  // USED FOR ADMIN INVENTORY
  async createProduct(data, id, products) {
    const schema = schemas.productSchema();

    const { error } = schema.validate(data);

    if (error) {
      alert(error);
      throw new Error(error);
      return;
    }

    let foundSimilarProductId = false;
    products.map((product) => {
      if (product.itemId === data.itemId) {
        foundSimilarProductId = true;
        return;
      }
    });

    if (foundSimilarProductId) {
      alert('Product ID already exists');
      return;
    }

    await retryApi(async () => await super.createDocument(data, id, 'Products'));
    alert(data.itemId + ' created successfully');
  }

  async readAllProducts() {
    const products = await retryApi(async () => await super.readAllDataFromCollection('Products'));
    const productsSchema = Joi.array().items(schemas.productSchema());

    try {
      await productsSchema.validateAsync(products);
    } catch (error) {
      throw new Error(error);
    }

    return products;
  }

  async readSelectedProduct(id) {
    const product = await retryApi(async () => await super.readSelectedDataFromCollection('Products', id));
    const productsSchema = schemas.productSchema();

    try {
      await productsSchema.validateAsync(product);
    } catch (error) {
      throw new Error(error);
    }

    return product;
  }

  async deleteProduct(id) {
    await retryApi(async () => await super.deleteDocumentFromCollection('Products', id));
  }

  async updateProduct(id, data) {
    const schema = Joi.object({
      itemName: Joi.string().required(),
      unit: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required().allow(''),
      weight: Joi.number().required(),
      dimensions: Joi.string().allow(null, ''),
      category: Joi.string().required(),
      imageLinks: Joi.array(),
      brand: Joi.string().allow(null, ''),
      pieces: Joi.number().required(),
      color: Joi.string().allow(null, ''),
      material: Joi.string().allow(null, ''),
      size: Joi.string().allow(null, ''),
      parentProductID: Joi.string().allow(null, ''),
      isCustomized: Joi.boolean().required(),
      piecesPerPack: Joi.number(),
      packsPerBox: Joi.number(),
      cbm: Joi.number().allow('', null),
      boxImage: Joi.string().uri().allow(null, ''),
      costPrice: Joi.number().allow('', null),
      freightCost: Joi.number().allow('', null),
    }).unknown(false);

    try {
      await schema.validateAsync(data);
    } catch (error) {
      throw new Error(error);
    }
    try {
      await retryApi(async () => await super.updateDocumentFromCollection('Products', id, data));
    } catch (error) {
      throw new Error(error);
    }
  }

  // USED FOR STOREFRONT

  async createCategory(categoryId) {
    const schema = Joi.string().required();

    try {
      await schema.validateAsync(categoryId);
    } catch (error) {
      throw new Error(error);
    }

    await retryApi(async () => {
      super.createDocument(
        {
          category: categoryId
            .split(' ')
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(' '),
        },
        categoryId
          .split(' ')
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(' '),
        'Categories'
      );
    });
  }

  async readAllCategories() {
    const categories = await retryApi(async () => await super.readAllDataFromCollection('Categories'));

    const categoriesSchema = Joi.array();

    try {
      await categoriesSchema.validateAsync(categories);
    } catch (error) {
      throw new Error(error);
    }

    return categories;
  }

  async readAllUserIds() {
    const ids = await retryApi(async () => await super.readAllIdsFromCollection('Users'));

    const idsSchema = Joi.array().items(Joi.string().required());

    try {
      await idsSchema.validateAsync(ids);
    } catch (error) {
      throw new Error(error);
    }

    return ids;
  }

  async readAllUsers() {
    const users = await retryApi(async () => await super.readAllDataFromCollection('Users'));
    return users;
  }

  async createNewUser(data, id) {
    const schema = schemas.userSchema();

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }

    retryApi(async () => await super.createDocument(data, id, 'Users'));
  }

  async readUserById(id) {
    const user = retryApi(async () => await super.readSelectedDataFromCollection('Users', id));
    return user;
  }

  async addItemToFavorites(userid, data) {
    await retryApi(async () => await super.addDocumentArrayFromCollection('Users', userid, data, 'favoriteItems'));
  }

  async removeItemFromFavorites(userid, data) {
    await retryApi(async () => await super.deleteDocumentFromCollectionArray('Users', userid, data, 'favoriteItems'));
  }

  async createUserCart(data, userid) {
    try {
      await retryApi(async () => {
        super.updateDocumentFromCollection('Users', userid, {
          cart: data,
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAllUserCart(userid) {
    await retryApi(async () => {
      super.updateDocumentFromCollection('Users', userid, {
        cart: [],
      });
    });
  }

  async readUserAddress(userid) {
    const user = retryApi(async () => await super.readSelectedDataFromCollection('Users', userid));

    return user.deliveryaddress;
  }

  async deleteAddress(userid, latitude, longitude, address) {
    await retryApi(async () => {
      super.deleteDocumentFromCollectionArray(
        'Users',
        userid,
        { latitude: latitude, longitude: longitude, address: address },
        'deliveryAddress'
      );
    });
  }

  async readUserContactPersons(userid) {
    const user = retryApi(async () => await super.readSelectedDataFromCollection('Users', userid));

    return user.contactPerson;
  }

  async deleteUserContactPersons(userid, name, phoneNumber) {
    await retryApi(async () => {
      await super.deleteDocumentFromCollectionArray(
        'Users',
        userid,
        { name: name, phoneNumber: phoneNumber },
        'contactPerson'
      );
    });
  }

  async updateLatitudeLongitude(userid, latitude, longitude) {
    await retryApi(async () => {
      await super.updateDocumentFromCollection('Users', userid, {
        latitude: latitude,
        longitude: longitude,
      });
    });
  }

  async updatePhoneNumber(userid, phoneNumber) {
    await retryApi(async () => {
      await super.updateDocumentFromCollection('Users', userid, {
        phoneNumber: phoneNumber,
      });
    });
  }

  async createTestCollection() {
    await retryApi(async () => {
      super.createDocument({ name: 'test' }, 'test', 'test');
    });
  }

  async readTestCollection() {
    const data = await retryApi(async () => await super.readAllDataFromCollection('test', 'test'));
    //  const data2 = await super.readAllDataFromCollection('test');
    return data;
  }

  async deleteTestCollection() {
    await retryApi(async () => {
      super.deleteDocumentFromCollection('test', 'test');
    });
  }

  async readAllOrders() {
    const orders = [];
    const userdata = await super.readAllDataFromCollection('Users').then((data) => {
      data.map((user) => {
        user.orders.map((order) => {
          orders.push(order);
        });
      });
    });
    return orders;
  }

  async readAllNotDeliveredOrders() {
    const ordersRef = collection(this.db, 'Orders');
    const q = query(ordersRef, where('delivered', '==', false));
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });
    return orders;
  }

  async readAllPaidOrders() {
    const orders = super.readAllOrders().then((orders) => {
      const paidorders = orders.filter((order) => {
        return order.paid === true;
      });
      return paidorders;
    });
  }

  async readAllParentProducts() {
    const parentProducts = [];
    const products = await this.readAllProducts();
    products.map((product) => {
      if (product.parentProductId === '') {
        parentProducts.push(product.itemId);
      }
    });
    return parentProducts;
  }

  async deleteUserByUserId(userId) {
    await super.deleteDocumentFromCollection('Users', userId);
  }

  async readProductStocksAvailable(productId) {
    const product = await this.readSelectedProduct(productId);
    return product.stocksAvailable;
  }

  async updateProductStocksAvailable(productId, stocksAvailable) {
    super.updateDocumentFromCollection('Products', productId, {
      stocksAvailable: stocksAvailable,
    });
  }

  async addOrderDataToTests(orderData) {
    super.updateDocumentFromCollection('Tests', 'orderData', { data: orderData });
  }

  async deleteOrderFromCollectionArray(userId, orderReference) {
    try {
      // Get the user document
      const userData = await this.readUserById(userId);
      const userDoc = userData;

      if (userDoc === undefined) {
        return;
      }

      // Get the orders array from the user document
      const orders = userDoc.orders;

      // Find the index of the order with the specified reference number
      const orderIndex = orders.findIndex((order) => order.reference === orderReference);

      // If order is found, remove it from the orders array
      if (orderIndex !== -1) {
        orders.splice(orderIndex, 1);

        // Update the user document with the new orders array
        // await userDocRef.update({
        //   orders: orders,
        // });

        await super.updateDocumentFromCollection('Users', userId, { orders: orders });
      } else {
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }

  async readAllOrderMessages() {
    return await this.readAllDataFromCollection('ordersMessages');
  }

  async readOrderMessageByReference(reference) {
    return await this.readSelectedDataFromCollection('ordersMessages', reference);
  }

  async updateOrderMessageAsRead(reference, data) {
    this.updateDocumentFromCollection('ordersMessages', reference, { ['messages']: data });
  }

  async updateOrderMessageMarkAsAdminReadAll(reference, data) {
    this.updateDocumentFromCollection('ordersMessages', reference, { adminReadAll: data });
  }

  async updateOrderMessageMarkAsOwnerReadAll(reference, data) {
    this.updateDocumentFromCollection('ordersMessages', reference, { ownerReadAll: data });
  }

  async readPayments() {
    return await this.readAllDataFromCollection('Payments');
  }
  // NOT USING THIS IF IN THE TRANSACTION CREATE PAYMENT CLOUD FIRESTORE WILL BE COMBINED WITH THIS FUNCTION

  async updatePaymentStatusDeclined(reference) {
    const referenceSchema = Joi.string().required();

    const { error2 } = referenceSchema.validate(reference);

    if (error2) {
      throw new Error(error2);
    }

    const paymentsRef = collection(this.db, 'Payments');
    const q = query(paymentsRef, where('orderReference', '==', reference));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.updateDocumentFromCollection('Payments', doc.id, { status: 'declined' });
    });
  }

  async deleteDeclinedPayment(reference, userId, link) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const userRef = doc(this.db, 'Users/', userId);
        const userRefDoc = await transaction.get(userRef);
        const userDoc = userRefDoc.data();
        const orders = userDoc.orders;

        const orderRef = doc(this.db, 'Orders/', reference);
        const orderRefDoc = await transaction.get(orderRef);
        const orderData = orderRefDoc.data();
        const oldProofOfPaymentLink = orderData.proofOfPaymentLink;

        const newProofOfPaymentLink = oldProofOfPaymentLink.filter((url) => {
          if (url != link) {
            return url;
          }
        });

        transaction.update(orderRef, { proofOfPaymentLink: newProofOfPaymentLink });

        const paymentsRef = collection(this.db, 'Payments');
        const q = query(paymentsRef, where('proofOfPaymentLink', '==', link));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          transaction.update(doc.ref, { status: 'declined' });
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addProductInteraction(userId, itemName, timeStamp) {
    const productInteraction = {
      itemName: itemName,
      dateTime: timeStamp,
    };
    this.addDocumentArrayFromCollection('Users', userId, productInteraction, 'productInteraction');
  }

  async sendProofOfPaymentToOrdersMessages(reference, url, dateTime, userId, userRole) {
    const messages = {
      dateTime: dateTime,
      image: url,
      message: '',
      read: false,
      userId: userId,
      userRole: userRole,
    };
    this.addDocumentArrayFromCollection('ordersMessages', reference, messages, 'messages');
  }

  async updateProductClicks(productid, userdata) {
    let id = productid;
    if (productid.endsWith('-RET')) {
      id = productid.substring(0, productid.length - 4);
    }

    if (
      !['affiliate', 'superAdmin', 'admin', 'driver'].includes(userdata ? userdata.role : null) ||
      userdata == null
    ) {
      await super.addDocumentArrayFromCollection('Products', id, { date: new Date(), userId: userdata ? userdata.uid : 'GUEST' }, 'clicks');
    }
  }

  async readAllPaymentProviders() {
    return await super.readAllDataFromCollection('PaymentProviders');
  }

  async readEmailAddressByUserId(userId) {
    const userData = await this.readUserById(userId);
    return userData.email;
  }

  async readAllMachines() {
    return await super.readAllDataFromCollection('Machines');
  }

  async readAllClaims(ids) {
    try {
      const userDataArray = await Promise.all(
        ids.map(async (id) => {
          const userData = await this.readUserById(id);
          if (userData.userRole == 'affiliate') {
            return userData.affiliateClaims;
          }
        })
      );
      const affiliateUserData = userDataArray.filter((userData) => userData !== undefined);
      return affiliateUserData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addBir2303Link(userId, url) {
    await this.updateDocumentFromCollection('Users', userId, { bir2303Link: url });
  }

  async deleteBir2303Link(userId) {
    await this.updateDocumentFromCollection('Users', userId, { bir2303Link: null });
  }

  async addDataToPageOpens(data) {
    await this.addDocumentArrayFromCollection(
      'Security',
      'pageOpens',
      { ipAddress: data.ipAddress, dateTime: data.dateTime, pageOpened: data.pageOpened },
      'data'
    );
  }

  async readAllUnpaidOrdersByUserId(userId) {
    const orderRef = collection(this.db, 'Orders');
    const q = query(orderRef, where('userId', '==', userId), where('paid', '==', false));
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });
    return orders;
  }

  async readAllAvailableAffiliateBankAccounts(userId) {
    const userData = await super.readSelectedDataFromCollection('Users', userId);
    const affiliateBankAccounts = userData.affiliateBankAccounts;
    return affiliateBankAccounts;
  }

  async updateAffiliateBankAccount(userId, data) {
    try {
      const dataSchema = Joi.object({})
        .keys({
          bank: Joi.string().required(),
          accountName: Joi.string().required(),
          accountNumber: Joi.string().required(),
        })
        .unknown(true);

      const { error } = dataSchema.validate(data);

      if (error) {
        throw new Error(error);
      }

      const affiliateUserData = await this.readSelectedDataFromCollection('Users', userId);
      const oldAffiliateBankAccount = affiliateUserData.affiliateBankAccounts;
      let newAffiliateBankAccount = [];
      const bankName = data.bank;
      const bankAccountUserName = data.accountName;
      const bankAccountNumber = data.accountNumber;
      let foundAccountToBeUpdated = false;
      oldAffiliateBankAccount.forEach((bankAccount) => {
        if (bankAccount.bank == bankName) {
          foundAccountToBeUpdated = true;
        }
      });

      if (foundAccountToBeUpdated) {
        oldAffiliateBankAccount.forEach((bankAccount) => {
          if (bankAccount.bank == bankName) {
            bankAccount.accountName = bankAccountUserName;
            bankAccount.accountNumber = bankAccountNumber;
          }
        });
        newAffiliateBankAccount = oldAffiliateBankAccount;
      } else {
        newAffiliateBankAccount = [
          ...oldAffiliateBankAccount,
          { bank: bankName, accountName: bankAccountUserName, accountNumber: bankAccountNumber },
        ];
      }

      await this.updateDocumentFromCollection('Users', userId, { affiliateBankAccounts: newAffiliateBankAccount });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async updateOrderMessageName(userId, name) {
    await this.updateDocumentFromCollection('ordersMessages', userId, { ownerName: name });
  }

  async updateOrderAsDelivered(orderId, proofOfDeliveryLink, userData) {
    try {
      const userRole = userData.userRole;
      const userId = userData.uid;
      await runTransaction(this.db, async (transaction) => {
        const orderRef = doc(this.db, 'Orders/', orderId);
        const orderRefDoc = await transaction.get(orderRef);
        const orderData = orderRefDoc.data();

        const ordersMessagesRef = doc(this.db, 'ordersMessages/', orderId);
        const orderMessagesRefDoc = await transaction.get(ordersMessagesRef);
        const orderMesssagesData = orderMessagesRefDoc.data();
        const oldMessages = orderMesssagesData.messages;
        const newMessages = [
          ...oldMessages,
          {
            dateTime: new Date(),
            image: proofOfDeliveryLink,
            message: '',
            read: false,
            userId: userId,
            userRole: userRole,
          },
        ];

        const oldProofOfDeliveryLinks = orderData.proofOfDeliveryLink;
        const newProofOfDeliveryLinks = [...oldProofOfDeliveryLinks, proofOfDeliveryLink];

        transaction.update(orderRef, { proofOfDeliveryLink: newProofOfDeliveryLinks });
        transaction.update(orderRef, { delivered: true });
        transaction.update(ordersMessagesRef, { delivered: true, messages: newMessages });
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async readSelectedOrder(orderId) {
    try {
      const order = await retryApi(async () => await super.readSelectedDataFromCollection('Orders', orderId));
      return order;
    } catch {
      throw new Error('Order not found');
    }
  }

  async transactionOutStocks(cartFinalData) {
    try {
      await runTransaction(this.db, async (transaction) => {
        const stocks = {};
        const promises = cartFinalData.map(async (item) => {
          const itemRef = doc(this.db, 'Products/', item.itemId);
          const itemDoc = await transaction.get(itemRef);
          const itemData = itemDoc.data();
          const oldStocks = itemData.stocksAvailable;
          const newStocks = oldStocks - item.quantity;
          stocks[item.itemId] = newStocks;
        });

        await Promise.all(promises);

        Object.keys(stocks).forEach((key) => {
          transaction.update(doc(this.db, 'Products/', key), { stocksAvailable: stocks[key] });
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async readProductsSearchIndex() {
    const products = await retryApi(
      async () => await super.readSelectedDataFromCollection('Index', 'ProductSearchIndex')
    );
    const data = products.search;
    return data;
  }

  async editUserPrice(userId, itemId, price) {
    const user = await this.readSelectedDataFromCollection('Users', userId);
    const oldUserPrices = user.userPrices;
    let newUserPrices = oldUserPrices.map((userPrice) => {
      if (userPrice.itemId === itemId) {
        return { ...userPrice, price: price };
      }
      return userPrice;
    });
    
    // If itemId does not exist in oldUserPrices, add it
    if (!newUserPrices.find((userPrice) => userPrice.itemId === itemId)) {
      newUserPrices.push({ itemId: itemId, price: price });
    }

    await this.updateDocumentFromCollection('Users',userId,{userPrices:newUserPrices})
  }

  async deleteUserPrice(userId, itemId) {
    const user = await this.readSelectedDataFromCollection('Users', userId);
    const oldUserPrices = user.userPrices;
    let newUserPrices = oldUserPrices.filter((userPrice) => userPrice.itemId !== itemId);
    await this.updateDocumentFromCollection('Users',userId,{userPrices:newUserPrices})
  }

  // async markCommissionPending(data, date, id){
  //   const updatedData = []
  //   data.map((commissions)=>{
  //     if(commissions.dateOrdered == date && commissions.status == 'claimable'){
  //       commissions.status = 'pending'
  //       updatedData.push(commissions)
  //     }else{
  //       updatedData.push(commissions)
  //     }
  //   })
  //   this.updateDocumentFromCollection('users', id, { ['affiliateCommissions']: updatedData });
  // }
}

export default firestoredb;

// ID: A unique identifier for each product, such as a serial number or SKU.
// Name: The name or title of the product.
// Description: A longer text field for a detailed description of the product.
// Price: The cost of the product.
// Quantity: The number of units of the product available for purchase.
// Category: A classification for the product, such as "clothing" or "electronics."
// Image: A link or file path to an image of the product.
// Weight: The weight of the product, which might be relevant for shipping calculations.
// Dimensions: The dimensions of the product, which might also be relevant for shipping.
// Brand: The brand or manufacturer of the product.
// Status: Whether the product is active, inactive, or discontinued.
// Date added: The date that the product was added to the database.
// Date modified: The date that the product was last modified.
// Features: A list of features or attributes of the product, such as color, size, or material.
// Ratings: A rating or review of the product, as provided by customers.
// Related products: A list of other products that are related to or often purchased with the product.
// Supplier: The company or individual that supplies the product.
// Warranty: The warranty or return policy for the product.
