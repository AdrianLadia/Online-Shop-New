

class AppConfig {
    constructor() {
        this.isDevEnvironment = true
        this.isPaymentSandBox = true
        this.noVat = false
        this.retailSafetyStock = 2
        this.freeDeliveryThreshold = 10000
        this.featuredCategory = 'Meal Box'
    }

    getFeaturedCategory() {
        return this.featuredCategory
    }

    getFreeDeliveryThreshold() {
        return this.freeDeliveryThreshold
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