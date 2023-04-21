const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('chromedriver');


class seleniumElements {
    constructor() {
        this.driver = new Builder().forBrowser('chrome').build();    
        
    }

    async getCheckoutItemsTotal() {
        await this.driver.wait(until.elementLocated(By.id('checkoutItemsTotal')), 10000);
        return await this.driver.findElement(By.id("checkoutItemsTotal"));
    }

    async getAutoGenerateUserButton() {
        await this.driver.wait(until.elementLocated(By.id('autogen-button')), 10000);
        return await this.driver.findElement(By.id("autogen-button"));
    }

    async getSignInWithGoogleButton() {
        await this.driver.wait(until.elementLocated(By.id('sign-in')), 10000);
        return await this.driver.findElement(By.id("sign-in"));
    }

    async getEmailInputGoogleNewUser() {
        await this.driver.wait(until.elementLocated(By.id('email-input')), 10000);
        return await this.driver.findElement(By.id("email-input"));
    }

    async getDisplayNameInputGoogleNewUser() {
        await this.driver.wait(until.elementLocated(By.id('display-name-input')), 10000);
        return await this.driver.findElement(By.id("display-name-input"));
    }

    async getAddAccountButton() {
        await this.driver.wait(until.elementLocated(By.id('add-account-button')), 10000);
        return await this.driver.findElement(By.id("add-account-button"));
    }

    async getLoginGuestButton() {
        await this.driver.wait(until.elementLocated(By.id('loginGuest')), 10000);
        return await this.driver.findElement(By.id("loginGuest"));
    }

    async getLoginButtonUserAccount() {
        await this.driver.wait(until.elementLocated(By.id('reuse-email')), 10000);
        return await this.driver.findElement(By.id("reuse-email"));
    }

  
    async getApp() {
        await this.driver.wait(until.elementLocated(By.id('app')), 10000);
        return await this.driver.findElement(By.id("app"));
    }

    async getLoginButton() {
        await this.driver.wait(until.elementLocated(By.id('loginButton')), 10000);
        return await this.driver.findElement(By.id("loginButton"));
    }

    async getLoginWithGoogle() {
        await this.driver.wait(until.elementLocated(By.id('loginWithGoogle')), 10000);
        return await this.driver.findElement(By.id("loginWithGoogle"));
    }

    async getTotalPriceOfCartButton() {
        await this.driver.wait(until.elementLocated(By.id('totalPrice')), 10000);
        return await this.driver.findElement(By.id("totalPrice"));
    }

    async getAllEntriesOfProductList() {
        await   this.driver.wait(until.elementLocated(By.id('entryquantity')), 10000);
        return await this.driver.findElements(By.id("entryquantity"))
    }

    async getAllAddToCartButtons() {
        await this.driver.wait(until.elementLocated(By.id('addtocartbutton')), 10000);
        return await this.driver.findElements(By.id("addtocartbutton"))
    }

    async getAccountMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('accountMenu')), 100000);
        return await this.driver.findElement(By.id("accountMenu"));
    }

    async getStoreMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('storeMenu')), 10000);
        return await this.driver.findElement(By.id("storeMenu"));
    }

    async getProfileMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('profileMenu')), 10000);
        return await this.driver.findElement(By.id("profileMenu"));
    }

    async getInventoryMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('inventoryMenu')), 10000);
        return await this.driver.findElement(By.id("inventoryMenu"));
    }

    async getOrdersTable() {
        await this.driver.wait(until.elementLocated(By.css('tr.MuiTableRow-root.css-34nofg-MuiTableRow-root')), 10000);
        return await this.driver.findElements(By.css('tr.MuiTableRow-root.css-34nofg-MuiTableRow-root'));
    }

    async getBackToStoreButton() {
        await this.driver.wait(until.elementLocated(By.id('backToStoreButton')), 10000);
        return await this.driver.findElement(By.id("backToStoreButton"));
    }

    async getCreatePaymentMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('createPaymentMenu')), 10000);
        return await this.driver.findElement(By.id("createPaymentMenu"));
    }

    async getCustomerOrdersMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('customerOrdersMenu')), 10000);
        return await this.driver.findElement(By.id("customerOrdersMenu"));
    }

    async getHamburgerAdminButton() {
        await this.driver.wait(until.elementLocated(By.id('hamburgerAdmin')), 10000);
        return await this.driver.findElement(By.id("hamburgerAdmin"));
    }

    async getAdminMenuButton() {
        await   this.driver.wait(until.elementLocated(By.id('adminMenu')), 10000);
        return await this.driver.findElement(By.id("adminMenu"));
    }

    async getMyOrdersMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('myOrdersMenu')), 10000);
        return await this.driver.findElement(By.id("myOrdersMenu"));
    }

    async getAccountStatementMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('accountStatementMenu')), 10000);
        return await this.driver.findElement(By.id("accountStatementMenu"));
    }

    async getLogoutMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('logoutMenu')), 10000);
        return await this.driver.findElement(By.id("logoutMenu"));
    }

    async getSettingsMenuButton() {
        await this.driver.wait(until.elementLocated(By.id('settingsMenu')), 10000);
        return await this.driver.findElement(By.id("settingsMenu"));
    }

    async getCartOpenButton() {
        await this.driver.wait(until.elementLocated(By.id('opencartbutton')), 10000);
        return await this.driver.findElement(By.id("opencartbutton"));
    }

    async getAddToCartIncrementButton() {
        await this.driver.wait(until.elementLocated(By.id('addToCartIncrement')), 10000);
        return await this.driver.findElements(By.id("addToCartIncrement"));
    }

    async getRemoveFromCartDecrementButton() {
        await this.driver.wait(until.elementLocated(By.id('addToCartDecrement')), 10000);
        return await this.driver.findElements(By.id("addToCartDecrement"));
    }

    async getClearCartButton() {
        await this.driver.wait(until.elementLocated(By.id('clearCartButton')), 10000);
        return await this.driver.findElement(By.id("clearCartButton"));
    }

    async getCloseCartButton() {
        await this.driver.wait(until.elementLocated(By.id('closeCartButton')), 10000);
        return await this.driver.findElement(By.id("closeCartButton"));
    }

    async getCartCheckoutButton() {
        await this.driver.wait(until.elementLocated(By.id('cartcheckoutbutton')), 10000);
        return await this.driver.findElement(By.id("cartcheckoutbutton"));
    }

    async getAddressEntry() {
        await this.driver.wait(until.elementLocated(By.id('addressEntry')), 10000);
        return await this.driver.findElement(By.id("addressEntry"));
    }

    async getContactNumberEntry() {
        await this.driver.wait(until.elementLocated(By.id('contactNumberEntry')), 10000);
        return await this.driver.findElement(By.id("contactNumberEntry"));
    }

    async getContactNameEntry() {
        await this.driver.wait(until.elementLocated(By.id('contactNameEntry')), 10000);
        return await this.driver.findElement(By.id("contactNameEntry"));
    }

    async getPlaceOrderButton() {
        await this.driver.wait(until.elementLocated(By.id('placeorderbutton')), 10000);
        return await this.driver.findElement(By.id("placeorderbutton"));
    }

    async getCustomerNamePaymentEntry() {
        await this.driver.wait(until.elementLocated(By.id('customerNamePayment')), 10000);
        return await this.driver.findElement(By.id("customerNamePayment"));
    }

    async getAmountPaymentEntry() {
        await this.driver.wait(until.elementLocated(By.id('amountPayment')), 10000);
        return await this.driver.findElement(By.id("amountPayment"));
    }

    async getReferencePaymentEntry() {
        await this.driver.wait(until.elementLocated(By.id('referencePayment')), 10000);
        return await this.driver.findElement(By.id("referencePayment"));
    }

    async getPaymentProviderPaymentEntry() {
        await this.driver.wait(until.elementLocated(By.id('paymentProviderPayment')), 10000);
        return await this.driver.findElement(By.id("paymentProviderPayment"));
    }

    async getCreatePaymentButton() {
        await this.driver.wait(until.elementLocated(By.id('createPaymentButton')), 10000);
        return await this.driver.findElement(By.id("createPaymentButton"));
    }

    async getSelectSavedAddressButton() {
        await this.driver.wait(until.elementLocated(By.id('selectFromSavedAddressButton')), 10000);
        return await this.driver.findElement(By.id("selectFromSavedAddressButton"));
    }

    async getSelectFromSavedContactsButton() {
        await this.driver.wait(until.elementLocated(By.id('selectFromSavedContactsButton')), 10000);
        return await this.driver.findElement(By.id("selectFromSavedContactsButton"));
    }

    async getSavedAddressButton() {
        await this.driver.wait(until.elementLocated(By.id('savedAddressButton')), 10000);
        return await this.driver.findElements(By.id("savedAddressButton"));
    }

    async getSavedContactButton() {
        await this.driver.wait(until.elementLocated(By.id('savedContactButton')), 10000);
        return await this.driver.findElements(By.id("savedContactButton"));
    }

    async getCloseModalButton() {
        await this.driver.wait(until.elementLocated(By.id('closeModalButton')), 10000);
        return await this.driver.findElement(By.id("closeModalButton"));
    }

    async getMayPaymentOption() {
        await this.driver.wait(until.elementLocated(By.id('mayaPaymentOption')), 10000);
        return await this.driver.findElement(By.id("mayaPaymentOption"));
    }

    async getMayaTotalAmountText() {
        await this.driver.wait(until.elementLocated(By.className('order-summary-total__total-amount--value')), 200000);
        return await this.driver.findElement(By.className('order-summary-total__total-amount--value'))
    }

    async getitemsTotalText() {
        await this.driver.wait(until.elementLocated(By.id('itemsTotal')), 10000);
        return await this.driver.findElement(By.id('itemsTotal'))
    }
    
}

export default seleniumElements;