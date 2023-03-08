import firestorefunctions from "../firestorefunctions";

class firestoredb {
  constructor() {
    this.firestore = new firestorefunctions();
  }

  // USED FOR ADMIN INVENTORY
  async createProduct(data, id) {
    this.firestore.createDocument(data, id, "Products");
  }

  async readAllProducts() {
    const products = await this.firestore.readAllDataFromCollection("Products");
    return products;
  }

  async readSelectedProduct(id) {
    const product = await this.firestore.readSelectedDataFromCollection(
      "Products",
      id
    );
    return product;
  }

  async deleteProduct(id) {
    this.firestore.deleteDocumentFromCollection("Products", id);
  }

  async updateProduct(id, data) {
    await this.firestore.updateDocumentFromCollection("Products", id, data);
  }

  // USED FOR STOREFRONT

  async createCategory(id) {
    this.firestore.createDocument(
      {
        category: id
          .split(" ")
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(" "),
      },
      id
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" "),
      "Categories"
    );
  }

  async readAllCategories() {
    const categories = await this.firestore.readAllDataFromCollection(
      "Categories"
    );
    return categories;
  }

  async readAllUserIds() {
    const ids = await this.firestore.readAllIdsFromCollection("Users");
    return ids;
  }

  async readAllUsers() {
    const users = await this.firestore.readAllDataFromCollection("Users");
    return users;
  }

  async createNewUser(data, id) {
    this.firestore.createDocument(data, id, "Users");
  }

  async readUserById(id) {
    const user = await this.firestore.readSelectedDataFromCollection(
      "Users",
      id
    );
    return user;
  }

  async createFavoriteItem(data, userid) {
    this.firestore.updateDocumentFromCollection("Users", userid, data);
  }

  async addItemToFavorites(userid, data) {
    console.log("ran");
    this.firestore.addDocumentArrayFromCollection(
      "Users",
      userid,
      data,
      "favoriteitems"
    );
  }

  async removeItemFromFavorites(userid, data) {
    this.firestore.deleteDocumentFromCollectionArray(
      "Users",
      userid,
      data,
      "favoriteitems"
    );
  }

  async createUserCart(data, userid) {
    this.firestore.updateDocumentFromCollection("Users", userid, {
      cart: data,
    });
  }

  async deleteAllUserCart(userid) {
    this.firestore.updateDocumentFromCollection("Users", userid, {
      cart: [],
    });
  }

  async readUserAddress(userid) {
    const user = await this.firestore.readSelectedDataFromCollection(
      "Users",
      userid
    );
    return user.deliveryaddress;
  }

  async updateAddress(userid, latitude, longitude, address) {
    console.log("updating address");
    this.readUserById(userid).then((user) => {
      const userAddressList = user.deliveryaddress;
      const newAddress = [
        { latitude: latitude, longitude: longitude, address: address },
      ];
      const updatedAddressList = [...newAddress, ...userAddressList];

      this.firestore.updateDocumentFromCollection("Users", userid, {
        deliveryaddress: filteredData,
      });
    });
  }

  async deleteAddress(userid, latitude, longitude, address) {
    console.log("deleting address");
    console.log(latitude, longitude, address);
    this.firestore.deleteDocumentFromCollectionArray(
      "Users",
      userid,
      { latitude: latitude, longitude: longitude, address: address },
      "deliveryaddress"
    );
  }

  async readUserContactPersons(userid) {
    const user = await this.firestore.readSelectedDataFromCollection(
      "Users",
      userid
    );
    return user.contactPerson;
  }

  async deleteUserContactPersons(userid, name, phonenumber) {
    this.firestore.deleteDocumentFromCollectionArray(
      "Users",
      userid,
      { name: name, phonenumber: phonenumber },
      "contactPerson"
    );
  }

  async updateContactPersons(userid, name, phonenumber) {
    console.log("updating contact persons");
    this.readUserById(userid).then((user) => {
      const userContactPersonList = user.contactPerson;
      const newContactPerson = [{ name: name, phonenumber: phonenumber }];
      const updatedContactPersonList = [
        ...newContactPerson,
        ...userContactPersonList,
      ];

      // WE DO THIS TO REMOVE THE EMPTY CONTACT PERSONS THAT ARE CREATED WHEN THE USER DELETES THE LAST CONTACT PERSON
      let filteredData = updatedContactPersonList.filter((item) => {
        return item.name !== "" && item.phonenumber !== "";
      });

      // console.log(filteredData)

      this.firestore.updateDocumentFromCollection("Users", userid, {
        contactPerson: filteredData,
      });
    });
  }

  async updateLatitudeLongitude(userid, latitude, longitude) {
    console.log("updating latitude and longitude");
    this.firestore.updateDocumentFromCollection("Users", userid, {
      latitude: latitude,
      longitude: longitude,
    });
  }

  async updatePhoneNumber(userid, phonenumber) {
    console.log("updating phonenumber");
    this.firestore.updateDocumentFromCollection("Users", userid, {
      phonenumber: phonenumber,
    });
  }

  async updateUserOrders(
    userid,
    old_orders,
    orderdate,
    name,
    address,
    phonenumber,
    latitude,
    longitude,
    cart,
    itemstotal,
    vat,
    shippingtotal,
    grandtotal,
    reference
  ) {
    const new_orders = {
      orderdate: orderdate,
      name: name,
      address: address,
      phonenumber: phonenumber,
      latitude: latitude,
      longitude: longitude,
      cart: cart,
      itemstotal: itemstotal,
      vat: vat,
      shippingtotal: shippingtotal,
      grandtotal: grandtotal,
      delivered: false,
      reference: reference,
      paid: false,
    };

    this.firestore.addDocumentArrayFromCollection(
      "Users",
      userid,
      new_orders,
      "orders"
    );
  }

  async createPayment(userid, amount, reference, paymentprovider) {
    this.firestore.addDocumentArrayFromCollection(
      "Users",
      userid,
      {
        date: new Date(),
        amount: amount,
        reference: reference,
        paymentprovider: paymentprovider,
      },
      "payments"
    );
  }

  async transactionPlaceOrder(
    userid,
    localDeliveryAddress,
    locallatitude,
    locallongitude,
    localphonenumber,
    localname,
    old_orders,
    orderdate,
    name,
    address,
    phonenumber,
    latitude,
    longitude,
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
    this.firestore.transactionPlaceOrder(
      userid,
      localDeliveryAddress,
      locallatitude,
      locallongitude,
      localphonenumber,
      localname,
      old_orders,
      orderdate,
      name,
      address,
      phonenumber,
      latitude,
      longitude,
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
    this.firestore.transactionCreatePayment(
      userid,
      amount,
      reference,
      paymentprovider
    );
  }

  async readAllOrders() {
    const orders = [];
    const userdata = await this.firestore
      .readAllDataFromCollection("Users")
      .then((data) => {
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
    const products = await this.readAllProducts()
    products.map((product) => {
      if (product.parentProductId === "") {
        parentProducts.push(product.itemid);
      }
    })
    return parentProducts;
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
