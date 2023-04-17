class businessLogic {
    constructor(){

    }

    getStocksAvailable(productsData) {
        return productsData.stocksAvailable
    }

    getTotalStocksOnHold(productData) {
        let quantity = 0
        productData.stocksOnHold.map((stocksOnHold) => {
            quantity += stocksOnHold.quantity
        }
        )
        return quantity
    }

    getTotalStocks(productData) {
        return this.getStocksAvailable(productData) + this.getTotalStocksOnHold(productData)
    }
}

export default businessLogic
