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

  getLatitudeDifferenceOfPaperboyAndSelectedLocation(paperboylatitude, selectedlatitudem) {
    return Math.abs(paperboylatitude - selectedlatitudem)
  }

  getLongitudeDifferenceOfPaperboyAndSelectedLocation(paperboylongitude, selectedlongitudem) {
    return Math.abs(paperboylongitude - selectedlongitudem)
  }

  getTotalDifferenceOfPaperboyAndSelectedLocation(paperboylatitude, paperboylongitude, selectedlatitudem, selectedlongitudem) {
    const latdifference = this.getLatitudeDifferenceOfPaperboyAndSelectedLocation(paperboylatitude, selectedlatitudem)
    const longdifference = this.getLongitudeDifferenceOfPaperboyAndSelectedLocation(paperboylongitude, selectedlongitudem)
    return latdifference + longdifference
  }

  convertTotalDifferenceToKilometers(totaldifference) {
    return totaldifference * 111.1
  }
}

export default businessCalculations;
