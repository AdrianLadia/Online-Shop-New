const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('chromedriver');


class seleniumElements {
    constructor() {
        this.driver = new Builder().forBrowser('chrome').build();    
        
    }

    async getCheckoutItemsTotal() {
        return await this.driver.findElement(By.id("checkoutItemsTotal"));
    }

    async getAutoGenerateUserButton() {
        return await this.driver.findElement(By.id("autogen-button"));
    }

    async getSignInWithGoogleButton() {
        return await this.driver.findElement(By.id("sign-in"));
    }

    async getEmailInputGoogleNewUser() {
        return await this.driver.findElement(By.id("email-input"));
    }

    async getDisplayNameInputGoogleNewUser() {
        return await this.driver.findElement(By.id("display-name-input"));
    }

    async getAddAccountButton() {
        return await this.driver.findElement(By.id("add-account-button"));
    }

    async getLoginGuestButton() {
        return await this.driver.findElement(By.id("loginGuest"));
    }

    async getLoginButtonUserAccount() {
        return await this.driver.findElement(By.id("reuse-email"));
    }

  
    async getApp() {
        return await this.driver.findElement(By.id("app"));
    }

    async getLoginButton() {
        return await this.driver.findElement(By.id("loginButton"));
    }

    async getLoginWithGoogle() {
        return await this.driver.findElement(By.id("loginWithGoogle"));
    }

    async getTotalPriceOfCartButton() {
        return await this.driver.findElement(By.id("totalPrice"));
    }

    async getAllEntriesOfProductList() {
        return await this.driver.findElements(By.id("entryquantity"))
    }

    async getAllAddToCartButtons() {
        return await this.driver.findElements(By.id("addtocartbutton"))
    }

    async getAccountMenuButton() {
        return await this.driver.findElement(By.id("accountMenu"));
    }

    async getStoreMenuButton() {
        return await this.driver.findElement(By.id("storeMenu"));
    }

    async getProfileMenuButton() {
        return await this.driver.findElement(By.id("profileMenu"));
    }

    async getMyOrdersMenuButton() {
        return await this.driver.findElement(By.id("myOrdersMenu"));
    }

    async getAccountStatementMenuButton() {
        return await this.driver.findElement(By.id("accountStatementMenu"));
    }

    async getLogoutMenuButton() {
        return await this.driver.findElement(By.id("logoutMenu"));
    }

    async getSettingsMenuButton() {
        return await this.driver.findElement(By.id("settingsMenu"));
    }

    async getCartOpenButton() {
        return await this.driver.findElement(By.id("opencartbutton"));
    }

    async getAddToCartIncrementButton() {
        return await this.driver.findElements(By.id("addToCartIncrement"));
    }

    async getRemoveFromCartDecrementButton() {
        return await this.driver.findElements(By.id("addToCartDecrement"));
    }

    async getClearCartButton() {
        return await this.driver.findElement(By.id("clearCartButton"));
    }

    async getCloseCartButton() {
        return await this.driver.findElement(By.id("closeCartButton"));
    }

    async getCartCheckoutButton() {
        return await this.driver.findElement(By.id("cartcheckoutbutton"));
    }

    async getAddressEntry() {
        return await this.driver.findElement(By.id("addressEntry"));
    }

    async getContactNumberEntry() {
        return await this.driver.findElement(By.id("contactNumberEntry"));
    }

    async getContactNameEntry() {
        return await this.driver.findElement(By.id("contactNameEntry"));
    }

    async getPlaceOrderButton() {
        return await this.driver.findElement(By.id("placeorderbutton"));
    }

}

export default seleniumElements;