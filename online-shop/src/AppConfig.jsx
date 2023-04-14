import { FaLaptopHouse } from "react-icons/fa"

class AppConfig {
    constructor() {
        this.isDevEnvironment = true
    }

    getIsDevEnvironment() {
        return this.isDevEnvironment
    }
}

export default AppConfig