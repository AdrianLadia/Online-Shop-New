import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import businessCalculations from '../utils/businessCalculations';
import dataManipulation from '../utils/dataManipulation';
import firestoredb from '../src/firestoredb';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseConfig from '../src/firebase_config';
import paperBoyLocation from '../src/data/paperBoyLocation';
import lalamoveDeliveryVehicles from '../src/data/lalamoveDeliveryVehicles';
// import { getAuth, connectAuthEmulator } from "firebase/auth";
import cloudFirestoreFunctions from '../src/cloudFirestoreFunctions';
import cloudFirestoreDb from '../src/cloudFirestoreDb';
import retryApi from '../utils/retryApi';
import testConfig from './testConfig';
import firestorefunctions from '../src/firestorefunctions';
import { fi } from 'date-fns/locale';
import AppConfig from '../src/AppConfig';
import storeProductsOrganizer from '../utils/classes/storeProductsOrganizer';
import allowedDeliveryDates from '../utils/classes/allowedDeliveryDates';

//
const datamanipulation = new dataManipulation();
const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app, true);
const cloudfirestorefunctions = new cloudFirestoreFunctions(app, true);
const cloudfirestore = new cloudFirestoreDb(app, true);
await cloudfirestore.createNewUser(
  {
    uid: 'TESTAFFILIATE',
    name: 'affiliate user',
    email: 'affiliate@gmail.com',
    emailVerified: true,
    phoneNumber: '09178927206',
    deliveryAddress: [],
    contactPerson: [],
    isAnonymous: false,
    orders: [],
    cart: {},
    favoriteItems: [],
    payments: [],
    userRole: 'affiliate',
    affiliate: null,
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
  },
  'TESTAFFILIATE'
);
await cloudfirestore.createNewUser(
  {
    uid: 'TESTUSER',
    name: 'test user2',
    email: 'test@gmail.com',
    emailVerified: true,
    phoneNumber: '09178927206',
    deliveryAddress: [],
    contactPerson: [],
    isAnonymous: false,
    orders: [],
    cart: {},
    favoriteItems: [],
    payments: [],
    userRole: 'member',
    affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
  },
  'TESTUSER'
);
await cloudfirestore.createNewUser(
  {
    uid: 'NOAFFILIATETESTUSER',
    name: 'test user3',
    email: 'test3@gmail.com',
    emailVerified: true,
    phoneNumber: '09178927206',
    deliveryAddress: [],
    contactPerson: [],
    isAnonymous: false,
    orders: [],
    cart: {},
    favoriteItems: [],
    payments: [],
    userRole: 'member',
    affiliate : null,
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
  },
  'NOAFFILIATETESTUSER'
);
const businesscalculations = new businessCalculations();
const paperboylocation = new paperBoyLocation();
const lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
const userTestId = 'TESTUSER';
const testconfig = new testConfig();
const testid = testconfig.getTestUserId();
const user = await cloudfirestorefunctions.readSelectedDataFromCollection('Users', userTestId);
const allProducts = await firestore.readAllProducts()

async function resetOrdersAndPayments() {
  const allOrders = await firestore.readAllIdsFromCollection('Orders');
  const allExpiredOrders = await firestore.readAllIdsFromCollection('ExpiredOrders');
  const idsPayment = await firestore.readAllIdsFromCollection('Payments')

  const deleteAllPaymentsPromise = idsPayment.map(async (paymentId) => {
    await firestore.deleteDocumentFromCollection('Payments', paymentId);
  });

  const deleteAllOrdersPromise = allOrders.map(async (orderId) => {
    await firestore.deleteDocumentFromCollection('Orders', orderId);
  }  );

  const deleteAllExpiredOrdersPromise = allExpiredOrders.map(async (orderId) => {
    await firestore.deleteDocumentFromCollection('ExpiredOrders', orderId);
  }  );

  await firestore.createDocument({test:'test'}, 'mock', 'Orders')
  await firestore.createDocument({test:'test'}, 'mock', 'ExpiredOrders')
  await firestore.createDocument({test:'test'}, 'mock', 'Payments')
  await Promise.all(deleteAllOrdersPromise);
  await Promise.all(deleteAllExpiredOrdersPromise);
  await Promise.all(deleteAllPaymentsPromise);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Business Calcualtions', () => {
  test('readAllParentProductsFromOnlineStoreProducts', async () => {
    const products = await cloudfirestore.readAllProductsForOnlineStore('Paper Bag');
    await delay(100);
    const parentProducts = businesscalculations.readAllParentProductsFromOnlineStoreProducts(products);
    expect(parentProducts.length).toBeGreaterThan(0);

  });
  test('getSafetyStock', () => {
    const averageSalesPerDay = 20;
    expect(businesscalculations.getSafetyStock(averageSalesPerDay)).toBe(40);
  });
  test('getStocksAvailableLessSafetyStock', () => {
    const stocksAvailable = 100;
    const safetyStock = 40;
    expect(businesscalculations.getStocksAvailableLessSafetyStock(stocksAvailable, safetyStock)).toBe(20);
  });
  test('getCartCount', async () => {
    const cart = [
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#10',
      'PPB#10',
      'PPB#10',
      'PPB#10',
      'PPB#10',
      'PPB#12',
      'PPB#12',
      'PPB#12',
      'PPB#16',
      'PPB#16',
      'PPB#16',
    ];
    expect(businesscalculations.getCartCount(cart)).toEqual({
      'PPB#1': 5,
      'PPB#10': 5,
      'PPB#12': 3,
      'PPB#16': 3,
    });
  });
  test('getTotalDifferenceOfPaperboyAndSelectedLocation', () => {
    const paperboylatitude = paperboylocation.latitude;
    const paperboylongitude = paperboylocation.longitude;
    const selectedlatitude = 10.333629311391931;
    const selectedlongitude = 123.93851059905926;
    const expected = 0.031733047732064534;
    const difference = businesscalculations.getTotalDifferenceOfPaperboyAndSelectedLocation(
      paperboylatitude,
      paperboylongitude,
      selectedlatitude,
      selectedlongitude
    );
    expect(difference).toBe(expected);
  });
  test('convertTotalDifferenceToKilometers', () => {
    const totaldifference = 0.031733047732064534;
    const expected = 3.5255416030323694;
    const kilometers = businesscalculations.convertTotalDifferenceToKilometers(totaldifference);
    expect(kilometers).toBe(expected);
  });
  test('getlocationsInDeliveryPoint', () => {
    const longLatList = [
      [10.33609636567313, 123.93865239990616, ['lalamoveServiceArea']],
      [6.102780179424748, 125.14266344007835, ['generalSantosArea']],
    ];
    longLatList.map((longLat) => {
      const latitude = longLat[0];
      const longitude = longLat[1];
      const locations = businesscalculations.getLocationsInPoint(latitude, longitude);
      expect(locations).toEqual(longLat[2]);
    });
  });

  test('cleanGeocode', () => {
    const data = datamanipulation.cleanGeocode(
      '8VRV+26C, Nivel Hills, Lungsod ng Cebu, 6000 Lalawigan ng Cebu, Philippines'
    );
    for (let i = 0; i < data.length; i++) {
      const string = data[i];
      expect(string).not.toContain('+');
    }
  });

  test('getVehicleForDelivery', () => {
    const test = [
      [0, 'motorcycle'],
      [20, 'motorcycle'],
      [200, 'sedan'],
      [300, 'mpv'],
      [600, 'pickup'],
      [1000, 'van'],
      [2000, 'closedvan'],
    ];
    test.map((test) => {
      const weight = test[0];
      const expected = test[1];
      const vehicle = businesscalculations.getVehicleForDelivery(weight).name;
      expect(vehicle).toBe(expected);
    });
  });
  test('getDeliveryFee', () => {
    const kilometers = 10;
    const vehicles = [
      lalamovedeliveryvehicles.motorcycle,
      lalamovedeliveryvehicles.sedan,
      lalamovedeliveryvehicles.mpv,
      lalamovedeliveryvehicles.pickup,
      lalamovedeliveryvehicles.van,
      lalamovedeliveryvehicles.closedvan,
    ];
    vehicles.map((vehicle) => {
      const deliveryFeePerKm = vehicle.deliveryFeePerKm;
      const expected = Math.round(deliveryFeePerKm * kilometers);
      const deliveryFee = businesscalculations.getDeliveryFee(kilometers, vehicle, false);
      expect(deliveryFee).toBe(expected);
    });
  });
  test('checkStocksIfAvailableInFirestore', async () => {
    const result = await businesscalculations.checkStocksIfAvailableInFirestore({
      'PPB#1' : 11,
      'PPB#1-RET': 1,
  });
  });
  test('getValueAddedTax', () => {
    const subtotal = 100;
    let expected;
    if (new AppConfig().getNoVat()) {
      expected = 0;
    } else {
      expected = 10.71;
    }

    const vat = businesscalculations.getValueAddedTax(subtotal,'www.imageurl.com', false);
    expect(vat).toBe(expected);
  });
  test('getValueAddedTaxNoVat', () => {
    const subtotal = 100;
    const expected = 0;
    const vat = businesscalculations.getValueAddedTax(subtotal,'', true);
    expect(vat).toBe(expected);
  });


  test('getGrandTotalAmount', () => {
    const subtotal = 100;
    const vat = 12;
    const deliveryfee = 10;
    const expected = 122;
    const grandTotal = businesscalculations.getGrandTotal(subtotal, vat, deliveryfee);
    expect(grandTotal).toBe(expected);
  });
  test('addToCart and removeFromCart', () => {
    const cart = user.cart;
    let newCart = businesscalculations.addToCart(cart, 'PPB#1',5);
    expect(newCart).toEqual({ 'PPB#1': 1 });
    const newCart2 = businesscalculations.addToCart(newCart, 'PPB#2',5);
    expect(newCart2).toEqual({ 'PPB#1': 1, 'PPB#2': 1 });
    const newCart3 = businesscalculations.removeFromCart(newCart2, 'PPB#2',5);
    expect(newCart3).toEqual({ 'PPB#1': 1 });
    const newCart4 = businesscalculations.addToCart(newCart3, 'PPB#1',0);
    expect(newCart4).toEqual({ 'PPB#1': 1 });

  });
  test('addToCartWithQuantity', () => {
    const cart = {};
    const newCart = businesscalculations.addToCartWithQuantity('PPB#1', 5, cart);
    expect(newCart).toEqual({ 'PPB#1': 5 });
  });
  test('checkIfAreasHasLalamoveServiceArea', () => {
    const areas = ['generalSantosArea', 'lalamoveServiceArea'];
    const result = businesscalculations.checkIfAreasHasLalamoveServiceArea(areas);
    expect(result).toBe(true);
  });
});

describe('Data Manipulation', async () => {
  test('getSecondsDifferenceBetweentTwoDates', async () => {
    const date1 = new Date(2023, 1, 1);
    const date2 = new Date(2023, 1, 2);
    const seconds = datamanipulation.getSecondsDifferenceBetweentTwoDates(date1, date2);

    expect(seconds).toBe(86400);
  });
  test('AccountStatement', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;
    

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'testlink3',
      'Adrian Ladia',
      'Maya',
      true
    );

    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: itemsTotal + vat + 2002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink3',
    });
    await delay(5000);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'testlink2',
      'Adrian Ladia',
      'Maya',
      true
    );

    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: itemsTotal + vat + 2002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink2',
    });

    await delay(5000);

    const testuser = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orderReferences = testuser.orders;

    const orderPromises = orderReferences.map(async (orderReference) => {
      return await firestore.readSelectedDataFromCollection('Orders', orderReference.reference);
    });

    const orders = await Promise.all(orderPromises);

    const payments = testuser.payments;
    const tableData = datamanipulation.accountStatementData(orders, payments);
    const table = datamanipulation.accountStatementTable(tableData);
    const endingBalance = table[3].runningBalance;

    expect(orders.length).toBe(2);
    expect(payments.length).toBe(2);
    expect(endingBalance).toBe(0);

    await cloudfirestore.deleteDocumentFromCollection('Orders','testref1234')

    // datamanipulation.accountStatementTable(tableData)
  }, 100000);
  test('getOrderFromReference', () => {
    const datamanipulation = new dataManipulation();
    const orders = user.orders;
    const reference = '13542212023-444266';
    datamanipulation.getOrderFromReference(reference, orders);
  });
  test('getAllCustomerNamesFromUsers', async () => {
    const users = await firestore.readAllUsers();
    await delay(100);
    // const expected = ['Adrian Anton Ladia', 'Adrian Ladia'];
    const data = datamanipulation.getAllCustomerNamesFromUsers(users);
    // expect(data).toEqual(expected);
    expect(data).not.toBe([]);
  });
  test('getUserUidFromUsers', async () => {
    const users = await firestore.readAllUsers();
    await delay(100);
    const uid = datamanipulation.getUserUidFromUsers(users, 'test user2');
    expect(uid).toEqual('TESTUSER');
  });
  test('filterOrders', async () => {
    const orders = await firestore.readAllOrders();
    await delay(100);
    let filtered = datamanipulation.filterOrders(orders, '', '', null, true, '');
  });
  test('getCategoryList', async () => {
    const categories = await firestore.readAllCategories();
    await delay(100);
    const allCategories = datamanipulation.getCategoryList(categories);
    const expected = ['Favorites'];
    categories.map((category) => {
      expected.push(category.category);
    });
    expect(allCategories).toEqual(expected);
  });
  test('getCheckoutPageTableDate & createPayMayaCheckoutItems', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    const orders = await firestore.readUserById(userTestId);
    await delay(100);
    const order = await firestore.readSelectedDataFromCollection('Orders', 'testref1234');
    await delay(100);
    const cart = order.cart;
    const cartItemsPrice = order.cartItemsPrice;

    const products = await firestore.readAllProducts();
    await delay(100);

    const data = datamanipulation.getCheckoutPageTableDate(products, cart, cartItemsPrice);
    const rows = data[0];

    await cloudfirestore.deleteDocumentFromCollection('Orders','testref1234')

    expect(rows.length).toBe(1);
  }, 10000000);

  test('getAllProductsInCategory', async () => {
    const products = await firestore.readAllProducts();
    await delay(100);
    const favorites = user.favoriteItems;
    datamanipulation.getAllProductsInCategory(products, 'Favorites', true, false, favorites);
    const selected_products = datamanipulation.getAllProductsInCategory(products, 'Paper Bag', true, false, favorites);
    expect(selected_products).not.toBe([]);
    expect(selected_products.length).toBeGreaterThan(0);
    expect(selected_products[0].forTutorial).toBe(true);

    if (selected_products.length > 1) {
      expect(selected_products[1].forTutorial).toBe(false);
    }
  });
});

describe('Emulator', () => {
  test('Emulator Connected to Firestore', async () => {
    await firestore.createTestCollection();
    await delay(100);
  });

  test('read test collection', async () => {
    const data = await firestore.readTestCollection();
    await delay(100);
    expect(data).toEqual([{ name: 'test' }]);
  });

  test('delete test collection', async () => {
    await firestore.deleteTestCollection();
    await delay(100);
    const data = await firestore.readTestCollection();
    await delay(100);
    expect(data).toEqual([]);
    // tet
  });
});

describe('firestorefunctions', async () => {
  test('createDocument', async () => {
    await firestore.createDocument({ test: 'test' }, 'test', 'Products');
    await delay(100);
    const data = await firestore.readSelectedDataFromCollection('Products', 'test');
    expect(data).toEqual({ test: 'test' });
  });

  test('readAllDataFromCollection', async () => {
    const data = await firestore.readAllDataFromCollection('Products');
    await delay(100);
    expect(data).not.toBe([]);
  });
  test('readAllIdsFromCollection', async () => {
    const data = await firestore.readAllIdsFromCollection('Products');
    await delay(100);
    expect(data).not.toBe([]);
  });
  test('readSelectedDataFromCollection', async () => {
    const data = await firestore.readSelectedDataFromCollection('Products', 'test');
    await delay(100);
    expect(data).not.toBe([]);
  });
  test('updateDocumentFromCollection', async () => {
    const olddata = await firestore.readSelectedDataFromCollection('Products', 'test');
    await delay(100);
    await firestore.updateDocumentFromCollection('Products', 'test', { test: 'test2' });
    await delay(100);
    const newdata = await firestore.readSelectedDataFromCollection('Products', 'test');
    await delay(100);
    expect(newdata).not.toBe(olddata);
  });

  test('addDocumentArrayFromCollection', async () => {
    await firestore.createDocument({ testarray: [] }, 'test', 'Products');
    await delay(100);
    await firestore.addDocumentArrayFromCollection('Products', 'test', { test: 'testarray' }, 'testarray');
    await delay(100);
    await firestore.addDocumentArrayFromCollection('Products', 'test', { test: 'testarray2' }, 'testarray');
    await delay(100);
    const selected = await firestore.readSelectedDataFromCollection('Products', 'test');
    const testfield = selected.testarray;

    expect(testfield).toEqual([{ test: 'testarray' }, { test: 'testarray2' }]);
  });
  test('deleteDocumentArrayFromCollection', async () => {
    await firestore.deleteDocumentFromCollectionArray('Products', 'test', { test: 'testarray2' }, 'testarray');
    await delay(100);
    const selected = await firestore.readSelectedDataFromCollection('Products', 'test');
    await delay(100);
    const testfield = selected.testarray;
    expect(testfield).toEqual([{ test: 'testarray' }]);
    await delay(100);
  });
  test('deleteDocumentFromCollection', async () => {
    const olddata = await firestore.readAllIdsFromCollection('Products');
    await delay(100);
    await firestore.deleteDocumentFromCollection('Products', 'test');
    await delay(100);
    const newdata = await firestore.readAllIdsFromCollection('Products');
    if (newdata.includes('test')) {
      throw new Error('test is not deleted');
    }

  });
});

describe('Database', async () => {
  test('readAllParentProducts', async () => {
    const data = await firestore.readAllParentProducts();
    await delay(100);
    expect(data).not.toBe([]);
  });
  test('updatedoc', async () => {
    await firestore.updatePhoneNumber(userTestId, '09178927206');
    await delay(100);
    const user = await firestore.readUserById(userTestId);
    await delay(100);
    const phone = user.phoneNumber;
    expect(phone).toEqual('09178927206');
  });
});

describe('Transaction Create Payment', async () => {
  test('Check if payment is added to payment field', async () => {
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
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'testuser'
    );

    await delay(100);

    await firestore.transactionCreatePayment('testuser', 1000, '1234567890', 'GCASH');
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const payments = user.payments;
    const amount = payments[0].amount;
    const reference = payments[0].reference;
    const paymentprovider = payments[0].paymentprovider;
    expect(amount).toEqual(1000);
    expect(reference).toEqual('1234567890');
    expect(paymentprovider).toEqual('GCASH');

    await firestore.deleteUserByUserId('testuser');
    await delay(100);
  });
});

describe('firestoredb', async () => {
  beforeEach(async () => {
    await firestore.createNewUser(
      {
        uid: 'test',
        name: 'test',
        email: 'test@gmail.com',
        emailVerified: true,
        phoneNumber: '09178927206',
        deliveryAddress: [{ address: 'Paper Boy', latitude: 1, longitude: 0 }],
        contactPerson: [{ name: 'testname', phoneNumber: '09178927206' }],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'test'
    );
    await delay(100);
    await firestore.createNewUser(
      {
        uid: 'testuser',
        name: 'test',
        email: 'test@gmail.com',
        emailVerified: true,
        phoneNumber: '09178927206',
        deliveryAddress: [{ address: 'Paper Boy', latitude: 1, longitude: 0 }],
        contactPerson: [{ name: 'testname', phoneNumber: '09178927206' }],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'testuser'
    );
    await delay(100);
  });
  afterEach(async () => {
    await firestore.deleteUserByUserId('test');
    await delay(100);
    await firestore.deleteUserByUserId('testuser');
    await delay(100);
  });
  test('createProduct and readAll Products', async () => {
    
    await firestore.createProduct(
      {
        itemId: 'test',
        itemName: 'testname',
        unit: 'bale',
        price: 1000,
        description: 'none',
        weight: 15,
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
        clicks: [],
        piecesPerPack: 1,
        packsPerBox: 10,
        cbm: 1,
        manufactured: true,
        machinesThatCanProduce: '',
        stocksLowestPoint: []
      },
      'test',allProducts
    );
    await delay(200);
    const products = await firestore.readAllProducts();
    await delay(200);
    let found = false;
    products.map((product) => {
      if (product.itemId === 'test') {
        found = true;
      }
    });
    expect(found).toEqual(true);
  });
  test('readSelectedProduct', async () => {
    const product = await firestore.readSelectedProduct('test');
    await delay(100);
    expect(product.itemName).toEqual('testname');
  });
  test('updateProduct', async () => {
    await firestore.updateProduct('test', {
      itemName: 'testname2',
      unit: 'bale',
      price: 1000,
      description: 'none',
      weight: 15,
      dimensions: '10x12',
      category: 'Paper Bag',
      imageLinks: ['testlink'],
      brand: 'testbrand',
      pieces: 1999,
      color: 'red',
      material: 'material',
      size: '10',
      isCustomized: false,
      piecesPerPack : 10,
      packsPerBox : 20,
      cbm : 10,
      boxImage : null,
      costPrice : null,

    });
    await delay(100);
    const product = await firestore.readSelectedProduct('test');
    await delay(100);
    expect(product.itemName).toEqual('testname2');
  });

  test('deleteProduct', async () => {
    await firestore.deleteProduct('test');
    await delay(100);
    const product = await firestore.readSelectedProduct('test');
    await delay(100);
    expect(product).toEqual(undefined);
  });

  test('createCategory amd readAllCategories', async () => {
    await firestore.createCategory('testtest');
    await delay(100);
    const categories = await firestore.readAllCategories();
    await delay(100);
    let found = false;
    categories.map((category) => {
      if (category.category === 'Testtest') {
        found = true;
      }
    });
    expect(found).toEqual(true);
  });

  test('readAllUserIds', async () => {
    const usersId = await firestore.readAllUserIds();
    await delay(100);
    let found = false;
    usersId.map((user) => {
      if (user === 'test') {
        found = true;
      }
    });
    expect(found).toEqual(true);
  });

  test('readAllUsers', async () => {
    const users = await firestore.readAllUsers();
    await delay(100);
    let found = false;
    users.map((user) => {
      if (user.uid === 'testuser') {
        found = true;
      }
    });
    expect(found).toEqual(true);
  });

  test('readUserById', async () => {
    const user = await firestore.readUserById('test');
    await delay(100);
    expect(user.uid).toEqual('test');
  });

  test('addItemToFavorites and removeItemFromFavorites', async () => {
    await firestore.addItemToFavorites('testuser', 'test');
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);

    const favorites = user.favoriteItems;
    let found = false;
    favorites.map((favorite) => {
      if (favorite === 'test') {
        found = true;
      }
    });
    expect(found).toEqual(true);

    await firestore.removeItemFromFavorites('testuser', 'test');
    await delay(100);
    const user2 = await firestore.readUserById('testuser');
    await delay(100);
    const favorites2 = user2.favoriteItems;
    let found2 = false;
    favorites2.map((favorite) => {
      if (favorite === 'test') {
        found2 = true;
      }
    });
    expect(found2).toEqual(false);
  });

  test('createUserCart and deleteUserCart', async () => {
    await firestore.createUserCart(['testitem', 'testitem'], 'testuser');
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);

    const cart = user.cart;
    expect(cart).toEqual(['testitem', 'testitem']);

    await firestore.deleteAllUserCart('testuser');
    await delay(100);
    const user2 = await firestore.readUserById('testuser');
    await delay(100);
    const cart2 = user2.cart;
    expect(cart2).toEqual([]);
  });

  test('deleteAddress', async () => {
    await firestore.deleteAddress('testuser', 1, 0, 'Paper Boy');
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);

    const address = user.deliveryAddress;
    expect(address).toEqual([]);
  });

  test('deleteUserContactPerson', async () => {
    await firestore.deleteUserContactPersons('testuser', 'testname', '09178927206');
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const contactPerson = user.contactPerson;
    expect(contactPerson).toEqual([]);
  });

  test('updateLatitudeLongitude', async () => {
    await firestore.updateLatitudeLongitude('testuser', 1, 0);
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const latitude = user.latitude;
    const longitude = user.longitude;
    expect(latitude).toEqual(1);
    expect(longitude).toEqual(0);
  });

  test('updatePhoneNumber', async () => {
    await firestore.updatePhoneNumber(userTestId, '09178927206');
    await delay(100);
    const user = await firestore.readUserById('TESTUSER');
    await delay(100);
    const phoneNumber = user.phoneNumber;
    expect(phoneNumber).toEqual('09178927206');
  });
});

describe('cloudfirestorefunctions', async () => {
  test('createDocument', async () => {
    await cloudfirestorefunctions.createDocument({ test: 'test' }, 'test', 'Products');
    await delay(100);
    const data = await cloudfirestorefunctions.readSelectedDataFromCollection('Products', 'test');

    expect(data).toEqual({ test: 'test' });
  });

  test('readAllDataFromCollection', async () => {
    const data = await cloudfirestorefunctions.readAllDataFromCollection('Products');
    await delay(100);
    expect(data).toBeInstanceOf(Array);
  });
  test('readAllIdsFromCollection', async () => {
    const data = await cloudfirestorefunctions.readAllIdsFromCollection('Products');
    await delay(100);

    expect(data).toBeInstanceOf(Array);
  });
  test('readSelectedDataFromCollection', async () => {
    const data = await cloudfirestorefunctions.readSelectedDataFromCollection('Products', 'test', 'test');
    await delay(100);
    expect(data).not.toBe([]);
  });
  test('updateDocumentFromCollection', async () => {
    const olddata = await cloudfirestorefunctions.readSelectedDataFromCollection('Products', 'test');
    await delay(100);
    await cloudfirestorefunctions.updateDocumentFromCollection('Products', 'test', { test: 'test222' });
    await delay(100);
    const newdata = await cloudfirestorefunctions.readSelectedDataFromCollection('Products', 'test');
    await delay(100);
    expect(newdata).not.toEqual(olddata);
  });
  test('deleteDocumentFromCollection', async () => {
    await cloudfirestorefunctions.deleteDocumentFromCollection('Products', 'test');
    await delay(100);
    const ids = await cloudfirestorefunctions.readAllIdsFromCollection('Products');
    await delay(100);

    if (ids.includes('test')) {
      expect(true).toEqual(false);
    }
  });
  test('');
});

describe('getCartCount', () => {
  test('getCartCount', () => {
    const getCartCountBusinessCalculations = businesscalculations.getCartCount;

    const count = getCartCountBusinessCalculations(['PPB#1']);
    const count2 = getCartCountBusinessCalculations(['PPB#1']);
    expect(count).toEqual({ 'PPB#1': 1 });
    expect(count2).toEqual(count);
  });

  test('getValueAddedTax', () => {
    const getValueAddedTaxBusinessCalculations = businesscalculations.getValueAddedTax;
    const vat = getValueAddedTaxBusinessCalculations(1000);
    const vat2 = getValueAddedTaxBusinessCalculations(1000);

    let expected1, expected2;
    if (new AppConfig().getNoVat()) {
      expected1 = 0;
      expected2 = 0;
    } else {
      expected1 = 107.14;
      expected2 = 107.14;
    }

    expect(vat).toEqual(expected1);
    expect(vat2).toEqual(vat);
  });
});

describe('cloudfirestoredb', async () => {
  test('transactionCreatePayment', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    await firestore.deleteDocumentFromCollectionByFieldValue('Payments', 'orderReference', 'testref1234');
    await delay(300)

    resetOrdersAndPayments()


    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(200);

    await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'testlink3',
      'userName',
      'Maya',
      true
    );
    await delay(200);

    const data = {
      userId: userTestId,
      amount: 62002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink3',
    };

    await cloudfirestore.transactionCreatePayment(data);
    await delay(7000);
    const payments2 = await firestore.readAllDataFromCollection('Payments');
    let found2 = false;
    payments2.map((payment) => {
      if (payment.proofOfPaymentLink === 'testlink3') {
        expect(payment.status).toEqual('approved');
        found2 = true;
      }
    });

    expect(found2).toEqual(true);

    await delay(100);

    const user = await firestore.readUserById(userTestId);
    const payments = user.payments;
    const userOrders = user.orders;
    const order = await cloudfirestore.readSelectedDataFromCollection('Orders', 'testref1234');

    let found = true;
    payments.forEach((payment) => {
      if (payment.reference === 'testref1234') {
        found = true;
      }
    });

    expect(found).toEqual(true);

    expect(userOrders.length > 0).toEqual(true);
    expect(payments.length > 0).toEqual(true);  
    expect(order.paid).toEqual(true);

    


      
    
    await firestore.deleteDocumentFromCollection('Orders', 'testref1234');
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
  }, 10000000);
  test('updateOrdersAsPaidOrNotPaid', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    resetOrdersAndPayments()


    

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(200);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await delay(200);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref123456',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await delay(200);

    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: (itemsTotal + vat + 2002) * 2,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'www.testlink.com',
    });

    await delay(5000);
    const userData = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = userData.orders;

    const promises = orders.map(async(order) => {
      return await firestore.readSelectedDataFromCollection('Orders', order.reference);
    });

    const ordersData = await Promise.all(promises);

    ordersData.forEach((order) => {
      if (order.reference === 'testref1234') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference === 'testref12345') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference === 'testref123456') {
        expect(order.paid).toEqual(false);
      }
    })

  }, 100000);
  test('transactionCreatePayment2', async () => {

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),   
      testing : true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: 8888,
      vat: 0,
      shippingtotal: 2002,
      grandTotal: 8888,
      reference: 'testref123456789',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await delay(100);
    
    const data = {
      userId: userTestId,
      amount: 8888,
      reference: 'testref123456789',
      paymentprovider: 'Maya',
      proofOfPaymentLink :'www.testlink.com'
    };
    await cloudfirestore.transactionCreatePayment(data);
    await delay(5000);

    const user = await firestore.readUserById(userTestId);
    const payments = user.payments;

    payments.forEach((payment) => {
      if (payment.reference === 'testref123456789') {
        expect(payment.amount).toEqual(8888);
      }
    });

    // await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await delay(100);
  },100000);
  test('testPayMayaWebHookSuccess', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    await firestore.deleteDocumentFromCollection('Orders', 'testref1234');
    await firestore.deleteDocumentFromCollection('Orders', 'testref12345');
    await firestore.deleteDocumentFromCollection('Orders', 'testref123456');
    await firestore.deleteDocumentFromCollection('Orders', 'testref1234567');
    await firestore.deleteDocumentFromCollection('Orders', 'testref12345678');

    resetOrdersAndPayments()

    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    const result = await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await delay(300);

    const req = {
      totalAmount: {
        value: itemsTotal + vat + 2002,
        currency: 'PHP',
      },
      buyer: {
        contact: {
          email: 'ladia.adrian@gmail.com',
          phone: '09178927206',
        },
        shippingAddress: {
          line1: 'Cebu',
          line2: 'Cebu City',
          countryCode: 'PH',
        },
        firstName: 'Adrian',
        lastName: 'Ladia',
      },
      redirectUrl: {
        success: 'http://starpack.ph/checkoutSuccess',
        failure: 'http://starpack.ph/checkoutFailed',
        cancel: 'http://starpack.ph/checkoutCancelled',
      },
      requestReferenceNumber: 'testref1234',
      metadata: {
        userId: userTestId,
      },
    };

    const res = await cloudfirestore.testPayMayaWebHookSuccess(req);
    await delay(5000);
    const data = res.data;
    expect(data).toEqual('success');

    const user = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const ordersReferences = user.orders;
    const payments = user.payments;

    if (payments.length == 0) {
      throw new Error('No payments found');
    }

    const orderPromises = ordersReferences.map(async(order) => {
      const doc = await firestore.readSelectedDataFromCollection('Orders', order.reference);
      
      return doc;
    });

    const orders = await Promise.all(orderPromises);

    if (orders.length == 0) {
      throw new Error('No orders found');
    }

    orders.forEach((order) => {
      if (order.reference == 'testref1234') {
        expect(order.paid).toEqual(true);
      } 
    });

    let found1 = false;
    payments.map((payment) => {
      if (payment.reference == 'testref1234') {
        found1 = true;
      }
    });

    expect(found1).toEqual(true);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);

    const user2orders = await firestore.readSelectedDataFromCollection('Orders', 'testref12345');
    expect(user2orders.paid).toEqual(false);
 

    const req2 = {
      totalAmount: {
        value: itemsTotal + vat + 2002,
        currency: 'PHP',
      },
      buyer: {
        contact: {
          email: 'ladia.adrian@gmail.com',
          phone: '09178927206',
        },
        shippingAddress: {
          line1: 'Cebu',
          line2: 'Cebu City',
          countryCode: 'PH',
        },
        firstName: 'Adrian',
        lastName: 'Ladia',
      },
      redirectUrl: {
        success: 'http://localhost:5173/checkoutSuccess',
        failure: 'http://localhost:5173/checkoutFailed',
        cancel: 'http://localhost:5173/checkoutCancelled',
      },
      requestReferenceNumber: 'testref12345',
      metadata: {
        userId: userTestId,
      },
    };

    const res2 = await cloudfirestore.testPayMayaWebHookSuccess(req2);

    await delay(5000);
    const data2 = res2.data;
    expect(data2).toEqual('success');

    const user3 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const user3orders = await firestore.readSelectedDataFromCollection('Orders','testref12345');
    const user3payments = user3.payments;
    const user3orderReferences = user3.orders

    found1 = false;
    user3payments.map((payment) => {
      if (payment.reference == 'testref12345') {
        found1 = true;
      }
    });

    

    expect(found1).toEqual(true);
    expect(user3orders.paid).toEqual(true);
    expect(user3orderReferences.length).toEqual(2);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref123456',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234567',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345678',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    const req3 = {
      totalAmount: {
        value: itemsTotal + vat + 2002,
        currency: 'PHP',
      },
      buyer: {
        contact: {
          email: 'ladia.adrian@gmail.com',
          phone: '09178927206',
        },
        shippingAddress: {
          line1: 'Cebu',
          line2: 'Cebu City',
          countryCode: 'PH',
        },
        firstName: 'Adrian',
        lastName: 'Ladia',
      },
      redirectUrl: {
        success: 'http://localhost:5173/checkoutSuccess',
        failure: 'http://localhost:5173/checkoutFailed',
        cancel: 'http://localhost:5173/checkoutCancelled',
      },
      requestReferenceNumber: 'testref12345678',
      metadata: {
        userId: userTestId,
      },
    };

    const res3 = await cloudfirestore.testPayMayaWebHookSuccess(req3);
    await delay(300);
    const data3 = res3.data;
    expect(data3).toEqual('success');

    const user4 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const user4orders = user4.orders;
    const user4payments = user4.payments;

    const ordersPromises4 = user4orders.map(async(order) => {
      const data = await firestore.readSelectedDataFromCollection('Orders', order.reference);
      return data
    });

    const orders4 = await Promise.all(ordersPromises4);

    orders4.map((order) => {
      if (order.reference == 'testref1234') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference == 'testref12345') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference == 'testref123456') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference == 'testref1234567') {
        expect(order.paid).toEqual(false);
      }
      if (order.reference == 'testref12345678') {
        expect(order.paid).toEqual(false);
      }
    });

    expect(user4payments.length).toEqual(3);

    await delay(200);

    await cloudfirestore.testPayMayaWebHookSuccess();

    const payments2 = await firestore.readAllDataFromCollection('Payments');

    let found2 = false;
    payments2.map((payment) => {
      if (payment.orderReference === 'testref12345678') {
        found2 = true;
        if (payment.status != 'approved') {
          throw new Error('Payment not approved');
        }
      }
    });

    expect(found2).toEqual(true);

    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
  }, 1000000000);
  test('changeUserRole', async () => {
    await cloudfirestore.createNewUser(
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
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'testuser'
    );
    await delay(300);
    await cloudfirestore.changeUserRole('testuser', 'admin');
    await delay(300);
    const user = await cloudfirestore.readSelectedUserById('testuser');
    await delay(300);
    expect(user.userRole).toEqual('admin');
    await cloudfirestore.changeUserRole('testuser', 'member');
    await delay(300);
    const user2 = await cloudfirestore.readSelectedUserById('testuser');
    await delay(300);
    expect(user2.userRole).toEqual('member');
    await cloudfirestore.deleteDocumentFromCollection('Users', 'testuser');
  });

  test('readAllProductsForOnlineStore', async () => {
    const products = await cloudfirestore.readAllProductsForOnlineStore('Paper Bag');
    await delay(300);

    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBeGreaterThan(0);
  });

  test('checkifuseridexist', async () => {
    const user = await cloudfirestore.checkIfUserIdAlreadyExist(userTestId);
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
        clicks: [],
        piecesPerPack: 1,
        packsPerBox: 10,
        cbm: 1,
        manufactured: true,
        machinesThatCanProduce: '',
        stocksLowestPoint: []
      },
      'test',allProducts
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
        clicks: [],
        piecesPerPack: 1,
        packsPerBox: 10,
        cbm: 1,
        manufactured: true,
        machinesThatCanProduce: '',
        stocksLowestPoint: []
      },
      'test2',allProducts
    );

    await cloudfirestore.createNewUser(
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
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'testuser'
    );

    await delay(500);

    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345678',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(500);

    const testUser = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const deliveryAddress = testUser.deliveryAddress;
    const contactPerson = testUser.contactPerson;
    const orders = testUser.orders;
    const allOrderIds = await firestore.readAllIdsFromCollection('Orders');

    let foundOrderId = false;
    allOrderIds.forEach((orderId) => {
      if (orderId === 'testref12345678') {
        foundOrderId = true;
      }
    });

    expect(foundOrderId).toEqual(true);

    expect(deliveryAddress).length(1);
    expect(contactPerson).length(1);
    expect(orders).length(1);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927205',
      localname: 'Andrei Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345678',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(500);

    const testUser2 = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const deliveryAddress2 = testUser2.deliveryAddress;
    const contactPerson2 = testUser2.contactPerson;
    const orders2 = testUser2.orders;

    expect(deliveryAddress2).length(1);
    expect(contactPerson2).length(2);
    expect(orders2).length(2);

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'Test City 2',
      locallatitude: 1.242,
      locallongitude: 2.1122,
      localphonenumber: '09178927205',
      localname: 'Andrei Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345678',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
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
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'testuser'
    );
    await delay(100);
    const user = await cloudfirestore.readSelectedDataFromCollection('Users', 'testuser');
    const email = user.email;
    await delay(100);
    expect(email).toEqual('test@gmail.com');
    await cloudfirestore.deleteDocumentFromCollection('Users', 'testuser');
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
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate : 'TESTAFFILIATE',
    affiliateClaims: [],
    affiliateDeposits: [],
    affiliateCommissions: [],
    bir2303Link : null,
    affiliateId : null,
    affiliateBankAccounts : [],
    joinedDate : new Date(),
      },
      'testuser2'
    );

    await delay(100);
    const user = await cloudfirestore.readSelectedUserById('testuser2');
    const email = user.email;
    await delay(100);
    expect(email).toEqual('test@gmail.com');
    await cloudfirestore.deleteDocumentFromCollection('Users', 'testuser2');
  });

  test('readUserRole', async () => {
    const userIds = await cloudfirestore.readAllIdsFromCollection('Users');
    const userRolesPromises = userIds.map(async (userId) => {
      return await cloudfirestore.readUserRole(userId);
    });
    const userRoles = await Promise.all(userRolesPromises);
    const roles = ['member', 'admin', 'superAdmin','affiliate'];
    userRoles.map((userRole) => {
      expect(roles.includes(userRole)).toEqual(true);
    });
  }, 10000);

  test('deleteProduct', async () => {
    await firestore.deleteProduct('test');
    await firestore.deleteProduct('test2');
  });
});

describe('retryApiCall', () => {
  test('retryApiCall', async () => {
    function testApiCallTrue() {
      return true;
    }

    function testApiCallFalse() {
      throw new Error('test error');
    }

    const result = await retryApi(() => testApiCallTrue());
    expect(result).toEqual(true);

    await expect(async () => {
      await retryApi(() => testApiCallFalse(), 2);
    }).rejects.toThrowError(Error);
  }, 10000000);
});

describe('deleteOrderFromUserFirestore', () => {
  test('clean Orders first', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    await firestore.deleteDocumentFromCollection('Orders', 'testref1234');
  });

  test('creating three orders from testUser', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref123456',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    test('check if reference is added to orderMessages collection', async () => {
      const ids = await firestore.readAllIdsFromCollection('ordersMessages');

      let found = false;
      ids.map((id) => {
        if (id == 'testref1234') {
          found = true;
        }
      });

      let found2 = false;
      ids.map((id) => {
        if (id == 'testref12345') {
          found2 = true;
        }
      });

      let found3 = false;
      ids.map((id) => {
        if (id == 'testref12346') {
          found3 = true;
        }
      });

      expect(found).toBe(true);
      expect(found2).toBe(true);
      expect(found3).toBe(true);
      await firestore.deleteDocumentFromCollection('ordersMessages', 'testref1234');
      await firestore.deleteDocumentFromCollection('ordersMessages', 'testref12345');
      await firestore.deleteDocumentFromCollection('ordersMessages', 'testref12346');
    });
  }, 100000);

  test('deleteOrderFromCollectionArray', async () => {
    await delay(1000);
    await firestore.deleteOrderFromCollectionArray(userTestId, 'testref12345');
    await delay(200);
    const user = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = user.orders;

    expect(orders.length).toEqual(2);

    orders.map((order) => {
      if (order.reference == 'testref12345') {
        throw new Error('Order not deleted');
      }
    });

    await firestore.deleteOrderFromCollectionArray(userTestId, 'testref1234');
    await delay(200);
    const user2 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders2 = user2.orders;

    expect(orders2.length).toEqual(1);

    await firestore.deleteOrderFromCollectionArray(userTestId, 'testref123456');
    await delay(200);
    const user3 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders3 = user3.orders;

    expect(orders3.length).toEqual(0);
  }, 100000);
});

describe('updateOrderProofOfPaymentLink', () => {
  let id1, id2;
  test('Create Test Order', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);
  }, 100000);

  test('updateOrderProofOfPaymentLink', async () => {
    id1 = await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink.com',
      'TEST USER',
      'BDO',
      true
    );
    await delay(300);
    const orderData = await firestore.readSelectedDataFromCollection('Orders', 'testref1234');

    expect(orderData.proofOfPaymentLink).toEqual(['https://testlink.com']);
  });

  test('Check if proof of payment is added to payments & orderMessages collection message field', async () => {
    const data = await firestore.readSelectedDataFromCollection('Payments', id1);
    const orderReference = data.orderReference;
    await delay(300);
    expect(data.proofOfPaymentLink).toEqual('https://testlink.com');
    expect(data.status).toEqual('pending');

    const data2 = await firestore.readSelectedDataFromCollection('ordersMessages', orderReference);
    const messages = data2.messages;
    messages.forEach((m) => {
      expect(m.image).not.toEqual('');
    });
  });

  test('add another proofOfPaymentLink', async () => {
    id2 = await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink2.com',
      'TEST USER',
      'BDO',
      true
    );
    await delay(300);

    const orderData = await firestore.readSelectedDataFromCollection('Orders', 'testref1234');
    expect(orderData.proofOfPaymentLink).toEqual(['https://testlink.com', 'https://testlink2.com']);


  });

  test('Check if proof of payment is added to payments 2', async () => {
    const data = await firestore.readSelectedDataFromCollection('Payments', id2);
    await delay(300);
    expect(data.proofOfPaymentLink).toEqual('https://testlink2.com');
    expect(data.status).toEqual('pending');
  });

  test('delete testref1234', async () => {
    await firestore.deleteDocumentFromCollection('Payments', 'testref1234');
    // await firestore.deleteDocumentFromCollection('Users', userTestId);
  });
}, 10000);

describe('convert date timestamp to date string', () => {
  test('convert date timestamp to date string', () => {
    const timestamp = { seconds: 1600000000, nanoseconds: 0 };
    const time = datamanipulation.convertDateTimeStampToDateString(timestamp);
    expect(time).toEqual('2020-09-13 20:26:40');
  });
});

describe('sendEmail', async () => {
  test('should send email', async () => {
    const data = {
      to: 'ladiaadrian@gmail.com',
      subject: 'test',
      text: 'test',
    };
    const res = await cloudfirestore.sendEmail(data);

    expect(res).toEqual('success');
  });
}, 100000);

describe('afterCheckoutRedirectLogic', () => {
  class testCheckout {
    constructor() {
    }

    mockFunction() {}

    runFunction(paymentMethodSelected) {
      const res = businesscalculations.afterCheckoutRedirectLogic(
        {
          paymentMethodSelected: paymentMethodSelected,
          referenceNumber: 'testref1234',
          grandTotal: 10000,
          deliveryFee: 100,
          vat: 200,
          rows: [],
          area: ['lalamoveServiceArea'],
          fullName: 'Test User',
          eMail: 'test@gmail.com',
          phoneNumber: '09178927206',
          setMayaRedirectUrl: this.mockFunction,
          setMayaCheckoutId: this.mockFunction,
          localDeliveryAddress: 'localDeliveryAddress',
          addressText: 'AddressText',
          userId: 'userId',
          itemsTotal: 1000,
          date: new Date(),
        },
        true
      );
      return res;
    }
  }

  const testRedirect = new testCheckout();

  test('Test BDO', async () => {
    let res;
    res = testRedirect.runFunction('bdo');
    expect(res).toEqual('bdo');

  });

  test('Test Unionbank', async () => {
    let res;
    res = testRedirect.runFunction('unionbank');
    expect(res).toEqual('unionbank');

  });

  test('Test Maya', async () => {
    let res;
    res = testRedirect.runFunction('maya');
    expect(res).toEqual('maya');

  });

  test('Test Maya', async () => {
    let res;
    res = testRedirect.runFunction('gcash');
    expect(res).toEqual('gcash');

  });

  test('Test Maya', async () => {
    let res;
    res = testRedirect.runFunction('visa');
    expect(res).toEqual('visa');

  });

  test('Test Maya', async () => {
    let res;
    res = testRedirect.runFunction('mastercard');
    expect(res).toEqual('mastercard');

  });

  // test('should return false if user has orders', async () => {
  //   await firestore.updateDocumentFromCollection('Users', userTestId, { orders: ['test'] });
  //   const res = await cloudfirestore.afterCheckoutRedirectLogic(userTestId);
  //   expect(res).toEqual(false);
  // });
});

describe('updatePaymentStatus', () => {
  let id1;
  test('Create Test Order', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
  });
  test('create Test Payment Proof Upload', async () => {
    id1 = await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink.com',
      'TEST USER',
      'BDO',
      true
    );
    await delay(300);
  });

  test('update status to failed', async () => {
    await firestore.updatePaymentStatusDeclined('testref1234');
    await delay(200);
    const data = await firestore.readSelectedDataFromCollection('Payments', id1);
    expect(data.status).toEqual('declined');
  });
  test('delete payment', async () => {
    await firestore.deleteDocumentFromCollection('Payments', id1);
  });
}, 100000);

describe('deleteOldOrders', async () => {
  test('create PAID 2 day ago order for testing', async () => {

    resetOrdersAndPayments()

    const currentDate = new Date(); // Get the current date
    const msInADay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const twoDaysAgo = new Date(currentDate.getTime() - 2 * msInADay); // Subtract 2 days from the current date
    const itemsTotal = 10000
    const vat = 1000
    await cloudfirestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      testing:true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12, 'PPB#1-RET':12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing:true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12, 'PPB#1-RET':12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing:true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12, 'PPB#1-RET':12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref123456',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing:true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12, 'PPB#1-RET':12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234567',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing:true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12, 'PPB#1-RET':12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345678',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await firestore.updateDocumentFromCollection('Orders', 'testref1234', {orderDate: twoDaysAgo});
    await firestore.updateDocumentFromCollection('Orders', 'testref12345', {orderDate: twoDaysAgo});
    
    await delay(200);
  },100000);

  test('check if order deleted', async () => {
    const res = await cloudfirestore.deleteOldOrders();
    await delay(3000);
    const testUserData = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = testUserData.orders;
    let found1 = false;
    let found2 = false;
    let found4 = false;
    orders.map((order) => {
      if (order.reference == 'testref12345') {
        throw new Error('Order not deleted');
      }

      if (order.reference == 'testref123456') {
        found1 = true;
      }
      if (order.reference == 'testref1234567') {
        found2 = true;
      }
      if (order.reference == 'testref1234') {
        throw new Error('Order not deleted');
      }
      if (order.reference == 'testref12345678') {
        found4 = true;
      }
    });

    expect(found1).toEqual(true);
    expect(found2).toEqual(true);
    expect(found4).toEqual(true);
  }, 100000);

  test('delete all orders', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, {
      orders: [],
    });
  });

  test('Create an order with items to test if items are added back to stocksAvailable and stocksOnHold is deleted', async () => {
    
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    await firestore.deleteDocumentFromCollection('Orders', 'testref1234');
    await firestore.deleteDocumentFromCollection('Orders', 'testref12345');
    await firestore.updateDocumentFromCollection('Products', 'PPB#16', { stocksOnHold: [] });
    await firestore.updateDocumentFromCollection('Products', 'PPB#12', { stocksOnHold: [] });
    await firestore.updateDocumentFromCollection('Products', 'PPB#1-RET', { stocksOnHold: [] });
    resetOrdersAndPayments()
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const ppb12 = await firestore.readSelectedDataFromCollection('Products', 'PPB#12');
    const ppb12Price = ppb12.price;
    const itemsTotal = (ppb12Price * 12 + ppb16Price * 12) / 1.12;
    const vat = ppb12Price * 12 + ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing:true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12, 'PPB#1-RET':12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await delay(300);

    const currentDate = new Date(); // Get the current date
    const msInADay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const twoDaysAgo = new Date(currentDate.getTime() - 2 * msInADay); // Subtract 2 days from the current date
    const userdata = await firestore.readUserById(userTestId);
    const orders = userdata.orders;

    cloudfirestore.updateDocumentFromCollection('Orders', 'testref1234', { orderDate: twoDaysAgo })

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#12': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref12345',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(2000);
  }, 100000);
  test('invoke function', async () => {
    const oldPPB16 = await firestore.readSelectedProduct('PPB#16');
    const oldPPB12 = await firestore.readSelectedProduct('PPB#12');
    const oldPPB1Retail = await firestore.readSelectedProduct('PPB#1-RET');
    const oldPPB16Stocks = oldPPB16.stocksAvailable;
    const oldPPB12Stocks = oldPPB12.stocksAvailable;
    const oldPPB1RetailStocks = oldPPB1Retail.stocksAvailable;
    await cloudfirestore.deleteOldOrders();
    await delay(2000);
    const newPPB16 = await firestore.readSelectedProduct('PPB#16');
    const newPPB12 = await firestore.readSelectedProduct('PPB#12');
    const newPPB1Retail = await firestore.readSelectedProduct('PPB#1-RET');
    const newPPB16Stocks = newPPB16.stocksAvailable;
    const newPPB12Stocks = newPPB12.stocksAvailable;
    const newPPB1RetailStocks = newPPB1Retail.stocksAvailable;
    const newPPB1StocksOnHold = newPPB1Retail.stocksOnHold;
    const newPPB16StocksOnHold = newPPB16.stocksOnHold;
    const newPPB12StocksOnHold = newPPB12.stocksOnHold;

    expect(newPPB16Stocks - oldPPB16Stocks).toEqual(12);
    expect(newPPB12Stocks - oldPPB12Stocks).toEqual(12);
    expect(newPPB1RetailStocks - oldPPB1RetailStocks).toEqual(12);
    expect(newPPB1StocksOnHold.length).toEqual(0);
    expect(newPPB16StocksOnHold.length).toEqual(1);
    expect(newPPB12StocksOnHold.length).toEqual(1);

    const userData = await firestore.readUserById(userTestId);
    const orders = userData.orders;

    let found = false;
    orders.map((order) => {
      if (order.reference == 'testref1234') {
        throw new Error('Order not deleted');
      }
      if (order.reference == 'testref12345') {
        found = true;
      }
    });

    expect(found).toEqual(true);

    const expiredOrder = await firestore.readSelectedDataFromCollection('ExpiredOrders', 'testref1234');
    expect(expiredOrder.reference).toEqual('testref1234');

    const shouldBeRemovedOrder = await firestore.readSelectedDataFromCollection('Orders', 'testref1234');
    expect(shouldBeRemovedOrder).toEqual(undefined);



  }, 100000);
});

describe('transactionPlaceOrder test retail', async () => {
  test('retail items', async () => {
    await firestore.updateDocumentFromCollection('Products', 'PPB#16', { stocksOnHold: [] });
    await delay(300);
    const ppb1RET = await firestore.readSelectedDataFromCollection('Products', 'PPB#1-RET');
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb1RETPrice = ppb1RET.price;
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb1RETPrice * 11) + (ppb16Price * 1)
    const vat = 0;

    const data = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const stocksAvailable = data.stocksAvailable;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#1-RET': 11, 'PPB#16': 1 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300);
    const data2 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const stocksOnHold2 = data2.stocksOnHold;
    const stocksAvailable2 = data2.stocksAvailable;

    expect(stocksOnHold2.length).toEqual(1);
    expect(stocksAvailable - stocksAvailable2).toEqual(1);
  }, 50000);
});

describe('deleteDeclinedPayments', () => {
  test('Setup test', async () => {
    const paymentIds = await firestore.readAllIdsFromCollection('Payments')
    paymentIds.map(async (paymentId) => {
      await firestore.deleteDocumentFromCollection('Payments', paymentId)
    })
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink.com',
      'TEST USER',
      'BDO',
      true
    );
    await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink2.com',
      'TEST USER',
      'BDO',
      true
    );
    await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink3.com',
      'TEST USER',
      'BDO',
      true
    );
  });

  test('invoking function', async () => {
    await firestore.deleteDeclinedPayment('testref1234', userTestId, 'https://testlink.com');
  });
  test('checking values', async () => {
    const payments = await firestore.readAllDataFromCollection('Payments');
    let found = false;
    const order = await firestore.readSelectedDataFromCollection('Orders', 'testref1234');
    await delay(300);
    expect(order.proofOfPaymentLink).toEqual(['https://testlink2.com', 'https://testlink3.com']);

    let found2 = false;
    payments.map((payment) => {
      if (payment.orderReference == 'testref1234' && payment.proofOfPaymentLink == 'https://testlink.com') {
        found2 = true;
        expect(payment.status).toEqual('declined');
      }
      if (['https://testlink2.com', 'https://testlink3.com'].includes(payment.proofOfPaymentLink)) {
        expect(payment.status).toEqual('pending');
      }
    });

    expect(found2).toEqual(true);
  });
}, 100000);

describe('testCancelOrder', () => {
  test('Setup test', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const ppb16Retail = await firestore.readSelectedProduct('PPB#16-RET');
    const ppb16RetPrice = ppb16Retail.price;
    const itemsTotal = (ppb16Price * 12 + ppb16RetPrice * 12) / 1.12;
    const vat = ppb16Price * 12 + ppb16RetPrice * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      isInvoiceNeeded: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12, 'PPB#16-RET': 12 },
      itemstotal: itemsTotal,
      vat: vat,
      shippingtotal: 2002,
      grandTotal: itemsTotal + vat + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
      
    });
  });

  test('deleteCancelledOrder invoke ', async () => {
    await delay(200);

    const productDataOld = await cloudfirestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const stocksAvailableOld = productDataOld.stocksAvailable;

    await cloudfirestore.transactionCancelOrder({ userId: userTestId, orderReference: 'testref1234' });
    await delay(300)
    const user = await cloudfirestore.readSelectedUserById(userTestId);
    const order = user.orders;

    expect(order.length).toEqual(0);

    const data = await firestore.readSelectedDataFromCollection('Orders','testref1234')
    expect(data).toEqual(undefined)

    const productDataNew = await cloudfirestore.readSelectedDataFromCollection('Products', 'PPB#16');
    productDataNew.stocksOnHold.map((stock) => {
      if (stock.reference == 'testref1234') {
        throw new Error('Stock not deleted');
      }
    });

    const stocksAvailableNew = productDataNew.stocksAvailable;

    expect(stocksAvailableNew - stocksAvailableOld).toEqual(12);
  });
}, 100000);

describe('updateProductClicks', async () => {
  test('Create test product', async () => {
    await firestore.createProduct(
      {
        itemId: 'test',
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
        clicks: [],
        piecesPerPack: 1,
        packsPerBox: 10,
        cbm: 1,
        manufactured: true,
        machinesThatCanProduce: '',
        stocksLowestPoint: []
      },
      'test',allProducts
    );
  });
  test('invoking function', async () => {
    await delay(200);
    await firestore.updateProductClicks('test', userTestId);
    await delay(200);
    const products = await firestore.readAllDataFromCollection('Products');

    const testProduct = products.filter((product) => product.itemId == 'test')[0];
    expect(testProduct.clicks.length).toEqual(1);
  });
  test('deleting test product', async () => {
    await firestore.deleteDocumentFromCollection('Products', 'test');
  });

  // await cloudfirestore.updateProductClicks('PPB#16-RET');
});

describe('readPaymentProviders', async () => {
  test('invoking function', async () => {
    const paymentProviders = await firestore.readAllPaymentProviders();
    expect(paymentProviders.length).toBeGreaterThan(0);
  });
});

describe('readAllMachines', async () => {
  test('invoking function', async () => {
    const machines = await firestore.readAllMachines();
    expect(machines.length).toBeGreaterThan(0);
  });
});

describe('testRetailTransactionPlaceOrder', async () => {
  test('Setup test', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
  });
  test('test retail items in transactionPlaceOrder ', async () => {
    const oldPpb1 = await firestore.readSelectedDataFromCollection('Products', 'PPB#1-RET');
    const ppb1OldStocks = oldPpb1.stocksAvailable;
    const oldPpb2 = await firestore.readSelectedDataFromCollection('Products', 'PPB#2-RET');
    const ppb2OldStocks = oldPpb2.stocksAvailable;
    const oldPpb3Wholesale = await firestore.readSelectedDataFromCollection('Products', 'PPB#3');
    const ppb3WholesaleOldStocks = oldPpb3Wholesale.stocksAvailable;

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing : true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#1-RET': 10, 'PPB#2-RET': 10,'PPB#3':1 },
      itemstotal: 1100,
      vat: 0,
      shippingtotal: 100,
      grandTotal: 1000,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    await delay(200);

    const user = await cloudfirestore.readSelectedUserById(userTestId);
    const order = user.orders;
    expect(order.length).toEqual(1);

    const newPpb1 = await firestore.readSelectedDataFromCollection('Products', 'PPB#1-RET');
    const ppb1NewStocks = newPpb1.stocksAvailable;
    const newPpb2 = await firestore.readSelectedDataFromCollection('Products', 'PPB#2-RET');
    const ppb2NewStocks = newPpb2.stocksAvailable;
    const newPpb3Wholesale = await firestore.readSelectedDataFromCollection('Products', 'PPB#3');
    const ppb3WholesaleNewStocks = newPpb3Wholesale.stocksAvailable;

    expect(ppb1OldStocks - ppb1NewStocks).toEqual(10);
    expect(ppb2OldStocks - ppb2NewStocks).toEqual(10);
    expect(ppb3WholesaleOldStocks - ppb3WholesaleNewStocks).toEqual(1);

  });
},100000);

describe('testStoreProductsOrganizer', async () => {
  let products = [];
  test('Setup test', async () => {
    products = await cloudfirestore.readAllProductsForOnlineStore();
  });
  test('invoking function', async () => {
    const categories = await firestore.readAllCategories();
    categories.forEach((category) => {
      const filteredProductsByCategory = products.filter((product) => product.category == category.category && product.unit == 'Pack');
      const spo = new storeProductsOrganizer(filteredProductsByCategory)
      spo.runMain()
    });
  });
});

describe('test commission system', async () => {
  test('Setup test', async () => {
    resetOrdersAndPayments()


    await firestore.deleteDocumentFromCollection('Users', 'TESTAFFILIATE')
    await firestore.deleteDocumentFromCollection('Users', 'TESTUSER')
    await cloudfirestore.createNewUser(
      {
        uid: 'TESTAFFILIATE',
        name: 'affiliate user',
        email: 'affiliate@gmail.com',
        emailVerified: true,
        phoneNumber: '09178927206',
        deliveryAddress: [],
        contactPerson: [],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'affiliate',
        affiliate: null,
        affiliateClaims: [],
        affiliateDeposits: [],
        affiliateCommissions: [],
        bir2303Link : null,
        affiliateId : null,
        affiliateBankAccounts : [],
        joinedDate : new Date(),
      },
      'TESTAFFILIATE'
    );
    await cloudfirestore.createNewUser(
      {
        uid: 'TESTUSER',
        name: 'test user2',
        email: 'test@gmail.com',
        emailVerified: true,
        phoneNumber: '09178927206',
        deliveryAddress: [],
        contactPerson: [],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
        affiliate: 'TESTAFFILIATE',
        affiliateClaims: [],
        affiliateDeposits: [],
        affiliateCommissions: [],
        bir2303Link : null,
        affiliateId : null,
        affiliateBankAccounts : [],
        joinedDate : new Date(),
      },
      'TESTUSER'
    );
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing : true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#1-RET': 10, 'PPB#2-RET': 10,'PPB#3':1 },
      itemstotal: 350000,
      vat: 0,
      shippingtotal: 100,
      grandTotal: 1000,
      reference: 'testref12',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    })
    await cloudfirestore.transactionCreatePayment({
      userId: 'TESTUSER',
      amount: 50000,
      reference: 'testref12',
      paymentprovider: 'gcash',
      proofOfPaymentLink: 'www.test.com',
  
    })
    await delay(5000);
    await cloudfirestore.transactionCreatePayment({
      userId: 'TESTUSER',
      amount: 100000,
      reference: 'testref12',
      paymentprovider: 'gcash',
      proofOfPaymentLink: 'www.test.com',

    })
    await delay(5000);
    await cloudfirestore.transactionCreatePayment({
      userId: 'TESTUSER',
      amount: 200000,
      reference: 'testref12',
      paymentprovider: 'gcash',
      proofOfPaymentLink: 'www.test.com',

    })
    await delay(5000);

  });
  test('check if transaction create payment added commissions to affiliate', async () => {
    const affiliateData = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateCommissions = affiliateData.affiliateCommissions
    expect(affiliateCommissions.length).toBeGreaterThan(0);
  });
  test('affiliate claims commission', async () => {
    const affiliateData = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateCommissions = affiliateData.affiliateCommissions
    const data1 = {
      date: new Date().toDateString(),
      data: affiliateCommissions,
      id: 'TESTAFFILIATE',
      claimCode: 'testcode',
    }
    const data2 = {
      affiliateUserId: 'TESTAFFILIATE',
      affiliateClaimId: 'testcode',
      method: 'gcash',
      accountNumber: '0123456789',
      accountName: 'affiliate user',
      transactionDate: new Date().toDateString(),
      amount: 17500,
      totalDeposited: 0,
      isDone: false
    }
    const data = {
      data1:data1,
      data2:data2
    }
    await cloudfirestore.onAffiliateClaim(data)
    await delay(300)
  });
  test('check if affiliate claims commission added to affiliate claims', async () => {
    const affiliateData = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateClaims = affiliateData.affiliateClaims
    const affiliateCommissions = affiliateData.affiliateCommissions
    expect(affiliateClaims.length).toBeGreaterThan(0);
    affiliateCommissions.forEach((claim) => {
      expect(claim.status).toEqual('pending')
    })
  });
  test('admin deposits to affiliate 10000 / 17500 only', async () => {
    
    await cloudfirestore.addDepositToAffiliate({
      depositImageUrl : 'www.testlink.com',
      amountDeposited : parseInt(10000),
      affiliateClaimId : 'testcode',
      affiliateUserId: 'TESTAFFILIATE',
      depositMethod : 'gcash',
      depositorUserId : 'ADMIN',
      depositorUserRole : 'admin',
      transactionDate : new Date().toDateString()
    })
    await delay(300)
  });
  test('check if deposited amount is added to affiliate deposits and status is pending', async () => {
    const affiliateData = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateDeposits = affiliateData.affiliateDeposits
    const affiliateCommissions = affiliateData.affiliateCommissions
    const affiliateClaims = affiliateData.affiliateClaims
    expect(affiliateDeposits.length).toBeGreaterThan(0);
    affiliateCommissions.forEach((commission) => {
      expect(commission.status).toEqual('pending')
    })

    affiliateClaims.forEach((claim) => {
      if (claim.affiliateClaimId == 'testcode') {
        expect(claim.isDone).toEqual(false)
      }
    })
  })
  test('admin deposits to affiliate 7500 to fully pay claim', async () => {
    await cloudfirestore.addDepositToAffiliate({
      depositImageUrl : 'www.testlink.com',
      amountDeposited : parseInt(7500),
      affiliateClaimId : 'testcode',
      affiliateUserId: 'TESTAFFILIATE',
      depositMethod : 'gcash',
      depositorUserId : 'ADMIN',
      depositorUserRole : 'admin',
      transactionDate : new Date().toDateString()
    })
    await delay(300)
  });
  test('check if deposited amount is added to affiliate deposits and status is done', async () => {
    const affiliateData = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateDeposits = affiliateData.affiliateDeposits
    const affiliateCommissions = affiliateData.affiliateCommissions
    const affiliateClaims = affiliateData.affiliateClaims
    expect(affiliateDeposits.length).toBeGreaterThan(1);
    affiliateCommissions.forEach((commission) => {
      expect(commission.status).toEqual('paid')
    })

    affiliateClaims.forEach((claim) => {
      if (claim.affiliateClaimId == 'testcode') {
        expect(claim.isDone).toEqual(true)
      }
    })
  })
  test('create another order with vat and pay' , async () => {
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      isInvoiceNeeded: true,
      testing : true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#1-RET': 10, 'PPB#2-RET': 10,'PPB#3':1 },
      itemstotal: 8928.57,
      vat: 1071.43,
      shippingtotal: 1000,
      grandTotal: 11000,
      reference: 'testref1234567',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    })
  })
  test('pay order with vat', async () => {
    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 11000,
      reference: 'testref1234567',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink3',
    })
    await delay(5000);
    const affiliateData = await cloudfirestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const commissions = affiliateData.affiliateCommissions
    let found = false
    commissions.forEach((commission) => {
      if (commission.commission == '261.64') {
        found = true
      }
    })
    expect(found).toEqual(true)
  })
  test('affiliate add payment method', async () => {
    await firestore.updateAffiliateBankAccount('TESTAFFILIATE', {bank : 'bdo',accountName: 'Adrian Ladia',accountNumber:'1234567890'})
    await delay(300)
    const affiliate = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateBankAccount = affiliate.affiliateBankAccounts
    let foundbdo = false
    affiliateBankAccount.forEach((bank) => {
      if (bank.bank == 'bdo') {
        foundbdo = true
      }
    })
    expect(foundbdo).toEqual(true)
    await firestore.updateAffiliateBankAccount('TESTAFFILIATE', {bank : 'unionbank',accountName: 'Adrian Ladia',accountNumber:'1234567890'})
    await firestore.updateAffiliateBankAccount('TESTAFFILIATE', {bank : 'gcash',accountName: 'Adrian Ladia',accountNumber:'1234567890'})
    await firestore.updateAffiliateBankAccount('TESTAFFILIATE', {bank : 'maya',accountName: 'Adrian Ladia',accountNumber:'1234567890'})
    await delay(300)
    const affiliate2 = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateBankAccount2 = affiliate2.affiliateBankAccounts

    if (affiliateBankAccount2.length != 4) {
      throw new Error('not all bank accounts are added')
    }

    await firestore.updateAffiliateBankAccount('TESTAFFILIATE', {bank : 'bdo',accountName: 'Ladia Adrian',accountNumber:'0987654321'})
    await firestore.updateAffiliateBankAccount('TESTAFFILIATE', {bank : 'unionbank',accountName: 'Ladia Adrian',accountNumber:'0987654321'})

    const affiliate3 = await firestore.readSelectedDataFromCollection('Users', 'TESTAFFILIATE')
    const affiliateBankAccount3 = affiliate3.affiliateBankAccounts

    affiliateBankAccount3.forEach((bank) => {
      if (bank.bank == 'bdo') {
        expect(bank.accountName).toEqual('Ladia Adrian')
        expect(bank.accountNumber).toEqual('0987654321')
      }
      if (bank.bank == 'unionbank') {
        expect(bank.accountName).toEqual('Ladia Adrian')
        expect(bank.accountNumber).toEqual('0987654321')
      }
    })

  })



},500000)


describe('test bir2303Link functions', () => {
  test('setup test', async () => {
    await firestore.updateDocumentFromCollection('Users', 'TESTUSER', {
      bir2303Link: null
    })
  })
  test('add link', async () => {
    await firestore.addBir2303Link('TESTUSER','www.testlink.com')
    await delay(300)
    const userdata = await firestore.readSelectedDataFromCollection('Users', 'TESTUSER')
    expect(userdata.bir2303Link).toEqual('www.testlink.com')
  })
  test('delete link', async () => {
    await firestore.deleteBir2303Link('TESTUSER')
    await delay(300)
    const userdata = await firestore.readSelectedDataFromCollection('Users', 'TESTUSER')
    expect(userdata.bir2303Link).toEqual(null)
  })
})

describe('get all affiliates', () => {
  test('invoke function', async () => {
    const users = await cloudfirestore.getAllAffiliateUsers()
    expect(users.length).toBeGreaterThan(0)
  })
})

describe('count all orders of a specific year', () => {
  test('prepare data', async () => {
    await firestore.updateDocumentFromCollection('Users',userTestId,{orders : []})
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: 1000,
      vat: 100,
      shippingtotal: 2002,
      grandTotal: 1000 + 100 + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: 1000,
      vat: 100,
      shippingtotal: 2002,
      grandTotal: 1000 + 100 + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300)
  })
  test('count orders', async () => {

    

    const yearToday = new Date().getFullYear()
    const userdata = await firestore.readSelectedDataFromCollection('Users',userTestId)
    const ordersRef = userdata.orders

    const ordersPromises = ordersRef.map(async (order) => {
      const orderdata = await firestore.readSelectedDataFromCollection('Orders',order.reference)
      return orderdata
    })

    const orders = await Promise.all(ordersPromises)
    

    const count = datamanipulation.countAllOrdersOfUserInASpecificYear(orders,yearToday)
    expect(count).toEqual(2)
  })
})

describe('test transaction create payment without an affiliate' , () => {
  test('setting up test', async () => {
    await firestore.updateDocumentFromCollection('Users','NOAFFILIATETESTUSER',{orders : [],payments : []})
    resetOrdersAndPayments()
    await delay(300)

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: 'NOAFFILIATETESTUSER',
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: 9998,
      vat: 0,
      shippingtotal: 2002,
      grandTotal: 12000,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(5000)
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: 'NOAFFILIATETESTUSER',
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 12 },
      itemstotal: 9998,
      vat: 0,
      shippingtotal: 2002,
      grandTotal: 12000,
      reference: 'testref12345',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(5000)
  },1000000)
  test('create payment', async () => {
    await cloudfirestore.transactionCreatePayment({
      userId: 'NOAFFILIATETESTUSER',
      amount: 12000,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink3',
    })
    await delay(5000)
  
    const user = await firestore.readSelectedDataFromCollection('Users','NOAFFILIATETESTUSER')
    const payment = user.payments
    const orderReferences = user.orders

    let foundPayment = false
    payment.forEach((payment) => {
      if (payment.reference === 'testref1234') {
        foundPayment = true
      }
    })

    expect(foundPayment).toBe(true)
    expect (orderReferences.length).toBe(2)

    const orderPromises = orderReferences.map(async (orderReference) => {
      const order = await firestore.readSelectedDataFromCollection('Orders',orderReference.reference)
      return order
    })

    const orders = await Promise.all(orderPromises)

    orders.map((order) => {
      if (order.reference === 'testref1234') {
        expect(order.proofOfPaymentLink).toEqual(['testlink3'])
        expect(order.paid).toBe(true)
      }
      if (order.reference === 'testref12345') {
        expect(order.proofOfPaymentLink).toEqual([])
        expect(order.paid).toBe(false)
      }
    })

    const paymentObj = await firestore.readAllDataFromCollection('Payments')
    
    let foundPaymentObj = false
    paymentObj.forEach((payment) => {
      if (payment.orderReference === 'testref1234') {
        foundPaymentObj = true
      }
    })

    expect(foundPaymentObj).toBe(true)
  },1000000000)
})

describe('test transactionPlaceOrder should not allow order if cart stocks is more than what is available in firestore' , () => {
  test('setup test', async () => {
    await cloudfirestore.updateDocumentFromCollection('Products','PPB#16',{stocksAvailable : 4})
    await cloudfirestore.updateDocumentFromCollection('Products','PPB#16-RET',{stocksAvailable : 4})
  })
  test('invoke function', async () => {
    const res = await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 5 , 'PPB#16-RET' : 5},
      itemstotal: 1000,
      vat: 0,
      shippingtotal: 2002,
      grandTotal: 1000 + 0 + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    
    expect(res.status).toEqual(409)
  })
})

describe('test transactionPlaceOrder data validation' , () => {
  test('invoke function', async () => {
    const res = await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 5 , 'PPB#16-RET' : 5},
      itemstotal: 1000,
      vat: 0,
      shippingtotal: -50,
      grandTotal: 1 + 0 + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });

    expect([400,409].includes(res.status)).toEqual(true)
  })
})


describe('test updateOrderAsDelivered it should update order as paid and add proof of payment link' , () => {
  test('setup test', async () => {
    await cloudfirestore.deleteDocumentFromCollection('Orders','testref1234')
    const res = await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 5 , 'PPB#16-RET' : 5},
      itemstotal: 1000,
      vat: 0,
      shippingtotal: 2002,
      grandTotal: 1000 + 0 + 2002,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300)
  })
  test('invoke function', async () => {
    await firestore.updateOrderAsDelivered('testref1234','testlink3',{uid : 'driver',userRole : 'admin'})
    await delay(300)
  })
  test('check if order is updated', async () => {
    const orderData = await firestore.readSelectedDataFromCollection('Orders','testref1234')
    const ordersMessagesData = await firestore.readSelectedDataFromCollection('ordersMessages','testref1234')
    const ordersMessages = ordersMessagesData.messages
    
    let found = false
    ordersMessages.forEach((message) => {
      if (message.image === 'testlink3') {
        found = true
      }
    })
    expect(found).toEqual(true)

    expect(ordersMessagesData.delivered).toEqual(true)
    expect(orderData.delivered).toEqual(true)
    expect(orderData.proofOfDeliveryLink).toEqual(['testlink3'])
  })
  test('invoke another function', async () => {
    await firestore.updateOrderAsDelivered('testref1234','testlink4',{uid : 'driver',userRole : 'admin'})
    await delay(300)
  })
  test('check if order is updated 2', async () => {
    const orderData = await firestore.readSelectedDataFromCollection('Orders','testref1234')
    expect(orderData.delivered).toEqual(true)
    expect(orderData.proofOfDeliveryLink).toEqual(['testlink3','testlink4'])
  })
})

describe('Void payment' , () => {
  test('setup test', async () => {
    await cloudfirestore.updateDocumentFromCollection('Users',userTestId,{orders : []})
    await cloudfirestore.updateDocumentFromCollection('Users',userTestId,{payments : []})
    resetOrdersAndPayments()

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 5 , 'PPB#16-RET' : 5},
      itemstotal: 9000,
      vat: 800,
      shippingtotal: 200,
      grandTotal: 9000 + 800 + 200,
      reference: 'testref1',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 5 , 'PPB#16-RET' : 5},
      itemstotal: 9000,
      vat: 800,
      shippingtotal: 200,
      grandTotal: 9000 + 800 + 200,
      reference: 'testref12',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'PPB#16': 5 , 'PPB#16-RET' : 5},
      itemstotal: 9000,
      vat: 800,
      shippingtotal: 200,
      grandTotal: 9000 + 800 + 200,
      reference: 'testref123',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(300)
  },10000)
  test('create payment of 20000', async () => {
    
    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 20000,
      reference: 'testref12',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'www.testlink12.com',
    });
    await delay(5000);
  })
  
  test('check values', async () => {
    await delay(5000);
    const testref1data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref1')
    const testref12data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref12')
    const testref123data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref123')

    expect(testref1data.paid).toEqual(true)
    expect(testref12data.paid).toEqual(true)
    expect(testref123data.paid).toEqual(false)
  })
  test('pay overpayment 20000', async () => {


    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 20000,
      reference: 'testref123',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'www.testlink123.com',
    });
    await delay(5000);
    const testref123data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref123')

    expect(testref123data.paid).toEqual(true)
  })
  test('voidpayment', async () => {
    const userId = await cloudfirestore.readSelectedDataFromCollection('Users',userTestId)

    await cloudfirestore.voidPayment({
      orderReference: 'testref123',
      proofOfPaymentLink: 'www.testlink123.com',
      userId: userTestId,
    })
    await delay(5000);
  },100000)
  
  test('check values 2', async () => {
    // delete payments in user
    const userdata = await cloudfirestore.readSelectedDataFromCollection('Users',userTestId)
    const userPayments = userdata.payments
    const userPaymentFound = userPayments.find((payment) => payment.proofOfPaymentLink === 'www.testlink123.com')

    expect(userPaymentFound).toEqual(undefined)

    // delete proof of payment link in order
    const order = await cloudfirestore.readSelectedDataFromCollection('Orders','testref123')
    expect(order.proofOfPaymentLink).toEqual([])

    // update payment object in payment to declines
     const allPaymentData = await cloudfirestore.readAllDataFromCollection('Payments')

     let found = false
     allPaymentData.forEach(async (payment) => {
        if (payment.proofOfPaymentLink === 'www.testlink123.com') {
          found = true
          expect(payment.status).toEqual('voided')
        }
     })

     expect(found).toEqual(true)

     //update teslink123 tp unpaid
     

     const testref1data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref1')
     const testref12data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref12')
     const testref123data = await cloudfirestore.readSelectedDataFromCollection('Orders','testref123')

      expect(testref1data.paid).toEqual(true)
      expect(testref12data.paid).toEqual(true)
      expect(testref123data.paid).toEqual(false)
 

  })
},100000)


describe.only('test edit customer function' , () => {
  test('setup test', async () => {
    resetOrdersAndPayments()
    await firestore.createProduct(
      {
        itemId: 'test',
        itemName: 'testname',
        unit: 'bale',
        price: 1000,
        description: 'none',
        weight: 15,
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
        clicks: [],
        piecesPerPack: 1,
        packsPerBox: 10,
        cbm: 1,
        manufactured: true,
        machinesThatCanProduce: '',
        stocksLowestPoint: []
      },
      'test',allProducts
    );

    await firestore.createProduct(
      {
        itemId: 'test2',
        itemName: 'testname2',
        unit: 'bale',
        price: 2000,
        description: 'none',
        weight: 15,
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
        clicks: [],
        piecesPerPack: 1,
        packsPerBox: 10,
        cbm: 1,
        manufactured: true,
        machinesThatCanProduce: '',
        stocksLowestPoint: []
      },
      'test2',allProducts
    );

    await cloudfirestore.transactionPlaceOrder({
      deliveryDate: new Date(),
      testing: true,
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: { 'test': 12,'test2':5 },
      itemstotal: 22000,
      vat: 1000,
      shippingtotal: 2000,
      grandTotal: 25000,
      reference: 'testref1234',
      userphonenumber: '09178927206',
      deliveryNotes: 'Test',
      totalWeight: 122,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
      eMail: 'starpackph@gmail.com',
      sendEmail: false,
      isInvoiceNeeded: true,
      urlOfBir2303: '',
      countOfOrdersThisYear: 0,
    });
    await delay(1000)
  })
  test('create payment', async () => {
    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 25000,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink3',
    });

    await delay(5000)

    const order = await cloudfirestore.readSelectedDataFromCollection('Orders','testref1234')
    expect(order.paid).toEqual(true)
  })
  test('invoke function', async () => {
    await cloudfirestore.editCustomerOrder({
      orderReference:'testref1234',
      cart : { 'test': 24,'test2':10 },
    })
    await delay(5000)
  })
  test('check values', async () => {
    const order = await firestore.readSelectedDataFromCollection('Orders','testref1234')
    await delay(300)

    expect(order.cart).toEqual({ 'test': 24,'test2':10 })
    expect(order.itemsTotal).toEqual(44000)
    expect(order.grandTotal).toEqual(47000)
    expect(order.paid).toEqual(false)
  })
  test('create another payment', async () => {
    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 47000,
      reference: 'testref1234',
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'testlink3',
    });

    await delay(5000)
  })
  test('check values 2', async () => {
    const order =await cloudfirestore.readSelectedDataFromCollection('Orders','testref1234')
    expect(order.paid).toEqual(true)
  })
  test('clean data', async () => {
    await firestore.deleteDocumentFromCollection('Orders','testref1234')
    await firestore.deleteDocumentFromCollection('Products','test')
    await firestore.deleteDocumentFromCollection('Products','test2')
  })
},100000000)