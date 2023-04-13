import seleniumElements from "./seleniumElements";

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class seleniumCommands extends seleniumElements {
    constructor() {
        super();
    }

    async startApp() {
        await this.driver.get("http://localhost:5173");
    }    
    
    async login() {
        const loginButton = await this.getLoginButton();
        await loginButton.click();
        const loginWithGoogle = await this.getLoginWithGoogle();
        await loginWithGoogle.click();
        await delay(6000)
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

    async

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
}

export default seleniumCommands;