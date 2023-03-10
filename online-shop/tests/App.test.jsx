import { beforeEach, describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import businessCalculations from "../utils/businessCalculations";
import dataManipulation from "../utils/dataManipulation";
import firestoredb from "../src/components/firestoredb";
import { initializeApp } from 'firebase/app';
import firebaseConfig from "../src/firebase_config";
import { runTransaction } from "firebase/firestore";
// 
const datamanipulation = new dataManipulation();
const app = initializeApp(firebaseConfig)
const firestore = new firestoredb(app,true)
const user = await firestore.readUserById('PN4JqXrjsGfTsCUEEmaR5NO6rNF3')


describe("Business Calcualtions", () => {
  test("getSafetyStock", () => {
    const bCalculations = new businessCalculations();
    const averageSalesPerDay = 20;
    expect(bCalculations.getSafetyStock(averageSalesPerDay)).toBe(40);
  });
  test("getStocksAvailableLessSafetyStock", () => {
    const bCalculations = new businessCalculations();
    const stocksAvailable = 100;
    const safetyStock = 40;
    expect(
      bCalculations.getStocksAvailableLessSafetyStock(
        stocksAvailable,
        safetyStock
      )
    ).toBe(20);
  });
  test("getCartCount", async () => {
    
    const cart = user.cart
    const bCalculations = new businessCalculations();
    expect(bCalculations.getCartCount(cart)).toEqual({
      "PPB#1": 5,
      "PPB#10": 5,
      "PPB#12": 3,
      "PPB#16": 3
    });
  });
});

describe("Data Manipulation", () => {
  test("AccountStatement", () => {

    const orders = user.orders

    const payments = user.payments

    orders.forEach((order) => {
      const newdate = new Date(
        order.orderdate.seconds * 1000 + order.orderdate.nanoseconds / 1000000
      );
      order.orderdate = newdate;
    });

    payments.forEach((payment) => {
      payment.date = new Date(
        payment.date.seconds * 1000 + payment.date.nanoseconds / 1000000
      );
    });

    const expected = [
      [
          {
              "seconds": 1678337277,
              "nanoseconds": 382000000
          },
          "1247292023-122953",
          7474,
          "",
          7474,
          "red"
      ],
      [
          {
              "seconds": 1678337319,
              "nanoseconds": 703000000
          },
          "1248292023-615338",
          16714,
          "",
          24188,
          "red"
      ],
      [
          {
              "seconds": 1678337359,
              "nanoseconds": 684000000
          },
          "Gcash 125235",
          "",
          50000,
          -25812,
          "green"
      ]
  ]

    expect(datamanipulation.accountStatementData(orders, payments, true)).toEqual(
      expected
    );
  });
  test("AccountStatementTable", () => {
   
    const tableData = [
      [
        "2023-03-06T07:43:27.488Z",
        "Gcash 325664343",
        "",
        32424,
        -32424,
        "green",
      ],
      [
        "2023-03-06T07:43:46.128Z",
        "Maya 3256643432",
        "",
        324253,
        -356677,
        "green",
      ],
      [
        "2023-03-06T08:24:36.330Z",
        "1624262023-899796",
        1537.8,
        "",
        -355139.2,
        "green",
      ],
      [
        "2023-03-07T02:23:58.194Z",
        "1023272023-873718",
        45976.8,
        "",
        -309162.4,
        "green",
      ],
    ];
    const expected = [
      {
        date: "3/6/2023",
        reference: "Gcash 325664343",
        credit: "",
        debit: 32424,
        runningBalance: -32424,
        color: "green",
      },
      {
        date: "3/6/2023",
        reference: "Maya 3256643432",
        credit: "",
        debit: 324253,
        runningBalance: -356677,
        color: "green",
      },
      {
        date: "3/6/2023",
        reference: "1624262023-899796",
        credit: 1537.8,
        debit: "",
        runningBalance: -355139.2,
        color: "green",
      },
      {
        date: "3/7/2023",
        reference: "1023272023-873718",
        credit: 45976.8,
        debit: "",
        runningBalance: -309162.4,
        color: "green",
      },
    ];
    expect(datamanipulation.accountStatementTable(tableData, true)).toEqual(
      expected
    );
    // datamanipulation.accountStatementTable(tableData)
  });
  test("getOrderFromReference", () => {
    const datamanipulation = new dataManipulation();
    const orders = user.orders
    const reference = "1247292023-122953";
    const expected = {
      "deliveryNotes": null,
      "userphonenumber": "",
      "paid": true,
      "userid": "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
      "phonenumber": "09178927206",
      "needAssistance": false,
      "longitude": 123.93387574188152,
      "reference": "1247292023-122953",
      "orderAcceptedByClientDate": null,
      "userWhoAcceptedOrder": null,
      "address": "Paper Boy",
      "grandtotal": 7474,
      "vat": 789,
      "shippingtotal": 110,
      "orderAcceptedByClient": false,
      "clientIDWhoAcceptedOrder": null,
      "delivered": false,
      "itemstotal": 6575,
      "username": "Adrian Ladia",
      "name": "Adrian Ladia",
      "orderdate": {
          "seconds": 1678337277,
          "nanoseconds": 382000000
      },
      "cart": [
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1"
      ],
      "latitude": 10.360648471259719,
      "totalWeight": 100,
      "deliveryVehicle": "Sedan"
  }

    expect(datamanipulation.getOrderFromReference(reference, orders,true)).toEqual(
      expected
    );
  });
  test("getAllCustomerNamesFromUsers", async () => {

    const users = await firestore.readAllUsers()
    const expected = ["Adrian Anton Ladia", "Adrian Ladia", "Adrian Ang"];
    const data = datamanipulation.getAllCustomerNamesFromUsers(users)
    expect(data).toEqual(expected);
  });
  test("getUserUidFromUsers", async () => {
    const users = await firestore.readAllUsers()
    const uid = datamanipulation.getUserUidFromUsers(users,'Adrian Ladia')
    expect(uid).toEqual("PN4JqXrjsGfTsCUEEmaR5NO6rNF3");
  });
  test("filterOrders", async () => {
    const orders = await firestore.readAllOrders()
    let filtered = datamanipulation.filterOrders(orders,'','',null,true,'')
    const expected = [
      {
          "reference": "1413182023-760473",
          "itemstotal": 10150,
          "vat": 1218,
          "name": "Adrian Ladia",
          "orderdate": {
              "seconds": 1675836806,
              "nanoseconds": 678000000
          },
          "longitude": 123.93403967370215,
          "latitude": 10.361113842400885,
          "paid": true,
          "userphonenumber": "",
          "grandtotal": 11433,
          "phonenumber": "09178927206",
          "address": "Paper Boy",
          "cart": [
              "ppb1-ppb",
              "ppb1-ppb",
              "ppb1-ppb",
              "ppb1-ppb",
              "ppb1-ppb"
          ],
          "username": "Adrian Anton Ladia",
          "delivered": false,
          "shippingtotal": 65
      },
      {
          "userid": "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
          "name": "Adrian Ladia",
          "reference": "1247292023-122953",
          "phonenumber": "09178927206",
          "userphonenumber": "",
          "address": "Paper Boy",
          "needAssistance": false,
          "username": "Adrian Ladia",
          "deliveryVehicle": "Sedan",
          "delivered": false,
          "shippingtotal": 110,
          "userWhoAcceptedOrder": null,
          "vat": 789,
          "totalWeight": 100,
          "orderAcceptedByClientDate": null,
          "deliveryNotes": null,
          "itemstotal": 6575,
          "orderdate": {
              "seconds": 1678337277,
              "nanoseconds": 382000000
          },
          "latitude": 10.360648471259719,
          "clientIDWhoAcceptedOrder": null,
          "cart": [
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1"
          ],
          "longitude": 123.93387574188152,
          "paid": true,
          "orderAcceptedByClient": false,
          "grandtotal": 7474
      },
      {
          "needAssistance": false,
          "orderAcceptedByClient": false,
          "deliveryNotes": "1254125",
          "reference": "1248292023-615338",
          "userphonenumber": "",
          "longitude": 123.93387574188152,
          "orderdate": {
              "seconds": 1678337319,
              "nanoseconds": 703000000
          },
          "totalWeight": 200,
          "username": "Adrian Ladia",
          "itemstotal": 14825,
          "phonenumber": "09178927206",
          "clientIDWhoAcceptedOrder": null,
          "name": "Adrian Ladia",
          "grandtotal": 16714,
          "shippingtotal": 110,
          "address": "Paper Boy",
          "userWhoAcceptedOrder": null,
          "latitude": 10.360648471259719,
          "paid": true,
          "vat": 1779,
          "delivered": false,
          "orderAcceptedByClientDate": null,
          "userid": "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
          "deliveryVehicle": "Sedan",
          "cart": [
              "PPB#10",
              "PPB#10",
              "PPB#10",
              "PPB#10",
              "PPB#10",
              "PPB#12",
              "PPB#12",
              "PPB#12",
              "PPB#12",
              "PPB#12"
          ]
      }
  ]
    expect(filtered).toEqual(expected);
    filtered = datamanipulation.filterOrders(orders,'','',null,null,'Adrian Ladia')

    filtered.map((order) => {
      expect(order.name).toEqual('Adrian Ladia')
    })

    filtered = datamanipulation.filterOrders(orders,'','',true,null,'')
    filtered.map((order) => {
      expect(order.delivered).toEqual(true)
    })
  });
 
});

describe("Emulator", () => {
  test("Emulator Connected to Firestore", async () => {
    await firestore.createTestCollection()
  });

  test("read test collection", async () => {
    const data = await firestore.readTestCollection()
    expect(data).toEqual([ { name: 'test' } ]);
  });

  test("delete test collection", async () => {
    await firestore.deleteTestCollection()
    const data = await firestore.readTestCollection()

    expect(data).toEqual([]);
    // tet
  })
})

describe("Database", () => {
  test("readAllParentProducts", async () => {
    const data = await firestore.readAllParentProducts();
    expect(data).not.toBe([]);
  });
  // a
  test("transactionPlaceOrder", async () => {
    const userdata = await firestore.readUserById('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2')
    const date = new Date()
    await firestore.transactionPlaceOrder(
    "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
    "Paper Boy",
    10.360648471259719,
    123.93387574188152,
    "09178927206",
    "Adrian Ladia",
    date,
    "Adrian Ladia",
    "Paper Boy",
    "09178927206",
    [
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#10",
        "PPB#10",
        "PPB#10",
        "PPB#10",
        "PPB#10",
        "PPB#12",
        "PPB#12",
        "PPB#12",
        "PPB#16",
        "PPB#16",
        "PPB#16"
    ],
    21975,
    2637,
    230,
    24842,
    "1545292023-662438",
    "Adrian Ladia",
    "",
    null,
    320,
    "Pick Up",
    false)

    const user = await firestore.readUserById('PN4JqXrjsGfTsCUEEmaR5NO6rNF3')
    const orders = user.orders
    
    let foundorder = false
    orders.map((order) => {
      console.log(order.reference)
      if (order.reference === "1545292023-662438") {
        console.log('found')
        foundorder = true
      }
    })
    expect(foundorder).toEqual(true)

  });
  test('transactionCreatePayment', async () => {
    await firestore.transactionCreatePayment('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2',1999,'124532-1235','GCASH')
    
  })
  test('updatedoc', async () => {
    await firestore.updatePhoneNumber('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2','09178927206')
    const user = await firestore.readUserById('tkzNxUOPW5RFRY2HO5yqTiAzDpZ2')
    const phone = user.phonenumber
    expect(phone).toEqual('09178927206')
  })
  

});
