const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
admin.initializeApp();
const corsHandler = cors({ origin: true });
const Joi = require('joi');

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

exports.readUserRole = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const userid = req.query.data
      console.log(userid)
      const db = admin.firestore();
      const user = await db.collection('Users').doc(userid).get();
      const userRole = user.data().userRole;
      console.log(userRole)
      res.send(userRole);
    }
    catch (error) {
      console.log(error)
      res.status(400).send('Error reading user role. Please try again later');
    }

    
  });
});

exports.readAllProductsForOnlineStore = functions.https.onRequest(async (req, res) => {
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
        const data = doc.data()
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
          weight: data.weight
        }
        products.push(productObject);
      });
  
      // Send the products array as a JSON response
      res.send(products);
    }
    catch (error) {
      res.status(400).send('Error reading products. Please try again later');
    }
  });
});

exports.transactionPlaceOrder = functions.https.onRequest(async (req, res) => {
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

    if (itemsTotalBackEnd != itemstotal+vat) {
      
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
        const cartUniqueItems = Array.from(new Set(data.cart))
        const ordersOnHold = {}
        const currentInventory = {}

        await Promise.all(cartUniqueItems.map(async(c) => {
          const productRef = db.collection('Products').doc(c)
          const productdoc = await transaction.get(productRef);
          // currentInventory.push(productdoc.data().stocksAvailable)
          ordersOnHold[c] = productdoc.data().stocksOnHold
          currentInventory[c] = productdoc.data().stocksAvailable
        }))

        
        // WRITE
        // WRITE TO PRODUCTS ON HOLD
        await Promise.all(cartUniqueItems.map(async (itemId) => {
          const prodref = db.collection('Products').doc(itemId)
          const orderQuantity = data.cart.filter((c) => c == itemId).length
          const newStocksAvailable = currentInventory[itemId] - orderQuantity
          console.log(ordersOnHold)
          console.log(itemId)
          const oldOrdersOnHold = ordersOnHold[itemId]
          const newOrderOnHold = {reference:reference,quantity:orderQuantity,userId:userid}
          const oldAndNewOrdersOnHold = [...oldOrdersOnHold, newOrderOnHold]
          transaction.update(prodref, {['stocksOnHold']: oldAndNewOrdersOnHold});
          transaction.update(prodref, {['stocksAvailable']: newStocksAvailable});
        }))

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
        res.end();
      } catch (e) {
        console.log(e);
      }
    });
  });
});

exports.checkIfUserIdAlreadyExist = functions.https.onRequest(async (req, res) => {
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

exports.deleteDocumentFromCollection = functions.https.onRequest(async (req, res) => {
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

exports.updateDocumentFromCollection = functions.https.onRequest(async (req, res) => {
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

exports.readAllIdsFromCollection = functions.https.onRequest(async (req, res) => {
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

exports.readAllDataFromCollection = functions.https.onRequest(async (req, res) => {
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

exports.createDocument = functions.https.onRequest(async (req, res) => {
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

exports.readSelectedDataFromCollection = functions.https.onRequest(async (req, res) => {
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

exports.login = functions.https.onRequest(async (req, res) => {
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

exports.getCartCount = getCartCount;
exports.getValueAddedTax = getValueAddedTax;
