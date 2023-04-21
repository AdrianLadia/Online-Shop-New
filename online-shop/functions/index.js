const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
// Use CORS middleware to enable Cross-Origin Resource Sharing
const corsHandler = cors({ origin: true });
const express = require('express');
const app = express();
const Joi = require('joi');

admin.initializeApp();

app.use(corsHandler);
app.use(express.json());

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

exports.readUserRole = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const userid = req.query.data;
      console.log(userid);
      const db = admin.firestore();
      const user = await db.collection('Users').doc(userid).get();
      const userRole = user.data().userRole;
      console.log(userRole);
      res.send(userRole);
    } catch (error) {
      console.log(error);
      res.status(400).send('Error reading user role. Please try again later');
    }
  });
});

exports.readAllProductsForOnlineStore = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      // Create a query for products where forOnlineStore is true
      const db = admin.firestore();
      const productsRef = db.collection('Products');
      const forOnlineStoreQuery = productsRef.where('forOnlineStore', '==', true);

      // Fetch and process the documents
      const querySnapshot = await forOnlineStoreQuery.get();
      console.log('querySnapshot', querySnapshot);
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
        };
        products.push(productObject);
      });

      // Send the products array as a JSON response
      res.status(200).send(products);
    } catch (error) {
      res.status(400).send('Error reading products. Please try again later');
    }
    // return res.json({status: 'ok'})
  });
});

// #########
// async transactionCreatePayment(userid, amount, reference, paymentprovider) {

//   const userIdSchema = Joi.string().required();
//   const amountSchema = Joi.number().required();
//   const referenceSchema = Joi.string().required();
//   const paymentproviderSchema = Joi.string().required();

//   console.log(typeof(amount))
//   console.log(amount)

//   const {error1} = userIdSchema.validate(userid);

//   const {error2} = amountSchema.validate(amount);

//   const {error3} = referenceSchema.validate(reference);

//   const {error4} = paymentproviderSchema.validate(paymentprovider);

//   if(error1 || error2 || error3 || error4){
//     console.log(error1, error2, error3, error4)
//     throw new Error("Data Validation Error")
//   }

//   const docRef = doc(this.db, "Users" + "/", userid);
//   try {
//     await runTransaction(this.db, async (transaction) => {
//       // READ
//       const doc = await transaction.get(docRef);
//       const orders = doc.data().orders;
//       const payments = doc.data().payments;

//       const data = [];
//       let totalpayments = parseFloat(amount);

//       payments.map((payment) => {
//         data.push(payment);
//         console.log(parseFloat(payment.amount));
//         totalpayments += parseFloat(payment.amount);
//       });

//       orders.sort((a, b) => {
//         return (
//           new Date(a.orderDate.seconds * 1000).getTime() -
//           new Date(b.orderDate.seconds * 1000).getTime()
//         );
//       });

//       console.log("Total Payments: ", totalpayments);
//       orders.map((order) => {
//         totalpayments -= parseFloat(order.grandTotal);
//         totalpayments = Math.round(totalpayments);
//         if (totalpayments >= 0) {
//           console.log("Order Paid");
//           console.log(order.reference);
//           if (order.paid == false) {
//             console.log(
//               "Updating Order to Paid with reference ",
//               order.reference
//             );
//             // WRITE
//             transaction.update(docRef, {
//               ["orders"]: arrayRemove(order),
//             });
//             order.paid = true;
//             // WRITE
//             transaction.update(docRef, {
//               ["orders"]: arrayUnion(order),
//             });
//             console.log(order);
//           }
//         }
//         if (order.paid == true && totalpayments < 0) {
//           console.log("Order Was Paid but now unpaid");
//           console.log(order.reference);
//           // WRITE
//           transaction.update(docRef, {
//             ["orders"]: arrayRemove(order),
//           });
//           order.paid = false;
//           // WRITE
//           transaction.update(docRef, {
//             ["orders"]: arrayUnion(order),
//           });
//           console.log(order);
//         }
//       });

//       // WRITE
//       transaction.update(docRef, {
//         ['payments']: arrayUnion({
//           date: new Date(),
//           amount: amount,
//           reference: reference,
//           paymentprovider: paymentprovider,
//         }),
//       });
//     });
//     console.log("Transaction successfully committed!");
//   } catch (e) {
//     console.log("Transaction failed: ", e);
//   }
// }

exports.createPayment = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const data = parseData(req.query.data);
      const userId = data.userId;
      console.log(data);
      console.log(userId);

      const db = admin.firestore();
      const user = await db.collection('Users').doc(userId).get();
      const userData = user.data();
      // const userData = userRef.data();
      const oldPayments = userData.payments;
      console.log('old Payments', oldPayments);

      const newPayments = [...oldPayments, data];

      console.log('new Payments', newPayments);

      await db
        .collection('Users')
        .doc(userId)
        .update({
          ['payments']: newPayments,
        });

      res.status(200).send('success');
    } catch (error) {
      res.status(400).send('Error creating payment. Please try again later');
    }
  });
});

exports.updateOrdersAsPaidOrNotPaid = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const id = req.query.data;
      console.log('Id selected is ', id);
      console.log('Validating Data');
      const userIdSchema = Joi.string().required();

      const { error1 } = userIdSchema.validate(id);

      if (error1) {
        console.log(error1);
        throw new Error('Data Validation Error');
      }

      console.log('Getting User Data');
      // Launch db
      const db = admin.firestore();
      // Get userdata
      const user = await db.collection('Users').doc(id).get();
      const userData = user.data();
      const payments = userData.payments;
      let orders = userData.orders;

      // console.log('Payments', payments)

      // manipulate data
      // get total of payments
      let totalPayments = 0;
      payments.map((payment) => {
        totalPayments += payment.amount;
      });
      // sort orders to target the oldest order first
      orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));

      // edit orders
      orders.forEach((order) => {
        totalPayments -= order.grandTotal;
        if (totalPayments >= 0) {
          order.paid = true;
          console.log(order.reference + ' is PAID');
        }
        if (totalPayments < 0) {
          order.paid = false;
          console.log(order.reference + ' is NOT PAID');
        }
      });

      console.log('Credit left is : ' + totalPayments);
      await db
        .collection('Users')
        .doc(id)
        .update({ ['orders']: orders });

      res.status(200).send('success');
    } catch (error) {
      res.status(400).send(error);
    }
  });
});

// ##############

exports.transactionPlaceOrder = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    console.log('running transactionPlaceOrder');
    const data = parseData(req.query.data);
    const userid = data.userid;
    const username = data.username;
    const localDeliveryAddress = data.localDeliveryAddress;
    const locallatitude = data.locallatitude;
    const locallongitude = data.locallongitude;
    const localphonenumber = data.localphonenumber;
    const localname = data.localname;
    const orderDate = data.orderDate;
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

    const db = admin.firestore();
    const cartCount = getCartCount(cart);

    let itemsTotalBackEnd = 0;
    const itemKeys = Object.keys(cartCount);

    for (const key of itemKeys) {
      const itemId = key;
      const itemQuantity = cartCount[key];
      const item = await db.collection('Products').doc(itemId).get();
      const price = item.data().price;
      const total = price * itemQuantity;
      itemsTotalBackEnd += total;
    }

    console.log(itemsTotalBackEnd);
    console.log(itemstotal + vat);

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

    db.runTransaction(async (transaction) => {
      try {
        // read user data
        const userRef = db.collection('Users').doc(userid);
        const user = await transaction.get(userRef);
        const userData = user.data();
        const deliveryAddress = userData.deliveryAddress;
        const contactPerson = userData.contactPerson;
        const cartUniqueItems = Array.from(new Set(data.cart));
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
            const orderQuantity = data.cart.filter((c) => c == itemId).length;
            const newStocksAvailable = currentInventory[itemId] - orderQuantity;
            console.log(ordersOnHold);
            console.log(itemId);
            const oldOrdersOnHold = ordersOnHold[itemId];
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
            console.log('address already exists');
            addressexists = true;
          }
          if (d.latitude == locallatitude) {
            console.log('latitude already exists');
            latitudeexists = true;
          }
          if (d.longitude == locallongitude) {
            console.log('longitude already exists');
            longitudeexists = true;
          }
        });
        if (addressexists == false || latitudeexists == false || longitudeexists == false) {
          console.log('adding new address');
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
            console.log('phonenumber already exists');
            phonenumberexists = true;
          }
          if (d.name == localname) {
            console.log('name already exists');
            nameexists = true;
          }
        });
        if (phonenumberexists == false || nameexists == false) {
          console.log('updating contact');
          const newContact = [{ name: localname, phoneNumber: localphonenumber }];
          const updatedContactList = [...newContact, ...contactPerson];
          console.log(updatedContactList);
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
        };

        const updatedOrders = [newOrder, ...oldOrders];

        transaction.update(userRef, { orders: updatedOrders });
        // DELETE CART BY UPDATING IT TO AN EMPTY ARRAY
        transaction.update(userRef, { cart: [] });
        res.send('SUCCESS');
      } catch (e) {
        console.log(e);
        res.status(400).send('FAILED');
      }
    });
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

    console.log('collectionName: ', collectionName);
    console.log('id: ', id);

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

// Expose the Express app as a Cloud Function
exports.payMayaWebHookSuccess = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    // TODO: You will have to implement the logic of this method.
    // console.log(req.body);
    const totalAmount = req.body.totalAmount.value;
    const userId = req.body.metadata.userId;
    const referenceNumber = req.body.requestReferenceNumber;

    const db = admin.firestore();

    try {
      db.runTransaction(async (transaction) => {
        // READ
        const userRef = db.collection('Users').doc(userId);
        const user = await transaction.get(userRef);
        const userData = user.data();
        // console.log(userData);
        const oldOrders = userData.orders;
        const oldPayments = userData.payments;
        const payment = {
          date: new Date(),
          amount: totalAmount,
          reference: referenceNumber,
          paymentprovider: 'Maya',
        };

        // WRITE
        // Add new payment
        const newPayments = [...oldPayments, payment];
        transaction.update(userRef, { ['payments']: newPayments });

        // Find the order and mark as paid

        let orderToUpdate = oldOrders.find((order) => order.reference === referenceNumber);
        orderToUpdate.paid = true;

        if (orderToUpdate == null) {
          res.status(500).send('Unable to find order ReferenceNumber : ' + referenceNumber + ' in user orders');
        }

        // orderToUpdate.paid = true;

        // Update the order
        transaction.update(userRef, { ['orders']: oldOrders });

        console.log('success');
        res.status(200).send('success');
      });
      // res.json({ paymentToReference: referenceNumber });
    } catch (error) {
      console.error('Error adding document:', error);
      res.status(500).send('Error adding document.');
    }
  });
});

exports.payMayaWebHookFailed = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // TODO: You will have to implement the logic of this method.
  console.log(req.body);

  res.send({
    success: true,
  });
});

exports.payMayaWebHookExpired = functions.region('asia-southeast1').https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // TODO: You will have to implement the logic of this method.
  console.log(req.body);

  res.send({
    success: true,
  });
});
