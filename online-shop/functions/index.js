const functions = require('firebase-functions');
const admin = require('firebase-admin');
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
  // origin: true
  // origin: ['http://localhost:9099']
});

const express = require('express');
const app = express();
const Joi = require('joi');
const nodemailer = require('nodemailer');

admin.initializeApp();

app.use(corsHandler);
app.use(express.json());

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
    console.log(error);
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
    console.log(payment);
    totalPayments += parseFloat(payment.amount);
  });

  console.log(totalPayments);

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

exports.onPaymentsChange = functions
  .region('asia-southeast1')
  .firestore.document('Payments/{paymentId}')
  .onWrite(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    let created = null;
    if (beforeData == undefined) {
      created = true;
    } else {
      created = false;
    }

    if (!('amount' in afterData)) {
      return;
    }

    if (created == false) {
      let checkPayments = false;
      if (beforeData.amount != afterData.amount) {
        checkPayments = true;
        console.log('amount changed');
      }
      if (beforeData.status != afterData.status) {
        checkPayments = true;
        console.log('status changed');
      }
      if (checkPayments == false) {
        console.log('not updating account statement');
        return;
      }
    }

    const db = admin.firestore();
    const userId = afterData.userId;
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
    console.log(toUpdate);
    toUpdate.forEach(async (_toUpdate) => {
      const orderRef = db.collection('Orders').doc(_toUpdate.reference);
      await orderRef.update({ paid: _toUpdate.paid });
    });
  });

exports.onOrdersChange = functions
  .region('asia-southeast1')
  .firestore.document('Orders/{orderId}')
  .onWrite(async (change, context) => {
    try {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      let created = null;
      if (beforeData == undefined) {
        created = true;
      } else {
        created = false;
      }

      if (!('grandTotal' in afterData)) {
        return;
      }

      if (created == false) {
        if (beforeData.grandTotal == afterData.grandTotal) {
          console.log('grandTotal did not change so not changing paid');
          return;
        }
      }

      const db = admin.firestore();
      const userId = afterData.userId;
      const orderSnapshot = await db.collection('Orders').where('userId', '==', userId).get();
      const userOrders = orderSnapshot.docs.map((doc) => doc.data());
      const paymentsSnapshot = await db
        .collection('Payments')
        .where('status', '==', 'approved')
        .where('userId', '==', userId)
        .get();
      const userPayments = paymentsSnapshot.docs.map((doc) => doc.data());

      // console.log('userOrders',userOrders)
      // console.log('userPayments' ,userPayments)

      const toUpdate = updateAccountStatement(userPayments, userOrders);
      console.log(toUpdate);
      toUpdate.forEach(async (_toUpdate) => {
        const orderRef = db.collection('Orders').doc(_toUpdate.reference);
        await orderRef.update({ paid: _toUpdate.paid });
      });
    } catch (error) {
      console.log(error);
    }
  });

exports.getIPAddress = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const clientIP =
      req.headers['x-appengine-user-ip'] || req.headers['fastly-client-ip'] || req.headers['x-forwarded-for'];
    res.send(clientIP);
    //
  });
});

exports.readUserRole = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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

exports.readSelectedDataFromOnlineStore = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const body = req.body;
      const productId = body.productId;
      const db = admin.firestore();
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
      console.log(error);
      res.status(400).send('Error reading selected data. Please try again later');
    }
  });
});

exports.readAllProductsForOnlineStore = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
        };
        products.push(productObject);
      });

      // Send the products array as a JSON response
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
      res.status(400).send('Error reading products. Please try again later');
    }
    // return res.json({status: 'ok'})
  });
});

exports.createPayment = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const data = parseData(req.query.data);
      const db = admin.firestore();
      await createPayment(data, db);
      res.status(200).send('success');
    } catch (error) {
      console.log(error);
      res.status(400).send('Error creating payment. Please try again later');
    }
  });
});

exports.updateOrdersAsPaidOrNotPaid = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const db = admin.firestore();
      const userId = req.query.data;

      await updateOrdersAsPaidOrNotPaid(userId, db);

      res.status(200).send('success');
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  });
});

// ##############

exports.transactionPlaceOrder = functions
  .region('asia-southeast1')
  .runWith({ memory: '2GB' })
  .https.onRequest(async (req, res) => {
    corsHandler(req, res, async () => {
      const data = parseData(req.query.data);
      const userid = data.userid;
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
      const sendMail = data.sendEmail;
      const isInvoiceNeeded = data.isInvoiceNeeded;
      const urlOfBir2303 = data.urlOfBir2303;
      const countOfOrdersThisYear = data.countOfOrdersThisYear;
      const deliveryDate = new Date(data.deliveryDate);

      let cartUniqueItems = [];

      const db = admin.firestore();

      let itemsTotalBackEnd = 0;
      const itemKeys = Object.keys(cart);

      const cartItemsPrice = {};
      const stocksAvailableList = [];

      for (const key of itemKeys) {
        const itemId = key;
        const itemQuantity = cart[key];
        const item = await db.collection('Products').doc(itemId).get();
        const price = item.data().price;
        const total = price * itemQuantity;
        const stocksAvailable = item.data().stocksAvailable;
        const itemName = item.data().itemName;
        itemsTotalBackEnd += total;
        cartUniqueItems.push(itemId);
        cartItemsPrice[itemId] = price;
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
              `The following items are out of stock: ${stockOuts.join(
                ', '
              )}\nPlease refresh the website to update stocks`
            );
          return;
        }

        if (itemsTotalBackEnd != itemstotal + vat) {
          console.log('itemsTotalBackEnd != itemstotal');
          res.status(400).send('Invalid data submitted. Please try again later');
          return;
        }

        if (vat + itemstotal + shippingtotal != grandTotal) {
          console.log('vat + itemstotal + shippingtotal != grandTotal');
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
            const deliveryAddress = userData.deliveryAddress;
            const contactPerson = userData.contactPerson;
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
              const newContact = [{ name: localname, phoneNumber: localphonenumber }];
              const updatedContactList = [...newContact, ...contactPerson];

              transaction.update(userRef, { contactPerson: updatedContactList });
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
              
              <p>We are pleased to inform you that your order has been confirmed.</p>
              
              <p><strong>Order Reference:</strong> ${newOrder.reference}</p>
              
              <p>Please note that payment should be made within <strong>24 hours</strong> to secure your order. You can view and complete payment for your order by visiting the "<strong>My Orders</strong>" page on our website: <a href="https://www.starpack.ph">www.starpack.ph</a>.</p>
              
              <p>If you have any questions or concerns, feel free to reach out to our support team.</p>
              
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
              <p><strong>Total:</strong> ${newOrder.grandTotal}</p>
      
              <p>Please check <strong>ADMIN ORDER MENU</strong> to view the order content</p>
              
              <p>Best Regards,<br>
              Star Pack Head</p>`
                );
              } catch {}
            }

            res.send('SUCCESS');
          } catch (e) {
            console.log(error);
            res.status(400).send('FAILED');
          }
        });
      } catch (error) {
        console.log(error);
        res.status(400).send('FAILED');
      }
    });
  });

exports.checkIfUserIdAlreadyExist = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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

exports.deleteDocumentFromCollection = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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

exports.updateDocumentFromCollection = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const data = parseData(req.query.data);
    const collectionName = data.collectionName;
    const id = data.id;
    const firestoreData = data.firestoreData;
    const db = admin.firestore();

    try {
      await db.collection(collectionName).doc(id).update(firestoreData);
      res.json({ result: `Document with ID: ${id} updated.` });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).send('Error updating document.');
    }
  });
});

exports.readAllIdsFromCollection = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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

exports.readAllDataFromCollection = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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

exports.createDocument = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const data = parseData(req.query.data);
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

exports.readSelectedDataFromCollection = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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

exports.login = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
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

exports.transactionCreatePayment = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const data = req.body;

    const depositAmount = data.amount;
    const orderReference = data.reference;
    const paymentprovider = data.paymentprovider;

    const commissionPercentage = 0.03;
    data['date'] = new Date();
    const proofOfPaymentLink = data.proofOfPaymentLink;
    console.log('Proof of payment link', proofOfPaymentLink);
    const db = admin.firestore();
    const userId = data.userId;

    try {
      await db.runTransaction(async (transaction) => {
        // READ
        const orderRef = db.collection('Orders').doc(orderReference);
        const orderSnapshot = await transaction.get(orderRef);
        const orderDetail = orderSnapshot.data();

        const itemsTotal = orderDetail.itemsTotal;
        const orderVat = orderDetail.vat;
        const vatPercentage = orderVat / itemsTotal;
        const shippingTotal = orderDetail.shippingTotal;
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
        const affiliateIdOfCustomer = userData.affiliate;
        let newAffiliateCommissions;
        let affiliateUserRef;
        if (affiliateIdOfCustomer != null) {
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
            },
          ];
        }

        const oldPayments = userData.payments;
        const newPayments = [...oldPayments, data];
        const allUserOrdersQuery = db.collection('Orders').where('userId', '==', userId);
        const ordersObject = await transaction.get(allUserOrdersQuery);
        const orders = ordersObject.docs.map((doc) => doc.data());

        // const toUpdateOrders = updateAccountStatement(newPayments, orders)

        // WRITE

        // toUpdateOrders.forEach((order) => {
        //   const ref = db.collection('Orders').doc(order.reference);
        //   transaction.update(ref, { paid: order.paid });
        // });

        if (doNotAddProofOfPaymentLink == false) {
          transaction.update(orderRef, { proofOfPaymentLink: newOrderPayments });
        }

        if (affiliateIdOfCustomer != null) {
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
      });
      res.status(200).send('success');
    } catch (error) {
      console.log(error);
      res.status(400).send('Error adding document.');
    }
  });
});

// Expose the Express app as a Cloud Function
exports.payMayaWebHookSuccess = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method != 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    try {
      const totalAmount = req.body.totalAmount.value;
      const userId = req.body.metadata.userId;
      const referenceNumber = req.body.requestReferenceNumber;
      const paymentprovider = 'Maya';

      const fullName = String(req.body.buyer.firstName) + String(req.body.buyer.lastName);

      const data = {
        userId: userId,
        amount: totalAmount,
        reference: referenceNumber,
        paymentprovider: paymentprovider,
        userName: fullName,
        date: new Date(),
      };

      const db = admin.firestore();

      await db.runTransaction(async (transaction) => {
        // READ
        const paymentsRef = db.collection('Payments').doc();
        const userRef = db.collection('Users').doc(userId);
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data();

        const oldPayments = userData.payments;
        const newPayments = [...oldPayments, data];

        // WRITE
        transaction.set(paymentsRef, {
          amount: totalAmount,
          orderReference: referenceNumber,
          proofOfPaymentLink: '',
          userId: userId,
          status: 'approved',
          userName: fullName,
          paymentMethod: 'Maya',
        });
        transaction.update(userRef, { payments: newPayments });
      });

      res.status(200).send('success');
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).send('Error updating document.');
    }
  });
});

exports.payMayaWebHookFailed = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  if (req.method != 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // TODO: You will have to implement the logic of this method.

  res.send({
    success: true,
  });
});

exports.payMayaWebHookExpired = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  if (req.method != 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // TODO: You will have to implement the logic of this method.

  res.send({
    success: true,
  });
});

exports.updateOrderProofOfPaymentLink = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Get the user document
      const data = req.body;

      const userName = data.userName;
      const paymentMethod = data.paymentMethod;
      const orderReference = data.orderReference;
      const userId = data.userId;
      const proofOfPaymentLink = data.proofOfPaymentLink;
      const forTesting = data.forTesting;

      // VALIDATE DATA
      const dataSchema = Joi.object({
        orderReference: Joi.string().required(),
        userId: Joi.string().required(),
        proofOfPaymentLink: Joi.string().required(),
        paymentMethod: Joi.string().required().allow(''),
        userName: Joi.string().required(),
        forTesting: Joi.boolean(),
      });

      const { error } = dataSchema.validate(data);

      if (error) {
        console.error('Error validating data:', error);
        res.status(400).send('Error validating data.');
        return;
      }

      const db = admin.firestore();

      await db.runTransaction(async (transaction) => {
        try {
          // READ
          const orderMessagesRef = db.collection('ordersMessages').doc(orderReference);
          const userRef = db.collection('Users').doc(userId);
          const userDoc = await transaction.get(userRef);
          const userData = userDoc.data();
          const orderRef = db.collection('Orders').doc(orderReference);
          const ordersObject = await transaction.get(orderRef);
          const order = ordersObject.data();
          const proofOfPayments = order.proofOfPaymentLink;
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
            amount: null,
          });

          const paymentId = newPaymentRef.id;

          if (forTesting == false) {
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

exports.sendEmail = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
      console.log(order);
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

      console.log(`order ${order.reference} is expired and will be deleted`);
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
    console.log(error);
    throw error;
  }
}

exports.deleteOldOrders = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      deleteOldOrders();
      res.status(200).send('successfully deleted all orders');
    } catch (error) {
      console.log(error);
      res.status(400).send('failed to delete old orders');
    }
  });
});

exports.giveAffiliateCommission = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      giveAffiliateCommission();
      res.status(200).send('successfully deleted all orders');
    } catch (error) {
      console.log(error);
      res.status(400).send('failed to delete old orders');
    }
  });
});

exports.deleteOldOrdersScheduled = functions
  .region('asia-southeast1')
  .pubsub.schedule('every 1 hours')
  .onRun(async (context) => {
    deleteOldOrders();
  });

exports.transactionCancelOrder = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
          res.status(200).send('success');
        } catch (error) {
          console.log(error);
          res.status(400).send('Error deleting order.');
        }
      });
    } catch (error) {
      console.log(error);
      res.status(400).send('Error deleting order.');
    }
  });
});

exports.addDepositToAffiliate = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
          console.log(e);
          res.status(400).send('Error adding deposit to affiliate.');
        }
      } else {
        res.status(401);
      }
    } catch (e) {
      console.log(e);
    }

    res.status(200).send(data);
  });
});

exports.onAffiliateClaim = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const db = admin.firestore();
    const data = req.body;
    try {
      db.runTransaction(async (transaction) => {
        const forStatus = data.data1;
        const commDate = forStatus.date;
        const commData = forStatus.data;
        const commId = forStatus.id;
        const claimCode = forStatus.claimCode;
        const userRef = db.collection('Users').doc(commId);
        const forClaims = data.data2;
        const affiliateUserId = forClaims.affiliateUserId;
        const affiliateRef = await db.collection('Users').doc(affiliateUserId).get();
        const affiliateUserData = affiliateRef.data();
        const oldAffiliateClaims = affiliateUserData.affiliateClaims;

        const updatedClaimData = [];
        oldAffiliateClaims.map((oldClaims) => {
          updatedClaimData.push(oldClaims);
        });
        updatedClaimData.push(forClaims);

        const updatedCommData = [];
        commData.map((commissions) => {
          if (
            new Date(commissions.dateOrdered) <= new Date(commDate) &&
            commissions.status == 'claimable' &&
            commissions.claimCode == ''
          ) {
            commissions.status = 'pending';
            commissions.claimCode = claimCode;
            updatedCommData.push(commissions);
          } else {
            updatedCommData.push(commissions);
          }
        });
        transaction.update(userRef, { affiliateClaims: updatedClaimData });
        transaction.update(userRef, { affiliateCommissions: updatedCommData });
        res.status(200).send(data);
      });
    } catch (e) {
      console.log(e);
      res.status(400).send('Error on affiliate claim.');
    }
  });
});

exports.addDepositToAffiliateDeposits = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
      console.log(e);
      res.status(400).send('Error adding deposit to affiliate.');
    }
  });
});

exports.markAffiliateClaimDone = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
      console.log(e);
      res.status(400).send('Error marking affiliate claim done.');
    }
  });
});

exports.getAllAffiliateUsers = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
    res.status(200).send(affiliateUsers);
  });
});

exports.readSelectedOrder = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const data = req.body;
    const reference = data.reference;
    const userId = data.userId;

    const db = admin.firestore();
    const orderRef = db.collection('Orders').doc(reference);
    const orderDoc = await orderRef.get();
    const orderData = orderDoc.data();

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

          transaction.update(userRef, { payments: updatedPayments });

          // delete proof of payment link in order
          const updatedOrderProofOfPaymentLink = orderProofOfPaymentLink.filter((link) => {
            if (link != proofOfPaymentLink) {
              return link;
            }
          });

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
        console.log(error);
        res.status(400).send('Error voiding payment');
      }
    });
  });

exports.editCustomerOrder = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const db = admin.firestore();
    const data = req.body;
    const orderReference = data.orderReference;
    const cart = data.cart;

    try {
      await db.runTransaction(async (transaction) => {
        const itemDetails = await Promise.all(
          Object.keys(cart).map(async (itemId) => {
            console.log(itemId);
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

        console.log('cartItemReferences',cartItemReferences)

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
        const _stockOnHoldList = []
        itemData.forEach((item) => {
          const stockOnHoldList = item.stocksOnHold;
          stockOnHoldList.forEach((stockOnHold) => {
            if (stockOnHold.reference == orderReference) {
              stockOnHold.quantity = cart[item.itemId];
            }
          });
          console.log()
          _stockOnHoldList[item.itemId] = stockOnHoldList;
        });

        console.log('stockOnHoldList',_stockOnHoldList)

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
          console.log('newItemsTotal', newItemsTotal);
          console.log('itemsTotalLessVat', itemsTotalLessVat);
          console.log('vat', vat);
          console.log('newGrandTotal', newGrandTotal);

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
      console.log(error);
      res.status(400).send('Error editing order');
    }
  });
});
