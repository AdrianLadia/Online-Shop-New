import serviceAreas from "../src/data/serviceAreas";
import lalamoveDeliveryVehicles from "../src/data/lalamoveDeliveryVehicles";

class businessCalculations {
  constructor() {
    this.serviceareas = new serviceAreas();
    this.lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
  }

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
  
  getLocationsInPoint(latitude,longitude) {
    function isPointInPolygon(point, polygon) {
      let x = point[0],
        y = point[1];
      let inside = false;
  
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
          yi = polygon[i][1];
        let xj = polygon[j][0],
          yj = polygon[j][1];
  
        let intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
  
      return inside;
    }
    
    const locations = [
      [this.serviceareas.lalamoveServiceArea, "lalamoveServiceArea"],
      [this.serviceareas.iloiloArea, "iloiloArea"],
      [this.serviceareas.leyteMaasinArea, "leyteMaasinArea"],
      [this.serviceareas.cagayanDeOroArea, "cagayanDeOroArea"],
      [this.serviceareas.surigaoArea, "surigaoArea"],
      [this.serviceareas.butuanArea, "butuanArea"],
      [this.serviceareas.dapitanArea, "dapitanArea"],
      [this.serviceareas.zamboangaArea, "zamboangaArea"],
      [this.serviceareas.pagadianArea, "pagadianArea"],
      [this.serviceareas.davaoArea, "davaoArea"],
      [this.serviceareas.generalSantosArea, "generalSantosArea"],
      [this.serviceareas.bacolodArea, "bacolodArea"],
      [this.serviceareas.dumagueteArea, "dumagueteArea"],
      [this.serviceareas.boholArea, "boholArea"],
      [this.serviceareas.masbateArea, "masbateArea"],
      [this.serviceareas.manilaArea, "manilaArea"],
      [this.serviceareas.samarArea, "samarArea"],
      [this.serviceareas.leytePalomponArea, "leytePalomponArea"],
    ];

    const locationsInDeliveryPoint = [];

    locations.map((location) => {
      const polygon = location[0];
      const name = location[1];
      const result = isPointInPolygon([latitude,longitude], polygon);

      if (result) {
        locationsInDeliveryPoint.push(name);
      }
    });
    console.log("locationsInDeliveryPoint");
    console.log(locationsInDeliveryPoint);
    return locationsInDeliveryPoint;
  }

  checkIfAreasHasLalamoveServiceArea(areas) {
    if (areas.includes("lalamoveServiceArea")) {
      return true;
    }
  }

  getVehicleForDelivery(weightOfItems) {
    if (weightOfItems <= this.lalamovedeliveryvehicles.motorcycle.maxWeight) {
      return this.lalamovedeliveryvehicles.motorcycle;
    }
    if (weightOfItems <= this.lalamovedeliveryvehicles.sedan.maxWeight && weightOfItems > this.lalamovedeliveryvehicles.motorcycle.maxWeight) {
      return this.lalamovedeliveryvehicles.sedan;
    }
    if (weightOfItems <= this.lalamovedeliveryvehicles.mpv.maxWeight && weightOfItems > this.lalamovedeliveryvehicles.sedan.maxWeight) {
      return this.lalamovedeliveryvehicles.mpv;
    }
    if (weightOfItems <= this.lalamovedeliveryvehicles.pickup.maxWeight && weightOfItems > this.lalamovedeliveryvehicles.mpv.maxWeight) {
      return this.lalamovedeliveryvehicles.pickup;
    }
    if (weightOfItems <= this.lalamovedeliveryvehicles.van.maxWeight && weightOfItems > this.lalamovedeliveryvehicles.pickup.maxWeight) {
      return this.lalamovedeliveryvehicles.van;
    }
    if (weightOfItems <= this.lalamovedeliveryvehicles.closedvan.maxWeight && weightOfItems > this.lalamovedeliveryvehicles.van.maxWeight) {
      return this.lalamovedeliveryvehicles.closedvan;
    }
  }

  getDeliveryFee(kilometers, vehicleObject,needAssistance) {
    let finalDelFee = null
    const delFeeWithoutMinimum = Math.round(kilometers * vehicleObject.deliveryFeePerKm)
    if (delFeeWithoutMinimum < vehicleObject.minDelFee) {
      finalDelFee = vehicleObject.minDelFee
    }
    else {
      finalDelFee = delFeeWithoutMinimum
    }
    if (needAssistance) {
      finalDelFee = finalDelFee + vehicleObject.driverAssistsPrice
    }
    return finalDelFee
  }

  

  


}

export default businessCalculations;
