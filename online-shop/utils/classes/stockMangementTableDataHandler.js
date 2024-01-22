//   headerName: 'Item Name',

//   headerName: 'Stocks Available',

//   headerName: 'Suggested Stocks',

//   headerName: 'Inventory Level',

class stockManagementTableDataHandler {
  constructor(productsList, itemAverageSalesPerDayData) {
    this.productsList = productsList;
    this.itemAverageSalesPerDayData = itemAverageSalesPerDayData;
    this.maxStockLevelInDays = 90;
  }

  createData(itemName, stocksAvailable, suggestedStocks, inventoryLevel) {
    return { itemName, stocksAvailable, suggestedStocks, inventoryLevel };
  }

  runMain() {
    tableData = [];
    this.productsList.forEach((product) => {
      const itemName = product.itemName;
      const itemId = product.itemId;
      const unit = product.unit;
      const stocksAvailable = product.stocksAvailable;
      const averageSalesPerDay = this.itemAverageSalesPerDayData[itemId]['average'];
      const suggestedStocks = averageSalesPerDay * this.maxStockLevelInDays;
      const inventoryLevel = (suggestedStocks / stocksAvailable) * 100;
      const data = this.createData(itemName,unit, stocksAvailable, suggestedStocks, inventoryLevel);
      tableData.push(data);
    });
    console.log(tableData);
  }

}

export default stockManagementTableDataHandler;
