import firebase from 'firebase/app';
import 'firebase/firestore';

class dataManipulation {
  constructor() {}

  accountStatementData(orders,payments,forTesting = false) {
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

    // console.log(data)
    

    if (payments) {
      payments.map((payment) => {
        data.push(payment);
      });
    }

    // console.log(data)

    data.sort((a, b) => {
        if (forTesting) {
            return b.date - a.date
        }
      return b.date.toDate() - a.date.toDate();
    });

    data.reverse();

    const dataToUse = [];
    data.map((item) => {
      if (item.paymentprovider) {
        dataToUse.push([
          item.date.toDate().toLocaleDateString(),
          item.paymentprovider + " " + item.reference,
          "",
          parseFloat(item.amount),
        ]);
      } else {
        dataToUse.push([
          item.date.toDate().toLocaleDateString(),
          item.reference,
          item.grandtotal,
          "",
        ]);
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
  }
}

export default dataManipulation;