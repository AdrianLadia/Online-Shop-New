

class AppConfig {
    constructor() {
        this.isDevEnvironment = false
        this.isPaymentSandBox = true
        this.noVat = true
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
}

export default AppConfig