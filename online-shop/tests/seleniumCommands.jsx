import seleniumElements from "./seleniumElements";
const { Builder, By, Key, until } = require('selenium-webdriver');


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class seleniumCommands extends seleniumElements {
    constructor() {
        super();
        this.mainWindowHandle = null;
    }

    async clickLoginGuestButton() {
        const loginGuestButton = await this.getLoginGuestButton();
        await loginGuestButton.click();
        await delay(600)
    }



    async clickAccountForLogin() {
        const account = await this.getLoginButtonUserAccount();
        await account.click();
        await delay(600)
    }

    async startApp() {
        await this.driver.get("http://localhost:5173");
        this.mainWindowHandle = await this.driver.getWindowHandle();
        await delay(2000)
    }    

    async clickLoginWithGoogle() {
        const loginWithGoogle = await this.getLoginWithGoogle();
        await loginWithGoogle.click();
        await delay(600)
    }

    async clickAutoGenerateUserButton() {
        const autoGenerateUserButton = await this.getAutoGenerateUserButton();
        await autoGenerateUserButton.click();
        await delay(600)
    }

    async clickAddAccountButton() {
        const addAccountButton = await this.getAddAccountButton();
        await addAccountButton.click();
        await delay(600)
    }

    async inputTestEmailInGoogleNewUser() {
        const emailInput = await this.getEmailInputGoogleNewUser();
        await emailInput.sendKeys("test@gmail.com");
    }

    async inputTestDisplayNameInGoogleNewUser() {
        const displayNameInput = await this.getDisplayNameInputGoogleNewUser();
        await displayNameInput.sendKeys("test");
    }

    async clickSignInWithGoogleButton() {
        const signInWithGoogleButton = await this.getSignInWithGoogleButton();
        await signInWithGoogleButton.click();
        await delay(600)
    }

    async clickStore() {
        const storeMenu = await this.getStoreMenuButton()
        await storeMenu.click()
        await delay(600)
    }

    async enterAddress() {
        const addressInput = await this.getAddressEntry()
        await addressInput.sendKeys("Test Address")
        await delay(600)
    }

    async enterContactNumber() {
        const contactNumberInput = await this.getContactNumberEntry()
        await contactNumberInput.sendKeys("1234567890")
        await delay(600)
    }

    async enterContactName() {
        const contactNumberInput = await this.getContactNameEntry()
        await contactNumberInput.sendKeys("Test Name")
        await delay(600)
    }

    async writeTestUserDetails() {
        await this.driver.wait(until.elementLocated(By.id('addressEntry')), 10000);
        await this.enterAddress()
        await this.enterContactNumber()
        await this.enterContactName()
    }

    async clickPlaceOrderButton() {
        const placeOrderButton = await this.getPlaceOrderButton()
        await placeOrderButton.click()
       
    }


    async checkoutAsGuest() {
        await this.addToCartAllProducts()
        await this.openCart();
        await this.clickCartCheckoutButton();
        await this.clickLoginGuestButton();
        await this.clickLoginWithGoogle();
        await this.driver.wait(async () => (await this.driver.getAllWindowHandles()).length === 2, 10000);
        const allHandles = await this.driver.getAllWindowHandles();
        const popupWindowHandle = allHandles.find(handle => handle !== this.mainWindowHandle);
        await this.driver.switchTo().window(popupWindowHandle);
        await this.clickAddAccountButton();
        await this.clickAutoGenerateUserButton();
        await this.clickSignInWithGoogleButton();
        await this.driver.switchTo().window(this.mainWindowHandle);
        await this.driver.wait(until.elementLocated(By.id('checkoutItemsTotal')), 10000);
        await delay(600)
        
    }
    
    async login() {
        const loginButton =await this.getLoginButton();
        await loginButton.click();
        
        await this.clickLoginWithGoogle()

        await this.driver.wait(async () => (await this.driver.getAllWindowHandles()).length === 2, 10000);
        const allHandles = await this.driver.getAllWindowHandles();
        const popupWindowHandle = allHandles.find(handle => handle !== this.mainWindowHandle);
        await this.driver.switchTo().window(popupWindowHandle);
        await this.clickAccountForLogin();
        await this.driver.switchTo().window(this.mainWindowHandle);
        await delay(600)

    }

    async clickAccountMenu() {
        const accountMenu = await this.getAccountMenuButton()
        await accountMenu.click()
        await delay(600)
    }

    async openCart() {
        const cartButton = await this.getCartOpenButton();
        await cartButton.click();
        await delay(600)
    }

    async addToCartIncrement(){
        const add = await this.getAddToCartIncrementButton();
        await add[0].click();
        await delay(600)
    }

    async removeFromCartDecrement(){
        const remove = await this.getRemoveFromCartDecrementButton();
        await remove[0].click();
        await delay(600)
    }

    async addToCartAllProducts() {
        const totalPrice = await this.getTotalPriceOfCartButton();
        const entryQuantity = await this.getAllEntriesOfProductList();
        const addtocartbutton = await this.getAllAddToCartButtons();

        for (const [index, entry] of entryQuantity.entries()) {
            try{
              await entry.sendKeys("1");
              await addtocartbutton[index].click();
            }
            catch(error){
              console.log(error)
            }
          }

        await(delay(600))
    }

    async clickLogoutButton() {
        const logoutButton = await this.getLogoutMenuButton();
        await logoutButton.click();
        await delay(600)
    }

    async clickClearCartButton() {
        const clearCartButton = await this.getClearCartButton();
        await clearCartButton.click();
        await delay(600)
    }

    async clickCloseCartButton() {
        const closeCartButton = await this.getCloseCartButton();
        await closeCartButton.click();
        await delay(600)
    }

    async clickCartCheckoutButton() {
        const checkoutButton = await this.getCartCheckoutButton();
        await checkoutButton.click();
    }

}

export default seleniumCommands;