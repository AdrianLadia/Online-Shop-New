import { FaLaptopHouse } from "react-icons/fa"

class AppConfig {
    constructor() {
        this.isDevEnvironment = false
        this.isPaymentSandBox = false
    }

    getIsDevEnvironment() {
        return this.isDevEnvironment
    }

    getIsPaymentSandBox() {
        return this.isPaymentSandBox
    }
}

export default AppConfig