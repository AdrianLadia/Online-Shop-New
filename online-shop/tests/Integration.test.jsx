import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import seleniumCommands from './seleniumCommands';
import firestoredb from '../src/firestoredb';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../src/firebase_config';

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('chromedriver');
const driver = new seleniumCommands();

const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app,true);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Integration', () => {
  test('startAppLocally', async () => {
    await driver.startApp();
    const app = await driver.getApp();
    expect(app).toBeTruthy();
    
  });
  
  test('login', async () => {
    await driver.login();
    await delay(500)
  }, 1000000);
  
  test('clickAccountMenu', async () => {
    await driver.clickAccountMenu();

    assert.notStrictEqual(await driver.getStoreMenuButton(), undefined);
    assert.notStrictEqual(await driver.getProfileMenuButton(), undefined);
    assert.notStrictEqual(await driver.getMyOrdersMenuButton(), undefined);
    assert.notStrictEqual(await driver.getAccountStatementMenuButton(), undefined);
    assert.notStrictEqual(await driver.getSettingsMenuButton(), undefined);
    assert.notStrictEqual(await driver.getLogoutMenuButton(), undefined);
    await driver.clickStoreMenu();

    await delay(500)
  }, 1000000)
});
  test('checkoutFlow', async () => {
    const totalPriceOld = await driver.getTotalPriceOfCartButton();
    await driver.addToCartAllProducts();
    const totalPriceNew = await driver.getTotalPriceOfCartButton();
    expect(totalPriceOld).not.toBe(totalPriceNew);
    const user = await firestore.readUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userCart = user.cart.length;
    
    expect(userCart).not.toBe(0);
    
    await driver.openCart();
    await driver.addToCartIncrement()
    await delay(300)
    const user2 = await firestore.readUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userCart2 = user2.cart.length;
    expect(userCart2 - userCart).toEqual(1);

    await driver.removeFromCartDecrement()
    await delay(300)
    const user3 = await firestore.readUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userCart3 = user.cart.length;

    expect(userCart3 - userCart2).toEqual(-1);
    await delay(500)
  }, 1000000);


// async function example() {

//   try {
//     // Navigate to Google
//     await driver.get('https://www.google.com');

//     // Find the search box and enter a query
//     let searchBox = await driver.findElement(By.name('q'));
//     await searchBox.sendKeys('Selenium', Key.RETURN);

//     // Wait for the results to load
//     await driver.wait(until.titleContains('Selenium'), 5000);

//     // Print the page title
//     console.log(await driver.getTitle());
//   } finally {
//     // Quit the browser
//     await driver.quit();
//   }
// }

// example();
