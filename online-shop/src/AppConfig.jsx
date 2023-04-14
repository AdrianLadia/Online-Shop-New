import { FaLaptopHouse } from "react-icons/fa"

class AppConfig {
    constructor() {
        this.isDevEnvironment = false
    }

    getIsDevEnvironment() {
        return this.isDevEnvironment
    }
}

export default AppConfig