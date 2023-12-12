// if role is member check if user has its own userPrices. userPrices will be the proiority
// if role is distributor use distributor price

class productsPriceHandler {
  constructor(products,userdata) {
    this.products = products;
   
    this.userRole = userdata ? userdata.userRole : 'GUEST'
    // this.userPrices = userPrices
    this.userPrices = userdata ? userdata.userPrices : {}

    
    this.distributorPrice = {}

    this.products.map(product => {
      const itemId = product.itemId;
      const distributorPrice = product.distributorPrice;
      this.distributorPrice[itemId] = distributorPrice;
    })

    this.finalData = this.products
  }


  runMain() {
    // if user is distributor
    if (this.userRole == 'distributor' || this.useDistributorPrice) {
        this.getDistributorPrice()   
    }
    if (this.userPrices != null) {
        if (Object.keys(this.userPrices).length > 0) {
            this.getUserSpecialPrices()
        }
    }
  }

  getUserSpecialPrices() {
    Object.keys(this.userPrices).forEach(itemId => {
      const userPrice = this.userPrices[itemId]
        this.finalData.forEach(product => {
          if (itemId == product.itemId) {
            product.price = parseFloat(userPrice)
          }
        })
    })
  }

  getNormalPrice() {
    this.finalData = this.products
  }

  getDistributorPrice() {
    const copyOfProducts = [...this.products]
    
    copyOfProducts.forEach(product => {
      console.log(product)
        const distributorPrice = this.distributorPrice[product.itemId]

        product.price = distributorPrice ? parseFloat(distributorPrice) : product.price
    })

    this.finalData = copyOfProducts
  }
}

export default productsPriceHandler