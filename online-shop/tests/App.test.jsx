import { beforeEach, describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import businessCalculations from "../utils/businessCalculations";
import dataManipulation from "../utils/dataManipulation";
import firestoredb from "../src/components/firestoredb";
import { initializeApp } from 'firebase/app';
import firebaseConfig from "../src/firebase_config";

const app = initializeApp(firebaseConfig)
const firestore = new firestoredb(app,true)


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
  test("getCartCount", () => {
    const cart = [
      "PPB#1",
      "PPB#1",
      "PPB#1",
      "PPB#1",
      "PPB#1",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#2",
      "PPB#3",
      "PPB#3",
      "PPB#3",
    ];
    const bCalculations = new businessCalculations();
    expect(bCalculations.getCartCount(cart)).toEqual({
      "PPB#1": 5,
      "PPB#2": 10,
      "PPB#3": 3,
    });
  });
});

describe("Data Manipulation", () => {
  test("AccountStatement", () => {
    const dManipulation = new dataManipulation();
    const orders = [
      {
        phonenumber: "t",
        userid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
        vat: 157.79999999999998,
        paid: false,
        username: "Adrian Ladia",
        address: "test",
        reference: "1624262023-899796",
        userWhoAcceptedOrder: null,
        needAssistance: false,
        cart: ["PPB#1"],
        clientIDWhoAcceptedOrder: null,
        delivered: false,
        orderdate: {
          seconds: 1678091076,
          nanoseconds: 330000000,
        },
        totalWeight: 20,
        latitude: 10.3595675,
        shippingtotal: 65,
        deliveryVehicle: "Motorcycle",
        longitude: 123.9415409,
        name: "t",
        userphonenumber: "",
        orderAcceptedByClient: false,
        itemstotal: 1315,
        deliveryNotes: null,
        orderAcceptedByClientDate: null,
        grandtotal: 1537.8,
      },
    ];

    const payments = [
      {
        reference: "325664343",
        paymentprovider: "Gcash",
        date: {
          seconds: 1678088607,
          nanoseconds: 488000000,
        },
        amount: "32424",
      },
      {
        amount: "324253",
        reference: "3256643432",
        paymentprovider: "Maya",
        date: {
          seconds: 1678088626,
          nanoseconds: 128000000,
        },
      },
    ];

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
      ["3/6/2023", "Gcash 325664343", "", 32424, -32424, "green"],
      ["3/6/2023", "Maya 3256643432", "", 324253, -356677, "green"],
      ["3/6/2023", "1624262023-899796", 1537.8, "", -355139.2, "green"],
    ];

    expect(dManipulation.accountStatementData(orders, payments, true)).toEqual(
      expected
    );
  });
  test("AccountStatementTable", () => {
    const datamanipulation = new dataManipulation();
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
    const orders = [
      {
        name: "t",
        cart: ["PPB#1"],
        grandtotal: 1537.8,
        itemstotal: 1315,
        totalWeight: 20,
        deliveryVehicle: "Motorcycle",
        deliveryNotes: null,
        paid: false,
        orderdate: {
          seconds: 1678091076,
          nanoseconds: 330000000,
        },
        orderAcceptedByClientDate: null,
        latitude: 10.3595675,
        userid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
        address: "test",
        userWhoAcceptedOrder: null,
        orderAcceptedByClient: false,
        longitude: 123.9415409,
        delivered: false,
        username: "Adrian Ladia",
        needAssistance: false,
        shippingtotal: 65,
        phonenumber: "t",
        reference: "1624262023-899796",
        userphonenumber: "",
        clientIDWhoAcceptedOrder: null,
        vat: 157.79999999999998,
      },
      {
        clientIDWhoAcceptedOrder: null,
        userphonenumber: "",
        deliveryNotes: null,
        itemstotal: 40765,
        delivered: false,
        userWhoAcceptedOrder: null,
        needAssistance: false,
        totalWeight: 620,
        longitude: 123.9415409,
        orderAcceptedByClientDate: null,
        orderdate: {
          seconds: 1678155838,
          nanoseconds: 194000000,
        },
        orderAcceptedByClient: false,
        latitude: 10.3595675,
        deliveryVehicle: "Van",
        address: "test",
        cart: [
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
          "PPB#1",
        ],
        grandtotal: 45976.8,
        paid: false,
        vat: 4891.8,
        reference: "1023272023-873718",
        shippingtotal: 320,
        phonenumber: "t",
        name: "t",
        userid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
        username: "Adrian Ladia",
      },
    ];
    const reference = "1023272023-873718";
    const expected = {
      clientIDWhoAcceptedOrder: null,
      userphonenumber: "",
      deliveryNotes: null,
      itemstotal: 40765,
      delivered: false,
      userWhoAcceptedOrder: null,
      needAssistance: false,
      totalWeight: 620,
      longitude: 123.9415409,
      orderAcceptedByClientDate: null,
      orderdate: {
        seconds: 1678155838,
        nanoseconds: 194000000,
      },
      orderAcceptedByClient: false,
      latitude: 10.3595675,
      deliveryVehicle: "Van",
      address: "test",
      cart: [
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
        "PPB#1",
      ],
      grandtotal: 45976.8,
      paid: false,
      vat: 4891.8,
      reference: "1023272023-873718",
      shippingtotal: 320,
      phonenumber: "t",
      name: "t",
      userid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
      username: "Adrian Ladia",
    };

    expect(datamanipulation.getOrderFromReference(reference, orders)).toEqual(
      expected
    );
  });
  test("getAllCustomerNamesFromUsers", () => {
    const datamanipulation = new dataManipulation();
    const users = [
      {
        cart: [],
        emailverfied: false,
        orders: [
          {
            phonenumber: "09178927206",
            shippingtotal: 110,
            address: "Paper Boy",
            username: "Adrian Anton Ladia",
            latitude: 10.360742842162331,
            cart: [
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
              "ppbag8-ppb-b",
            ],
            userphonenumber: "",
            itemstotal: 42900,
            longitude: 123.9338352876576,
            name: "Adrian Ladia",
            paid: false,
            grandtotal: 48158,
            delivered: false,
            orderdate: {
              seconds: 1675836819,
              nanoseconds: 522000000,
            },
            reference: "1413182023-781625",
            vat: 5148,
          },
          {
            itemstotal: 10150,
            grandtotal: 11433,
            latitude: 10.361113842400885,
            cart: ["ppb1-ppb", "ppb1-ppb", "ppb1-ppb", "ppb1-ppb", "ppb1-ppb"],
            name: "Adrian Ladia",
            address: "Paper Boy",
            shippingtotal: 65,
            longitude: 123.93403967370215,
            paid: false,
            userphonenumber: "",
            vat: 1218,
            phonenumber: "09178927206",
            delivered: false,
            username: "Adrian Anton Ladia",
            orderdate: {
              seconds: 1675836806,
              nanoseconds: 678000000,
            },
            reference: "1413182023-760473",
          },
        ],
        name: "Adrian Anton Ladia",
        payments: [
          {
            paymentprovider: "asf",
            date: {
              seconds: 1675740484,
              nanoseconds: 95000000,
            },
            amount: "20000",
            reference: "124214",
          },
        ],
        email: "adrian_ladia@yahoo.com",
        latitude: 10.357048288916205,
        contactPerson: [
          {
            name: "Adrian Ladia",
            phonenumber: "09178927206",
          },
        ],
        isanonymous: false,
        deliveryaddress: [
          {
            address: "Paper Boy",
            longitude: 123.9338352876576,
            latitude: 10.360742842162331,
          },
        ],
        uid: "LP6ARIs14qZm4qjj1YOLCSNjxsj1",
        longitude: 123.93594982434351,
        favoriteitems: [],
        phonenumber: "",
      },
      {
        deliveryaddress: [
          {
            longitude: 123.9415409,
            address: "test",
            latitude: 10.3595675,
          },
        ],
        payments: [
          {
            date: {
              seconds: 1678088607,
              nanoseconds: 488000000,
            },
            reference: "325664343",
            amount: "32424",
            paymentprovider: "Gcash",
          },
          {
            date: {
              seconds: 1678088626,
              nanoseconds: 128000000,
            },
            amount: "324253",
            paymentprovider: "Maya",
            reference: "3256643432",
          },
        ],
        longitude: 123.93388587547149,
        orders: [
          {
            vat: 157.79999999999998,
            shippingtotal: 65,
            longitude: 123.9415409,
            userWhoAcceptedOrder: null,
            cart: ["PPB#1"],
            deliveryVehicle: "Motorcycle",
            deliveryNotes: null,
            orderdate: {
              seconds: 1678091076,
              nanoseconds: 330000000,
            },
            phonenumber: "t",
            username: "Adrian Ladia",
            paid: false,
            clientIDWhoAcceptedOrder: null,
            latitude: 10.3595675,
            delivered: false,
            userid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
            userphonenumber: "",
            orderAcceptedByClientDate: null,
            itemstotal: 1315,
            name: "t",
            orderAcceptedByClient: false,
            grandtotal: 1537.8,
            address: "test",
            needAssistance: false,
            totalWeight: 20,
            reference: "1624262023-899796",
          },
          {
            orderAcceptedByClient: false,
            delivered: false,
            orderAcceptedByClientDate: null,
            deliveryNotes: null,
            grandtotal: 45976.8,
            cart: [
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
              "PPB#1",
            ],
            phonenumber: "t",
            vat: 4891.8,
            totalWeight: 620,
            latitude: 10.3595675,
            paid: false,
            orderdate: {
              seconds: 1678155838,
              nanoseconds: 194000000,
            },
            userWhoAcceptedOrder: null,
            deliveryVehicle: "Van",
            shippingtotal: 320,
            needAssistance: false,
            userid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
            reference: "1023272023-873718",
            clientIDWhoAcceptedOrder: null,
            name: "t",
            longitude: 123.9415409,
            itemstotal: 40765,
            username: "Adrian Ladia",
            address: "test",
            userphonenumber: "",
          },
        ],
        latitude: 10.360743396481435,
        contactPerson: [
          {
            name: "t",
            phonenumber: "t",
          },
        ],
        isanonymous: false,
        name: "Adrian Ladia",
        cart: [],
        favoriteitems: ["PPB#2", "PPB#1PK"],
        emailverfied: true,
        uid: "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
        phonenumber: "",
        email: "ladiaadrian@gmail.com",
      },
      {
        favoriteitems: [],
        uid: "tkzNxUOPW5RFRY2HO5yqTiAzDpZ2",
        deliveryaddress: [
          {
            address: "Cebu Philippines",
            latitude: 10.375608301816845,
            longitude: 123.91724270874339,
          },
        ],
        latitude: 10.374823834823193,
        orders: [],
        email: "adrianang88888@gmail.com",
        contactPerson: [
          {
            name: "Adri ladi",
            phonenumber: "09173233345",
          },
        ],
        isanonymous: false,
        payments: [],
        phonenumber: "",
        cart: [],
        longitude: 123.98224514316472,
        name: "Adrian Ang",
        emailverfied: true,
      },
    ];

    const expected = ["Adrian Anton Ladia", "Adrian Ladia", "Adrian Ang"];
    const data = datamanipulation.getAllCustomerNamesFromUsers(users)
    // const data = datamanipulation.getAllCustomerNamesFronUsers(users)
    console.log(data) 
    expect(data).toEqual(expected);
  });
});

describe("Emulator", () => {
  test("Emulator Connected to Firestore", async () => {
    await firestore.createTestCollection()
  });

  test("read test collection", async () => {
    const data = await firestore.readTestCollection()
    console.log(data)
    expect(data).toEqual([ { name: 'test' } ]);
  });

  test("delete test collection", async () => {
    await firestore.deleteTestCollection()
    const data = await firestore.readTestCollection()
    console.log(data)
    expect(data).toEqual([]);
  })
})

// describe("Database", () => {
//   test("readAllParentProducts", async () => {
//     const data = await firestore.readAllParentProducts();
//     expect(data).not.toBe([]);
//   });
// });
