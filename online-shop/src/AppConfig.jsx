import { FaLaptopHouse } from "react-icons/fa"

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