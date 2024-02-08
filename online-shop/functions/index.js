const functions = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { setGlobalOptions } = require('firebase-functions/v2');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { logger } = require('firebase-functions');
const PromisePool = require('es6-promise-pool');
// Maximum concurrent account deletions.
const MAX_CONCURRENT = 3;
setGlobalOptions({ region: 'asia-southeast1', maxInstances: 10 });

const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors');
// Use CORS middleware to enable Cross-Origin Resource Sharing
const corsHandler = cors({
  origin: [
    'https://starpack.ph',
    'http://localhost:9099',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'https://pg.maya.ph',
    'https://payments.maya.ph',
    'https://payments.paymaya.com',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://127.0.0.1:5173',
    'https://127.0.0.1:5174',
  ],
});

const express = require('express');
const app = express();
const Joi = require('joi');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const crypto = require('crypto');
const axios = require('axios');

app.use(corsHandler);
app.use(express.json());

const validApiKey = 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg';
function handleApiKey(apiKey, res) {
  // Check for API key in the request header
  if (!apiKey || apiKey !== validApiKey) {
    return false;
  } else {
    return true;
  }
}

// Use CORS middleware to enable Cross-Origin Resource Sharing
async function sendmail(to, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: 'starpackph@gmail.com',
        pass: 'ucyiyamqzjubekif',
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send the email using the transporter object

    await transporter.sendMail({
      from: 'starpackph@gmail.com',
      to: to,
      subject: subject,
      html: htmlContent,
    });
  } catch (error) {
    logger.log(error);
  }
}

function parseData(data) {
  // Decode and parse the URL-encoded JSON string
  let parsedData;
  try {
    parsedData = JSON.parse(decodeURIComponent(data));
  } catch (e) {
    res.status(400).send('Invalid data format. Data must be a valid URL-encoded JSON string.');
    return;
  }
  return parsedData;
}

function updateAccountStatement(payments, orders) {
  let totalPayments = 0;

  payments.map((payment) => {
    logger.log(payment);
    totalPayments += parseFloat(payment.amount);
  });

  logger.log(totalPayments);

  orders.sort((a, b) => {
    const timeA = a.orderDate.seconds * 1e9 + a.orderDate.nanoseconds;
    const timeB = b.orderDate.seconds * 1e9 + b.orderDate.nanoseconds;
    return timeA - timeB;
  });

  const toUpdateOrders = [];

  orders.forEach((order) => {
    totalPayments -= order.grandTotal;
    let paid = null;
    if (totalPayments >= 0) {
      paid = true;
    }
    if (totalPayments < 0) {
      paid = false;
    }
    if (order.paid !== paid) {
      toUpdateOrders.push({ reference: order.reference, paid: paid });
    }
  });

  return toUpdateOrders;
}

function getCartCount(cart) {
  // VALIDATION
  const cartSchema = Joi.array().required();
  const { error } = cartSchema.validate(cart);
  if (error) {
    throw new Error(error.details[0].message);
  }

  // FUNCTION
  const counts = {};
  cart.forEach((str) => {
    counts[str] = counts[str] ? counts[str] + 1 : 1;
  });

  // VALIDATION
  const countsSchema = Joi.object().required();
  const { error2 } = countsSchema.validate(counts);
  if (error2) {
    throw new Error(error2.details[0].message);
  }

  return counts;
}

function getValueAddedTax(totalPrice) {
  const totalPriceSchema = Joi.number().required();
  const { error } = totalPriceSchema.validate(totalPrice);
  if (error) {
    throw new Error('Data Validation Error');
  }

  const vat = totalPrice - totalPrice / 1.12;
  const roundedVat = Math.round(vat * 100) / 100;

  const vatSchema = Joi.number().required();
  const { error2 } = vatSchema.validate(vat);
  if (error2) {
    throw new Error('Data Validation Error');
  }
  return roundedVat;
}

async function updateOrdersAsPaidOrNotPaid(userId, db) {
  const user = await db.collection('Users').doc(userId).get();
  const userData = user.data();
  const payments = userData.payments;
  let orders = userData.orders;
  // manipulate data
  // get total of payments
  let totalPayments = 0;
  payments.map((payment) => {
    totalPayments += payment.amount;
  });
  // sort orders to target the oldest order first
  // orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));

  orders.sort((a, b) => {
    const timeA = a.orderDate.seconds * 1e9 + a.orderDate.nanoseconds;
    const timeB = b.orderDate.seconds * 1e9 + b.orderDate.nanoseconds;
    return timeA - timeB;
  });

  // edit orders
  orders.forEach((order) => {
    totalPayments -= order.grandTotal;
    if (totalPayments >= 0) {
      order.paid = true;
    }
    if (totalPayments < 0) {
      order.paid = false;
    }
  });

  await db
    .collection('Users')
    .doc(userId)
    .update({ ['orders']: orders });
}

// 2nd gen

exports.postToConversionApi = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    function processIPAddress(ip) {
      if (ip.startsWith('::ffff:')) {
        const potentialIPv4 = ip.split('::ffff:')[1];

        // Simple validation to check if the extracted part is likely an IPv4
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipv4Pattern.test(potentialIPv4)) {
          return potentialIPv4; // Return the extracted IPv4 address
        }
      }
      return ip; // Return the original IP (be it IPv6 or any other format)
    }

    function getFirstAndLastName(name) {
      if (!name) {
        // This checks for undefined, null, and empty string.
        return [undefined, undefined];
      }

      let names = name.trim().split(' ');

      const firstName = names[0] || undefined;
      const lastName = names.length > 1 ? names[names.length - 1] : undefined;

      return [hashString(firstName), hashString(lastName)];
    }

    function hashString(string) {
      if (!string) {
        return undefined;
      }
      const hash = crypto.createHash('sha256').update(string).digest('hex');
      return hash;
    }

    const data = req.body;
    const apiVersion = 'v18.0';
    const nekot =
      'EAACZBZA8LIcZBkBO7nFSSJwMZBrQGMPRtADRUVaWD1sxsMYRLHssadWok8XZAAmy2ea60Re54L6I0DMF9EZAEU8OQU1v75OBVS9KZBqR6eviE0LlIWDbZCDRxMV9qCaq2tTPFsT3I6BP4f3A69Ry6eo8nMmpJErZAZBFoTStVEnJ6ZBWkCW6ZBkGwjQzrdc5qFPh2VU0WgZDZD';
    const pixelId = '699964975514234';
    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${nekot}`;

    const event_name = data.event_name;
    const event_time = Math.floor(Date.now() / 1000);
    const event_source_url = data.event_source_url;
    const custom_parameters = data.custom_parameters;
    const action_source = 'website';
    const fbc = data.fbc;
    const fbp = data.fbp;
    const email = hashString(data.email);
    const phone = data.phone ? hashString(data.phone.replace(/\D+/g, '')) : undefined;
    const name = data.name;
    const [firstName, lastName] = getFirstAndLastName(name);

    let ipAddress =
      req.headers['x-appengine-user-ip'] || req.headers['fastly-client-ip'] || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    ipAddress = processIPAddress(ipAddress);
    logger.log('_____________________________________________________________________________');
    logger.log('event_name', event_name, custom_parameters);
    logger.log(`IP Address: ${ipAddress}`);
    logger.log(`User Agent: ${userAgent}`);
    if (fbc != undefined) {
      logger.log('fbc', fbc);
    }
    if (fbp != undefined) {
      logger.log('fbp', fbp);
    }
    if (email != undefined) {
      logger.log('email', data.email, email);
    }
    if (phone != undefined) {
      logger.log('phone', data.phone, phone);
    }
    if (firstName != undefined) {
      logger.log('firstName', data.name, firstName);
    }
    if (lastName != undefined) {
      logger.log('lastName', data.lastName, lastName);
    }

    let payload = {
      data: [
        {
          event_name: event_name,
          event_time: event_time,
          action_source: action_source,
          event_source_url: event_source_url,
          user_data: {
            client_ip_address: ipAddress,
            client_user_agent: userAgent,
            fbc: fbc,
            fbp: fbp,
            country: hashString('PH'),
            fn: firstName,
            ln: lastName,
            em: email,
            ph: phone,
          },
          custom_data: {
            ...custom_parameters,
          },
        },
      ],
      //  test_event_code: "TEST79909"
    };

    payload = JSON.stringify(payload);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.events_received == 1) {
          logger.log('success');
          res.status(200).send(data);
        } else {
          logger.log('error');
          res.status(400).send(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(400).send(data);
      });
  });
});

exports.onPaymentsChange = onDocumentWritten('Payments/{paymentId}', async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();
  logger.log('beforeData', beforeData);
  logger.log('afterData', afterData);

  let created = null;
  if (beforeData == undefined) {
    created = true;
  } else {
    created = false;
  }

  if (!afterData) {
    return;
  }

  if (!('amount' in afterData)) {
    return;
  }

  if (created == false) {
    let checkPayments = false;
    if (beforeData.amount != afterData.amount) {
      checkPayments = true;
      logger.log('amount changed');
    }
    if (beforeData.status != afterData.status) {
      checkPayments = true;
      logger.log('status changed');
    }
    if (checkPayments == false) {
      logger.log('not updating account statement');
      return;
    }
  }

  const db = admin.firestore();
  const userId = afterData.userId;

  // WE DONT DO ANYTHING IF USERID IS GUEST BECAUSE
  // GUEST DOES NOT HAVE AN ACCOUNT STATEMENT
  if (userId == 'GUEST') {
    logger.log('userId is GUEST');
    return;
  }

  const paymentsSnapshot = await db
    .collection('Payments')
    .where('status', '==', 'approved')
    .where('userId', '==', userId)
    .get();
  const userPayments = paymentsSnapshot.docs.map((doc) => doc.data());
  const user = await db.collection('Users').doc(userId).get();
  const userOrders = user.data().orders;

  const orderPromises = userOrders.map((order) => {
    const ref = order.reference;
    const orderRef = db.collection('Orders').doc(ref);
    return orderRef.get();
  });

  const orderSnapshots = await Promise.all(orderPromises);

  const orders = orderSnapshots.map((orderSnapshot) => {
    return orderSnapshot.data();
  });

  const toUpdate = updateAccountStatement(userPayments, orders);
  toUpdate.forEach(async (_toUpdate) => {
    const orderRef = db.collection('Orders').doc(_toUpdate.reference);
    await orderRef.update({ paid: _toUpdate.paid });
  });
});

exports.onOrdersChange = onDocumentWritten('Orders/{orderId}', async (event) => {
  console.log('________________________');
  console.log('RUNNING ON ORDERS CHANGE');

  try {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();

    let created = null;
    if (beforeData == undefined) {
      created = true;
    } else {
      created = false;
    }

    if (afterData) {
      if (!('grandTotal' in afterData)) {
        return;
      }
    }

    if (!beforeData.grandTotal) {
      return;
    }

    try {
      if (created == false) {
        if (beforeData.grandTotal == afterData.grandTotal) {
          logger.log('grandTotal did not change so not changing paid');
          return;
        }
      }
    } catch {}

    const db = admin.firestore();
    const userId = afterData ? afterData.userId : beforeData.userId;

    if (userId == 'GUEST') {
      logger.log('userId is null');
      return;
    }

    const orderSnapshot = await db.collection('Orders').where('userId', '==', userId).get();
    const userOrders = orderSnapshot.docs.map((doc) => doc.data());
    const paymentsSnapshot = await db
      .collection('Payments')
      .where('status', '==', 'approved')
      .where('userId', '==', userId)
      .get();
    const userPayments = paymentsSnapshot.docs.map((doc) => doc.data());
    const toUpdate = updateAccountStatement(userPayments, userOrders);
    logger.log(toUpdate);
    toUpdate.forEach(async (_toUpdate) => {
      const orderRef = db.collection('Orders').doc(_toUpdate.reference);
      await orderRef.update({ paid: _toUpdate.paid });
    });
  } catch (error) {
    logger.log(error);
  }
});

exports.getIPAddress = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const clientIP =
      req.headers['x-appengine-user-ip'] || req.headers['fastly-client-ip'] || req.headers['x-forwarded-for'];
    res.send(clientIP);
    //
  });
});

exports.readUserRole = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      const userid = req.query.data;

      const db = admin.firestore();
      const user = await db.collection('Users').doc(userid).get();
      const userRole = user.data().userRole;

      res.send(userRole);
    } catch (error) {
      res.status(400).send('Error reading user role. Please try again later');
    }
  });
});

exports.readSelectedDataFromOnlineStore = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      const body = req.body;
      const productId = body.productId;
      const db = admin.firestore();
      console.log(productId);
      const selectedDataRef = db.collection('Products').doc(productId);
      const selectedData = await selectedDataRef.get();
      const data = selectedData.data();
      const productObject = {
        averageSalesPerDay: data.averageSalesPerDay,
        brand: data.brand,
        category: data.category,
        color: data.color,
        description: data.description,
        dimensions: data.dimensions,
        imageLinks: data.imageLinks,
        itemId: data.itemId,
        isCustomized: data.isCustomized,
        itemName: data.itemName,
        material: data.material,
        parentProductID: data.parentProductID,
        pieces: data.pieces,
        price: data.price,
        size: data.size,
        stocksAvailable: data.stocksAvailable,
        unit: data.unit,
        weight: data.weight,
        packsPerBox: data.packsPerBox,
        piecesPerPack: data.piecesPerPack,
        boxImage: data.boxImage,
      };

      res.send(productObject);
    } catch (error) {
      logger.log(error);
      res.status(400).send('Error reading selected data. Please try again later');
    }
  });
});

exports.readAllProductsForOnlineStore = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      // Create a query for products where forOnlineStore is true
      const category = req.query.category;
      const db = admin.firestore();
      const productsRef = db.collection('Products');
      const forOnlineStoreQuery = productsRef.where('forOnlineStore', '==', true).where('category', '==', category);

      // Fetch and process the documents
      const querySnapshot = await forOnlineStoreQuery.get();

      const products = [];
      querySnapshot.forEach((doc) => {
        // Add each product to the products array along with its document ID
        const data = doc.data();
        const productObject = {
          averageSalesPerDay: data.averageSalesPerDay,
          brand: data.brand,
          category: data.category,
          color: data.color,
          description: data.description,
          dimensions: data.dimensions,
          imageLinks: data.imageLinks,
          itemId: data.itemId,
          isCustomized: data.isCustomized,
          itemName: data.itemName,
          material: data.material,
          parentProductID: data.parentProductID,
          pieces: data.pieces,
          price: data.price,
          size: data.size,
          stocksAvailable: data.stocksAvailable,
          unit: data.unit,
          weight: data.weight,
          packsPerBox: data.packsPerBox,
          piecesPerPack: data.piecesPerPack,
          boxImage: data.boxImage,
          distributorPrice: data.distributorPrice,
        };
        products.push(productObject);
      });

      // Send the products array as a JSON response
      res.status(200).send(products);
    } catch (error) {
      logger.log(error);
      res.status(400).send('Error reading products. Please try again later');
    }
    // return res.json({status: 'ok'})
  });
});

exports.createPayment = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      const data = parseData(req.query.data);
      const db = admin.firestore();
      await createPayment(data, db);
      res.status(200).send('success');
    } catch (error) {
      logger.log(error);
      res.status(400).send('Error creating payment. Please try again later');
    }
  });
});

exports.updateOrdersAsPaidOrNotPaid = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      const db = admin.firestore();
      const userId = req.query.data;

      await updateOrdersAsPaidOrNotPaid(userId, db);

      res.status(200).send('success');
    } catch (error) {
      logger.log(error);
      res.status(400).send(error);
    }
  });
});

// ##############

exports.transactionPlaceOrder = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    console.log('API KEY', apiKey);
    if (handleApiKey(apiKey, res) == false) {
      res.status(400).send('Invalid API Key');
      return;
    }

    const data = parseData(req.query.data);
    let userid = data.userid;
    console.log('userid', userid);
    // If guest checkout
    if (userid == null) {
      userid = 'GUEST';
    }
    const username = data.username;
    const localDeliveryAddress = data.localDeliveryAddress;
    const locallatitude = data.locallatitude;
    const locallongitude = data.locallongitude;
    const localphonenumber = data.localphonenumber;
    const localname = data.localname;
    const orderDate = new Date();
    const cart = data.cart;
    const itemstotal = data.itemstotal;
    const vat = data.vat;
    const shippingtotal = data.shippingtotal;
    const grandTotal = data.grandTotal;
    const reference = data.reference;
    const userphonenumber = data.userphonenumber;
    const deliveryNotes = data.deliveryNotes;
    const totalWeight = data.totalWeight;
    const deliveryVehicle = data.deliveryVehicle;
    const needAssistance = data.needAssistance;
    const eMail = data.eMail;
    let sendMail = data.sendEmail;
    const isInvoiceNeeded = data.isInvoiceNeeded;
    const urlOfBir2303 = data.urlOfBir2303;
    const countOfOrdersThisYear = data.countOfOrdersThisYear;
    const deliveryDate = new Date(data.deliveryDate);
    const paymentMethod = data.paymentMethod;
    const userRole = data.userRole;
    const affiliateUid = data.affiliateUid;
    const kilometersFromStore = data.kilometersFromStore;
    const firstOrderDiscount = data.firstOrderDiscount;

    let cartUniqueItems = [];

    const db = admin.firestore();
    const userRef = db.collection('Users').doc(userid);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    console.log('userId', userid);
    console.log('userData', userData);

    const userPrices = userData && userData.userPrices ? userData.userPrices : {};

    let itemsTotalBackEnd = 0;
    const itemKeys = Object.keys(cart);

    const cartItemsPrice = {};
    const stocksAvailableList = [];
    const cartEmailData = [];
    for (const key of itemKeys) {
      const itemId = key;
      const itemQuantity = cart[key];
      const item = await db.collection('Products').doc(itemId).get();
      let price = null;
      if (userRole == 'distributor') {
        price = item.data().distributorPrice;
      } else {
        price = item.data().price;
      }

      if (userPrices[itemId]) {
        price = parseFloat(userPrices[itemId]);
      }

      const total = price * itemQuantity;
      const stocksAvailable = item.data().stocksAvailable;
      const itemName = item.data().itemName;
      const itemUnit = item.data().unit;
      itemsTotalBackEnd += total;
      cartUniqueItems.push(itemId);
      cartItemsPrice[itemId] = price;
      cartEmailData.push({ itemName: itemName, itemQuantity: itemQuantity, itemUnit: itemUnit });
      stocksAvailableList.push({ itemId, stocksAvailable, itemName });
    }

    if (data.testing == false) {
      const stockOuts = [];

      stocksAvailableList.forEach((item) => {
        const backEndStocksAvailable = item.stocksAvailable;
        const dataReceivedStocksAvailable = cart[item.itemId];
        const difference = backEndStocksAvailable - dataReceivedStocksAvailable;

        if (difference < 0) {
          stockOuts.push(item.itemName);
          return;
        }
      });

      if (stockOuts.length > 0) {
        res
          .status(409)
          .send(
            `The following items are out of stock: ${stockOuts.join(', ')}\nPlease refresh the website to update stocks`
          );
        return;
      }
      console.log('itemsTotalBackEnd', itemsTotalBackEnd);
      console.log('itemstotal', itemstotal);
      console.log('vat', vat);
      if (itemsTotalBackEnd != itemstotal + vat) {
        logger.log('itemsTotalBackEnd != itemstotal');
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (vat + itemstotal + shippingtotal - firstOrderDiscount != grandTotal) {
        logger.log('vat + itemstotal + shippingtotal != grandTotal');
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (shippingtotal < 0) {
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (cart.length <= 0) {
        res.status(400).send('You need to have items in your cart');
        return;
      }

      if (itemstotal <= 0) {
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (vat < 0) {
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (grandTotal < 0) {
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (totalWeight < 0) {
        res.status(400).send('Invalid data submitted. Please try again later');
        return;
      }

      if (localDeliveryAddress == '') {
        res.status(400).send('Please Enter Delivery Address');
        return;
      }

      if (localphonenumber == '') {
        res.status(400).send('Please Enter Phone Number');
        return;
      }

      if (localname == '') {
        res.status(400).send('Please Enter Contact Name');
        return;
      }
    }
    try {
      await db.runTransaction(async (transaction) => {
        try {
          // read user data

          const userRef = db.collection('Users').doc(userid);
          const user = await transaction.get(userRef);
          const userData = user.data();
          const deliveryAddress = userData.deliveryAddress ? userData.deliveryAddress : [];
          const contactPerson = userData.contactPerson ? userData.contactPerson : [];
          const ordersOnHold = {};
          const currentInventory = {};

          await Promise.all(
            cartUniqueItems.map(async (c) => {
              const productRef = db.collection('Products').doc(c);
              const productdoc = await transaction.get(productRef);
              // currentInventory.push(productdoc.data().stocksAvailable)
              ordersOnHold[c] = productdoc.data().stocksOnHold;

              currentInventory[c] = productdoc.data().stocksAvailable;
            })
          );

          // WRITE
          // WRITE TO PRODUCTS ON HOLD

          await Promise.all(
            cartUniqueItems.map(async (itemId) => {
              const prodref = db.collection('Products').doc(itemId);
              const orderQuantity = data.cart[itemId];
              const newStocksAvailable = currentInventory[itemId] - orderQuantity;
              let oldOrdersOnHold = ordersOnHold[itemId];

              oldOrdersOnHold = ordersOnHold[itemId];

              if (oldOrdersOnHold == undefined) {
                oldOrdersOnHold = [];
              }

              const newOrderOnHold = { reference: reference, quantity: orderQuantity, userId: userid };
              const oldAndNewOrdersOnHold = [...oldOrdersOnHold, newOrderOnHold];

              transaction.update(prodref, { ['stocksOnHold']: oldAndNewOrdersOnHold });
              transaction.update(prodref, { ['stocksAvailable']: newStocksAvailable });
            })
          );

          // WRITE TO DELIVER ADDRESS LIST
          let addressexists = false;
          let latitudeexists = false;
          let longitudeexists = false;
          deliveryAddress.map((d) => {
            if (d.address == localDeliveryAddress) {
              addressexists = true;
            }
            if (d.latitude == locallatitude) {
              latitudeexists = true;
            }
            if (d.longitude == locallongitude) {
              longitudeexists = true;
            }
          });
          if (addressexists == false || latitudeexists == false || longitudeexists == false) {
            if (userid != 'GUEST') {
              const newAddress = [
                {
                  latitude: locallatitude,
                  longitude: locallongitude,
                  address: localDeliveryAddress,
                },
              ];
              const updatedAddressList = [...newAddress, ...deliveryAddress];
              transaction.update(userRef, { deliveryAddress: updatedAddressList });
            }
          }

          // WRITE TO CONTACT NUMBER
          // CHECKS IF CONTACTS ALREADY EXISTS IF NOT ADDS IT TO FIRESTORE

          let phonenumberexists = false;
          let nameexists = false;
          contactPerson.map((d) => {
            if (d.phoneNumber == localphonenumber) {
              phonenumberexists = true;
            }
            if (d.name == localname) {
              nameexists = true;
            }
          });
          if (phonenumberexists == false || nameexists == false) {
            if (userid != 'GUEST') {
              const newContact = [{ name: localname, phoneNumber: localphonenumber }];
              const updatedContactList = [...newContact, ...contactPerson];
              transaction.update(userRef, { contactPerson: updatedContactList });
            }
          }

          const oldOrders = userData.orders;
          const newOrder = {
            orderDate: orderDate,
            contactName: localname,
            deliveryAddress: localDeliveryAddress,
            contactPhoneNumber: localphonenumber,
            deliveryAddressLatitude: locallatitude,
            deliveryAddressLongitude: locallongitude,
            cart: cart,
            itemsTotal: itemstotal,
            vat: vat,
            shippingTotal: shippingtotal,
            grandTotal: grandTotal,
            delivered: false,
            reference: reference,
            paid: false,
            userName: username,
            userPhoneNumber: userphonenumber,
            deliveryNotes: deliveryNotes,
            orderAcceptedByClient: false,
            userWhoAcceptedOrder: null,
            orderAcceptedByClientDate: null,
            clientIDWhoAcceptedOrder: null,
            totalWeight: totalWeight,
            deliveryVehicle: deliveryVehicle,
            needAssistance: needAssistance,
            userId: userid,
            proofOfPaymentLink: [],
            eMail: eMail,
            cartItemsPrice: cartItemsPrice,
            isInvoiceNeeded: isInvoiceNeeded,
            urlOfBir2303: urlOfBir2303,
            countOfOrdersThisYear: countOfOrdersThisYear,
            proofOfDeliveryLink: [],
            deliveryDate: deliveryDate,
            paymentMethod: paymentMethod,
            affiliateUid: affiliateUid,
            kilometersFromStore: kilometersFromStore,
            firstOrderDiscount: firstOrderDiscount,
          };

          const userOrderObject = { reference: reference, date: new Date() };
          const updatedOrders = [userOrderObject, ...oldOrders];
          transaction.update(userRef, { orders: updatedOrders });
          const orderCollectionRef = db.collection('Orders').doc(reference);

          transaction.set(orderCollectionRef, newOrder);
          // DELETE CART BY UPDATING IT TO AN EMPTY ARRAY
          transaction.update(userRef, { cart: {} });

          // CREATE ORDERMESSAGES CHAT
          const orderMessagesRef = db.collection('ordersMessages').doc(reference);
          transaction.set(orderMessagesRef, {
            messages: [],
            ownerUserId: userid,
            ownerName: username,
            referenceNumber: reference,
            isInquiry: false,
            ownerReadAll: true,
            adminReadAll: true,
            delivered: false,
          });
          orderMessagesRef.collection('messages');

          if (sendMail == true) {
            try {
              sendmail(
                newOrder.eMail,
                'Order Confirmation',
                `<p>Dear Customer,</p>
                      
                      <p>We are thrilled to confirm that your order has been successfully placed.</p>
                      
                      <p><strong>Order Reference:</strong> ${newOrder.reference}</p>
                
                      <p>Kindly note that payment must be processed within <strong>24 hours</strong> to secure your order. If you have selected Cash on Delivery (COD) as your payment method, please disregard this reminder.</p> 
  
                      <p>If you have an account with us, you can conveniently track your order by visiting the "<strong>My Orders</strong>" page on our website: <a href="https://www.starpack.ph">www.starpack.ph</a>.</p>
                
                <p>If you have any questions or need assistance, please don't hesitate to reach out to our dedicated support team.</p>
                
                <p>Thank you for choosing Star Pack!</p>
                
                <p>Best Regards,<br>
                The Star Pack Team</p>`
              );

              sendmail(
                'ladiaadrian@gmail.com',
                'Order Received',
                `<p>Order received,</p>
                
              <p><strong>Order Reference:</strong> ${newOrder.reference}</p>
              <p><strong>Customer:</strong> ${newOrder.userName}</p>
              <p><strong>Customer Phone Number:</strong> ${newOrder.userPhoneNumber}</p>
              <p><strong>Total:</strong> ${newOrder.grandTotal}</p>
              
              <p><strong>Delivery Date:</strong> ${newOrder.deliveryDate}</p>
              <p><strong>Delivery Address:</strong></p><a href='https://www.google.com/maps?q=${
                newOrder.deliveryAddressLatitude
              },${newOrder.deliveryAddressLongitude}'>${newOrder.deliveryAddress}</a> 
              <p><strong>Delivery Vehicle:</strong> ${newOrder.deliveryVehicle}</p>
              <p><strong>Delivery Notes:</strong> ${newOrder.deliveryNotes}</p>
              <p><strong>Need Assistance:</strong> ${newOrder.needAssistance}</p>
              <p><strong>Contact Name:</strong> ${newOrder.contactName}</p>
              <p><strong>Contact Phone Number:</strong> ${newOrder.contactPhoneNumber}</p>
              
              <p><strong>Items:</strong></p>
              <ul>
              ${cartEmailData
                .map((item) => {
                  return `<li>${item.itemName} - ${item.itemQuantity} ${item.itemUnit}</li>`;
                })
                .join('')}
                </ul>
                <p><strong>Items Total:</strong> ${newOrder.itemsTotal}</p>
                <p><strong>VAT:</strong> ${newOrder.vat}</p>
                <p><strong>Shipping Total:</strong> ${newOrder.shippingTotal}</p>
                <p><strong>Grand Total:</strong> ${newOrder.grandTotal}</p>
                <p><strong>Payment Method: </strong> ${newOrder.paymentMethod}</p>

              
              <br>
              <br>
              <p> <strong> Delivery Note to driver </strong></p> <br>
              <p> Pick up at Paper Boy, Red Gate, Naa sulat Pustanan Printers Cebu. Deliver to ${
                newOrder.deliveryAddress
              }, ${newOrder.contactPhoneNumber}, ${newOrder.contactName} </p>


              <p>Please check <strong>ADMIN ORDER MENU</strong> to view the order content</p>
              
              <p>Best Regards,<br>
              Star Pack Head</p>`
              );
            } catch (error) {
              logger.log(error);
              logger.log('error sending email');
            }
          }

          res.send('SUCCESS');
        } catch (e) {
          logger.log(e);
          res.status(400).send('FAILED');
        }
      });
    } catch (error) {
      logger.log(error);
      res.status(400).send('FAILED');
    }
  });
});

exports.checkIfUserIdAlreadyExist = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const userId = req.query.userId;
    const db = admin.firestore();
    const user = await db.collection('Users').doc(userId).get();
    if (user.data() == undefined) {
      res.send(false);
    } else {
      res.send(true);
    }
  });
});

exports.deleteDocumentFromCollection = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = parseData(req.query.data);
    const collectionName = data.collectionName;
    const id = data.id;
    const db = admin.firestore();

    try {
      await db.collection(collectionName).doc(id).delete();
      res.json({ result: `Document with ID: ${id} deleted.` });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).send('Error deleting document.');
    }
  });
});

exports.updateDocumentFromCollection = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;
    const collectionName = data.collectionName;
    const id = data.id;
    const firestoreData = data.firestoreData;
    const db = admin.firestore();

    function isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    }

    Object.keys(firestoreData).forEach((key) => {
      const potentialDateString = firestoreData[key];

      // Check if the string matches the ISO 8601 format
      if (
        typeof potentialDateString === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(potentialDateString)
      ) {
        const dateObject = new Date(potentialDateString);

        // Validate if it's a valid date
        if (isValidDate(dateObject)) {
          firestoreData[key] = dateObject;
        }
      }
    });

    try {
      await db.collection(collectionName).doc(id).update(firestoreData);
      res.json({ result: `Document with ID: ${id} updated.` });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).send('Error updating document.');
    }
  });
});

exports.readAllIdsFromCollection = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const collectionName = req.query.collectionName;
    const db = admin.firestore();
    const list = [];
    try {
      await db
        .collection(collectionName)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            list.push(doc.id);
          });
          res.send(list);
          // res.json({ result: `Document with ID: ${id} added.` });
        });
    } catch (error) {
      console.error('Error reading document:', error);
    }
  });
});

exports.readAllDataFromCollection = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const collectionName = req.query.collectionName;
    const db = admin.firestore();
    const list = [];
    try {
      await db
        .collection(collectionName)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            list.push(doc.data());
          });
          res.send(list);
          // res.json({ result: `Document with ID: ${id} added.` });
        });
    } catch (error) {
      console.error('Error reading document:', error);
    }
  });
});

exports.createDocument = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;
    const collection = data.collection;
    const id = data.id;
    const firestoreData = data.firestoreData;
    const db = admin.firestore();

    try {
      await db.collection(collection).doc(id).set(firestoreData);
      res.json({ result: `Document with ID: ${id} added.` });
    } catch (error) {
      console.error('Error adding document:', error);
      res.status(500).send('Error adding document.');
    }
  });
});

exports.readSelectedDataFromCollection = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    // Your function logic here
    const data = parseData(req.query.data);
    const collectionName = data.collectionName;
    const id = data.id;

    const db = admin.firestore();

    try {
      db.collection(collectionName)
        .doc(id)
        .get()
        .then((snapshot) => {
          const docData = snapshot.data();
          res.json(docData);
        });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).send('Error fetching document.');
    }
  });
});

exports.login = onRequest(async (req, res) => {
  const apiKey = req.headers['apikey'];
  if (!handleApiKey(apiKey, res)) {
    res.status(400).send('Invalid API Key');
    return;
  }
  try {
    const allUsersSnapshot = await admin.firestore().collection('Users').get();
    const usersData = [];

    allUsersSnapshot.forEach((doc) => {
      usersData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(usersData);
  } catch (error) {
    console.error('Error fetching users data: ', error);
    res.status(500).json({ error: 'An error occurred while fetching users data.' });
  }
});

exports.transactionCreatePayment = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;

    const depositAmount = parseFloat(data.amount);
    const orderReference = data.reference;
    const paymentprovider = data.paymentprovider;

    const commissionPercentage = 0.01;
    data['date'] = new Date();
    const proofOfPaymentLink = data.proofOfPaymentLink;
    logger.log('Proof of payment link', proofOfPaymentLink);
    const db = admin.firestore();
    let userId;

    let paymentNotAccepted = false;
    try {
      await db.runTransaction(async (transaction) => {
        // READ
        const orderRef = db.collection('Orders').doc(orderReference);
        const orderSnapshot = await transaction.get(orderRef);
        const orderDetail = orderSnapshot.data();
        const affiliateUid = orderDetail.affiliateUid;
        console.log('affiliateUid', affiliateUid);
        const itemsTotal = orderDetail.itemsTotal;
        const orderVat = orderDetail.vat;
        const vatPercentage = orderVat / itemsTotal;
        const shippingTotal = orderDetail.shippingTotal;
        const grandTotal = orderDetail.grandTotal;
        const cart = orderDetail.cart;
        userId = orderDetail.userId;
        const oldOrderProofOfPaymentLinks = orderDetail.proofOfPaymentLink;
        const newOrderPayments = [...oldOrderProofOfPaymentLinks, proofOfPaymentLink];
        let doNotAddProofOfPaymentLink = false;
        if (oldOrderProofOfPaymentLinks.includes(proofOfPaymentLink)) {
          doNotAddProofOfPaymentLink = true;
        }

        const lessCommissionToShipping = parseFloat((shippingTotal * (depositAmount / itemsTotal)).toFixed(2));
        const paymentsRef = db.collection('Payments');
        const paymentQuery = paymentsRef.where('proofOfPaymentLink', '==', proofOfPaymentLink);
        const paymentSnapshot = await paymentQuery.get();
        let documentID;
        let paymentsData;
        paymentSnapshot.forEach((doc) => {
          paymentsData = doc.data();

          paymentsData.status = 'approved';
          paymentsData.amount = depositAmount;
          documentID = doc.id;
        });
        // const paymentsRef = db.collection('Payments').doc();
        const userRef = db.collection('Users').doc(userId);
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();
        const affiliateIdOfCustomer = affiliateUid != null ? affiliateUid : userData.affiliate;
        console.log('affiliateIdOfCustomer', affiliateIdOfCustomer);
        let newAffiliateCommissions;
        let affiliateUserRef;
        let foundAffiliate = false;
        if (affiliateIdOfCustomer != null) {
          try {
            affiliateUserRef = db.collection('Users').doc(affiliateIdOfCustomer);
            const affiliateUserSnap = await transaction.get(affiliateUserRef);
            const affiliateUserData = affiliateUserSnap.data();
            const oldAffiliateCommissions = affiliateUserData.affiliateCommissions;

            const commission =
              ((parseFloat(depositAmount) - lessCommissionToShipping) / (1 + vatPercentage)) * commissionPercentage;
            newAffiliateCommissions = [
              ...oldAffiliateCommissions,
              {
                customer: 'test',
                dateOrdered: new Date().toDateString(),
                commission: commission.toFixed(2),
                status: 'claimable',
                claimCode: '',
                orderReference: orderReference,
              },
            ];
            foundAffiliate = true;
          } catch (error) {
            console.log('error', error);
          }
        }

        const oldPayments = userData.payments;
        const newPayments = [...oldPayments, data];

        const newStocksOnHold = {};

        await Promise.all(
          Object.keys(cart).map(async (itemId) => {
            const ref = db.collection('Products').doc(itemId);
            const doc = await transaction.get(ref);
            const productData = doc.data();
            const stocksOnHold = productData.stocksOnHold;

            stocksOnHold.forEach((stock) => {
              // Changed map to forEach
              if (stock.reference != orderReference) {
                // Initialize with empty array if not exist
                if (!newStocksOnHold[itemId]) {
                  newStocksOnHold[itemId] = [];
                }
                // Spread the existing array and add the new stock
                newStocksOnHold[itemId] = [...newStocksOnHold[itemId], stock];
              }
            });
          })
        );

        console.log('newStocksOnHold', newStocksOnHold);

        // WRITE

        if (userId == 'GUEST') {
          if (depositAmount < grandTotal) {
            logger.log('payment not accepted in transaction');
            paymentNotAccepted = true;
            return;
          } else {
            logger.log('setting order to paid : ' + orderReference);
            transaction.update(orderRef, { paid: true });
          }
        }

        if (doNotAddProofOfPaymentLink == false) {
          transaction.update(orderRef, { proofOfPaymentLink: newOrderPayments });
        }

        if (affiliateIdOfCustomer != null && foundAffiliate == true) {
          transaction.update(affiliateUserRef, { affiliateCommissions: newAffiliateCommissions });
        }

        if (paymentsData) {
          transaction.update(db.collection('Payments').doc(documentID), paymentsData);
          transaction.update(userRef, { payments: newPayments });
        } else {
          const paymentRef = db.collection('Payments').doc();

          transaction.set(paymentRef, {
            orderReference: orderReference,
            proofOfPaymentLink: proofOfPaymentLink,
            userId: userId,
            status: 'approved',
            userName: userData.name,
            paymentMethod: paymentprovider,
            paymentId: paymentRef.id,
            amount: depositAmount,
          });
        }
        transaction.update(userRef, { payments: newPayments });

        // delete ordersOnHold if paid
        Object.keys(newStocksOnHold).forEach((itemId) => {
          const newStocksOnHoldArray = newStocksOnHold[itemId];
          const ref = db.collection('Products').doc(itemId);
          transaction.update(ref, { stocksOnHold: newStocksOnHoldArray });
        });
      });

      if (paymentNotAccepted == true) {
        logger.log('payment not accepted returned');
        res.status(200).send('Error creating payment. Payment is less than total');
        return;
      }
      res.status(200).send('success');
    } catch (error) {
      logger.log(error);
      res.status(400).send('Error adding document.');
    }
  });
});

// Paymaya create checkout request
exports.payMayaCheckout = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    function convertToBase64(key) {
      return btoa(key + ':');
    }

    const data = req.body;
    const payload = data.payload;
    const isSandbox = data.isSandbox;

    let url;
    let publicKey;
    let secretKey;

    if (isSandbox) {
      url = 'https://pg-sandbox.paymaya.com/checkout/v1/checkouts';
      publicKey = 'pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah';
      secretKey = 'sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl';
    } else {
      url = 'https://pg.maya.ph/checkout/v1/checkouts';
      publicKey = 'pk-DKpOh7gQI1sjjeE4pzTenb8B2n1I3chEmu6UKlJCzYE';
      secretKey = 'sk-c6YLzDpPYtd3AQZNm4i8gcnKQV0FioKXEjyuS074gEj';
    }

    const headers = {
      Accept: 'application/json',
      Authorization: `Basic ${convertToBase64(publicKey)}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.post(url, payload, { headers });
    logger.log(response.data);
    res.send(response.data);
  });
});

exports.payMayaEndpoint = onRequest(async (req, res) => {
  if (req.method != 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  console.log('req.body', req.body);

  const data = req.body;
  const status = data.paymentStatus;
  const requestReferenceNumber = data.requestReferenceNumber;

  const db = admin.firestore();

  const amount = parseFloat(data.totalAmount.value);
  const forTesting = data.forTesting ? data.forTesting : false;
  const url = forTesting
    ? 'http://127.0.0.1:5001/online-store-paperboy/asia-southeast1/'
    : 'https://asia-southeast1-online-store-paperboy.cloudfunctions.net/';
  let response;
  if (status == 'PAYMENT_SUCCESS') {
    const orderRef = db.collection('Orders').doc(requestReferenceNumber);
    const order = await orderRef.get();
    const orderData = order.data();
    const userId = orderData.userId;
    const data = {
      userId: userId,
      amount: amount,
      reference: requestReferenceNumber,
      paymentprovider: 'Maya',
      proofOfPaymentLink: 'Maya',
    };
    const jsonData = JSON.stringify(data);
    console.log('jsonData', jsonData);
    console.log('url', url);
    response = await axios.post(`${url}transactionCreatePayment`, jsonData, {
      headers: {
        'Content-Type': 'application/json',
        apikey: 'starpackjkldrfjklhdjljkfggfjmnxmnxcbbltrpiermjrnsddqqasdfg',
      },
    });
    console.log('response', response);
  }

  if (status == 'PAYMENT_FAILED') {
    response = { status: 200 }; // temporary. Replace when logic is implemented
  }

  if (status == 'PAYMENT_EXPIRED') {
    response = { status: 200 }; // temporary. Replace when logic is implemented
  }
  console.log('response', response);
  if (response.status == 200) {
    res.status(200).send({
      webhookDataProcessed: 'success',
    });
  } else {
    res.status(500).send({
      webhookDataProcessed: 'failed',
    });
  }
});

exports.updateOrderProofOfPaymentLink = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      // Get the user document
      const data = req.body;

      const userName = data.userName;
      const paymentMethod = data.paymentMethod;
      const orderReference = data.orderReference;
      const userId = data.userId;
      const proofOfPaymentLink = data.proofOfPaymentLink;
      const amount = data.amount;
      const forTesting = data.forTesting;

      // VALIDATE DATA
      const dataSchema = Joi.object({
        orderReference: Joi.string().required(),
        userId: Joi.string().required(),
        proofOfPaymentLink: Joi.string().required(),
        paymentMethod: Joi.string().required().allow(''),
        userName: Joi.string().required(),
        amount: Joi.number().required().allow(null),
        forTesting: Joi.boolean(),
      });

      const { error } = dataSchema.validate(data);

      if (error) {
        console.error('Error validating data:', error);
        res.status(400).send('Error validating data.');
        return;
      }

      const db = admin.firestore();

      async function getOrderWithRetry(transaction, orderRef, retries, delay) {
        let orderData = null;

        for (let i = 0; i < retries; i++) {
          const ordersObject = await transaction.get(orderRef);
          orderData = ordersObject.data();
          if (orderData) {
            break;
          }

          // If orderData is null, wait for the specified delay before trying again
          await sleep(delay);
        }

        return orderData;
      }

      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }

      await db.runTransaction(async (transaction) => {
        try {
          // READ
          const orderMessagesRef = db.collection('ordersMessages').doc(orderReference);
          const userRef = db.collection('Users').doc(userId);
          const userDoc = await transaction.get(userRef);
          const userData = userDoc.data();
          const orderRef = db.collection('Orders').doc(orderReference);
          const order = await getOrderWithRetry(transaction, orderRef, 3, 500);
          // const ordersObject = await transaction.get(orderRef);
          // const order = ordersObject.data();
          let proofOfPayments = order.proofOfPaymentLink;

          const newProofOfPayment = [...proofOfPayments, proofOfPaymentLink];
          const orderMessages = await transaction.get(orderMessagesRef);
          const orderMessagesData = orderMessages.data();
          const oldMessages = orderMessagesData.messages;
          const newMessage = {
            dateTime: new Date(),
            image: proofOfPaymentLink,
            message: '',
            read: false,
            userId: userId,
            userRole: 'member',
          };
          const newMessageHistory = [...oldMessages, newMessage];

          // WRITE

          transaction.update(orderMessagesRef, { messages: newMessageHistory });

          transaction.update(orderRef, {
            proofOfPaymentLink: newProofOfPayment,
          });

          // TODO
          // ADD PAYMENT DATA TO PAYMENTS COLLECTION
          const newPaymentRef = db.collection('Payments').doc();

          transaction.set(newPaymentRef, {
            orderReference: orderReference,
            proofOfPaymentLink: proofOfPaymentLink,
            userId: userId,
            status: 'pending',
            userName: userName,
            paymentMethod: paymentMethod,
            paymentId: newPaymentRef.id,
            amount: amount,
          });

          const paymentId = newPaymentRef.id;
          // we dont run sendemail if amount is not equal to null because it means that payment is made by guest
          if (forTesting == false && amount == null) {
            sendmail(
              'ladiaadrian@gmail.com',
              'Payment Uploaded',
              `<h2>Payment Uploaded</h2>
            
            <p>Order Reference Number: <strong>${orderReference}</strong></p>
            <p>Proof of Payment: <a href=${proofOfPaymentLink}>Click here</a></p>
            <p>User Name: <strong>${userName}</strong></p>
            <p>User ID: <strong>${userId}</strong></p>
            <p>Payment Method: <strong>${paymentMethod}</strong></p>
  
            <p>You can accept or reject this payment in Admin Create Payments Menu</p>
  
            <p>Best regards,</p>
            <p>Your Company</p>`
            );
          }
          res.status(200).send(paymentId);
        } catch (error) {
          console.error('Error updating proof of payment link:', error);
          res.status(400).send('Error updating proof of payment link.');
        }
      });
    } catch (error) {
      console.error('Error updating proof of payment link:', error);
      res.status(400).send('Error updating proof of payment link.');
    }
  });
});

exports.sendEmail = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    // get the recipient email address and message content from the client-side
    const data = req.body;
    const { to, subject, text } = data;

    try {
      sendmail(to, subject, text);
      res.status(200).send('success');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(400).send('failed');
    }
  });
});

async function deleteOldOrders() {
  const db = admin.firestore();
  const expiryHours = 24;
  let currentTime = new Date();

  const usersRef = db.collection('Orders').where('paid', '==', false);
  const snapshot = await usersRef.get();
  const deletedOrders = [];
  const dataNeededToUpdateOrderValue = []; // {userId, filteredOrders}
  try {
    snapshot.forEach((orderObj) => {
      // IF THERE IS PAYMENT UNDER REVIEW DO NOT DELETE
      let paymentLinks;
      const order = orderObj.data();
      logger.log(order);
      paymentLinks = order.proofOfPaymentLink;
      if (paymentLinks == null) {
        paymentLinks = [];
      }

      if (paymentLinks.length > 0) {
        return;
      }

      // IF ORDER IS PAID. DO NOT DELETE
      const paid = order.paid;
      if (paid) {
        return;
      }

      // IF ORDER IS NOT EXPIRED DO NOT DELETE (24 hr window)
      let orderTimeStamp = order.orderDate;
      try {
        orderTimeStamp = orderTimeStamp.toDate();
      } catch {
        orderTimeStamp = new Date(orderTimeStamp);
      }

      const diffTime = Math.abs(currentTime - orderTimeStamp);
      const msInHour = 1000 * 60 * 60;
      const diffHours = Math.floor(diffTime / msInHour);
      const lessThanExpiryHours = diffHours < expiryHours;

      if (lessThanExpiryHours) {
        return;
      }

      logger.log(`order ${order.reference} is expired and will be deleted`);
      // foundExpiredOrders = true;
      // WE PASS THE ORDER TO THE ARRAY ADD THE ORDER CART BACK TO THE INVENTORY
      deletedOrders.push(order);
      dataNeededToUpdateOrderValue.push({ userId: order.userId, reference: order.reference });
    });

    const dataNeededToUpdateProductValue = []; //This is the data needed to do the writes it follows this schema
    // {reference:reference,userId:userId,quantity:null,itemId:itemId}
    const allCartItems = [];
    deletedOrders.forEach(async (order) => {
      const cart = order.cart;
      const reference = order.reference;
      const userId = order.userId;

      const cartItems = Object.keys(cart);
      cartItems.map(async (itemId) => {
        const deletedOrderData = { reference: reference, userId: userId, quantity: null, itemId: itemId }; // {itemId: quantity}
        deletedOrderData.quantity = cart[itemId];
        dataNeededToUpdateProductValue.push(deletedOrderData);
        if (!allCartItems.includes(itemId)) {
          allCartItems.push(itemId);
        }
      });
    });

    const finalDataNeededToUpdateProductValue = [];
    const stocksToAdjust = {};
    const stocksOnHoldToAdjust = {};

    await Promise.all(
      allCartItems.map(async (itemId) => {
        const productRef = db.collection('Products').doc(itemId);
        const productGet = await productRef.get();
        const prodData = productGet.data();

        const stocksAvailable = prodData.stocksAvailable;
        const stocksOnHold = prodData.stocksOnHold;
        stocksToAdjust[itemId] = stocksAvailable;
        stocksOnHoldToAdjust[itemId] = stocksOnHold;
      })
    );

    const orderUserIds = [];
    const orderReferences = [];

    dataNeededToUpdateOrderValue.map((data) => {
      const userId = data.userId;
      const reference = data.reference;
      orderReferences.push(reference);
      if (!orderUserIds.includes(userId)) {
        orderUserIds.push(userId);
      }
    });

    const filteredOrderData = [];

    await Promise.all(
      orderUserIds.map(async (userId) => {
        const userObj = await db.collection('Users').doc(userId).get();
        const userData = userObj.data();
        const orders = userData.orders;
        const filteredOrders = orders.filter((order) => {
          if (!orderReferences.includes(order.reference)) {
            return true;
          }
        });
        filteredOrderData.push({ userId: userId, filteredOrders: filteredOrders });
      })
    );

    dataNeededToUpdateProductValue.map((data) => {
      const reference = data.reference;
      const userId = data.userId;
      const quantity = data.quantity;
      const itemId = data.itemId;
      stocksToAdjust[itemId] += quantity;
      const stocksOnHold = stocksOnHoldToAdjust[itemId];

      const newStocksOnHold = stocksOnHold.filter((order) => order.reference != reference);
      stocksOnHoldToAdjust[itemId] = newStocksOnHold;
      const newData = { itemId: itemId, newStocksOnHold: newStocksOnHold };
      finalDataNeededToUpdateProductValue.push(newData);
    });

    //
    await db.runTransaction(async (transaction) => {
      filteredOrderData.forEach(async (data) => {
        const userId = data.userId;
        const userRef = db.collection('Users').doc(userId);
        transaction.update(userRef, { orders: data.filteredOrders });
      });

      const entries = Object.entries(stocksToAdjust);
      for (const [key, value] of entries) {
        const itemId = key;
        const newStocksAvailable = value;
        const productRef = db.collection('Products').doc(itemId);
        transaction.update(productRef, { stocksAvailable: newStocksAvailable });
      }

      const entries2 = Object.entries(stocksOnHoldToAdjust);

      for (const [key, value] of entries2) {
        const itemId = key;
        const newStocksOnHold = value;
        const productRef = db.collection('Products').doc(itemId);
        transaction.update(productRef, { stocksOnHold: newStocksOnHold });
      }

      deletedOrders.forEach(async (order) => {
        const orderRef = db.collection('Orders').doc(order.reference);
        const expiredOrderRef = db.collection('ExpiredOrders').doc(order.reference);
        transaction.delete(orderRef);
        transaction.create(expiredOrderRef, order);
      });
    });
  } catch (error) {
    logger.log(error);
    throw error;
  }
}

exports.deleteOldOrders = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      await deleteOldOrders();
      res.status(200).send('successfully deleted all orders');
    } catch (error) {
      logger.log(error);
      res.status(400).send('failed to delete old orders');
    }
  });
});

exports.giveAffiliateCommission = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      giveAffiliateCommission();
      res.status(200).send('successfully deleted all orders');
    } catch (error) {
      logger.log(error);
      res.status(400).send('failed to delete old orders');
    }
  });
});

// V2
// exports.deleteOldOrdersScheduled = onSchedule('every 1 hours', async (context) => {
//   // Use a pool so that we delete maximum `MAX_CONCURRENT` users in parallel.
//   const promisePool = new PromisePool(async () => await deleteOldOrders(), MAX_CONCURRENT);
//   await promisePool.start();
//   logger.log('delete old orders finished')
// });

// V1
exports.deleteOldOrdersScheduled = functions
  .region('asia-southeast1')
  .pubsub.schedule('every 1 hours')
  .onRun(async (context) => {
    deleteOldOrders();
  });

exports.transactionCancelOrder = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;
    const { userId, orderReference } = data;
    const db = admin.firestore();
    try {
      await db.runTransaction(async (transaction) => {
        try {
          // READ
          const userRef = db.collection('Users').doc(userId);
          const userDataObj = await transaction.get(userRef);
          const userData = userDataObj.data();
          let orders = userData.orders;
          console.log('orderRef', orderReference);
          const paymentsRef = db.collection('Payments').where('orderReference', '==', orderReference);
          let docRef;
          paymentsRef
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                // If documents are found
                querySnapshot.forEach((doc) => {
                  // doc is a document snapshot
                  console.log('Document found:', doc.id, doc.data());

                  // To get a document reference
                  docRef = doc.ref;

                  // Do something with the document reference
                  // ...
                });
              } else {
                // No documents found
                console.log('No matching documents.');
              }
            })
            .catch((error) => {
              console.error('Error getting documents: ', error);
            });

          const data = orders.filter((order) => order.reference != orderReference);

          const cancelledOrderRef = db.collection('Orders').doc(orderReference);
          const cancelledDataObj = await transaction.get(cancelledOrderRef);
          const cancelledData = cancelledDataObj.data();
          const cancelledDataCart = cancelledData.cart;

          orders = data;
          // READ OLD STOCKSAVAILABLE
          const oldStocksAvailable = {};
          const newStocksOnHoldData = {};

          await Promise.all(
            Object.entries(cancelledDataCart).map(async ([itemId, quantity]) => {
              const productRef = db.collection('Products').doc(itemId);
              const prodSnap = await transaction.get(productRef);
              const prodData = prodSnap.data();
              const stocksOnHold = prodData.stocksOnHold;
              const stocksAvailable = prodData.stocksAvailable;
              oldStocksAvailable[itemId] = stocksAvailable;
              const newStocksOnHold = stocksOnHold.filter((data) => {
                if (data.reference != orderReference) {
                  return true;
                }
              });
              newStocksOnHoldData[itemId] = newStocksOnHold;
            })
          );

          // WRITE
          Object.entries(cancelledDataCart).map(([itemId, quantity]) => {
            const productRef = db.collection('Products').doc(itemId);
            const newStocksAvailable = oldStocksAvailable[itemId] + quantity;
            const newStocksOnHold = newStocksOnHoldData[itemId];
            transaction.update(productRef, { stocksAvailable: newStocksAvailable });
            transaction.update(productRef, { stocksOnHold: newStocksOnHold });
          });

          transaction.update(userRef, { orders: orders });
          transaction.delete(cancelledOrderRef);
          transaction.delete(docRef);
          res.status(200).send('success');
        } catch (error) {
          logger.log(error);
          res.status(400).send('Error deleting order.');
        }
      });
    } catch (error) {
      logger.log(error);
      res.status(400).send('Error deleting order.');
    }
  });
});

exports.addDepositToAffiliate = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;
    const affiliateUserId = data.affiliateUserId;
    const depositorUserRole = data.depositorUserRole;
    const amountDeposited = data.amountDeposited;
    const claimId = data.affiliateClaimId;
    try {
      // Check if user logged in is admin or superAdmin if not res.status(401)
      if (depositorUserRole == 'admin' || depositorUserRole == 'superAdmin') {
        // Add data to affiliates account affiliateDeposits
        const db = admin.firestore();
        try {
          await db.runTransaction(async (transaction) => {
            const userRef = db.collection('Users').doc(affiliateUserId);
            const docRef = await userRef.get();
            const affiliateUserData = docRef.data();
            const oldAffiliateDeposits = affiliateUserData.affiliateDeposits;
            const oldAffiliateClaims = affiliateUserData.affiliateClaims;
            const oldAffiliateCommissions = affiliateUserData.affiliateCommissions;
            // UPDATE AFFILIATE CLAIMS
            const updatedClaimData = [];
            oldAffiliateClaims.map((claims) => {
              if (claims.affiliateClaimId == claimId) {
                claims.totalDeposited += amountDeposited;
                updatedClaimData.push(claims);
              } else {
                updatedClaimData.push(claims);
              }
            });
            // UPDATE AFFILIATE DEPOSITS
            const updatedData = [];
            oldAffiliateDeposits.map((oldDeposits) => {
              updatedData.push(oldDeposits);
            });
            updatedData.push(data);
            // UPDATE AFFILIATE COMMISSIONS
            const updatedCommissionData = [];
            const filledClaimIds = [];
            updatedClaimData.forEach((claim) => {
              if (claim.amount == claim.totalDeposited) {
                filledClaimIds.push(claim.affiliateClaimId);
                claim.isDone = true;
              }
            });

            oldAffiliateCommissions.forEach((commission) => {
              if (filledClaimIds.includes(commission.claimCode)) {
                commission.status = 'paid';
              }
              updatedCommissionData.push(commission);
            });

            transaction.update(userRef, { affiliateClaims: updatedClaimData });
            transaction.update(userRef, { affiliateDeposits: updatedData });
            transaction.update(userRef, { affiliateCommissions: updatedCommissionData });
          });
        } catch (e) {
          logger.log(e);
          res.status(400).send('Error adding deposit to affiliate.');
        }
      } else {
        res.status(401);
      }
    } catch (e) {
      logger.log(e);
    }

    res.status(200).send(data);
  });
});

exports.onAffiliateClaim = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const db = admin.firestore();
    const data = req.body;
    db.runTransaction(async (transaction) => {
      try {
        const commDate = data.date;
        const claimCode = data.affiliateClaimId;
        const affiliateUserId = data.affiliateUserId;
        const amount = data.amount;

        if (amount <= 0) {
          res.status(400).send('Cannot claim if amount is 0 or less.');
        }
        if (amount < 1000) {
          res.status(400).send('Cannot claim if amount is less than 1000.');
        }

        const affiliateRef = db.collection('Users').doc(affiliateUserId);
        const docSnap = await transaction.get(affiliateRef);
        const affiliateUserData = docSnap.data();
        console.log('commissionsData', data);
        console.log('affiliateUserData', affiliateUserData);
        const oldAffiliateClaims = affiliateUserData.affiliateClaims;
        const commissions = affiliateUserData.affiliateCommissions;

        console.log('commissions', commissions);

        const hasPending = commissions.some((commission) => commission.status === 'pending');
        if (hasPending) {
          console.log('hasPending', hasPending);
          res.status(400).send('Cannot claim if there is another pending claim.');
        }

        const updatedClaimData = [...oldAffiliateClaims, data];

        const updatedCommData = commissions.map((commission) => {
          if (
            new Date(commission.dateOrdered) <= new Date(commDate) &&
            commission.status === 'claimable' &&
            commission.claimCode === ''
          ) {
            return { ...commission, status: 'pending', claimCode: claimCode };
          }
          return commission;
        });

        transaction.update(affiliateRef, { affiliateClaims: updatedClaimData });
        transaction.update(affiliateRef, { affiliateCommissions: updatedCommData });

        res.status(200).send('Success');
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
    });
  });
});

exports.addDepositToAffiliateDeposits = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const info = req.body;
    const amountDeposited = info.amountDeposited;
    const userId = info.userId;
    const claimId = info.claimId;
    const db = admin.firestore();
    try {
      const docRef = await db.collection('Users').doc(userId).get();
      const affiliateUserData = docRef.data();
      const affiliateClaims = affiliateUserData.affiliateClaims;
      const updatedData = [];

      affiliateClaims.map((claim) => {
        if (claim.affiliateClaimId == claimId) {
          claim.totalDeposited += amountDeposited;
          updatedData.push(claim);
        } else {
          updatedData.push(claim);
        }
      });
      const userRef = db.collection('Users').doc(userId);
      await userRef.update({ affiliateClaims: updatedData });
      res.status(200).send(data);
    } catch (e) {
      logger.log(e);
      res.status(400).send('Error adding deposit to affiliate.');
    }
  });
});

exports.markAffiliateClaimDone = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;
    const claimId = data.claimId;
    const userId = data.userId;
    const date = data.date;
    const db = admin.firestore();
    try {
      const docRef = await db.collection('Users').doc(userId).get();
      const affiliateUserData = docRef.data();
      const affiliateClaims = affiliateUserData.affiliateClaims;
      const affiliateCommissions = affiliateUserData.affiliateCommissions;
      const updatedData1 = [];
      affiliateCommissions.map((commissions) => {
        if (
          new Date(commissions.dateOrdered) <= new Date(date) &&
          commissions.status == 'pending' &&
          commissions.claimCode == claimId
        ) {
          commissions.status = 'claimed';
          updatedData1.push(commissions);
        } else {
          updatedData1.push(commissions);
        }
      });
      const userRef = db.collection('Users').doc(userId);
      await userRef.update({ affiliateCommissions: updatedData1 });

      const updatedData = [];
      affiliateClaims.map((claim) => {
        if (claim.affiliateClaimId == claimId) {
          claim.isDone = true;
          updatedData.push(claim);
        } else {
          updatedData.push(claim);
        }
      });
      await userRef.update({ affiliateClaims: updatedData });
      res.status(200).send(data);
    } catch (e) {
      logger.log(e);
      res.status(400).send('Error marking affiliate claim done.');
    }
  });
});

exports.getAllAffiliateUsers = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    console.log('apiKey', apiKey);
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    try {
      const db = admin.firestore();
      const usersRef = db.collection('Users').where('userRole', '==', 'affiliate');
      const snapshot = await usersRef.get();
      const affiliateUsers = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.affiliateId != '') {
          affiliateUsers.push(data);
        }
      });
      console.log('affiliateUsers', affiliateUsers);
      res.status(200).send(affiliateUsers);
    } catch (e) {
      console.log(e);
      res.status(400).send('Error getting affiliate users.');
    }
  });
});

exports.readSelectedOrder = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const data = req.body;
    const reference = data.reference;
    const userId = data.userId;

    const db = admin.firestore();
    const orderRef = db.collection('Orders').doc(reference);
    const orderDoc = await orderRef.get();
    const orderData = orderDoc.data();

    console.log(orderData);
    const orderUserId = orderData.userId;
    const userRef = db.collection('Users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const userRole = userData.userRole;

    if (!['admin', 'superAdmin'].includes(userRole)) {
      if (orderUserId != userId) {
        res.status(401).send('Unauthorized');
        
      }
    }

    res.status(200).send(orderData);
  });
});

exports.voidPayment = functions
  .region('asia-southeast1')
  .runWith({ memory: '2GB' })
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
      const apiKey = req.headers['apikey'];
      if (!handleApiKey(apiKey, res)) {
        res.status(400).send('Invalid API Key');
        return;
      }
      const db = admin.firestore();
      const data = req.body;
      const orderReference = data.orderReference;
      const proofOfPaymentLink = data.proofOfPaymentLink;
      const userId = data.userId;
      try {
        db.runTransaction(async (transaction) => {
          const orderRef = db.collection('Orders').doc(orderReference);
          const userRef = db.collection('Users').doc(userId);

          const orderDoc = await transaction.get(orderRef);
          const orderData = orderDoc.data();
          const orderProofOfPaymentLink = orderData.proofOfPaymentLink;

          const userDoc = await transaction.get(userRef);
          const userData = userDoc.data();
          const payments = userData.payments;

          const paymentsRef = db.collection('Payments');
          const paymentQuery = paymentsRef.where('proofOfPaymentLink', '==', proofOfPaymentLink);
          const paymentSnapshot = await transaction.get(paymentQuery);

          const allUserOrdersQuery = db.collection('Orders').where('userId', '==', userId);
          const ordersObject = await transaction.get(allUserOrdersQuery);
          const orders = ordersObject.docs.map((doc) => doc.data());

          // delete payments in user
          const updatedPayments = payments.filter((payment) => {
            if (payment.proofOfPaymentLink != proofOfPaymentLink) {
              return payment;
            }
          });

          logger.log(updatedPayments);

          transaction.update(userRef, { payments: updatedPayments });

          // delete proof of payment link in order
          const updatedOrderProofOfPaymentLink = orderProofOfPaymentLink.filter((link) => {
            if (link != proofOfPaymentLink) {
              return link;
            }
          });

          logger.log(updatedOrderProofOfPaymentLink);

          transaction.update(orderRef, { proofOfPaymentLink: updatedOrderProofOfPaymentLink });

          // update payment object in payment
          paymentSnapshot.forEach((doc) => {
            const id = doc.id;
            const ref = db.collection('Payments').doc(id);
            transaction.update(ref, { status: 'voided' });
          });

          // update account statement in user
          // const toUpdateOrders = updateAccountStatement(updatedPayments,orders)

          // toUpdateOrders.forEach((order) => {
          //   const ref = db.collection('Orders').doc(order.reference);
          //   transaction.update(ref, { paid: order.paid });
          // });

          res.status(200).send('Payment voided successfully');
        });
      } catch (error) {
        logger.log(error);
        res.status(400).send('Error voiding payment');
      }
    });
  });

exports.editCustomerOrder = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const apiKey = req.headers['apikey'];
    if (!handleApiKey(apiKey, res)) {
      res.status(400).send('Invalid API Key');
      return;
    }
    const db = admin.firestore();
    const data = req.body;
    const orderReference = data.orderReference;
    const cart = data.cart;

    try {
      await db.runTransaction(async (transaction) => {
        const itemDetails = await Promise.all(
          Object.keys(cart).map(async (itemId) => {
            logger.log(itemId);
            const productRef = db.collection('Products').doc(itemId);
            const productDoc = await transaction.get(productRef);
            return productDoc.data();
          })
        );

        let newItemsTotal = 0;
        const cartItemReferences = [];

        Object.keys(cart).forEach((itemId) => {
          const itemData = itemDetails.find((item) => item.itemId == itemId);
          const quantity = cart[itemId];
          const total = itemData.price * quantity;
          newItemsTotal += total;
          const itemRef = db.collection('Products').doc(itemId);
          cartItemReferences.push(itemRef);
        });

        const orderRef = db.collection('Orders').doc(orderReference);
        const orderDoc = await transaction.get(orderRef);
        const orderData = orderDoc.data();

        logger.log('cartItemReferences', cartItemReferences);

        // await Promise.all(
        //   allCartItems.map(async (itemId) => {
        //     const productRef = db.collection('Products').doc(itemId);
        //     const productGet = await productRef.get();
        //     const prodData = productGet.data();

        //     const stocksAvailable = prodData.stocksAvailable;
        //     const stocksOnHold = prodData.stocksOnHold;
        //     stocksToAdjust[itemId] = stocksAvailable;
        //     stocksOnHoldToAdjust[itemId] = stocksOnHold;
        //   })
        // );

        const promises = cartItemReferences.map(async (itemRef) => {
          return transaction.get(itemRef);
        });

        const itemDocs = await Promise.all(promises);

        const itemData = itemDocs.map((itemDoc) => itemDoc.data());

        // reference: reference, quantity: orderQuantity, userId: userid
        const _stockOnHoldList = [];
        itemData.forEach((item) => {
          const stockOnHoldList = item.stocksOnHold;
          stockOnHoldList.forEach((stockOnHold) => {
            if (stockOnHold.reference == orderReference) {
              stockOnHold.quantity = cart[item.itemId];
            }
          });
          logger.log();
          _stockOnHoldList[item.itemId] = stockOnHoldList;
        });

        logger.log('stockOnHoldList', _stockOnHoldList);

        // WRITE
        Object.keys(_stockOnHoldList).forEach((itemId) => {
          const itemRef = db.collection('Products').doc(itemId);
          transaction.update(itemRef, { stocksOnHold: _stockOnHoldList[itemId] });
        });
        // changedStockOnHold.forEach((stockOnHold) => {
        //   const itemRef = db.collection('Products').doc(stockOnHold.itemId);
        //   transaction.update(itemRef, { stocksOnHold: stockOnHold });
        // })

        if (orderData.vat == 0) {
          const newGrandTotal = newItemsTotal + orderData.shippingTotal + orderData.vat;
          transaction.update(orderRef, { cart: cart, itemsTotal: newItemsTotal, grandTotal: newGrandTotal });
        }

        if (orderData.vat > 0) {
          const itemsTotalLessVat = newItemsTotal / 1.12;
          const vat = newItemsTotal - itemsTotalLessVat;
          const newGrandTotal = itemsTotalLessVat + orderData.shippingTotal + vat;
          logger.log('newItemsTotal', newItemsTotal);
          logger.log('itemsTotalLessVat', itemsTotalLessVat);
          logger.log('vat', vat);
          logger.log('newGrandTotal', newGrandTotal);

          transaction.update(orderRef, {
            cart: cart,
            itemsTotal: itemsTotalLessVat,
            grandTotal: newGrandTotal,
            vat: vat,
          });
        }
      });
      res.status(200).send('Order edited successfully');
    } catch (error) {
      logger.log(error);
      res.status(400).send('Error editing order');
    }
  });
});

async function internalUpdateProductSearchIndex() {
  const db = admin.firestore();
  const productsRef = db.collection('Products');
  const snapshot = await productsRef.get();
  const products = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    products.push(data);
  });
  const searchIndex = [];
  products.forEach((product) => {
    if (product.unit == 'Pack') {
      const productSearchIndex = {
        itemId: product.itemId,
        name: product.itemName,
        category: product.category,
      };

      if (product.forOnlineStore) {
        searchIndex.push(productSearchIndex);
      }
    }
  });
  const searchIndexRef = db.collection('Index').doc('ProductSearchIndex');
  await searchIndexRef.set({ search: searchIndex });
}

exports.updateProductSearchIndexScheduled = functions
  .region('asia-southeast1')
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    await internalUpdateProductSearchIndex();
  });

exports.updateProductSearchIndex = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      await internalUpdateProductSearchIndex();
      res.status(200).send('Product search index updated');
    } catch {
      res.status(400).send('Error updating product search index');
    }
  });
});

exports.facebookMessengerWebhook = onRequest(async (req, res) => {
  // Your verify token should be a secret and match the one you set in the Facebook webhook setup
  // const mode = req.query['hub.mode'];
  // const challenge = req.query['hub.challenge'];
  // const verifyToken = req.query['hub.verify_token'];

  const data = req.body;
  const entry = data.entry[0];
  const entryId = entry.id;
  const entryTime = entry.time;
  const messaging = entry.messaging;

  console.log('data', data);
  logger.log('data', data);

  console.log('entryId : ', entryId);
  console.log('entryTime : ', entryTime);
  console.log('messaging : ', messaging);

  res.status(200).send(challenge);
});

async function internalUpdateCustomerSearchIndex() {
  const db = admin.firestore();
  const usersRef = db.collection('Users');
  const snapshot = await usersRef.get();
  const users = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    users.push(data);
  });
  const searchIndex = [];
  users.forEach((user) => {
    const userSearchIndex = {
      userId: user.userId,
      name: user.name,
    };
    searchIndex.push(userSearchIndex);
  });
  const searchIndexRef = db.collection('Index').doc('CustomerSearchIndex');
  await searchIndexRef.set({ search: searchIndex });
}

exports.updateCustomerSearchIndexScheduled = functions
  .region('asia-southeast1')
  .pubsub.schedule('every 24 hours')
  .onRun(async (context) => {
    await internalUpdateCustomerSearchIndex();
  });


