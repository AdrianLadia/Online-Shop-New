class productsPriceHandler {
  constructor(products,userPrices,userRole) {
    this.products = products;
    this.userRole = userRole
    // this.userPrices = userPrices
    this.userPrices = {
        'PPB#1' : 1000
    }
    
    this.distributorPrice = {}

    this.products.map(product => {
      console.log(product)
      const itemId = product.itemId;
      const distributorPrice = product.distributorPrice;
      this.distributorPrice[itemId] = distributorPrice;
    })

    console.log('distributorPrice',this.distributorPrice)
    
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
        const distributorPrice = this.distributorPrice[product.itemId]

        product.price = distributorPrice ? distributorPrice : product.price
    })
    console.log('copyOfProducts',copyOfProducts)
    this.finalData = copyOfProducts
  }
}

export default productsPriceHandler