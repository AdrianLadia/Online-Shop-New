// import firebase from 'firebase/app';
// import 'firebase/firestore';
import { format, utcToZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';

class dataManipulation {
  constructor() {}

  convertDateToNanoSecondsAndSeconds(dateObject) {
    const date = new Date(dateObject);
    const nanoseconds = (date.getTime() % 1000) * 1000000;
    const seconds = Math.floor(date.getTime() / 1000);
    const result = { nanoseconds: nanoseconds, seconds: seconds };
    return result;
  }

  accountStatementData(orders, payments, forTesting = false) {
    const data = [];

    if (orders) {
      orders.map((order) => {
        let newObject = { ...order };
        let value = newObject['orderDate'];
        delete newObject['orderDate'];
        newObject['date'] = value;
        data.push(newObject);
      });
    }

    if (payments) {
      payments.map((payment) => {
        data.push(payment);
      });
    }

    data.sort((a, b) => {
      if (forTesting) {
        return b.date - a.date;
      } else {
        return b.date.toDate() - a.date.toDate();
      }
    });

    data.reverse();

    const dataToUse = [];
    data.map((item) => {
      if (item.paymentprovider) {
        const dataToPush = [item.date, item.paymentprovider + ' ' + item.reference, '', parseFloat(item.amount)];
        dataToUse.push(dataToPush);
      } else {
        dataToUse.push([item.date, item.reference, item.grandTotal, '']);
      }
    });

    let runningBalance = 0;
    dataToUse.map((item) => {
      runningBalance += item[2];
      runningBalance -= item[3];
      item.push(Math.round(runningBalance * 100) / 100);
      if (runningBalance > 0) {
        item.push('red');
      } else {
        item.push('green');
      }
    });

    if (forTesting) {
      dataToUse.map((item) => {
        item[0] = this.convertDateToNanoSecondsAndSeconds(item[0]);
      });
    }

    return dataToUse;
  }
  accountStatementTable(tableData, forTesting = false) {
    function createData(date, reference, credit, debit, runningBalance, color) {
      return { date, reference, credit, debit, runningBalance, color };
    }
    const rowsdata = [];
    tableData.map((item) => {
      let date = null;
      if (forTesting) {
        const parsed = parseISO(item[0]);
        date = format(parsed, 'M/d/yyyy');
      } else {
        date = item[0].toDate().toLocaleDateString();
      }

      rowsdata.push(createData(date, item[1], item[2], item[3], item[4], item[5]));
    });
    return rowsdata;
  }
  getOrderFromReference(referencenumber, orders, forTesting = false) {
    let orderfiltered = null;
    orders.map((order) => {
      if (order.reference === referencenumber) {
        orderfiltered = order;
      }
    });

    if (forTesting) {
      orderfiltered['orderDate'] = this.convertDateToNanoSecondsAndSeconds(orderfiltered['orderDate']);
    }

    return orderfiltered;
  }

  getAllCustomerNamesFromUsers(users) {
    const customers = [];
    users.map((user) => {
      customers.push(user.name);
    });
    return customers;
  }

  getUserUidFromUsers(users, selectedName) {
    const user = users.find((user) => user.name === selectedName);
    if (user) {
      return user.uid;
    }
    return undefined;
  }

  filterOrders(orders, startDate, referenceNumber, delivered, paid, selectedName) {
    let filterPaid = null;
    let filterUnpaid = null;
    let filterName = null;
    let filterDate = null;
    if (paid === true) {
      filterPaid = true;
    }
    if (paid === false) {
      filterUnpaid = true;
    }
    if (selectedName !== '') {
      filterName = true;
    } else {
      filterName = false;
    }
    if (startDate !== '') {
      filterDate = true;
    } else {
      filterDate = false;
    }

    const dataFilteredByDate = [];
    // FILTER BY DATE
    orders.map((order) => {
      if (filterDate === true) {
        if (order.orderDate.toDate().toLocaleDateString() === startDate.toLocaleDateString()) {
          dataFilteredByDate.push(order);
        }
      } else {
        dataFilteredByDate.push(order);
      }
    });

    const dataFilteredByName = [];
    dataFilteredByDate.map((order) => {
      if (filterName === true) {
        if (order.userName === selectedName) {
          dataFilteredByName.push(order);
        }
      } else {
        dataFilteredByName.push(order);
      }
    });

    const dataFilteredByDelivered = [];
    dataFilteredByName.map((order) => {
      if (delivered === true) {
        if (order.delivered === true) {
          dataFilteredByDelivered.push(order);
        }
      }
      if (delivered === false) {
        if (order.delivered === false) {
          dataFilteredByDelivered.push(order);
        }
      }
      if (delivered === null) {
        dataFilteredByDelivered.push(order);
      }
    });

    const dataFilteredByPaid = [];
    dataFilteredByDelivered.map((order) => {
      if (paid === true) {
        if (order.paid === true) {
          dataFilteredByPaid.push(order);
        }
      }
      if (paid === false) {
        if (order.paid === false) {
          dataFilteredByPaid.push(order);
        }
      }
      if (paid === null) {
        dataFilteredByPaid.push(order);
      }
    });
    return dataFilteredByPaid;
  }

  getCategoryList(categories) {
    const c = ['Favorites'];
    categories.map((category) => {
      c.push(category.category);
    });
    return c;
  }

  getCheckoutPageTableDate(product_list, cart) {
    function createData(itemimage, itemName, itemquantity, itemprice, itemtotal, weighttotal) {
      return { itemimage, itemName, itemquantity, itemprice, itemtotal, weighttotal };
    }

    let rows_non_state = [];
    let total_non_state = 0;
    let total_weight_non_state = 0;
    const items = [...new Set(cart)];
    let item_count = {};
    items.map((item, index) => {
      item_count[item] = 0;
    });

    cart.map((item, index) => {
      item_count[item] += 1;
    });

    Object.entries(item_count).map(([key, quantity]) => {
      product_list.map((product) => {
        if (product.itemId === key) {
          total_weight_non_state += product.weight * quantity;
          total_non_state += product.price * quantity;

          let row = createData(
            product.imageLinks[0],
            product.itemName,
            quantity.toLocaleString(),
            parseInt(product.price).toLocaleString(),
            (product.price * quantity).toLocaleString(),
            total_weight_non_state
          );
          rows_non_state.push(row);
        }
      });
    });

    return [rows_non_state, total_non_state, total_weight_non_state];
  }

  manipulateCartData(cart) {
    //get unique items of array
    function set(arr) {
      return [...new Set(arr)];
    }

    let unique_items = set(cart);

    let cart_data = [];
    unique_items.map((item, index) => {
      cart_data.push({ itemId: item, quantity: 0 });
    });

    cart_data.map((item, index) => {
      cart.map((cart_item, index) => {
        if (item.itemId === cart_item) {
          item.quantity += 1;
        }
      });
    });
    console.log(cart_data);
    return cart_data;
  }

  getAllProductsInCategory(products, categorySelected,wholesale,retail,favorites) {
    if (categorySelected === 'Favorites') {
      let selected_products = [];
      products.map((product) => {
        if (favorites.includes(product.itemId)) {
          selected_products.push(product);
        }
      });
      return selected_products;
    }

    let selected_products_by_category = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].category === categorySelected) {
        selected_products_by_category.push(products[i]);
      }
    }

    let selected_products = [];
    if (wholesale) {
      selected_products_by_category.map((product) => {
        if (product.unit !== 'Pack') {
          selected_products.push(product);
        }
      });
    }

    if (retail) {
      selected_products_by_category.map((product) => {
        if (product.unit === 'Pack') {
          selected_products.push(product);
        }
      });
    }

    return selected_products;
  }


  // convertTimestampToFirebaseTimestamp(timestamp) {
  //   const date = new Date(timestamp.seconds * 1000);
  //   date.setMilliseconds(timestamp.nanoseconds / 1000000);
  //   const firebaseTimeStamp = firebase.firestore.Timestamp.fromDate(date);
  //   return firebaseTimeStamp;
  // }
}

export default dataManipulation;
