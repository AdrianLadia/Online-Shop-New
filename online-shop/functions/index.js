const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { setDoc, doc } = require('firebase/firestore');
admin.initializeApp();


// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      const original = snap.data().original;
      console.log('Uppercasing', context.params.documentId, original);
      const uppercase = original.toUpperCase();
      return snap.ref.set({uppercase}, {merge: true});
    });

    exports.createDocument = functions.https.onRequest(async (req, res) => {
      const data = req.query.data;
      const id = req.query.id;
      const collection = req.query.collection;
    
      // Decode and parse the URL-encoded JSON string
      let parsedData;
      try {
        parsedData = JSON.parse(decodeURIComponent(data));
      } catch (e) {
        res.status(400).send('Invalid data format. Data must be a valid URL-encoded JSON string.');
        return;
      }
    
      const db = admin.firestore();
    
      try {
        await db.collection(collection).doc(id).set(parsedData);
        res.json({result: `Document with ID: ${id} added.`});
      } catch (error) {
        console.error('Error adding document:', error);
        res.status(500).send('Error adding document.');
      }
    });
    
exports.login = functions.https.onRequest(async (req, res) => {
  try {
    const allUsersSnapshot = await admin.firestore().collection('Users').get();
    const usersData = [];

    allUsersSnapshot.forEach((doc) => {
      usersData.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(usersData);
  } catch (error) {
    console.error("Error fetching users data: ", error);
    res.status(500).json({ error: "An error occurred while fetching users data." });
  }
});






