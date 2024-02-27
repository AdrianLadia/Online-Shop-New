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
    if (this.userRole == 'cousin') {
        console.log('cousin',this.userPrices)
        this.getCousinPrice()
        this.getUserSpecialPrices()
        return
    }
    if (this.userRole == 'distributor') {
        this.getDistributorPrice()  
        this.getUserSpecialPrices()
        return 
    }
    if (this.userPrices != null) {
        if (Object.keys(this.userPrices).length > 0) {
            this.getUserSpecialPrices()
            return
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

        const distributorPrice = this.distributorPrice[product.itemId]

        product.price = distributorPrice ? parseFloat(distributorPrice) : product.price
    })

    this.finalData = copyOfProducts
  }

  getCousinPrice() {
    const percentDiscountFromDistributorPrice = 3
    function roundUpToNearest5(number) {
      return Math.ceil(number / 5) * 5;
    }
    const copyOfProducts = [...this.products]
    
    copyOfProducts.forEach(product => {

        const distributorPrice = this.distributorPrice[product.itemId] 

        product.price = distributorPrice ? parseFloat(distributorPrice) : product.price
        product.price = roundUpToNearest5(product.price * (1 - percentDiscountFromDistributorPrice / 100))
    })

    this.finalData = copyOfProducts
  }
}

export default productsPriceHandler