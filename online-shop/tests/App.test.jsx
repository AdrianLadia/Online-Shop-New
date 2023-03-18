import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import businessCalculations from '../utils/businessCalculations';
import dataManipulation from '../utils/dataManipulation';
import firestoredb from '../src/components/firestoredb';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../src/firebase_config';
import paperBoyLocation from '../src/data/paperBoyLocation';
import serviceAreas from '../src/data/serviceAreas';
import lalamoveDeliveryVehicles from '../src/data/lalamoveDeliveryVehicles';
import dataValidation from '../utils/dataValidation';
import orderData from '../src/data/orderData';
//
const datamanipulation = new dataManipulation();
const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app, true);
const user = await firestore.readUserById('PN4JqXrjsGfTsCUEEmaR5NO6rNF3');
const businesscalculations = new businessCalculations();
const paperboylocation = new paperBoyLocation();
const serviceareas = new serviceAreas();
const lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
const datavalidation = new dataValidation();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Business Calcualtions', () => {
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
    const cart = user.cart;
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
  test('getVehicleForDelivery', () => {
    const test = [
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
      const deliveryFee = businesscalculations.getDeliveryFee(kilometers, vehicle);
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
    const expected = 12;
    const vat = businesscalculations.getValueAddedTax(subtotal);
    expect(vat).toBe(expected);
  });
  test('getGrandTotalAmount', () => {
    const subtotal = 100;
    const vat = 12;
    const deliveryfee = 10;
    const expected = 122;
    const grandtotal = businesscalculations.getGrandTotal(subtotal, vat, deliveryfee);
    expect(grandtotal).toBe(expected);
  });
  test('addToCart and removeFromCart', () => {
    const cart = user.cart;
    const newCart = businesscalculations.addToCart(cart, 'PPB#1');
    expect(newCart).toEqual([...cart, 'PPB#1']);
    const newCart2 = businesscalculations.addToCart(newCart, 'PPB#2');
    expect(newCart2).toEqual([...newCart, 'PPB#2']);
    const newCart3 = businesscalculations.removeFromCart(newCart2, 'PPB#2');
    expect(newCart3).toEqual([...newCart]);
  });
  test('addToCartWithQuantity', () => {
    const cart = user.cart;
    const newCart = businesscalculations.addToCartWithQuantity('PPB#1', 5, cart);
    expect(newCart).toEqual([...cart, 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1']);
  });
});

describe('Data Manipulation', () => {
  test('AccountStatement', () => {
    const orders = user.orders;

    const payments = user.payments;

    orders.forEach((order) => {
      const newdate = new Date(order.orderdate.seconds * 1000 + order.orderdate.nanoseconds / 1000000);
      order.orderdate = newdate;
    });

    payments.forEach((payment) => {
      payment.date = new Date(payment.date.seconds * 1000 + payment.date.nanoseconds / 1000000);
    });

    const expected = [
      [
        {
          seconds: 1678337277,
          nanoseconds: 382000000,
        },
        '1247292023-122953',
        7474,
        '',
        7474,
        'red',
      ],
      [
        {
          seconds: 1678337319,
          nanoseconds: 703000000,
        },
        '1248292023-615338',
        16714,
        '',
        24188,
        'red',
      ],
      [
        {
          seconds: 1678337359,
          nanoseconds: 684000000,
        },
        'Gcash 125235',
        '',
        50000,
        -25812,
        'green',
      ],
    ];

    expect(datamanipulation.accountStatementData(orders, payments, true)).toEqual(expected);
  });
  test('AccountStatementTable', () => {
    const tableData = [
      ['2023-03-06T07:43:27.488Z', 'Gcash 325664343', '', 32424, -32424, 'green'],
      ['2023-03-06T07:43:46.128Z', 'Maya 3256643432', '', 324253, -356677, 'green'],
      ['2023-03-06T08:24:36.330Z', '1624262023-899796', 1537.8, '', -355139.2, 'green'],
      ['2023-03-07T02:23:58.194Z', '1023272023-873718', 45976.8, '', -309162.4, 'green'],
    ];
    const expected = [
      {
        date: '3/6/2023',
        reference: 'Gcash 325664343',
        credit: '',
        debit: 32424,
        runningBalance: -32424,
        color: 'green',
      },
      {
        date: '3/6/2023',
        reference: 'Maya 3256643432',
        credit: '',
        debit: 324253,
        runningBalance: -356677,
        color: 'green',
      },
      {
        date: '3/6/2023',
        reference: '1624262023-899796',
        credit: 1537.8,
        debit: '',
        runningBalance: -355139.2,
        color: 'green',
      },
      {
        date: '3/7/2023',
        reference: '1023272023-873718',
        credit: 45976.8,
        debit: '',
        runningBalance: -309162.4,
        color: 'green',
      },
    ];
    expect(datamanipulation.accountStatementTable(tableData, true)).toEqual(expected);
    // datamanipulation.accountStatementTable(tableData)
  });
  test('getOrderFromReference', () => {
    const datamanipulation = new dataManipulation();
    const orders = user.orders;
    const reference = '1247292023-122953';
    const expected = {
      deliveryNotes: null,
      userphonenumber: '',
      paid: true,
      userid: 'PN4JqXrjsGfTsCUEEmaR5NO6rNF3',
      phonenumber: '09178927206',
      needAssistance: false,
      longitude: 123.93387574188152,
      reference: '1247292023-122953',
      orderAcceptedByClientDate: null,
      userWhoAcceptedOrder: null,
      address: 'Paper Boy',
      grandtotal: 7474,
      vat: 789,
      shippingtotal: 110,
      orderAcceptedByClient: false,
      clientIDWhoAcceptedOrder: null,
      delivered: false,
      itemstotal: 6575,
      username: 'Adrian Ladia',
      name: 'Adrian Ladia',
      orderdate: {
        seconds: 1678337277,
        nanoseconds: 382000000,
      },
      cart: ['PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1'],
      latitude: 10.360648471259719,
      totalWeight: 100,
      deliveryVehicle: 'Sedan',
    };

    expect(datamanipulation.getOrderFromReference(reference, orders, true)).toEqual(expected);
  });
  test('getAllCustomerNamesFromUsers', async () => {
    const users = await firestore.readAllUsers();
    const expected = ['Adrian Anton Ladia', 'Adrian Ladia', 'Adrian Ang'];
    const data = datamanipulation.getAllCustomerNamesFromUsers(users);
    expect(data).toEqual(expected);
  });
  test('getUserUidFromUsers', async () => {
    const users = await firestore.readAllUsers();
    const uid = datamanipulation.getUserUidFromUsers(users, 'Adrian Ladia');
    expect(uid).toEqual('PN4JqXrjsGfTsCUEEmaR5NO6rNF3');
  });
  test('filterOrders', async () => {
    const orders = await firestore.readAllOrders();
    let filtered = datamanipulation.filterOrders(orders, '', '', null, true, '');
    const expected = [
      {
        reference: '1413182023-760473',
        itemstotal: 10150,
        vat: 1218,
        name: 'Adrian Ladia',
        orderdate: {
          seconds: 1675836806,
          nanoseconds: 678000000,
        },
        longitude: 123.93403967370215,
        latitude: 10.361113842400885,
        paid: true,
        userphonenumber: '',
        grandtotal: 11433,
        phonenumber: '09178927206',
        address: 'Paper Boy',
        cart: ['ppb1-ppb', 'ppb1-ppb', 'ppb1-ppb', 'ppb1-ppb', 'ppb1-ppb'],
        username: 'Adrian Anton Ladia',
        delivered: false,
        shippingtotal: 65,
      },
      {
        userid: 'PN4JqXrjsGfTsCUEEmaR5NO6rNF3',
        name: 'Adrian Ladia',
        reference: '1247292023-122953',
        phonenumber: '09178927206',
        userphonenumber: '',
        address: 'Paper Boy',
        needAssistance: false,
        username: 'Adrian Ladia',
        deliveryVehicle: 'Sedan',
        delivered: false,
        shippingtotal: 110,
        userWhoAcceptedOrder: null,
        vat: 789,
        totalWeight: 100,
        orderAcceptedByClientDate: null,
        deliveryNotes: null,
        itemstotal: 6575,
        orderdate: {
          seconds: 1678337277,
          nanoseconds: 382000000,
        },
        latitude: 10.360648471259719,
        clientIDWhoAcceptedOrder: null,
        cart: ['PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1'],
        longitude: 123.93387574188152,
        paid: true,
        orderAcceptedByClient: false,
        grandtotal: 7474,
      },
      {
        needAssistance: false,
        orderAcceptedByClient: false,
        deliveryNotes: '1254125',
        reference: '1248292023-615338',
        userphonenumber: '',
        longitude: 123.93387574188152,
        orderdate: {
          seconds: 1678337319,
          nanoseconds: 703000000,
        },
        totalWeight: 200,
        username: 'Adrian Ladia',
        itemstotal: 14825,
        phonenumber: '09178927206',
        clientIDWhoAcceptedOrder: null,
        name: 'Adrian Ladia',
        grandtotal: 16714,
        shippingtotal: 110,
        address: 'Paper Boy',
        userWhoAcceptedOrder: null,
        latitude: 10.360648471259719,
        paid: true,
        vat: 1779,
        delivered: false,
        orderAcceptedByClientDate: null,
        userid: 'PN4JqXrjsGfTsCUEEmaR5NO6rNF3',
        deliveryVehicle: 'Sedan',
        cart: ['PPB#10', 'PPB#10', 'PPB#10', 'PPB#10', 'PPB#10', 'PPB#12', 'PPB#12', 'PPB#12', 'PPB#12', 'PPB#12'],
      },
    ];
    expect(filtered).toEqual(expected);
    filtered = datamanipulation.filterOrders(orders, '', '', null, null, 'Adrian Ladia');

    filtered.map((order) => {
      expect(order.name).toEqual('Adrian Ladia');
    });

    filtered = datamanipulation.filterOrders(orders, '', '', true, null, '');
    filtered.map((order) => {
      expect(order.delivered).toEqual(true);
    });
  });
  test('getCategoryList', async () => {
    const categories = await firestore.readAllCategories();
    const allCategories = datamanipulation.getCategoryList(categories);
    const expected = ['Favorites'];
    categories.map((category) => {
      expected.push(category.category);
    });
    expect(allCategories).toEqual(expected);
  });
  test('getCheckoutPageTableDate', async () => {
    const products = await firestore.readAllProducts();
    const cart = user.cart;
    const data = datamanipulation.getCheckoutPageTableDate(products, cart);
  });
  test('manipulateCartData', () => {
    const cart = ['PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#1', 'PPB#2', 'PPB#2'];
    const cart_data = datamanipulation.manipulateCartData(cart);
    const expected = [
      {
        itemid: 'PPB#1',
        quantity: 5,
      },
      {
        itemid: 'PPB#2',
        quantity: 2,
      },
    ];
    expect(cart_data).toEqual(expected);
  });
  test('getAllProductsInCategory', async () => {
    const products = await firestore.readAllProducts();
    const favorites = user.favoriteitems;
    const selected_products = datamanipulation.getAllProductsInCategory(products, 'Favorites', true, false, favorites);
  });
});

describe('Emulator', () => {
  test('Emulator Connected to Firestore', async () => {
    await firestore.createTestCollection();
  });

  test('read test collection', async () => {
    const data = await firestore.readTestCollection();
    expect(data).toEqual([{ name: 'test' }]);
  });

  test('delete test collection', async () => {
    await firestore.deleteTestCollection();
    const data = await firestore.readTestCollection();

    expect(data).toEqual([]);
    // tet
  });
});

describe('firestorefunctions', () => {
  test('createDocument', async () => {
    firestore.firestore.createDocument({ test: 'test' }, 'test', 'Products');
  });
  test('readAllDataFromCollection', async () => {
    const data = await firestore.firestore.readAllDataFromCollection('Products');
    expect(data).not.toBe([]);
  });
  test('readAllIdsFromCollection', async () => {
    const data = await firestore.firestore.readAllIdsFromCollection('Products');
    expect(data).not.toBe([]);
  });
  test('readSelectedDataFromCollection', async () => {
    const data = await firestore.firestore.readSelectedDataFromCollection('Products', 'test', 'test');
    expect(data).not.toBe([]);
  });
  test('updateDocumentFromCollection', async () => {
    const olddata = await firestore.firestore.readSelectedDataFromCollection('Products', 'test');
    await firestore.firestore.updateDocumentFromCollection('Products', 'test', { test: 'test2' });
    const newdata = await firestore.firestore.readSelectedDataFromCollection('Products', 'test');
    expect(newdata).not.toBe(olddata);
  });
  test('deleteDocumentFromCollection', async () => {
    const olddata = await firestore.firestore.readAllIdsFromCollection('Products');
    const newdata = firestore.firestore.deleteDocumentFromCollection('Products', 'test');
    expect(newdata).not.toBe(olddata);
  });
  test('addDocumentArrayFromCollection', async () => {
    await firestore.firestore.createDocument({ testarray: [] }, 'test', 'Products');
    await firestore.firestore.addDocumentArrayFromCollection('Products', 'test', { test: 'testarray' }, 'testarray');
    await firestore.firestore.addDocumentArrayFromCollection('Products', 'test', { test: 'testarray2' }, 'testarray');
    const selected = await firestore.firestore.readSelectedDataFromCollection('Products', 'test');
    const testfield = selected.testarray;

    expect(testfield).toEqual([{ test: 'testarray' }, { test: 'testarray2' }]);
  });
  test('deleteDocumentArrayFromCollection', async () => {
    await firestore.firestore.deleteDocumentFromCollectionArray(
      'Products',
      'test',
      { test: 'testarray2' },
      'testarray'
    );
    const selected = await firestore.firestore.readSelectedDataFromCollection('Products', 'test');
    const testfield = selected.testarray;
    expect(testfield).toEqual([{ test: 'testarray' }]);
    await firestore.firestore.deleteDocumentFromCollection('Products', 'test');
  });
});

describe('Database', () => {
  test('readAllParentProducts', async () => {
    const data = await firestore.readAllParentProducts();
    expect(data).not.toBe([]);
  });
  // a

  test('transactionCreatePayment', async () => {
    await firestore.transactionCreatePayment('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2', 1999, '124532-1235', 'GCASH');
  });
  test('updatedoc', async () => {
    await firestore.updatePhoneNumber('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2', '09178927206');
    const user = await firestore.readUserById('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2');
    const phone = user.phonenumber;
    expect(phone).toEqual('09178927206');
  });
});

describe('Data Validation', () => {
  test('isString isNumber isArray isBoolean', () => {
    const string = 'test';
    const number = 123;
    const array = [];
    const boolean = true;

    expect(datavalidation.isString(string)).toEqual(true);
    expect(datavalidation.isString(number)).toEqual(false);
    expect(datavalidation.isString(array)).toEqual(false);
    expect(datavalidation.isNumber(string)).toEqual(false);
    expect(datavalidation.isNumber(number)).toEqual(true);
    expect(datavalidation.isNumber(array)).toEqual(false);
    expect(datavalidation.isArray(string)).toEqual(false);
    expect(datavalidation.isArray(number)).toEqual(false);
    expect(datavalidation.isArray(array)).toEqual(true);
    expect(datavalidation.isBoolean(string)).toEqual(false);
    expect(datavalidation.isBoolean(number)).toEqual(false);
    expect(datavalidation.isBoolean(array)).toEqual(false);
    expect(datavalidation.isBoolean(boolean)).toEqual(true);
  });
});

describe('Transaction Place Order', async () => {
  let cartCount;
  let initialProductCount = {};
  beforeEach(async () => {
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

    await firestore.createNewUser(
      {
        uid: 'testuser',
        name: 'test',
        email: 'test@gmail.com',
        emailverfied: true,
        phonenumber: '09178927206',
        deliveryaddress: [],
        contactPerson: [],
        isanonymous: false,
        orders: [],
        cart: [],
        favoriteitems: [],
        payments: [],
      },
      'testuser'
    );
    const date = new Date();
    await delay(300);

    const orderdata = new orderData(
      'testuser',
      '',
      'Adrian Ladia',
      'Paper Boy',
      10.360648471259719,
      123.93387574188152,
      date,
      cart,
      21975,
      2637,
      230,
      24842,
      '1234567890',
      'Adrian Ladia',
      '09178927206',
      '',
      320,
      lalamovedeliveryvehicles.pickup,
      false
    );

    orderdata.transactionPlaceOrder(firestore);

    await delay(300);
  });

  afterEach(async () => {
    await delay(300);
    await firestore.deleteUserByUserId('testuser');
    await delay(300);
    Object.entries(cartCount).map(async ([itemId, count]) => {
      const stocksAvailable = await firestore.readProductStocksAvailable(itemId);
      const resetStockCount = stocksAvailable + count;
      await firestore.updateProductStocksAvailable(itemId, resetStockCount);
    });
    await delay(300);
  });

  test('readIfTransactionSuccessful', async () => {
    const user = await firestore.readUserById('testuser');
    const orders = user.orders;
    let foundorder = false;
    orders.map((order) => {
      if (order.reference === '1234567890') {
        foundorder = true;
      }
    });
    expect(foundorder).toEqual(true);
  });

  test('check if deliveryaddress added', async () => {
    const user = await firestore.readUserById('testuser');
    const deliveryaddress = user.deliveryaddress;
    const expected = [
      {
        address: 'Paper Boy',
        latitude: 10.360648471259719,
        longitude: 123.93387574188152,
      },
    ];

    expect(deliveryaddress).toEqual(expected);
  });

  test('check if cart is empty', async () => {
    const user = await firestore.readUserById('testuser');
    const cart = user.cart;
    expect(cart).toEqual([]);
  });

  test('CheckifInventoryUpdated', async () => {
    await Promise.all(
      Object.entries(cartCount).map(async ([item, count]) => {
        const product = await firestore.readSelectedProduct(item);
        const stocksAvailable = product.stocksAvailable;
        const initialCount = initialProductCount[item];
        const expected = initialCount - count;
        expect(stocksAvailable).toEqual(expected);
      })
    );
  });
});

describe('Transaction Create Payment', async () => {
  beforeEach(async () => {
    await firestore.createNewUser(
      {
        uid: 'testuser',
        name: 'test',
        email: 'test@gmail.com',
        emailverfied: true,
        phonenumber: '09178927206',
        deliveryaddress: [],
        contactPerson: [],
        isanonymous: false,
        orders: [],
        cart: [],
        favoriteitems: [],
        payments: [],
      },
      'testuser'
    );
    await delay(300);
    firestore.firestore.transactionCreatePayment('testuser', 1000, '1234567890', 'GCASH');
    await delay(300);
  });
  test('Check if payment is added to payment field', async () => {
    const user = await firestore.readUserById('testuser');
    const payments = user.payments;
    const amount = payments[0].amount;
    const reference = payments[0].reference;
    const paymentprovider = payments[0].paymentprovider;
    expect(amount).toEqual(1000);
    expect(reference).toEqual('1234567890');
    expect(paymentprovider).toEqual('GCASH');
  });

  afterEach(async () => {
    firestore.deleteUserByUserId('testuser');
  });
});

describe('firestoredb', async () => {
  beforeEach(async () => {
    await firestore.createNewUser({ test: 'test' }, 'test');
    await firestore.createNewUser(
      {
        uid: 'testuser',
        name: 'test',
        email: 'test@gmail.com',
        emailverfied: true,
        latitude: null,
        longitude: null,
        phonenumber: '09178927206',
        deliveryaddress: [{ address: 'Paper Boy', latitude: 1, longitude: 0 }],
        contactPerson: [{ name: 'testname', phonenumber: '09178927206' }],
        isanonymous: false,
        orders: [],
        cart: [],
        favoriteitems: [],
        payments: [],
      },
      'testuser'
    );
  });
  afterEach(async () => {
    await firestore.deleteUserByUserId('test');
    await firestore.deleteUserByUserId('testuser');
  });
  test('createProduct and readAll Products', async () => {
    await firestore.createProduct({ test: 'test' }, 'test');
    const products = await firestore.readAllProducts();
    console.log(products);
    console.log(products[0].test);
    let found = false;
    products.map((product) => {
      if (product.test === 'test') {
        found = true;
      }
    });
    expect(found).toEqual(true);
  });
  test('readSelectedProduct', async () => {
    const product = await firestore.readSelectedProduct('test');
    expect(product.test).toEqual('test');
  });
  test('updateProduct', async () => {
    await firestore.updateProduct('test', { test: 'test2' });
    const product = await firestore.readSelectedProduct('test');
    expect(product.test).toEqual('test2');
  });

  test('deleteProduct', async () => {
    await firestore.deleteProduct('test');
    const product = await firestore.readSelectedProduct('test');
    expect(product).toEqual(undefined);
  });

  test('createCategory amd readAllCategories', async () => {
    await firestore.createCategory('testtest');
    const categories = await firestore.readAllCategories();
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
    console.log(usersId);
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
    let found = false;
    users.map((user) => {
      if (user.test === 'test') {
        found = true;
      }
    });
    expect(found).toEqual(true);
  });

  test('readUserById', async () => {
    const user = await firestore.readUserById('test');
    expect(user.test).toEqual('test');
  });

  test('addItemToFavorites and removeItemFromFavorites', async () => {
    await firestore.addItemToFavorites('testuser', 'test');
    const user = await firestore.readUserById('testuser');
    const favorites = user.favoriteitems;
    let found = false;
    favorites.map((favorite) => {
      if (favorite === 'test') {
        found = true;
      }
    });
    expect(found).toEqual(true);

    await firestore.removeItemFromFavorites('testuser', 'test');
    const user2 = await firestore.readUserById('testuser');
    const favorites2 = user2.favoriteitems;
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
    const user = await firestore.readUserById('testuser');
    const cart = user.cart;
    expect(cart).toEqual(['testitem', 'testitem']);

    await firestore.deleteAllUserCart('testuser');
    const user2 = await firestore.readUserById('testuser');
    const cart2 = user2.cart;
    expect(cart2).toEqual([]);
  });

  test('deleteAddress', async () => {
    await firestore.deleteAddress('testuser', 1, 0, 'Paper Boy');
    const user = await firestore.readUserById('testuser');
    const address = user.deliveryaddress;
    expect(address).toEqual([]);
  });

  test('deleteUserContactPerson', async () => {
    await firestore.deleteUserContactPersons('testuser', 'testname', '09178927206');
    const user = await firestore.readUserById('testuser');
    const contactPerson = user.contactPerson;
    expect(contactPerson).toEqual([]);
  });

  test('updateLatitudeLongitude', async () => {
    await firestore.updateLatitudeLongitude('testuser', 1, 0);
    const user = await firestore.readUserById('testuser');
    const latitude = user.latitude;
    const longitude = user.longitude;
    expect(latitude).toEqual(1);
    expect(longitude).toEqual(0);
  });

  test('updatePhoneNumber', async () => {
    await firestore.updatePhoneNumber('testuser', '09178927206');
    const user = await firestore.readUserById('testuser');
    const phonenumber = user.phonenumber;
    expect(phonenumber).toEqual('09178927206');
  });
});
