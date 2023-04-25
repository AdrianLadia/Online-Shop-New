import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import businessCalculations from '../utils/businessCalculations';
import dataManipulation from '../utils/dataManipulation';
import firestoredb from '../src/firestoredb';
import { initializeApp } from 'firebase/app';
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

//
const datamanipulation = new dataManipulation();
const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app, true);
const businesscalculations = new businessCalculations();
const paperboylocation = new paperBoyLocation();
const lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
const cloudfirestorefunctions = new cloudFirestoreFunctions();
const cloudfirestore = new cloudFirestoreDb();
const userTestId = 'xB80hL1fGRGWnO1yCK7vYL2hHQCP';
const testconfig = new testConfig();
const testid = testconfig.getTestUserId();
const user = await cloudfirestorefunctions.readSelectedDataFromCollection('Users', testid);

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
    ]);
  });
  test('getValueAddedTax', () => {
    const subtotal = 100;
    const expected = 10.71;
    const vat = businesscalculations.getValueAddedTax(subtotal);
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
    let newCart = businesscalculations.addToCart(cart, 'PPB#1');
    expect(newCart).toEqual([...cart, 'PPB#1']);
    const newCart2 = businesscalculations.addToCart(newCart, 'PPB#2');
    expect(newCart2).toEqual([...newCart, 'PPB#2']);
    const newCart3 = businesscalculations.removeFromCart(newCart2, 'PPB#2');

    newCart3.map((itemInCart) => {
      newCart = newCart.filter((item) => item !== itemInCart);
    });

    expect(newCart.length).toEqual(0);
  });
  test('addToCartWithQuantity', () => {
    const cart = user.cart;
    const newCart = businesscalculations.addToCartWithQuantity('PPB#1', 5, cart);
    expect(newCart).toEqual([...cart, 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1']);
  });
  test('checkIfAreasHasLalamoveServiceArea', () => {
    const areas = ['generalSantosArea', 'lalamoveServiceArea'];
    const result = businesscalculations.checkIfAreasHasLalamoveServiceArea(areas);
    expect(result).toBe(true);
  });
});

describe('Data Manipulation', async () => {
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
    });

    await cloudfirestore.transactionCreatePayment({
      userId: userTestId,
      amount: 62002,
      reference: 'testref1234',
      paymentprovider: 'Maya',
    });

    await(delay(1000))
    
    const testuser = await firestore.readSelectedDataFromCollection('Users', userTestId);
    
    const orders = testuser.orders;
    const payments = testuser.payments;
    const tableData = datamanipulation.accountStatementData(orders,payments)
    const table = datamanipulation.accountStatementTable(tableData)
    const endingBalance = table[3].runningBalance

    expect(orders.length).toBe(2);
    expect(payments.length).toBe(2);
    expect(endingBalance).toBe(0);


    // datamanipulation.accountStatementTable(tableData)
  });
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
    const uid = datamanipulation.getUserUidFromUsers(users, 'Adrian Ladia');
    expect(uid).toEqual('PN4JqXrjsGfTsCUEEmaR5NO6rNF3');
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
  test('manipulateCartData', () => {
    const cart = ['PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#2', 'PPB#2'];
    const cart_data = datamanipulation.manipulateCartData(cart);
    const expected = [
      {
        itemId: 'PPB#1',
        quantity: 5,
      },
      {
        itemId: 'PPB#2',
        quantity: 2,
      },
    ];
    expect(cart_data).toEqual(expected);
  });
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
  test('updatedoc', async () => {
    await firestore.updatePhoneNumber('LP6ARIs14qZm4qjj1YOLCSNjxsj1', '09178927206');
    await delay(100);
    const user = await firestore.readUserById('LP6ARIs14qZm4qjj1YOLCSNjxsj1');
    await delay(100);
    const phone = user.phonenumber;
    expect(phone).toEqual('09178927206');
  });
});

describe('Transaction Place Order', async () => {
  let cartCount;
  let initialProductCount = {};

  beforeEach(async () => {
    await delay(100);
  });

  test('readIfTransactionSuccessful', async () => {
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

    const cartSetItems = Array.from(new Set(cart));
    const businesscalculations = new businessCalculations();
    cartCount = businesscalculations.getCartCount(cart);
    cartSetItems.map(async (item) => {
      const product = await firestore.readSelectedProduct(item);
      const stocksAvailable = product.stocksAvailable;
      initialProductCount[item] = stocksAvailable;
    });
    await delay(100);

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
        userRole: 'member',
      },
      'testuser'
    );
    await delay(100);
    const date = new Date();

    await firestore.transactionPlaceOrder({
      userid: 'testuser',
      username: 'Adrian Ladia',
      localDeliveryAddress: 'Paper Boy',
      locallatitude: 1.1,
      locallongitude: 14.1,
      localphonenumber: '09178238421',
      localname: 'Adrian Ladia',
      cart: cart,
      itemstotal: 20000,
      vat: 1200,
      shippingtotal: 1000,
      grandTotal: 22200,
      reference: 'testref-124124521',
      userphonenumber: '09178927206',
      deliveryNotes: 'None',
      totalWeight: 320,
      deliveryVehicle: 'Sedan',
      needAssistance: true,
    });
    await delay(100);
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const orders = user.orders;
    let foundorder = false;
    orders.map((order) => {
      if (order.reference === 'testref-124124521') {
        foundorder = true;
      }
    });
    expect(foundorder).toEqual(true);
  });

  test('check if deliveryaddress added', async () => {
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const deliveryaddress = user.deliveryAddress;
    const expected = [
      {
        address: 'Paper Boy',
        latitude: 1.1,
        longitude: 14.1,
      },
    ];

    expect(deliveryaddress).toEqual(expected);
  });

  test('check if cart is empty', async () => {
    const user = await firestore.readUserById('testuser');
    await delay(100);
    const cart = user.cart;
    expect(cart).toEqual([]);
  });

  test('CheckifInventoryUpdated', async () => {
    await Promise.all(
      Object.entries(cartCount).map(async ([item, count]) => {
        const product = await firestore.readSelectedProduct(item);
        await delay(100);
        const stocksAvailable = product.stocksAvailable;
        const initialCount = initialProductCount[item];
        const expected = initialCount - count;
        expect(stocksAvailable).toEqual(expected);
      })
    );

    await firestore.deleteUserByUserId('testuser');
    await delay(100);
    Object.entries(cartCount).map(async ([itemId, count]) => {
      const stocksAvailable = await firestore.readProductStocksAvailable(itemId);
      const resetStockCount = stocksAvailable + count;
      await firestore.updateProductStocksAvailable(itemId, resetStockCount);
    });
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
        cart: [],
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
        cart: [],
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
        cart: [],
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
    expect(vat).toEqual(107.14);
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
  });
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
        cart: [],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
        cart: [],
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
        cart: [],
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
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
    });

    await cloudfirestore.transactionPlaceOrder({
      userid: userTestId,
      username: 'Adrian',
      localDeliveryAddress: 'Test City',
      locallatitude: 1.24,
      locallongitude: 2.112,
      localphonenumber: '09178927206',
      localname: 'Adrian Ladia',
      cart: [
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
        'PPB#16',
      ],
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
    });

  });

  test ('deleteOrderFromCollectionArray', async () => {



    await firestore.deleteOrderFromCollectionArray(userTestId,'testref12345')

    const user = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders = user.orders;

    expect(orders.length).toEqual(2);

    orders.map((order) => {
      if (order.reference == 'testref12345') {
        throw new Error('Order not deleted');
      } 
    });

    await firestore.deleteOrderFromCollectionArray(userTestId,'testref1234')

    const user2 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders2 = user2.orders;

    expect(orders2.length).toEqual(1);

    await firestore.deleteOrderFromCollectionArray(userTestId,'testref123456')

    const user3 = await firestore.readSelectedDataFromCollection('Users', userTestId);
    const orders3 = user3.orders;

    expect(orders3.length).toEqual(0);

  })
});
