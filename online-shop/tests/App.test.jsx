import { beforeEach, describe, expect, test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import businessCalculations from "../utils/businessCalculations";
import dataManipulation from "../utils/dataManipulation";

describe("Business Calcualtions", () => {
  test("getSafetyStock", () => {
    const bCalculations = new businessCalculations();
    const averageSalesPerDay = 20;
    expect(bCalculations.getSafetyStock(averageSalesPerDay)).toBe(40);
  });
  test('getStocksAvailableLessSafetyStock', () => {
    const bCalculations = new businessCalculations();
    const stocksAvailable = 100;
    const safetyStock = 40;
    expect(bCalculations.getStocksAvailableLessSafetyStock(stocksAvailable, safetyStock)).toBe(20);
  })
  test('getCartCount', () => {
    const cart = ['PPB#1','PPB#1','PPB#1','PPB#1','PPB#1','PPB#2','PPB#2','PPB#2','PPB#2','PPB#2','PPB#2','PPB#2','PPB#2','PPB#2','PPB#2','PPB#3','PPB#3','PPB#3']
    const bCalculations = new businessCalculations();
    expect(bCalculations.getCartCount(cart)).toEqual({'PPB#1': 5, 'PPB#2': 10, 'PPB#3': 3});
  } )
});

describe('Data Manipulation', () => {
    test('AccountStatement', () => {
        const dManipulation = new dataManipulation();
        const orders = [
            {
                "phonenumber": "t",
                "userid": "PN4JqXrjsGfTsCUEEmaR5NO6rNF3",
                "vat": 157.79999999999998,
                "paid": false,
                "username": "Adrian Ladia",
                "address": "test",
                "reference": "1624262023-899796",
                "userWhoAcceptedOrder": null,
                "needAssistance": false,
                "cart": [
                    "PPB#1"
                ],
                "clientIDWhoAcceptedOrder": null,
                "delivered": false,
                "orderdate": {
                    "seconds": 1678091076,
                    "nanoseconds": 330000000
                },
                "totalWeight": 20,
                "latitude": 10.3595675,
                "shippingtotal": 65,
                "deliveryVehicle": "Motorcycle",
                "longitude": 123.9415409,
                "name": "t",
                "userphonenumber": "",
                "orderAcceptedByClient": false,
                "itemstotal": 1315,
                "deliveryNotes": null,
                "orderAcceptedByClientDate": null,
                "grandtotal": 1537.8
            }
        ]

        const payments = [
            {
                "reference": "325664343",
                "paymentprovider": "Gcash",
                "date": {
                    "seconds": 1678088607,
                    "nanoseconds": 488000000
                },
                "amount": "32424"
            },
            {
                "amount": "324253",
                "reference": "3256643432",
                "paymentprovider": "Maya",
                "date": {
                    "seconds": 1678088626,
                    "nanoseconds": 128000000
                }
            }
        ]

        orders.forEach((order) => {
            const newdate = new Date(order.orderdate.seconds * 1000 + order.orderdate.nanoseconds / 1000000)
            order.orderdate = newdate
        })

        // console.log(orders)

        payments.forEach((payment) => {
            payment.date = new Date(payment.date.seconds * 1000 + payment.date.nanoseconds / 1000000)
        })
        
        const expected = [
            [
                "3/6/2023",
                "Gcash 325664343",
                "",
                32424,
                -32424,
                "green"
            ],
            [
                "3/6/2023",
                "Maya 3256643432",
                "",
                324253,
                -356677,
                "green"
            ],
            [
                "3/6/2023",
                "1624262023-899796",
                1537.8,
                "",
                -355139.2,
                "green"
            ]
        ]

        expect(dManipulation.accountStatementData(orders, payments,true)).toEqual(expected)

    })
    test('AccountStatementTable', () => {
        const datamanipulation = new dataManipulation();
        const tableData = [
            [
                "2023-03-06T07:43:27.488Z",
                "Gcash 325664343",
                "",
                32424,
                -32424,
                "green"
            ],
            [
                "2023-03-06T07:43:46.128Z",
                "Maya 3256643432",
                "",
                324253,
                -356677,
                "green"
            ],
            [
                "2023-03-06T08:24:36.330Z",
                "1624262023-899796",
                1537.8,
                "",
                -355139.2,
                "green"
            ],
            [
                "2023-03-07T02:23:58.194Z",
                "1023272023-873718",
                45976.8,
                "",
                -309162.4,
                "green"
            ]
        ]
        const expected = [
            {
                "date": "3/6/2023",
                "reference": "Gcash 325664343",
                "credit": "",
                "debit": 32424,
                "runningBalance": -32424,
                "color": "green"
            },
            {
                "date": "3/6/2023",
                "reference": "Maya 3256643432",
                "credit": "",
                "debit": 324253,
                "runningBalance": -356677,
                "color": "green"
            },
            {
                "date": "3/6/2023",
                "reference": "1624262023-899796",
                "credit": 1537.8,
                "debit": "",
                "runningBalance": -355139.2,
                "color": "green"
            },
            {
                "date": "3/7/2023",
                "reference": "1023272023-873718",
                "credit": 45976.8,
                "debit": "",
                "runningBalance": -309162.4,
                "color": "green"
            }
        ]
        expect(datamanipulation.accountStatementTable(tableData,true)).toEqual(expected)
        // datamanipulation.accountStatementTable(tableData)
    })
})