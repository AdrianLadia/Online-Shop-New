import dataValidation from '../../utils/dataValidation';

class orderData {
  constructor(
    useruid,
    userphonenumber,
    username,
    deliveryaddress,
    latitude,
    longitude,
    dateoforder,
    cart,
    itemstotal,
    vat,
    deliveryfee,
    grandtotal,
    referencenumber,
    contactname,
    contactphonenumber,
    deliverynotes,
    totalweight,
    deliveryvehicle,
    needassistance
  ) {
    this.userUid = useruid;
    this.userPhoneNumber = userphonenumber;
    this.userName = username;
    this.deliveryAddress = deliveryaddress;
    this.latitude = latitude;
    this.longitude = longitude;
    this.dateOfOrder = dateoforder;
    this.cart = cart;
    this.itemsTotal = itemstotal;
    this.vat = vat;
    this.deliveryFee = deliveryfee;
    this.grandTotal = grandtotal;
    this.referenceNumber = referencenumber;
    this.contactName = contactname;
    this.contactPhoneNumber = contactphonenumber;
    this.deliveryNotes = deliverynotes;
    this.totalWeight = totalweight;
    this.deliveryVehicle = deliveryvehicle;
    this.needAssistance = needassistance;

    console.log(this.userPhoneNumber)
    console.log(this.contactPhoneNumber)

    const datavalidation = new dataValidation();
    datavalidation.isString(this.userUid);
    datavalidation.isString(this.userPhoneNumber);
    datavalidation.isString(this.userName);
    datavalidation.isString(this.deliveryAddress);
    datavalidation.isNumber(this.latitude);
    datavalidation.isNumber(this.longitude);
    datavalidation.isDateObject(this.dateOfOrder);
    datavalidation.isArray(this.cart);
    datavalidation.isNumber(this.itemsTotal);
    datavalidation.isNumber(this.vat);
    datavalidation.isNumber(this.deliveryFee);
    datavalidation.isNumber(this.grandTotal);
    datavalidation.isString(this.referenceNumber);
    datavalidation.isString(this.contactName);
    datavalidation.isString(this.contactPhoneNumber);
    datavalidation.isString(this.deliveryNotes);
    datavalidation.isNumber(this.totalWeight);
    datavalidation.isObject(this.deliveryVehicle);
    datavalidation.isBoolean(this.needAssistance);
  }

  transactionPlaceOrder(firestore) {
    const datavalidation = new dataValidation();
    if (this.deliveryAddress === '') {
      throw new Error('Delivery address is empty');
    }

    if (this.contactName === '') {
      throw new Error('Contact name is empty');
    }

    if (this.contactPhoneNumber === '') {
      throw new Error('Contact phone number is empty');
    }

    if (this.cart.length === 0) {
      throw new Error('Cart is empty');
    }
    if (this.itemsTotal < 0) {
      throw new Error('Items total is less than 0');
    }
    if (this.vat < 0) {
      throw new Error('VAT is less than 0');
    }
    if (this.deliveryFee < 0) {
      throw new Error('Delivery fee is less than 0');
    }
    if (this.grandTotal < 0) {
      throw new Error('Grand total is less than 0');
    }
    if (this.totalWeight < 0) {
      throw new Error('Total weight is less than 0');
    }
    if (datavalidation.error === true) {
        throw new Error('data validation error');
    }


    firestore.transactionPlaceOrder(
      this.userUid,
      this.deliveryAddress,
      this.latitude,
      this.longitude,
      this.contactPhoneNumber,
      this.contactName,
      this.dateOfOrder,
      this.userName,
      this.deliveryAddress,
      this.userPhoneNumber,
      this.cart,
      this.itemsTotal,
      this.vat,
      this.deliveryFee,
      this.grandTotal,
      this.referenceNumber,
      this.userName,
      this.userPhoneNumber,
      this.deliveryNotes,
      this.totalWeight,
      this.deliveryVehicle,
      this.needAssistance
    );
  }
}

export default orderData;
