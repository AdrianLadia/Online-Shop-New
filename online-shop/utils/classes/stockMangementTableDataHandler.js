//   headerName: 'Item Name',

//   headerName: 'Stocks Available',

//   headerName: 'Suggested Stocks',

//   headerName: 'Inventory Level',

class stockManagementTableDataHandler {
  constructor(productsList, itemAverageSalesPerDayData, hideSlowMovingItems, fastMovingItemThreshold) {
    this.productsList = productsList;
    this.hideSlowMovingItems = hideSlowMovingItems;
    this.itemAverageSalesPerDayData = itemAverageSalesPerDayData;
    this.maxStockLevelInDays = 60;
    this.minimumPiecesWholesale = 2000;
    this.fastMovingItemThreshold = fastMovingItemThreshold; //Sales per day of fast moving items
  }

  createDataWholesale(id, itemName, stocksAvailable, suggestedStocks, inventoryLevel) {
    return { id, itemName, stocksAvailable, suggestedStocks, inventoryLevel };
  }

  createDataRetail(id, itemName, stocksAvailable, packsPerBox, inventoryLevel) {
    return { id, itemName, stocksAvailable, packsPerBox, inventoryLevel };
  }

  getMinimumQuantity(piecesPerBox) {
    const x = this.minimumPiecesWholesale / piecesPerBox;
    const roundUp = Math.ceil(x);
    return roundUp;
  }

  getInventoryLevelWholesale(suggestedStocks, stocksAvailable) {
    if (stocksAvailable === 0) {
      return 0;
    }

    const inventoryLevel = (stocksAvailable / suggestedStocks) * 100;
    const roundedInventoryLevel = Math.round(inventoryLevel);
    return roundedInventoryLevel;
  }

  getInventoryLevelRetail(packsPerBox, stocksAvailable) {
    const inventoryLevel = (stocksAvailable / packsPerBox) * 100;
    const roundedInventoryLevel = Math.round(inventoryLevel);
    return roundedInventoryLevel;
  }

  ifStocksAvailableIsNegative(stocksAvailable) {
    if (stocksAvailable < 0) {
      return 0;
    }
    return stocksAvailable;
  }

  filterIfSlowMovingItem(averageSalesPerDay) {
    if (this.hideSlowMovingItems && averageSalesPerDay < this.fastMovingItemThreshold) {
      return true;
    }
    return false;
  }

  getWholesaleData() {
    const tableData = [];
    this.productsList.forEach((product) => {
      const itemName = product.itemName;
      const itemId = product.itemId;
      const unit = product.unit;
      const itemData = this.itemAverageSalesPerDayData[itemId];
      const averageSalesPerDay = itemData ? itemData.average : 0;

      if (this.filterIfSlowMovingItem(averageSalesPerDay) == false) {
        if (unit != 'Pack') {
          const stocksAvailable = this.ifStocksAvailableIsNegative(product.stocksAvailable);
          const piecesPerBox = product.piecesPerBox;

          let suggestedStocks = Math.ceil(averageSalesPerDay * this.maxStockLevelInDays);
          if (suggestedStocks * piecesPerBox < this.minimumPiecesWholesale) {
            suggestedStocks = this.getMinimumQuantity(piecesPerBox);
          }

          const inventoryLevel = this.getInventoryLevelWholesale(suggestedStocks, stocksAvailable);
          // console.log(itemId,suggestedStocks,inventoryLevel)
          const data = this.createDataWholesale(itemId, itemName, stocksAvailable, suggestedStocks, inventoryLevel);
          tableData.push(data);
        }
      }
      // console.log(data);
    });

    return tableData;
  }

  getRetailData() {
    const tableData = [];
    const packsPerBoxList = {};
    this.productsList.forEach((product) => {
      if (product.unit != 'Pack') {
        packsPerBoxList[product.itemId + '-RET'] = product.packsPerBox;
      }
    });
    this.productsList.forEach((product) => {
      const itemName = product.itemName;
      const itemId = product.itemId;
      const unit = product.unit;
      const forOnlineStore = product.forOnlineStore;
      if (forOnlineStore) {
        if (unit == 'Pack') {

          const stocksAvailable = this.ifStocksAvailableIsNegative(product.stocksAvailable);
          const packsPerBox = packsPerBoxList[itemId];
  
          const inventoryLevel = this.getInventoryLevelRetail(packsPerBox, stocksAvailable);
          const data = this.createDataRetail(itemId, itemName, stocksAvailable, packsPerBox, inventoryLevel);
          tableData.push(data);
        }
      }
    });

    return tableData;
  }
}

export default stockManagementTableDataHandler;
