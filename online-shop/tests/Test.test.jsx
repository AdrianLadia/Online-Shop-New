import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import firestoredb from '../src/firestoredb';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../src/firebase_config';
import cloudFirestoreDb from '../src/cloudFirestoreDb';

const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app, true);
// const cloudfirestore = new cloudFirestoreDb(app)


describe('test get data', async () => {
    test('get data', async () => {
        const data = await firestore.readAllCategories()
        // const data = await firestore.readSelectedDataFromCollection('Users','6CO7Rda0Ngtoi41Gp6Zge3VlB5C5')
        expect(data).not.toEqual(null)
    },1000000)
}

)