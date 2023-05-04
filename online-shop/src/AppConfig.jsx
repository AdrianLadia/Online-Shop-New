

class AppConfig {
    constructor() {
        this.isDevEnvironment = true
        this.isPaymentSandBox = true
    }

    getIsDevEnvironment() {
        return this.isDevEnvironment
    }

    getIsPaymentSandBox() {
        return this.isPaymentSandBox
    }
}

export default AppConfig