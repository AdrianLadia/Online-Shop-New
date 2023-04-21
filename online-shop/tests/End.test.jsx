import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import seleniumCommands from './seleniumCommands';
import firestoredb from '../src/firestoredb';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../src/firebase_config';
import cloudFirestoreDb from '../src/cloudFirestoreDb';
import testConfig from './testConfig';
import { assert } from 'joi';

const { Builder, By, Key, until, WebDriver } = require('selenium-webdriver');
const testconfig = new testConfig()
const testUserId = testconfig.getTestUserId()
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

  test('guestCheckout', async () => {
    await driver.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
    const users = await cloudfirestore.readAllDataFromCollection('Users')
    const usersLength = users.length;
    await driver.checkoutAsGuest()
    const itemsTotal = await (await driver.getCheckoutItemsTotal()).getText();
    expect(parseFloat(itemsTotal)).toBeGreaterThan(0);
    const users2 = await cloudfirestore.readAllDataFromCollection('Users')
    const usersLength2 = users2.length;
    expect(usersLength2 - usersLength).toEqual(1);
    await driver.clickAccountMenu()
    await driver.clickStore()
    await delay(1000)
    await driver.clickAccountMenu()
    await driver.clickLogoutButton()

    console.log('logged out')

  }, 1000000);

  test('login', async () => {
    await driver.login();
    
  }, 1000000);


  test('clearCart', async () => {
    await driver.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
    await driver.addToCartAllProducts()
    await driver.openCart();
    await driver.clickClearCartButton();
    await(delay(600))
    const user = await cloudfirestore.readSelectedUserById(testUserId)
    await(delay(300))
    const userCart = user.cart
    const userCartLength = userCart.length;
    expect(userCartLength).toEqual(0);
    await driver.clickCloseCartButton()
  }, 1000000);

  test('Checkout Flow', async () => {
    await cloudfirestore.updateDocumentFromCollection('Users', testUserId, {orders: [],contactPerson: [], deliveryAddress: []})
    
    await driver.driver.navigate().refresh();
    await driver.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
    const totalPriceOld = await (await driver.getTotalPriceOfCartButton()).getText();
    await driver.addToCartAllProducts();
    await delay(1000)
    const totalPriceNew = await (await driver.getTotalPriceOfCartButton()).getText();
    expect(totalPriceOld).not.toBe(totalPriceNew);
    const user = await cloudfirestore.readSelectedUserById(testUserId)
    const userCart = user.cart.length;
    
    expect(userCart).not.toBe(0);
    
    await driver.openCart();
    await driver.addToCartIncrement()
    await(delay(1000))
    const user2 = await cloudfirestore.readSelectedUserById(testUserId)
    const userCart2 = user2.cart.length;

    expect(userCart2 - userCart).toEqual(1);

    await driver.removeFromCartDecrement()
    await(delay(1000))
    const user3 = await cloudfirestore.readSelectedUserById(testUserId)
    const userCart3 = user3.cart.length;

    expect(userCart3 - userCart2).toEqual(-1);

    await driver.clickCartCheckoutButton()
    
    console.log('clicked checkout button')

    await driver.writeTestUserDetails()
    await driver.clickMayaPaymentOption()
    let itemsTotal = await (await driver.getCheckoutItemsTotal()).getText();
    itemsTotal = itemsTotal.replace(',', '');
    itemsTotal = parseFloat(itemsTotal)

    await driver.clickPlaceOrderButton()


    await driver.driver.wait(until.alertIsPresent(), 10000);
    const alert = await driver.driver.switchTo().alert();
    await alert.accept();
    await driver.driver.switchTo().window(driver.mainWindowHandle);
    let mayaTotal = await driver.getMayaTotalAmount()
    mayaTotal = mayaTotal.replace(/[^\d.-]/g, '');
    mayaTotal = parseFloat(mayaTotal)

    expect(mayaTotal == itemsTotal).toEqual(true)

    await delay(1000)


    await driver.driverGoBackToLastPage()

    const user4 = await cloudfirestore.readSelectedUserById(testUserId)
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

    await delay(1000)
    await driver.clickSelectFromSavedContactsButton()
    const savedContact = await driver.getSavedContactButton()
    let foundContact = false
    savedContact.map(async (address) => {
      const contactText = await address.getText()
      if (contactText === 'Test Name, 1234567890') {
        foundContact = true
      }
    })
    await driver.clickCloseModalButton()

    await delay(1000)
    await driver.clickSelectFromSavedAddressButton()
    const savedAddress = await driver.getSavedAddressButton()
    let foundAddress = false
    savedAddress.map(async (contact) => {
      const addressText = await contact.getText()
      if (addressText === 'Test Address') {
        foundAddress = true
      }
    })
    await driver.clickCloseModalButton()



    expect(foundAddress).toBe(true)
    expect(foundContact).toBe(true)



    
    

  }, 10000000);

  test('guestPrevilages', async () => {
    await cloudfirestore.changeUserRole(testUserId, 'member')
    await driver.driver.navigate().refresh();
    await delay(2000)

    await driver.clickAccountMenu()
    try{
      await driver.driver.findElement(By.id('adminMenu'))
      throw new Error('admin menu should not be visible')
    }
    catch(e) {

    }
    


  },1000000)

  test('superAdminPrevilages', async () => {
    await cloudfirestore.changeUserRole(testUserId, 'superAdmin')
    await driver.driver.navigate().refresh();
    await delay(2000)
    await driver.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);
    await driver.clickAccountMenu();
    await driver.clickAdminMenu()
    await driver.clickBackToStoreButton()
    await delay(1000)
    
  }, 1000000)

  test('ordersMenu', async () => {
    await cloudfirestore.changeUserRole(testUserId, 'superAdmin')
    await driver.driver.navigate().refresh();
    await delay(2000)
    await driver.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);
    await driver.clickAccountMenu();
    await driver.clickAdminMenu()
    await driver.clickHamburgerAdmin()
    await driver.clickCustomerOrdersMenu()
    await delay(1000)
    const orders = await driver.getOrdersTable()
    expect(orders.length).toBeGreaterThan(0)
    await driver.clickBackToStoreButton()
    await delay(1000)
  }, 1000000)

  test('createPaymentMenu', async () => {
    await cloudfirestore.changeUserRole(testUserId, 'superAdmin')
    await driver.driver.navigate().refresh();
    await delay(2000)
    await driver.clickAccountMenu();
    await driver.clickAdminMenu()
    await delay(1000)
    await driver.clickHamburgerAdmin()
    await driver.clickCreatePaymentMenu()
    await driver.createTestPayment()
    await delay(2000)
    const user = await cloudfirestore.readSelectedUserById(testUserId)
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

    await cloudfirestore.updateDocumentFromCollection('Users',testUserId, {payments:[]})

    await driver.clickBackToStoreButton()
  }, 1000000)
});


