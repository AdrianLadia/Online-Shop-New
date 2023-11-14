class productsPriceHandler {
  constructor(products,userPrices,userRole) {
    this.products = products;
    this.userRole = userRole
    // this.userPrices = userPrices
    this.userPrices = {
        'PPB#1' : 1000
    }
    this.distributorPrices = {
        'PPB#1' : 900,
        'PPB#2' : 800,
        'PPB#3' : 700,
        'PPB#4' : 600,
    }
    this.finalData = this.products
  }

  runMain() {
    // if user is distributor
    if (this.userRole == 'distributor') {
        this.getDistributorPrice()   
    }
    if (this.userPrices != null) {
        if (this.userPrices.length > 0) {
            this.getUserSpecialPrices()
        }
    }
  }

  getUserSpecialPrices() {
    Object.keys(this.userPrices).forEach(userPrice => {
        this.finalData.forEach(product => {
            product.price = this.userPrices[userPrice]
        })
    })
  }

  getDistributorPrice() {
    const copyOfProducts = [...this.products]
    copyOfProducts.forEach(product => {
        product.price = this.products.distributorPrice
    })
    console.log('copyOfProducts',copyOfProducts)
    this.finalData = copyOfProducts
  }
}

export default productsPriceHandler