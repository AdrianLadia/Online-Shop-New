import firestorefunctions from '../firestorefunctions';
import Joi from 'joi';

class firestoredb extends firestorefunctions {
  constructor(app, emulator = false) {
    super(app, emulator);
  }

  // USED FOR ADMIN INVENTORY
  async;
  createProduct(data, id) {
    const schema = Joi.object({
      itemId: Joi.string().required(),
      itemName: Joi.string().required(),
      unit: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      weight: Joi.number().required(),
      dimensions: Joi.string(),
      category: Joi.string().required(),
      imageLinks: Joi.array(),
      brand: Joi.string(),
      pieces: Joi.number().required(),
      color: Joi.string(),
      material: Joi.string(),
      size: Joi.string(),
      stocksAvailable: Joi.number().required(),
      stocksOnHold: Joi.array().required(),
      averageSalesPerDay: Joi.number().required(),
      parentProductID: Joi.string(),
      stocksOnHoldCompleted: Joi.array().required(),
    }).unknown(false);

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }

    super.createDocument(data, id, 'Products');
  }

  async readAllProducts() {
    const products = await super.readAllDataFromCollection('Products');
    return products;
  }

  async readSelectedProduct(id) {
    const product = await super.readSelectedDataFromCollection('Products', id);
    return product;
  }

  async deleteProduct(id) {
    super.deleteDocumentFromCollection('Products', id);
  }

  async updateProduct(id, data) {
    const schema = Joi.object({
      itemName: Joi.string().required(),
      unit: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      weight: Joi.number().required(),
      dimensions: Joi.string(),
      category: Joi.string().required(),
      imageLinks: Joi.array(),
      brand: Joi.string(),
      pieces: Joi.number().required(),
      color: Joi.string(),
      material: Joi.string(),
      size: Joi.string(),
    }).unknown(false);

    const { error } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }
    await super.updateDocumentFromCollection('Products', id, data);
  }

  // USED FOR STOREFRONT

  async createCategory(categoryId) {
    const schema = Joi.string().required();

    const { error } = schema.validate(categoryId);
    if (error) {
      throw new Error(error);
    }

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
  }

  async readAllCategories() {
    const categories = await super.readAllDataFromCollection('Categories');
    return categories;
  }

  async readAllUserIds() {
    const ids = await super.readAllIdsFromCollection('Users');
    return ids;
  }

  async readAllUsers() {
    const users = await super.readAllDataFromCollection('Users');
    return users;
  }

  async createNewUser(data, id) {
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

    super.createDocument(data, id, 'Users');
  }

  async readUserById(id) {
    const user = await super.readSelectedDataFromCollection('Users', id);
    return user;
  }

  async addItemToFavorites(userid, data) {
    console.log('ran');
    super.addDocumentArrayFromCollection('Users', userid, data, 'favoriteItems');
  }

  async removeItemFromFavorites(userid, data) {
    super.deleteDocumentFromCollectionArray('Users', userid, data, 'favoriteItems');
  }

  async createUserCart(data, userid) {
    super.updateDocumentFromCollection('Users', userid, {
      cart: data,
    });
  }

  async deleteAllUserCart(userid) {
    super.updateDocumentFromCollection('Users', userid, {
      cart: [],
    });
  }

  async readUserAddress(userid) {
    const user = await super.readSelectedDataFromCollection('Users', userid);
    return user.deliveryaddress;
  }

  async deleteAddress(userid, latitude, longitude, address) {
    console.log('deleting address');
    console.log(latitude, longitude, address);
    super.deleteDocumentFromCollectionArray(
      'Users',
      userid,
      { latitude: latitude, longitude: longitude, address: address },
      'deliveryAddress'
    );
  }

  async readUserContactPersons(userid) {
    const user = await super.readSelectedDataFromCollection('Users', userid);
    return user.contactPerson;
  }

  async deleteUserContactPersons(userid, name, phonenumber) {
    super.deleteDocumentFromCollectionArray('Users', userid, { name: name, phonenumber: phonenumber }, 'contactPerson');
  }

  async updateLatitudeLongitude(userid, latitude, longitude) {
    super.updateDocumentFromCollection('Users', userid, {
      latitude: latitude,
      longitude: longitude,
    });
  }

  async updatePhoneNumber(userid, phonenumber) {
    super.updateDocumentFromCollection('Users', userid, {
      phonenumber: phonenumber,
    });
  }

  async createTestCollection() {
    super.createDocument({ name: 'test' }, 'test', 'test');
  }

  async readTestCollection() {
    const data = await super.readAllDataFromCollection('test');
    return data;
  }

  async deleteTestCollection() {
    super.deleteDocumentFromCollection('test', 'test');
  }

  // async transactionPlaceOrder(
  //   userId,
  //   deliveryAddress,
  //   locallatitude,
  //   locallongitude,
  //   localphonenumber,
  //   localname,
  //   orderdate,
  //   name,
  //   address,
  //   phonenumber,
  //   cart,
  //   itemstotal,
  //   vat,
  //   shippingtotal,
  //   grandtotal,
  //   reference,
  //   username,
  //   userphonenumber,
  //   deliveryNotes,
  //   totalWeight,
  //   deliveryVehicle,
  //   needAssistance
  // ) {
  //   super.transactionPlaceOrder(
  //     userId,
  //     deliveryAddress,
  //     locallatitude,
  //     locallongitude,
  //     localphonenumber,
  //     localname,
  //     orderdate,
  //     name,
  //     address,
  //     phonenumber,
  //     cart,
  //     itemstotal,
  //     vat,
  //     shippingtotal,
  //     grandtotal,
  //     reference,
  //     username,
  //     userphonenumber,
  //     deliveryNotes,
  //     totalWeight,
  //     deliveryVehicle,
  //     needAssistance
  //   );
  // }

  // async transactionCreatePayment(userid, amount, reference, paymentprovider) {
  //   super.transactionCreatePayment(userid, amount, reference, paymentprovider);
  // }

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
        parentProducts.push(product.itemid);
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
