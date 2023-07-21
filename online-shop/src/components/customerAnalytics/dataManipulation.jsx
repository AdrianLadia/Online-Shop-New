class dataManipulation {
  constructor() {}

  getAllCustomers(data) {
    const customers = [];
    Object.keys(data).map((customer) => {
      customers.push(customer);
    });
    return customers;
  }

  getDataOfChosenCustomer(data, chosenCustomer, products) {
    const toReturn = [];
    Object.keys(data).map((customer, index) => {
      if (customer == chosenCustomer) {
        Object.keys(data[customer]).map((itemID, index) => {
          let productID = itemID;
          const salesPerMonth = [];
          let totalSales = 0;
          products.map((product)=>{
            if(product.itemId === itemID){
              productID = product.itemName
            }
          })
          Object.keys(data[customer][itemID]).map((date, index) => {
            const dateString = date.slice(5, 7);
            const yearString = date.slice(0, 4);
            salesPerMonth.push({
              Year: yearString,
              Month: dateString,
              Quantity: data[customer][itemID][date],
              id: index,
            });
            totalSales += data[customer][itemID][date];
          });
          const customerData = {};
          customerData['name'] = productID;
          customerData['sales'] = salesPerMonth;
          customerData['totalSales'] = totalSales;
          customerData['id'] = index;
          toReturn.push(customerData);
        });
      }
    });
    return toReturn;
  }

  filterDataForGraph(data) {
    const toReturn = [];
    // Create a new Date object
    const currentDate = new Date();

    let monthToday = String(currentDate.getMonth() + 1);

    if (monthToday.length == 1) {
      monthToday = '0' + monthToday;
    }

    // Get the year
    const yearToday = String(currentDate.getFullYear());
    Object.keys(data).map((key) => {
      if (key == 'sales') {
        data[key].map((info) => {
          let year = info.Year;
          let month = info.Month;
        //   console.log(month, year);
          let quantity = info.Quantity;
            // console.log('year',year);
            // console.log('yearToday',yearToday)
            // console.log('month',month);
            // console.log('monthToday',monthToday);
            // console.log('-----')
          if (year != yearToday) {
            // console.log(year, yearToday);
            // console.log(month, monthToday);
            toReturn.push([year, month, quantity]);
            return
          }
            if (year == yearToday && month < monthToday) {
                toReturn.push([year, month, quantity]);
            }
        });
      }
    });

    return toReturn;
  }

  fillMissingMonths(array) {
    try{
      const filledArray = [];

      const startYear = parseInt(array[0].slice(0, 4), 10);
      const startMonth = parseInt(array[0].slice(4), 10);
    
      for (let year = startYear; year <= parseInt(array[array.length - 1].slice(0, 4), 10); year++) {
        const endMonth = (year === parseInt(array[array.length - 1].slice(0, 4), 10)) ? parseInt(array[array.length - 1].slice(4), 10) : 12;
        const monthStart = (year === startYear) ? startMonth : 1;
    
        for (let month = monthStart; month <= endMonth; month++) {
          const filledMonth = month.toString().padStart(2, '0');
          filledArray.push(`${year}${filledMonth}`);
        }
      }
    
      return filledArray;
    }catch(e){
      // console.log(e)
    }
  }

  appRemovePacksFromProducts(products) {
    return products.filter((product) => product.unit !== 'Pack');
  }
}

export default dataManipulation;
