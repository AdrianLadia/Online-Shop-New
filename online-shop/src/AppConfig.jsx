

class AppConfig {
    constructor() {
        this.isDevEnvironment = false
        this.isPaymentSandBox = true
        this.noVat = true
        this.retailSafetyStock = 2
    }

    getIsDevEnvironment() {
        return this.isDevEnvironment
    }

    getIsPaymentSandBox() {
        return this.isPaymentSandBox
    }

    getNoVat() {
        return this.noVat
    }

    getRetailSafetyStock() {
        return this.retailSafetyStock
    }
}

export default AppConfig