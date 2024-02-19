import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../src/firebase_config.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ref = collection(db, 'Products')
const snapshot = await getDocs(ref);
snapshot.forEach((doc) => {
  if (doc.data().unit != 'Pack') {
    console.log(doc.id, '=>', doc.data().stocksAvailable);
  }
});
// const timestamp = Timestamp.fromMillis(Date.parse('2024-02-13T12:31:00Z'))
// const documentSnapshot = await runTransaction(db,
//     updateFunction => updateFunction.get(ref),
//     {readOnly: true, readTime: timestamp}
// );

// const data = documentSnapshot.data();
// console.log(data);

//   const querySnapshot = await firestore.runTransaction(
//     updateFunction => updateFunction.get(query),
//     {readOnly: true, readTime: new Firestore.Timestamp(1684098540, 0)}
//   )