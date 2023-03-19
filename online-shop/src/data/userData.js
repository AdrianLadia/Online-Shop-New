import dataValidation from '../../utils/dataValidation';

class userData {
  constructor(uid, name, email, emailVerified, phoneNumber, isAnonymous,cart) {
    (this.uid = uid),
      (this.name = name),
      (this.email = email),
      (this.emailVerified = emailVerified),
      (this.phoneNumber = phoneNumber),
      (this.deliveryAddress = []),
      (this.contactPerson = []),
      (this.isAnonymous = isAnonymous),
      (this.orders = []),
      (this.cart = cart),
      (this.favoriteItems = []),
      (this.payments = []);

    this.datavalidation = new dataValidation();
    this.datavalidation.isString(this.uid);
    this.datavalidation.isString(this.name);
    this.datavalidation.isString(this.email);
    this.datavalidation.isBoolean(this.emailVerified);
    this.datavalidation.isString(this.phoneNumber);
    this.datavalidation.isArray(this.deliveryAddress);
    this.datavalidation.isArray(this.contactPerson);
    this.datavalidation.isBoolean(this.isAnonymous);
    this.datavalidation.isArray(this.orders);
    this.datavalidation.isArray(this.cart);
    this.datavalidation.isArray(this.favoriteItems);
    this.datavalidation.isArray(this.payments);

    // if (this.datavalidation.error == true) {
    //     throw new Error('data validation error');
    // }
  }

  async createNewUser(firestore) {
    if (this.datavalidation.error == true) {
      throw new Error('data validation error');
    }

    firestore.createNewUser(
      {
        uid: this.uid,
        name: this.name,
        email: this.email,
        emailverfied: this.emailVerified,
        phoneNumber: this.phoneNumber,
        deliveryAddress: this.deliveryAddress,
        contactPerson: this.contactPerson,
        isAnonymous: this.isAnonymous,
        orders: this.orders,
        cart: this.cart,
        favoriteItems: this.favoriteItems,
        payments: this.payments,
      },
      this.uid
    );
  }

  async checkIfUserExists(firestore) {
    if (this.datavalidation.error == true) {
      throw new Error('data validation error');
    }
    const ids = await firestore.readAllUserIds();
    if (ids.includes(this.uid)) {
      return true;
    }
    if (!ids.includes(this.uid)) {
      return false;
    }
  }

}

export default userData;
