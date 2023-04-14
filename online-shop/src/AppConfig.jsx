class AppConfig {
    constructor() {
        this.developmentEnvironment = true
    }
    getEnvironment() {
        return this.developmentEnvironment;
    }
}

export default AppConfig;