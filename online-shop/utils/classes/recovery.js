import firestoredb from '../../src/firestoredb.js';
import firebaseConfig from '../../src/firebase_config.js';
import { initializeApp } from 'firebase/app';


const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app,true);

const products = await firestore.readAllDataFromCollection('Products')

products.forEach(product => {
    let stocksOnHoldCompletedQuantity = 0
    product.stocksOnHold.forEach(stock => {
        stocksOnHoldCompletedQuantity += stock.quantity
    })
    if (product.unit != 'Pack') {
        console.log(`${product.itemId} -> ${product.stocksAvailable + stocksOnHoldCompletedQuantity} `)
    }
})

const PPB45 = products.filter(p => p.itemId == 'PPB#45')[0]
const stocksOnHoldCompleted = PPB45.stocksOnHoldCompleted
const last = stocksOnHoldCompleted[stocksOnHoldCompleted.length - 1]
console.log(products)