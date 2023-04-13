import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import seleniumCommands from './seleniumCommands';
import firestoredb from '../src/firestoredb';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../src/firebase_config';
import cloudFirestoreDb from '../src/cloudFirestoreDb';

const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('chromedriver');
const driver = new seleniumCommands();

const app = initializeApp(firebaseConfig);
const firestore = new firestoredb(app,true);
const cloudfirestore = new cloudFirestoreDb();


function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Integration', () => {

  test('startAppLocally', async () => {
    await driver.startApp();
    const app = await driver.getApp();
    expect(app).toBeTruthy();


  }, 1000000);

  // test('guestCheckout', async () => {
  //   await driver.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
  //   const users = await cloudfirestore.readAllDataFromCollection('Users')
  //   const usersLength = users.length;
  //   await driver.checkoutAsGuest()
  //   const itemsTotal = await (await driver.getCheckoutItemsTotal()).getText();
  //   expect(parseFloat(itemsTotal)).toBeGreaterThan(0);
  //   const users2 = await cloudfirestore.readAllDataFromCollection('Users')
  //   const usersLength2 = users2.length;
  //   expect(usersLength2 - usersLength).toEqual(1);
  //   await driver.clickAccountMenu()
  //   await driver.clickStore()
  //   await driver.clickAccountMenu()
  //   await driver.clickLogoutButton()

  //   console.log('logged out')

  // }, 1000000);

  test('login', async () => {
    await driver.login();
    
  }, 1000000);


  // test('clearCart', async () => {
  //   await driver.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
  //   await driver.addToCartAllProducts()
  //   await driver.openCart();
  //   await driver.clickClearCartButton();
  //   await(delay(600))
  //   const user = await cloudfirestore.readSelectedUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
  //   await(delay(300))
  //   const userCart = user.cart
  //   const userCartLength = userCart.length;
  //   expect(userCartLength).toEqual(0);
  //   await driver.clickCloseCartButton()
  // }, 1000000);

  test('Checkout Flow', async () => {
    await cloudfirestore.updateDocumentFromCollection('Users', 'NSrPrIoJoaDVSSRCVX2Lct2wiBhm', {orders: [],contactPerson: [], deliveryAddress: []})
    
    await driver.driver.navigate().refresh();
    await driver.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
    const totalPriceOld = await (await driver.getTotalPriceOfCartButton()).getText();
    await driver.addToCartAllProducts();
    await delay(1000)
    const totalPriceNew = await (await driver.getTotalPriceOfCartButton()).getText();
    expect(totalPriceOld).not.toBe(totalPriceNew);
    const user = await cloudfirestore.readSelectedUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userCart = user.cart.length;
    
    expect(userCart).not.toBe(0);
    
    await driver.openCart();
    await driver.addToCartIncrement()
    await(delay(1000))
    const user2 = await cloudfirestore.readSelectedUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userCart2 = user2.cart.length;

    expect(userCart2 - userCart).toEqual(1);

    await driver.removeFromCartDecrement()
    await(delay(1000))
    const user3 = await cloudfirestore.readSelectedUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userCart3 = user3.cart.length;

    expect(userCart3 - userCart2).toEqual(-1);

    await driver.clickCartCheckoutButton()
    
    console.log('clicked checkout button')

    await driver.writeTestUserDetails()
    await driver.clickPlaceOrderButton()
    await driver.driver.wait(until.alertIsPresent(), 10000);
    const alert = await driver.driver.switchTo().alert();
    await alert.accept();
    await driver.driver.switchTo().window(driver.mainWindowHandle);
    await delay(1000)

    await driver.driver.navigate().refresh();

    const user4 = await cloudfirestore.readSelectedUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const userOrders4 = user4.orders

    let found = false
    userOrders4.map(order => {
      const contactName = order.contactName;
      const contactPhoneNumber = order.contactPhoneNumber;
      const deliveryAddress = order.deliveryAddress;

      if (contactName === 'Test Name' &&
      contactPhoneNumber === '1234567890' &&
      deliveryAddress === 'Test Address') {
        found = true
      }
    })

    expect(found).toBe(true)

    await driver.clickSelectFromSavedContactsButton()
    const savedAddress = await driver.getSavedContactButton()
    savedAddress.sendKeys(Key.ESCAPE);

    await driver.clickSelectFromSavedAddressesButton()
    const savedContact = await driver.getSavedAddressButton()
    savedContact.sendKeys(Key.ESCAPE);

    let foundAddress = false
    savedAddress.map(async (address) => {
      const addressText = address.getText()
      if (addressText === 'Test Address') {
        foundAddress = true
      }
    })

    let foundContact = false
    savedContact.map(async (contact) => {
      const contactText = contact.getText()
      if (contactText === 'Test Name, 1234567890') {
        foundContact = true
      }
    })

    expect(foundAddress).toBe(true)
    expect(foundContact).toBe(true)



    
    

  }, 1000000);

  
  test('accountMenu', async () => {
    await driver.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);
    await driver.clickAccountMenu();

    assert.notStrictEqual(await driver.getStoreMenuButton(), undefined);
    assert.notStrictEqual(await driver.getProfileMenuButton(), undefined);
    assert.notStrictEqual(await driver.getMyOrdersMenuButton(), undefined);
    assert.notStrictEqual(await driver.getAccountStatementMenuButton(), undefined);
    assert.notStrictEqual(await driver.getSettingsMenuButton(), undefined);
    assert.notStrictEqual(await driver.getLogoutMenuButton(), undefined);
  
    await driver.clickStore()
  }, 1000000)


  test('superAdminPrevilages', async () => {
    await cloudfirestore.changeUserRole('NSrPrIoJoaDVSSRCVX2Lct2wiBhm', 'superAdmin')
    await driver.driver.navigate().refresh();
    await driver.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);
    await driver.clickAccountMenu();
    await driver.clickAdminMenu()
    await driver.clickBackToStoreButton()
    
  }, 1000000)

  test('ordersMenu', async () => {
    await cloudfirestore.changeUserRole('NSrPrIoJoaDVSSRCVX2Lct2wiBhm', 'superAdmin')
    await driver.driver.navigate().refresh();
    await driver.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);
    await driver.clickAccountMenu();
    await driver.clickAdminMenu()
    await driver.clickHamburgerAdmin()
    await driver.clickCustomerOrdersMenu()
    await delay(1000)
    const orders = await driver.getOrdersTable()
    expect(orders.length).toBeGreaterThan(0)
    await driver.clickBackToStoreButton()
  }, 1000000)

  test('createPaymentMenu', async () => {
    await cloudfirestore.changeUserRole('NSrPrIoJoaDVSSRCVX2Lct2wiBhm', 'superAdmin')
    await driver.driver.navigate().refresh();
    await driver.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);
    await driver.clickAccountMenu();
    await driver.clickAdminMenu()
    await driver.clickHamburgerAdmin()
    await driver.clickCreatePaymentMenu()
    await driver.createTestPayment()
    await delay(1000)
    const user = await cloudfirestore.readSelectedUserById('NSrPrIoJoaDVSSRCVX2Lct2wiBhm')
    const payments = user.payments
    let found = false
    payments.map(payment => {
      if (payment.reference === 'Test Payment' &&
      payment.amount === 10000 &&
      payment.paymentprovider === 'Test Payment Provider' ) {
        found = true
      }

    })

    expect(found).toBe(true) 

    await cloudfirestore.updateDocumentFromCollection('Users','NSrPrIoJoaDVSSRCVX2Lct2wiBhm', {payments:[]})

    await driver.clickBackToStoreButton()
  }, 1000000)
});

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