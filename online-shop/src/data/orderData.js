import dataValidation from '../../utils/dataValidation';
import firestoredb from '../components/firestoredb';

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
      alert('Delivery address is empty');
      throw new Error('Delivery address is empty');
    }

    if (this.contactName === '') {
      alert('Contact name is empty');
      throw new Error('Contact name is empty');
    }

    if (this.contactPhoneNumber === '') {
      alert('Contact phone number is empty');
      throw new Error('Contact phone number is empty');
    }

    if (this.cart.length === 0) {
      alert('Cart is empty');
      throw new Error('Cart is empty');
    }
    if (this.itemsTotal < 0) {
      alert('Items total is less than 0')
      throw new Error('Items total is less than 0');
    }
    if (this.vat < 0) {
      alert('VAT is less than 0')
      throw new Error('VAT is less than 0');
    }
    if (this.deliveryFee < 0) {
      alert('Delivery fee is less than 0')
      throw new Error('Delivery fee is less than 0');
    }
    if (this.grandTotal < 0) {
      alert('Grand total is less than 0')
      throw new Error('Grand total is less than 0');
    }
    if (this.totalWeight < 0) {
      alert('Total weight is less than 0')
      throw new Error('Total weight is less than 0');
    }
    if (datavalidation.error === true) {
        alert('data validation error');
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
