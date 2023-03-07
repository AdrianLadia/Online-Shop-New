class businessCalculations {
  constructor() {}

  getSafetyStock(averageSalesPerDay) {
    // multiplier is equal to days
    const multiplier = 2;
    return Math.round(averageSalesPerDay) * multiplier;
  }

  getStocksAvailableLessSafetyStock(stocksAvailable, averageSalesPerDay) {
    return stocksAvailable - this.getSafetyStock(averageSalesPerDay);
  }

//Counts the cart and returns an object for example { "itemID": 2, "itemID": 1 }
  getCartCount(cart) {
    const counts = {};
    cart.forEach((str) => {
      counts[str] = counts[str] ? counts[str] + 1 : 1;
    });
    return counts;
  }
}

export default businessCalculations;
