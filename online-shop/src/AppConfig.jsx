

class AppConfig {
    constructor() {
        this.isDevEnvironment = true
        this.isPaymentSandBox = true
        this.noVat = false
        this.retailSafetyStock = 0
        this.freeDeliveryThreshold = 200
        this.featuredCategory = 'Meal Box'
        this.firestoreDeveloperEmail = ['ladia.adrian@gmail.com']
        this.minimumOrder = 200
    }

    getMinimumOrder() {
        return this.minimumOrder
    }

    getFirestoreDeveloperEmail() {
        return this.firestoreDeveloperEmail
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