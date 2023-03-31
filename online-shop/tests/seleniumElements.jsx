const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('chromedriver');


class seleniumElements {
    constructor() {
        this.driver = new Builder().forBrowser('chrome').build();    
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
}

export default seleniumElements;