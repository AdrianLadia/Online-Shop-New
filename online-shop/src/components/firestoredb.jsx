import firestorefunctions from '../firestorefunctions';

class firestoredb extends firestorefunctions {
  constructor(app, emulator = false) {
    super(app, emulator);
  }
    

  // USED FOR ADMIN INVENTORY
  async createProduct(data, id) {
    this.createDocument(data, id, 'Products');
  }

  async readAllProducts() {
    const products = await this.readAllDataFromCollection('Products');
    return products;
  }

  async readSelectedProduct(id) {
    const product = await this.readSelectedDataFromCollection('Products', id);
    return product;
  }

  async deleteProduct(id) {
    this.deleteDocumentFromCollection('Products', id);
  }

  async updateProduct(id, data) {
    await this.updateDocumentFromCollection('Products', id, data);
  }

  // USED FOR STOREFRONT

  async createCategory(id) {
    this.createDocument(
      {
        category: id
          .split(' ')
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(' '),
      },
      id
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' '),
      'Categories'
    );
  }

  async readAllCategories() {
    const categories = await this.readAllDataFromCollection('Categories');
    return categories;
  }

  async readAllUserIds() {
    const ids = await this.readAllIdsFromCollection('Users');
    return ids;
  }

  async readAllUsers() {
    const users = await this.readAllDataFromCollection('Users');
    return users;
  }

  async createNewUser(data, id) {
    this.createDocument(data, id, 'Users');
  }

  async readUserById(id) {
    const user = await this.readSelectedDataFromCollection('Users', id);
    return user;
  }

  async addItemToFavorites(userid, data) {
    console.log('ran');
    this.addDocumentArrayFromCollection('Users', userid, data, 'favoriteitems');
  }

  async removeItemFromFavorites(userid, data) {
    this.deleteDocumentFromCollectionArray('Users', userid, data, 'favoriteitems');
  }

  async createUserCart(data, userid) {
    this.updateDocumentFromCollection('Users', userid, {
      cart: data,
    });
  }

  async deleteAllUserCart(userid) {
    this.updateDocumentFromCollection('Users', userid, {
      cart: [],
    });
  }

  async readUserAddress(userid) {
    const user = await this.readSelectedDataFromCollection('Users', userid);
    return user.deliveryaddress;
  }


  async deleteAddress(userid, latitude, longitude, address) {
    console.log('deleting address');
    console.log(latitude, longitude, address);
    this.deleteDocumentFromCollectionArray(
      'Users',
      userid,
      { latitude: latitude, longitude: longitude, address: address },
      'deliveryaddress'
    );
  }

  async readUserContactPersons(userid) {
    const user = await this.readSelectedDataFromCollection('Users', userid);
    return user.contactPerson;
  }

  async deleteUserContactPersons(userid, name, phonenumber) {
    this.deleteDocumentFromCollectionArray(
      'Users',
      userid,
      { name: name, phonenumber: phonenumber },
      'contactPerson'
    );
  }

  async updateLatitudeLongitude(userid, latitude, longitude) {
    this.updateDocumentFromCollection('Users', userid, {
      latitude: latitude,
      longitude: longitude,
    });
  }

  async updatePhoneNumber(userid, phonenumber) {
    this.updateDocumentFromCollection('Users', userid, {
      phonenumber: phonenumber,
    });
  }

  async createTestCollection() {
    this.createDocument({ name: 'test' }, 'test', 'test');
  }

  async readTestCollection() {
    const data = await this.readAllDataFromCollection('test');
    return data;
  }

  async deleteTestCollection() {
    this.deleteDocumentFromCollection('test', 'test');
  }

  async transactionPlaceOrder(
    userid,
    localDeliveryAddress,
    locallatitude,
    locallongitude,
    localphonenumber,
    localname,
    orderdate,
    name,
    address,
    phonenumber,
    cart,
    itemstotal,
    vat,
    shippingtotal,
    grandtotal,
    reference,
    username,
    userphonenumber,
    deliveryNotes,
    totalWeight,
    deliveryVehicle,
    needAssistance
  ) {
    this.transactionPlaceOrder(
      userid,
      localDeliveryAddress,
      locallatitude,
      locallongitude,
      localphonenumber,
      localname,
      orderdate,
      name,
      address,
      phonenumber,
      cart,
      itemstotal,
      vat,
      shippingtotal,
      grandtotal,
      reference,
      username,
      userphonenumber,
      deliveryNotes,
      totalWeight,
      deliveryVehicle,
      needAssistance
    );
  }

  async transactionCreatePayment(userid, amount, reference, paymentprovider) {
    this.transactionCreatePayment(userid, amount, reference, paymentprovider);
  }

  async readAllOrders() {
    const orders = [];
    const userdata = await this.readAllDataFromCollection('Users').then((data) => {
      data.map((user) => {
        user.orders.map((order) => {
          orders.push(order);
        });
      });
    });
    return orders;
  }

  async readAllPaidOrders() {
    const orders = this.readAllOrders().then((orders) => {
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
    await this.deleteDocumentFromCollection('Users', userId);
  }

  async readProductStocksAvailable(productId) {
    const product = await this.readSelectedProduct(productId)
    return product.stocksAvailable
  }

  async updateProductStocksAvailable(productId, stocksAvailable) {
    this.updateDocumentFromCollection('Products', productId, {
      stocksAvailable: stocksAvailable,
    });
  }

  async addOrderDataToTests(orderData) {
    this.updateDocumentFromCollection('Tests','orderData',{'data' : orderData})
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
