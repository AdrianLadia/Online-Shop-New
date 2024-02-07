class menuRules {
    constructor(userRole) {
        this.rules = {
            companyDashboard: ['admin','superAdmin'],
            addItem: ['superAdmin'],
            editItem: ['superAdmin'],
            inventory: ['admin','superAdmin','delivery'],
            createPayment: ['superAdmin'],
            voidPayment: ['superAdmin'],
            orders: ['delivery','admin','superAdmin'],
            itemAnalytics: ['admin','superAdmin'],
            customerAnalytics: ['admin','superAdmin'],
            adminChat: ['admin','superAdmin'],
            affiliateClaimRequest: ['superAdmin'],
            delivery: ['delivery','driver','admin','superAdmin'],
            editCustomerOrders: ['superAdmin'],
            customerAccount: ['superAdmin'],
        }
        this.redirectPage = {
            admin : 'companyDashboard',
            superAdmin : 'companyDashboard',
            delivery : 'orders',
            driver : 'delivery',
        }
        this.userRole = userRole;
    }

    checkIfUserAuthorized(menuName) {
        return this.rules[menuName].includes(this.userRole);
    }

    getAdminRedirectPage() {
        return this.redirectPage[this.userRole];
    }


}

export default menuRules;
