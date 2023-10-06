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
          products.map((product) => {
            if (product.itemId === itemID) {
              productID = product.itemName;
            }
          });
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
    function getFirstAndLast(data) {
      data.sort((a, b) => {
        const dateA = new Date(a.Year, a.Month - 1); // Months are 0-indexed in JavaScript's Date object
        const dateB = new Date(b.Year, b.Month - 1);

        return dateA - dateB;
      });

      const firstDate = new Date(data[0].Year, data[0].Month - 1);
      const lastDate = new Date(data[data.length - 1].Year, data[data.length - 1].Month - 1);

      return {
        First: firstDate,
        Last: lastDate,
      };
    }

    function getDatesBetween(dates) {
      const { First: startDate, Last: endDate } = dates;
      const dateArray = {};

      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const key = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
        dateArray[key] = 0; // Default value set to 0
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return dateArray;
    }

    // Create a new Date object
    const currentDate = new Date();

    let monthToday = String(currentDate.getMonth() + 1);

    if (monthToday.length == 1) {
      monthToday = '0' + monthToday;
    }

    const sales = data.sales;
    // console.log(data.sales);

    const firstAndLast = getFirstAndLast(sales);
    const datesBetween = getDatesBetween(firstAndLast);
    // console.log(datesBetween);
    const toProcessObject = {};

    sales.forEach((sale) => {
      const year = sale.Year;
      const month = sale.Month;
      const quantity = sale.Quantity;

      // try{
      datesBetween[year + '-' + month] += quantity;
      // }
      // catch (error){

      // }
    });

    const toFilter = [];
    Object.keys(datesBetween).forEach((key) => {
      const year = key.slice(0, 4);
      const month = key.slice(5, 7);
      const quantity = datesBetween[key];
      toFilter.push([year, month, quantity]);
    });

    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');

    const toReturn = toFilter.filter(([year, month, _]) => year !== currentYear || month !== currentMonth);

    console.log(toReturn);
    // ['2022','09',100]
    return toReturn;
  }

  fillMissingMonths(array) {
    try {
      const filledArray = [];

      const startYear = parseInt(array[0].slice(0, 4), 10);
      const startMonth = parseInt(array[0].slice(4), 10);

      for (let year = startYear; year <= parseInt(array[array.length - 1].slice(0, 4), 10); year++) {
        const endMonth =
          year === parseInt(array[array.length - 1].slice(0, 4), 10)
            ? parseInt(array[array.length - 1].slice(4), 10)
            : 12;
        const monthStart = year === startYear ? startMonth : 1;

        for (let month = monthStart; month <= endMonth; month++) {
          const filledMonth = month.toString().padStart(2, '0');
          filledArray.push(`${year}${filledMonth}`);
        }
      }

      return filledArray;
    } catch (e) {
      // console.log(e)
    }
  }

  appRemovePacksFromProducts(products) {
    return products.filter((product) => product.unit !== 'Pack');
  }
}

export default dataManipulation;
