// import firebase from 'firebase/app';
// import 'firebase/firestore';
import { format, utcToZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

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
        let value = newObject["orderdate"];
        delete newObject["orderdate"];
        newObject["date"] = value;
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
        const dataToPush = [
          item.date,
          item.paymentprovider + " " + item.reference,
          "",
          parseFloat(item.amount),
        ];
        dataToUse.push(dataToPush);
      } else {
        dataToUse.push([item.date, item.reference, item.grandtotal, ""]);
      }
    });

    let runningBalance = 0;
    dataToUse.map((item) => {
      runningBalance += item[2];
      runningBalance -= item[3];
      item.push(Math.round(runningBalance * 100) / 100);
      if (runningBalance > 0) {
        item.push("red");
      } else {
        item.push("green");
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
        date = format(parsed, "M/d/yyyy");
      } else {
        date = item[0].toDate().toLocaleDateString();
      }

      rowsdata.push(
        createData(date, item[1], item[2], item[3], item[4], item[5])
      );
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
      orderfiltered["orderdate"] = this.convertDateToNanoSecondsAndSeconds(
        orderfiltered["orderdate"]
      );
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

  

  filterOrders(
    orders,
    startDate,
    referenceNumber,
    delivered,
    paid,
    selectedName
  ) {

    
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
    if (selectedName !== "") {
      filterName = true;
    } else {
      filterName = false;
    }
    if (startDate !== "") {
      filterDate = true;
    } else {
      filterDate = false;
    }

    const dataFilteredByDate = [];
    // FILTER BY DATE
    orders.map((order) => {
      if (filterDate === true) {
        if (
          order.orderdate.toDate().toLocaleDateString() ===
          startDate.toLocaleDateString()
        ) {
          dataFilteredByDate.push(order);
        }
      } else {
        dataFilteredByDate.push(order);
      }
    });


    const dataFilteredByName = [];
    dataFilteredByDate.map((order) => {
      if (filterName === true) {
        if (order.username === selectedName) {
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

  // convertTimestampToFirebaseTimestamp(timestamp) {
  //   const date = new Date(timestamp.seconds * 1000);
  //   date.setMilliseconds(timestamp.nanoseconds / 1000000);
  //   const firebaseTimeStamp = firebase.firestore.Timestamp.fromDate(date);
  //   return firebaseTimeStamp;
  // }
}

export default dataManipulation;
