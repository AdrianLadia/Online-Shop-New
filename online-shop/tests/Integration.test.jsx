import { afterEach, beforeEach, describe, expect, test } from 'vitest';
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('chromedriver');

let driver = await new Builder().forBrowser('chrome').build();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Integration', () => {
  test("startAppLocally", async () => {
      await driver.get("http://localhost:5173");
      const app = await driver.findElement(By.id("app"));
      expect(app).toBeTruthy();
  })

  test("login", async () => {
    const loginButton = await driver.findElement(By.id("loginButton"));
    await loginButton.click();
    const loginWithGoogle = await driver.findElement(By.id("loginWithGoogle"));
    await loginWithGoogle.click();
    await delay(10000)
  },1000000)

  // test('productList', async () => {
  //   const totalPrice = await driver.findElement(By.id("totalPrice"));
  //   const totalPriceOld = await totalPrice.getText();
  //   const entryQuantity = await driver.findElements(By.id("entryquantity"));
  //   const addtocartbutton = await driver.findElements(By.id("addtocartbutton"));
    
    
  //   for (const [index, entry] of entryQuantity.entries()) {
  //     try{
  //       await entry.sendKeys("1");
  //       await addtocartbutton[index].click();
  //     }
  //     catch(error){
  //       console.log(error)
  //     }
  //   }

  //   const totalPriceNew = await totalPrice.getText();
  //   expect(totalPriceNew).not.toBe(totalPriceOld);
  // }, 1000000)

  test('accountMenu', async () => {
    const accountMenu = await driver.findElement(By.id("accountMenu"));
    await accountMenu.click();
    const storeMenu = await driver.findElement(By.id("storeMenu"));
    const profileMenu = await driver.findElement(By.id("profileMenu"));
    const myOrdersMenu = await driver.findElement(By.id("myOrdersMenu"));
    const accountStatementMenu = await driver.findElement(By.id("accountStatementMenu"));
    const logoutMenu = await driver.findElement(By.id("logoutMenu"));
    const settingsMenu = await driver.findElement(By.id("settingsMenu"));

    assert.notStrictEqual(storeMenu, undefined);
    assert.notStrictEqual(profileMenu, undefined);
    assert.notStrictEqual(myOrdersMenu, undefined);
    assert.notStrictEqual(accountStatementMenu, undefined);
    assert.notStrictEqual(logoutMenu, undefined);
    assert.notStrictEqual(settingsMenu, undefined);
    
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
