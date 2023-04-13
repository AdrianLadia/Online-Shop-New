import seleniumElements from "./seleniumElements";
const { Builder, By, Key, until } = require('selenium-webdriver');


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function backspace(element) {
    for (let i = 0; i < 100; i++) {
      await element.sendKeys(Key.BACK_SPACE);
      }
}

class seleniumCommands extends seleniumElements {
    constructor() {
        super();
        this.mainWindowHandle = null;
    }

    async clickLoginGuestButton() {
        const loginGuestButton = await this.getLoginGuestButton();
        await loginGuestButton.click();

    }



    async clickAccountForLogin() {
        const account = await this.getLoginButtonUserAccount();
        await account.click();

    }

    async startApp() {
        await this.driver.get("http://localhost:5173");
        this.mainWindowHandle = await this.driver.getWindowHandle();

    }    

    async clickLoginWithGoogle() {
        const loginWithGoogle = await this.getLoginWithGoogle();
        await loginWithGoogle.click();

    }

    async clickAutoGenerateUserButton() {
        const autoGenerateUserButton = await this.getAutoGenerateUserButton();
        await autoGenerateUserButton.click();

    }

    async clickAddAccountButton() {
        const addAccountButton = await this.getAddAccountButton();
        await addAccountButton.click();

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

    }

    async clickStore() {
        const storeMenu = await this.getStoreMenuButton()
        await storeMenu.click()

    }

    async enterAddress() {
        const addressInput = await this.getAddressEntry()
        await addressInput.click()
        await backspace(addressInput)
        await addressInput.sendKeys("Test Address")

    }

    async clickAdminMenu() {
        const adminMenu = await this.getAdminMenuButton()
        await adminMenu.click()

    }

    async clickInventoryMenu() {
        const inventoryMenu = await this.getInventoryMenuButton()
        await inventoryMenu.click()
    }

    async clickCreatePaymentMenu() {
        const createPaymentMenu = await this.getCreatePaymentMenuButton()
        await createPaymentMenu.click()
    }

    async clickBackToStoreButton() {
        const backToStoreButton = await this.getBackToStoreButton()
        await backToStoreButton.click()
    }

    async clickCustomerOrdersMenu() {
        const customerOrdersMenu = await this.getCustomerOrdersMenuButton()
        await customerOrdersMenu.click()
    }

    async clickHamburgerAdmin() {
        const hamburgerAdmin = await this.getHamburgerAdminButton()
        await hamburgerAdmin.click()
    }

    async enterContactNumber() {
        const contactNameInput = await this.getContactNumberEntry()
        await contactNameInput.click()
        await backspace(contactNameInput)
        await contactNameInput.sendKeys("1234567890")

    }

    async enterContactName() {
        const contactNumberInput = await this.getContactNameEntry()
        await contactNumberInput.click()
        await backspace(contactNumberInput)
        await contactNumberInput.sendKeys("Test Name")
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
        await this.driver.wait(until.elementLocated(By.id('accountMenu')), 10000);


    }

    async clickStoreMenu() {
        const storeMenu = await this.getStoreMenuButton()
        await storeMenu.click()
    }

    async clickAccountMenu() {
        const accountMenu = await this.getAccountMenuButton()
        await accountMenu.click()

    }

    async openCart() {
        const cartButton = await this.getCartOpenButton();
        await cartButton.click();

    }

    async addToCartIncrement(){
        const add = await this.getAddToCartIncrementButton();
        await add[0].click();

    }

    async removeFromCartDecrement(){
        const remove = await this.getRemoveFromCartDecrementButton();
        await remove[0].click();

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


    }

    async clickLogoutButton() {
        const logoutButton = await this.getLogoutMenuButton();
        await logoutButton.click();

    }

    async clickClearCartButton() {
        const clearCartButton = await this.getClearCartButton();
        await clearCartButton.click();

    }

    async clickCloseCartButton() {
        const closeCartButton = await this.getCloseCartButton();
        await closeCartButton.click();

    }

    async clickCartCheckoutButton() {
        const checkoutButton = await this.getCartCheckoutButton();
        await checkoutButton.click();
    }

    async clickCustomerNamePaymentEntry() {
        const customerNamePaymentEntry = await this.getCustomerNamePaymentEntry();
        await customerNamePaymentEntry.click();
    }

    async clickAmountPaymentEntry() {
        const amountPaymentEntry = await this.getAmountPaymentEntry();
        await amountPaymentEntry.click();
    }

    async clickReferencePaymentEntry() {
        const referencePaymentEntry = await this.getReferencePaymentEntry();
        await referencePaymentEntry.click();
    }

    async clickPaymentProviderPaymentEntry() {
        const paymentProviderPaymentEntry = await this.getPaymentProviderPaymentEntry();
        await paymentProviderPaymentEntry.click();
    }

    async clickCreatePaymentButton() {
        const createPaymentButton = await this.getCreatePaymentButton();
        await createPaymentButton.click();
    }

    async createTestPayment() {
        const customerNamePaymentEntry = await this.getCustomerNamePaymentEntry();
        const amountPaymentEntry = await this.getAmountPaymentEntry();
        const referencePaymentEntry = await this.getReferencePaymentEntry();
        const paymentProviderPaymentEntry = await this.getPaymentProviderPaymentEntry();

        await this.clickCustomerNamePaymentEntry()
        const suggestionsList = await this.driver.wait(until.elementLocated(By.css('.MuiAutocomplete-listbox')), 5000);
        await customerNamePaymentEntry.sendKeys("ladia.adrian@gmail.com")
        const suggestion = await suggestionsList.findElement(By.css('.MuiAutocomplete-option'));
        await suggestion.click();
        await amountPaymentEntry.sendKeys("10000")
        await referencePaymentEntry.sendKeys("Test Payment")
        await paymentProviderPaymentEntry.sendKeys("Test Payment Provider")
        await this.clickCreatePaymentButton()
    }

    async clickSelectFromSavedContactsButton () {
        const selectFromSavedContactsButton = await this.getSelectFromSavedContactsButton();
        await selectFromSavedContactsButton.click();
    }

    async clickSelectFromSavedAddressButton () {
        const selectFromSavedAddressButton = await this.getSelectSavedAddressButton();
        await selectFromSavedAddressButton.click();
    }

    
}

export default seleniumCommands;