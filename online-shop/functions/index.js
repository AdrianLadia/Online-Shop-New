const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
admin.initializeApp();
const corsHandler = cors({ origin: true });

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

exports.addDocumentArrayFromCollection = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const data = parseData(req.query.data);
    const collectionName = data.collectionName;
    const id = data.id;
    const firestoreData = data.firestoreData;
    const arrayName = data.arrayName;
    const db = admin.firestore();

    console.log('RAN RAN RAN');
    console.log('collectionName : ' + collectionName);
    console.log('id : ' + id);
    console.log('firestoreData : ' + firestoreData);
    console.log('arrayName : ' + arrayName);

    try {
      await db.collection(collectionName).doc(id).update({
        [arrayName]: admin.firestore.FieldValue.arrayUnion(firestoreData),
      });
      res.json({ result: `Document with ID: ${id} updated.` });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).send('Error updating document.');
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
    }
    catch (error) {
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
