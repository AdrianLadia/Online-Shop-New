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

//
const datamanipulation = new dataManipulation();
const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app, true);
await firestore.createNewUser(
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
  },
  'TESTUSER'
);
const businesscalculations = new businessCalculations();
const paperboylocation = new paperBoyLocation();
const lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
const cloudfirestorefunctions = new cloudFirestoreFunctions(app, true);
const cloudfirestore = new cloudFirestoreDb(app);
const userTestId = 'TESTUSER';
const testconfig = new testConfig();
const testid = testconfig.getTestUserId();
const user = await cloudfirestorefunctions.readSelectedDataFromCollection('Users', userTestId);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Business Calcualtions', () => {
  test('readAllParentProductsFromOnlineStoreProducts', async () => {
    const products = await cloudfirestore.readAllProductsForOnlineStore();
    await delay(100);
    const parentProducts = businesscalculations.readAllParentProductsFromOnlineStoreProducts(products);
    expect(parentProducts.length).toBeGreaterThan(0);
    const promises = [];
    parentProducts.map((parentProduct) => {
      const data = firestore.readSelectedDataFromCollection('Products', parentProduct);
      promises.push(data);
    });

    const results = await Promise.all(promises);

    results.map((result) => {
      expect(result.parentProductID).toBe('');
    });
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

    const products = await firestore.readAllProducts();
    const result = await businesscalculations.checkStocksIfAvailableInFirestore(products, [
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1',
      'PPB#1-RET'
    ]);
  });
  test('getValueAddedTax', () => {

    const subtotal = 100;
    let expected 
    if (new AppConfig().getNoVat()) {
      expected = 0;
    }
    else {
      expected = 10.71;
    }
    
    const vat = businesscalculations.getValueAddedTax(subtotal);
    expect(vat).toBe(expected);
  });
  test('getValueAddedTaxNoVat', () => {
    const subtotal = 100;
    const expected = 0;
    const vat = businesscalculations.getValueAddedTax(subtotal, true);
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
    console.log(cart)
    let newCart = businesscalculations.addToCart(cart, 'PPB#1');
    expect(newCart).toEqual({'PPB#1' : 1});
    const newCart2 = businesscalculations.addToCart(newCart, 'PPB#2');
    expect(newCart2).toEqual({'PPB#1' : 1, 'PPB#2' : 1});
    const newCart3 = businesscalculations.removeFromCart(newCart2, 'PPB#2');
    expect(newCart3).toEqual({'PPB#1' : 1});
  });
  test('addToCartWithQuantity', () => {
    const cart = {}
    const newCart = businesscalculations.addToCartWithQuantity('PPB#1', 5, cart);
    expect(newCart).toEqual({'PPB#1' : 5});
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
    console.log(seconds);
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
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 62002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 62002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
    });

    await delay(1000);

    const testuser = await firestore.readSelectedDataFromCollection('Users', userTestId);

    const orders = testuser.orders;
    const payments = testuser.payments;
    const tableData = datamanipulation.accountStatementData(orders, payments);
    const table = datamanipulation.accountStatementTable(tableData);
    const endingBalance = table[3].runningBalance;

    expect(orders.length).toBe(2);
    expect(payments.length).toBe(2);
    expect(endingBalance).toBe(0);

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
    const products = await firestore.readAllProducts();
    await delay(100);

    const cart = user.cart;
    const data = datamanipulation.getCheckoutPageTableDate(products, cart);
    const rows = data[0];
  }, 10000);

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
  test('deleteDocumentFromCollection', async () => {
    const olddata = await firestore.readAllIdsFromCollection('Products');
    await delay(100);
    const newdata = firestore.deleteDocumentFromCollection('Products', 'test');
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
    await firestore.deleteDocumentFromCollection('Products', 'test');
    await delay(100);
  });
});

describe('Database', async () => {
  test('readAllParentProducts', async () => {
    const data = await firestore.readAllParentProducts();
    await delay(100);
    expect(data).not.toBe([]);
  });
  // a

  test('transactionCreatePayment', async () => {
    await firestore.transactionCreatePayment('LP6ARIs14qZm4qjj1YOLCSNjxsj1', 1999, '124532-1235', 'GCASH');
    await delay(100);
  });
  test.only('updatedoc', async () => {
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
        contactPerson: [{ name: 'testname', phonenumber: '09178927206' }],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
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
        contactPerson: [{ name: 'testname', phonenumber: '09178927206' }],
        isAnonymous: false,
        orders: [],
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
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
      },
      'test'
    );
    await delay(100);
    const products = await firestore.readAllProducts();
    await delay(100);
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
    await firestore.updatePhoneNumber('testuser', '09178927206');
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const phonenumber = user.phonenumber;
    expect(phonenumber).toEqual('09178927206');
  });
});

describe('cloudfirestorefunctions', async () => {
  test('createDocument', async () => {
    await cloudfirestorefunctions.createDocument({ test: 'test' }, 'test', 'Products');
    await delay(100);
    const data = await cloudfirestorefunctions.readSelectedDataFromCollection('Products', 'test');
    // console.log(data);
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
    console.log(data);
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
    const { getCartCount } = require('../functions/index.js');
    const getCartCountBusinessCalculations = businesscalculations.getCartCount;

    const count = getCartCountBusinessCalculations(['PPB#1']);
    const count2 = getCartCountBusinessCalculations(['PPB#1']);
    expect(count).toEqual({ 'PPB#1': 1 });
    expect(count2).toEqual(count);
  });

  test('getValueAddedTax', () => {
    const { getValueAddedTax } = require('../functions/index.js');
    const getValueAddedTaxBusinessCalculations = businesscalculations.getValueAddedTax;
    const vat = getValueAddedTaxBusinessCalculations(1000);
    const vat2 = getValueAddedTaxBusinessCalculations(1000);

    let expected1, expected2;
    if (new AppConfig().getNoVat()) {
      expected1 = 0;
      expected2 = 0;
    }
    else {
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
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });
    await delay(200);

    const data = {
      userId: userTestId,
      amount: 62002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
    };

    await cloudfirestore.transactionCreatePayment(data);

    await delay(100);

    const user = await firestore.readUserById(userTestId);
    const payments = user.payments;
    const orders = user.orders;

    let found = true;
    payments.forEach((payment) => {
      if (payment.reference === 'testref1234') {
        found = true;
      }
    });

    expect(found).toEqual(true);

    expect(orders.length > 0).toEqual(true);
    expect(payments.length > 0).toEqual(true);

    orders.map((order) => {
      if (order.reference === 'testref1234') {
        expect(order.paid).toEqual(true);
      }
    });

    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
  },100000);
  test('updateOrdersAsPaidOrNotPaid', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });
    await delay(200);

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await delay(200);

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await delay(200);

    await cloudfirestore.createPayment({
      userId: userTestId,
      amount: 150000,
      reference: 'testref1234',
      paymentprovider: 'Maya',
    });

    await delay(200);
    await cloudfirestore.updateOrdersAsPaidOrNotPaid(userTestId);
    await delay(200);
    const userData = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = userData.orders;

    orders.forEach((order) => {
      if (order.reference === 'testref1234') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference === 'testref12345') {
        expect(order.paid).toEqual(true);
      }
      if (order.reference === 'testref123456') {
        expect(order.paid).toEqual(false);
      }
    });
  }, 100000);
  test('transactionCreatePayment', async () => {
    // await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await delay(100);
    const data = {
      userId: userTestId,
      amount: 8888,
      reference: 'testref123456789',
      paymentprovider: 'Maya',
    };
    await cloudfirestore.createPayment(data);

    const user = await firestore.readUserById(userTestId);
    const payments = user.payments;

    payments.forEach((payment) => {
      if (payment.reference === 'testref123456789') {
        expect(payment.amount).toEqual(8888);
      }
    });

    // await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await delay(100);
  });
  test('testPayMayaWebHookSuccess', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    const result = await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await delay(300);

    const req = {
      totalAmount: {
        value: 62002,
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
      requestReferenceNumber: 'testref1234',
      metadata: {
        userId: userTestId,
      },
    };
    const res = await cloudfirestore.testPayMayaWebHookSuccess(req);
    await delay(300);
    const data = res.data;
    expect(data).toEqual('success');

    const user = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = user.orders;
    const payments = user.payments;

    orders.map((order) => {
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
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });
    await delay(300);

    const user2 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const user2orders = user2.orders;

    user2orders.map((order) => {
      if (order.reference == 'testref12345') {
        expect(order.paid).toEqual(false);
      }
    });

    const req2 = {
      totalAmount: {
        value: 62002,
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
    await delay(300);
    const data2 = res2.data;
    expect(data2).toEqual('success');

    const user3 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const user3orders = user3.orders;
    const user3payments = user3.payments;

    found1 = false;
    user3payments.map((payment) => {
      if (payment.reference == 'testref12345') {
        found1 = true;
      }
    });

    expect(found1).toEqual(true);

    user3orders.map((order) => {
      if (order.reference == 'testref12345') {
        expect(order.paid).toEqual(true);
      }
    });

    expect(user3orders.length).toEqual(2);

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    const req3 = {
      totalAmount: {
        value: 62002,
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

    user4orders.map((order) => {
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
    const products = await cloudfirestore.readAllProductsForOnlineStore();
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
        cart: {},
        favoriteItems: [],
        payments: [],
        userRole: 'member',
      },
      'testuser'
    );

    await delay(500);

    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });
    await delay(500);

    const testUser = await firestore.readSelectedDataFromCollection('Users', 'testuser');
    const deliveryAddress = testUser.deliveryAddress;
    const contactPerson = testUser.contactPerson;
    const orders = testUser.orders;

    expect(deliveryAddress).length(1);
    expect(contactPerson).length(1);
    expect(orders).length(1);

    await cloudfirestore.transactionPlaceOrder({
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927205',
      localname: 'Andrei Ladia',
      cart: {'PPB#16' : 12},
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
      userid: 'testuser',
      username: 'testname',
      localDeliveryAddress: 'Test City 2',
      locallatitude: 1.242,
      locallongitude: 2.1122,
      localphonenumber: '09178927205',
      localname: 'Andrei Ladia',
      cart: {'PPB#16' : 12},
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
    const roles = ['member', 'admin', 'superAdmin'];
    userRoles.map((userRole) => {
      console.log(userRole);
      expect(roles.includes(userRole)).toEqual(true);
    });
  });

  test('deleteProduct', async () => {
    await firestore.deleteProduct('test')
    await firestore.deleteProduct('test2')
  })
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
    await firestore.updateDocumentFromCollection('Users', 'testuser', { orders: [] });
  });

  test('creating three orders from testUser', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { payments: [] });
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });
  },100000);

  test('updateOrderProofOfPaymentLink', async () => {
    id1 = await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink.com',
      'TEST USER',
      'BDO'
    );
    const userData = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = userData.orders;
    let orderFound = false;
    orders.map((order) => {
      if (order.reference == 'testref1234') {
        orderFound = true;
        expect(order.proofOfPaymentLink).toEqual(['https://testlink.com']);
      }
    });
    expect(orderFound).toEqual(true);
  });

  test('Check if proof of payment is added to payments', async () => {
    const data = await firestore.readSelectedDataFromCollection('Payments', id1);
    await delay(300);
    expect(data.proofOfPaymentLink).toEqual('https://testlink.com');
    expect(data.status).toEqual('pending');
  });

  test('add another proofOfPaymentLink', async () => {
    id2 = await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink2.com',
      'TEST USER',
      'BDO'
    );
    const userData = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = userData.orders;
    let orderFound = false;
    orders.map((order) => {
      if (order.reference == 'testref1234') {
        orderFound = true;
        expect(order.proofOfPaymentLink).toEqual(['https://testlink.com', 'https://testlink2.com']);
      }
    });
    expect(orderFound).toEqual(true);
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
      this.bdoselected = false;
      this.mayaselected = false;
      this.unionbankselected = false;
      this.gcashselected = false;
      this.visaselected = false;
      this.mastercardselected = false;
      this.bitcoinselected = false;
      this.ethereumselected = false;
      this.solanaselected = false;
    }

    mockFunction() {
      console.log('mockFunction');
    }

    runFunction() {
      const res = businesscalculations.afterCheckoutRedirectLogic(
        {
          bdoselected: this.bdoselected,
          unionbankselected: this.unionbankselected,
          gcashselected: this.gcashselected,
          mayaselected: this.mayaselected,
          visaselected: this.visaselected,
          mastercardselected: this.mastercardselected,
          bitcoinselected: this.bitcoinselected,
          ethereumselected: this.ethereumselected,
          solanaselected: this.solanaselected,
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
        },
        true
      );
      return res;
    }
  }

  const testRedirect = new testCheckout();

  test('Test BDO', async () => {
    let res;
    testRedirect.bdoselected = true;
    res = testRedirect.runFunction();
    expect(res).toEqual('bankDeposit');
    testRedirect.bdoselected = false;
  });

  test('Test Unionbank', async () => {
    let res;
    testRedirect.unionbankselected = true;
    res = testRedirect.runFunction();
    expect(res).toEqual('bankDeposit');
    testRedirect.unionbankselected = false;
  });

  test('Test Maya', async () => {
    let res;
    testRedirect.mayaselected = true;
    res = testRedirect.runFunction();
    expect(res).toEqual('maya');
    testRedirect.mayaselected = false;
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
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    });
  });
  test('create Test Payment Proof Upload', async () => {
    id1 = await cloudfirestore.updateOrderProofOfPaymentLink(
      'testref1234',
      userTestId,
      'https://testlink.com',
      'TEST USER',
      'BDO'
    );
    await delay(300);
  });
  test('update status to success', async () => {
    await firestore.updatePaymentStatus('testref1234', 'approved');
    await delay(200);
    const data = await firestore.readSelectedDataFromCollection('Payments', id1);
    expect(data.status).toEqual('approved');
  });
  test('update status to failed', async () => {
    await firestore.updatePaymentStatus('testref1234', 'declined');
    await delay(200);
    const data = await firestore.readSelectedDataFromCollection('Payments', id1);
    expect(data.status).toEqual('declined');
  });
  test('update status to pending', async () => {
    await firestore.updatePaymentStatus('testref1234', 'pending');
    await delay(200);
    const data = await firestore.readSelectedDataFromCollection('Payments', id1);
    expect(data.status).toEqual('pending');
  });
  test('delete payment', async () => {
    await firestore.deleteDocumentFromCollection('Payments', id1);
  });
},100000);

describe('deleteOldOrders', () => {
  test('create PAID 2 day ago order for testing', async () => {
    const currentDate = new Date(); // Get the current date
    const msInADay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const twoDaysAgo = new Date(currentDate.getTime() - 2 * msInADay); // Subtract 2 days from the current date
    await firestore.updateDocumentFromCollection('Users', userTestId, {
      orders: [
        { paid: true, orderDate: twoDaysAgo, reference: 'testref1234', proofOfPaymentLink: [],cart :{} },
        { paid: false, orderDate: twoDaysAgo, reference: 'testref12345', proofOfPaymentLink: [],cart :{} },
        { paid: false, orderDate: currentDate, reference: 'testref123456', proofOfPaymentLink: [],cart :{} },
        { paid: true, orderDate: currentDate, reference: 'testref1234567', proofOfPaymentLink: [],cart :{} },
        { paid: false, orderDate: currentDate, reference: 'testref12345678', proofOfPaymentLink: ['a'],cart :{} },
      ],
    });
    await delay(200);
  });

  test('check if order deleted', async () => {
    const res = await cloudfirestore.deleteOldOrders();
    await delay(3000);
    const testUserData = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = testUserData.orders;
    let found1 = false;
    let found2 = false;
    let found3 = false;
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
        found3 = true;
      }
      if (order.reference == 'testref12345678') {
        found4 = true
      }
    });

    expect(found1).toEqual(true);
    expect(found2).toEqual(true);
    expect(found3).toEqual(true);
    expect(found4).toEqual(true);
  }, 100000);

  test('delete all orders', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, {
      orders: [],
    });
  });

  test('Create an order with items to test if items are added back to stocksAvailable', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const ppb12 = await firestore.readSelectedDataFromCollection('Products', 'PPB#12');
    const ppb12Price = ppb12.price;
    const itemsTotal = ((ppb12Price * 12) + (ppb16Price * 12)) / 1.12;
    const vat = ((ppb12Price * 12) + (ppb16Price * 12)) - itemsTotal;
    
    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12, 'PPB#12' : 12},
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
    });

    await delay(300);

    const currentDate = new Date(); // Get the current date
    const msInADay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    const twoDaysAgo = new Date(currentDate.getTime() - 2 * msInADay); // Subtract 2 days from the current date
    const userdata = await firestore.readUserById(userTestId)
    const orders = userdata.orders
    
    orders.map((order) => {
      if (order.reference == 'testref1234') {
        order.orderDate = twoDaysAgo
      }
    })
    
    console.log(orders)

    await firestore.updateDocumentFromCollection('Users',userTestId,{orders: orders})
    await delay(300);

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16': 12, 'PPB#12': 12},
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
    });
    await delay(2000)


  },100000)
  test('invoke function', async () => {
    
    const oldPPB16 = await firestore.readSelectedProduct('PPB#16');
    const oldPPB12 = await firestore.readSelectedProduct('PPB#12');
    const oldPPB16Stocks = oldPPB16.stocksAvailable
    const oldPPB12Stocks = oldPPB12.stocksAvailable
    await cloudfirestore.deleteOldOrders();
    await delay(2000)
    const newPPB16 = await firestore.readSelectedProduct('PPB#16');
    const newPPB12 = await firestore.readSelectedProduct('PPB#12');
    const newPPB16Stocks = newPPB16.stocksAvailable
    const newPPB12Stocks = newPPB12.stocksAvailable

    expect(newPPB16Stocks - oldPPB16Stocks).toEqual(12);
    expect(newPPB12Stocks - oldPPB12Stocks).toEqual(12);

    const userData = await firestore.readUserById(userTestId)
    const orders = userData.orders

    let found = false
    orders.map((order) => {
      if (order.reference == 'testref1234') {
        throw new Error('Order not deleted');
      }
      if (order.reference == 'testref12345') {
        found = true
      }
    })

    expect(found).toEqual(true)

  },100000);  
});

describe('transactionPlaceOrder test retail', async () => {
  test('retail items', async () => {
    await firestore.updateDocumentFromCollection('Products', 'PPB#16', { stocksOnHold: [] });
    await delay(300)
    const ppb1RET = await firestore.readSelectedDataFromCollection('Products', 'PPB#1-RET');
    const ppb1RETPrice = ppb1RET.price;
    const itemsTotal = (ppb1RETPrice * 11 + 5000) / 1.12;
    const vat = ppb1RETPrice * 11 + 5000 - itemsTotal;

    const data = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const stocksAvailable = data.stocksAvailable;
    
    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#1-RET' : 11, 'PPB#16': 1},
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
    })
    await delay(300)
    const data2 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const stocksOnHold2 = data2.stocksOnHold;
    const stocksAvailable2 = data2.stocksAvailable;

    expect(stocksOnHold2.length).toEqual(1);
    expect(stocksAvailable - stocksAvailable2).toEqual(1);
  },50000);
});

describe('deleteDeclinedPayments', () => {
  test('Setup test', async () => {
    await firestore.updateDocumentFromCollection('Users', userTestId, { orders: [] });
    const ppb16 = await firestore.readSelectedDataFromCollection('Products', 'PPB#16');
    const ppb16Price = ppb16.price;
    const itemsTotal = (ppb16Price * 12) / 1.12;
    const vat = ppb16Price * 12 - itemsTotal;

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: {'PPB#16' : 12},
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
    })

    await cloudfirestore.updateOrderProofOfPaymentLink('testref1234', userTestId, 'https://testlink.com','TEST USER' ,'BDO')
    await cloudfirestore.updateOrderProofOfPaymentLink('testref1234', userTestId, 'https://testlink2.com','TEST USER' ,'BDO')
    await cloudfirestore.updateOrderProofOfPaymentLink('testref1234', userTestId, 'https://testlink3.com','TEST USER' ,'BDO')
  });

  test('invoking function', async () => {
    await firestore.deleteDeclinedPayment('testref1234', userTestId,'https://testlink.com');
  });
  test('checking values', async () => {
    const user = await firestore.readUserById(userTestId);
    const orders = user.orders;
    const payments = await firestore.readAllDataFromCollection('Payments');


    let found = false
    orders.map((order) => {
      if (order.reference == 'testref1234') {
        found = true
        expect(order.proofOfPaymentLink).toEqual(['https://testlink2.com','https://testlink3.com']);
      }
      
    });

    expect(found).toEqual(true)

    let found2 = false
    payments.map((payment) => {
      if (payment.orderReference == 'testref1234') {
        found2 = true
        expect(payment.status).toEqual('declined');
      }
    })

    expect(found2).toEqual(true)


  });
},100000);