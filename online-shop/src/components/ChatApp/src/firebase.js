import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../../firebase_config";

// const firebaseConfig = {
//   apiKey: "AIzaSyDnFzbjAZ7CMdPD9DQs-JR-PquCSxdAoYk",
//   authDomain: "chat-app-84014.firebaseapp.com",
//   projectId: "chat-app-84014",
//   storageBucket: "chat-app-84014.appspot.com",
//   messagingSenderId: "917247631172",
//   appId: "1:917247631172:web:8624f5fb3e8ece86640111"
// };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db