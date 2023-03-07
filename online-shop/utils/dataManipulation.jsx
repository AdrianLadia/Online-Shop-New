// import firebase from 'firebase/app';
// import 'firebase/firestore';
import { format, utcToZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';

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


    if (payments) {
      payments.map((payment) => {
        data.push(payment);
      });
    }


    data.sort((a, b) => {
        if (forTesting) {
            return b.date - a.date
        }
        else {
          return b.date.toDate() - a.date.toDate();
        }
    });

    data.reverse();

    const dataToUse = [];
    data.map((item) => {
      if (item.paymentprovider) {
        const itemDate = forTesting ? format(item.date,'M/d/yyyy') : item.date.toDate();
        const dataToPush = [
          itemDate,
          item.paymentprovider + " " + item.reference,
          "",
          parseFloat(item.amount),
        ]
        dataToUse.push(dataToPush);
      } else {
        const itemDate = forTesting ? format(item.date,'M/d/yyyy') : item.date.toDate();
        dataToUse.push([
          itemDate,
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
    return dataToUse;
  }
  accountStatementTable(tableData,forTesting = false) {
    function createData(date, reference, credit, debit, runningBalance, color) {
      return { date, reference, credit, debit, runningBalance,color };
    }
    const rowsdata = [];
    tableData.map((item) => {
      
      
      let date = null
      if (forTesting) {
        const parsed = parseISO(item[0])
        date = format(parsed,'M/d/yyyy')
      }
      else {
        date = format(item[0],'M/d/yyyy')
      }

      rowsdata.push(
        createData(date, item[1], item[2], item[3], item[4], item[5])
      );
    });
    return rowsdata
  }
  getOrderFromReference(referencenumber,order) {
    orders.map((order) => {
        if (order.reference === reference) { 
            return order 
         }
    });
}
}

export default dataManipulation;