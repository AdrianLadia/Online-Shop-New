import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import businessCalculations from '../utils/businessCalculations.jsx';
import cloudFirestoreDb from '../src/cloudFirestoreDb.jsx';
import firestoredb from '../src/components/firestoredb.jsx';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../src/firebase_config';
const app = initializeApp(firebaseConfig);

const businesscalculations = new businessCalculations();
const cloudfirestore = new cloudFirestoreDb();
const firestore = new firestoredb(app, true);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('getCartCount', () => {
  test('getCartCount', () => {
    const { getCartCount } = require('../functions/index.js');
    const getCartCountBusinessCalculations = businesscalculations.getCartCount;

    const count = getCartCountBusinessCalculations(['PPB#1']);
    const count2 = getCartCount(['PPB#1']);
    expect(count).toEqual({ 'PPB#1': 1 });
    expect(count2).toEqual(count);
  });

  test('getValueAddedTax', () => {
    const { getValueAddedTax } = require('../functions/index.js');
    const getValueAddedTaxBusinessCalculations = businesscalculations.getValueAddedTax;
    const vat = getValueAddedTaxBusinessCalculations(1000);
    const vat2 = getValueAddedTax(1000);
    expect(vat).toEqual(107.14);
    expect(vat2).toEqual(vat);
  });
});

describe('cloudfirestoredb', async () => {
  test('checkifuseridexist', async () => {
    const user = await cloudfirestore.checkIfUserIdAlreadyExist('PN4JqXrjsGfTsCUEEmaR5NO6rNF3');
    await delay(300);
    expect(user).toEqual(true);
    const falseUser = await cloudfirestore.checkIfUserIdAlreadyExist('testfalseuser12432456436');
    await delay(300);
    expect(falseUser).toEqual(false);
  });
  test('transactionPlaceOrder', async () => {
    await firestore.createProduct(
      {
        itemId: 'test',
        itemName: 'testname',
        unit: 'bale',
        price: 1000,
        description: 'none',
        weight: 10,
        dimensions: '10x12',
        category: 'Paper Bag',
        imageLinks: ['testlink'],
        brand: 'testbrand',
        pieces: 1999,
        color: 'red',
        material: 'material',
        size: '10',
        stocksAvailable: 23,
        stocksOnHold: [],
        averageSalesPerDay: 0,
        parentProductID: 'test',
        stocksOnHoldCompleted: [],
        forOnlineStore: true,
        isCustomized: false,
        salesPerMonth: [],
        stocksIns: [],
      },
      'test'
    );
    await firestore.createProduct(
      {
        itemId: 'test2',
        itemName: 'testname',
        unit: 'bale',
        price: 500,
        description: 'none',
        weight: 10,
        dimensions: '10x12',
        category: 'Paper Bag',
        imageLinks: ['testlink'],
        brand: 'testbrand',
        pieces: 1999,
        color: 'red',
        material: 'material',
        size: '10',
        stocksAvailable: 23,
        stocksOnHold: [],
        averageSalesPerDay: 0,
        parentProductID: 'test',
        stocksOnHoldCompleted: [],
        forOnlineStore: true,
        isCustomized: false,
        salesPerMonth: [],
        stocksIns: [],
      },
      'test2'
    );
    await firestore.createNewUser(
      {
        uid: 'testuser',
        name: 'test',
        email: 'test@gmail.com',
        emailVerified: true,
        phoneNumber: '09178927206',
        deliveryAddress: [],
        contactPerson: [],
        isAnonymous: false,
        orders: [],
        cart: [],
        favoriteItems: [],
        payments: [],
      },
      'testuser'
    );

    await delay(300);

    let data = {
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'PPB',
      locallatitude: 1.12,
      locallongitude: 1.3,
      localphonenumber: '09138927206',
      localname: 'Contact Person',
      orderDate: new Date(),
      cart: ['test', 'test', 'test', 'test2'],
      itemstotal: 3500,
      vat: 375,
      shippingtotal: 200,
      grandTotal: 4075,
      reference: 'testref1234567',
      userphonenumber: '',
      deliveryNotes: 'none',
      totalWeight: 50,
      deliveryVehicle: 'motorcycle',
      needAssistance: true,
    };
    await cloudfirestore.transactionPlaceOrder(data);
    await delay(300);

    const testUser = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const deliveryAddress = testUser.deliveryAddress;
    const contactPerson = testUser.contactPerson;
    const orders = testUser.orders;

    expect(deliveryAddress).length(1);
    expect(contactPerson).length(1);
    expect(orders).length(1);

    data = {
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'PPB',
      locallatitude: 1.12,
      locallongitude: 1.3,
      localphonenumber: '09138927206',
      localname: 'Contact Person 2',
      orderDate: new Date(),
      cart: ['test', 'test', 'test', 'test2'],
      itemstotal: 3500,
      vat: 375,
      shippingtotal: 200,
      grandTotal: 4075,
      reference: 'testref1234567',
      userphonenumber: '',
      deliveryNotes: 'none',
      totalWeight: 50,
      deliveryVehicle: 'motorcycle',
      needAssistance: true,
    };
    await cloudfirestore.transactionPlaceOrder(data);
    await delay(300);

    const testUser2 = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const deliveryAddress2 = testUser2.deliveryAddress;
    const contactPerson2 = testUser2.contactPerson;
    const orders2 = testUser2.orders;

    expect(deliveryAddress2).length(1);
    expect(contactPerson2).length(2);
    expect(orders2).length(2);

    data = {
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'PPB2',
      locallatitude: 1.12,
      locallongitude: 1.3,
      localphonenumber: '09138927206',
      localname: 'Contact Person 2',
      orderDate: new Date(),
      cart: ['test', 'test', 'test', 'test2'],
      itemstotal: 3500,
      vat: 375,
      shippingtotal: 200,
      grandTotal: 4075,
      reference: 'testref1234567',
      userphonenumber: '',
      deliveryNotes: 'none',
      totalWeight: 50,
      deliveryVehicle: 'motorcycle',
      needAssistance: true,
    };
    await cloudfirestore.transactionPlaceOrder(data);
    await delay(300);

    const testUser3 = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const deliveryAddress3 = testUser3.deliveryAddress;
    const contactPerson3 = testUser3.contactPerson;
    const orders3 = testUser3.orders;

    expect(deliveryAddress3).length(2);
    expect(contactPerson3).length(2);
    expect(orders3).length(3);

    await firestore.deleteUserByUserId('testuser');
    await firestore.deleteProduct('test');
    await firestore.deleteProduct('test2');
  }, 100000);

  test('createNewUser', async () => {
    await cloudfirestore.createNewUser(
      {
        uid: 'testuser',
        name: 'Test User',
        email: 'test@gmail.com',
        emailVerified: true,
        phoneNumber: '',
        deliveryAddress: [],
        contactPerson: [],
        isAnonymous: false,
        orders: [],
        cart: [],
        favoriteItems: [],
        payments: [],
      },
      'testuser'
    );
    await delay(100);
    const user = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const email = user.email;
    await delay(100);
    expect(email).toEqual('test@gmail.com');
    await firestore.deleteUserByUserId('testuser');
  });

  test('readSelectedUserById', async () => {
    await cloudfirestore.createNewUser(
      {
        uid: 'testuser2',
        name: 'Test User',
        email: 'test@gmail.com',
        emailVerified: true,
        phoneNumber: '',
        deliveryAddress: [],
        contactPerson: [],
        isAnonymous: false,
        orders: [],
        cart: [],
        favoriteItems: [],
        payments: [],
      },
      'testuser2'
    );

    await delay(100);
    const user = await cloudfirestore.readSelectedUserById('testuser2')
    const email = user.email;
    await delay(100);
    expect(email).toEqual('test@gmail.com');
    await firestore.deleteUserByUserId('testuser2');
  });
});
