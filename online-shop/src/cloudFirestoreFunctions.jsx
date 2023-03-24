import axios from 'axios';

class cloudFirestoreFunctions {
  constructor(emulator = false) {
    if (emulator === false) {
    }
    if (emulator === true) {
    }
  }


  async createDocument(firestoreData, id, collection) {
    const encodedData = encodeURIComponent(JSON.stringify({ collection, id, firestoreData }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/createDocument?data=${encodedData}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async readAllDataFromCollection(collectionName) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/readAllDataFromCollection?collectionName=${collectionName}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async readAllIdsFromCollection(collectionName) {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/readAllIdsFromCollection?collectionName=${collectionName}`
      );
      return response.data;
    } catch (error) {
      console.error('Error reading document:', error);
    }
  }

  async readSelectedDataFromCollection(collectionName, id) {
    const encodedData = encodeURIComponent(JSON.stringify({ collectionName, id }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/readSelectedDataFromCollection?data=${encodedData}`
      );
      return response.data;
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  async deleteDocumentFromCollection(collectionName, id) {
    const encodedData = encodeURIComponent(JSON.stringify({ collectionName, id }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/deleteDocumentFromCollection?data=${encodedData}`
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }

  async updateDocumentFromCollection(collectionName, id, firestoreData) {
    const encodedData = encodeURIComponent(JSON.stringify({ collectionName, id, firestoreData }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/updateDocumentFromCollection?data=${encodedData}`
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  async addDocumentArrayFromCollection(collectionName, id, arrayName, firestoreData) {
    const encodedData = encodeURIComponent(JSON.stringify({ collectionName, id, firestoreData, arrayName }));
    try {
      const response = await axios.get(
        `http://127.0.0.1:5001/online-store-paperboy/us-central1/addDocumentArrayFromCollection?data=${encodedData}`
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }

  //   await updateDoc(arrayRef, {
  //     [arrayname]: arrayUnion(data),
  //   });
  // }

  // async deleteDocumentFromCollectionArray(
  //   collectionname,
  //   id,
  //   data,
  //   arrayname,
  //   localphonenumber
  // ) {
  //   const arrayRef = doc(this.db, collectionname + "/", id);

  //   if (consolelog) {
  //     console.log(
  //       "Deleted document from collection array from " +
  //         collectionname +
  //         " " +
  //         id +
  //         " " +
  //         arrayname,
  //       data
  //     );
  //   }
  //   await updateDoc(arrayRef, {
  //     [arrayname]: arrayRemove(data),
  //   });
  // }

  // async transactionPlaceOrder(
  //   data
  // ) {

  //   console.log(data)
  //   const schema = Joi.object({
  //     userid: Joi.string().required(),
  //     username: Joi.string().required(),
  //     localDeliveryAddress: Joi.string().required(),
  //     locallatitude: Joi.number().required(),
  //     locallongitude: Joi.number().required(),
  //     localphonenumber: Joi.string().required(),
  //     localname: Joi.string().required(),
  //     orderDate: Joi.date().required(),
  //     cart: Joi.array().required(),
  //     itemstotal: Joi.number().required(),
  //     vat: Joi.number().required(),
  //     shippingtotal: Joi.number().required(),
  //     grandTotal: Joi.number().required(),
  //     reference: Joi.string().required(),
  //     userphonenumber: Joi.string().allow(''),
  //     deliveryNotes: Joi.string().allow(''),
  //     totalWeight: Joi.number().required(),
  //     deliveryVehicle: Joi.string().required(),
  //     needAssistance: Joi.boolean().required(),
  //   }).unknown(false);

  //   const { error} = schema.validate(data)
  //   if (error) {
  //     throw new Error(error)
  //   }

  //   try {
  //     await runTransaction(this.db, async (transaction) => {

  //       const docRef = doc(this.db, "Users" + "/", data.userid);
  //       const usersdoc = await transaction.get(docRef);
  //       const deliveryAddress = usersdoc.data().deliveryAddress;
  //       const contactPerson = usersdoc.data().contactPerson;
  //       const cartUniqueItems = Array.from(new Set(data.cart))

  //       const currentInventory = {}
  //       await Promise.all(cartUniqueItems.map(async(c) => {
  //         const productRef = doc(this.db, "Products" + "/", c);
  //         const productdoc = await transaction.get(productRef);
  //         // currentInventory.push(productdoc.data().stocksAvailable)
  //         currentInventory[c] = productdoc.data().stocksAvailable
  //       }))

  //       console.log(currentInventory)
  //       // WRITE
  //       // WRITE TO PRODUCTS ON HOLD

  //       await Promise.all(cartUniqueItems.map(async (itemId) => {
  //         const prodref = doc(this.db, "Products" + "/", itemId);
  //         const orderQuantity = data.cart.filter((c) => c == itemId).length
  //         const newStocksAvailable = currentInventory[itemId] - orderQuantity
  //         await transaction.update(prodref, {['stocksOnHold']: arrayUnion({reference: data.reference, quantity: orderQuantity, userId: data.userid})});
  //         await transaction.update(prodref, {['stocksAvailable']: newStocksAvailable});
  //       }))

  //       // WRITE TO DELIVER ADDRESS LIST
  //       let addressexists = false;
  //       let latitudeexists = false;
  //       let longitudeexists = false;
  //       deliveryAddress.map((d) => {
  //         if (d.address == data.localDeliveryAddress) {
  //           console.log("address already exists");
  //           addressexists = true;
  //         }
  //         if (d.latitude == data.locallatitude) {
  //           console.log("latitude already exists");
  //           latitudeexists = true;
  //         }
  //         if (d.longitude == data.locallongitude) {
  //           console.log("longitude already exists");
  //           longitudeexists = true;
  //         }
  //       });
  //       if (
  //         addressexists == false &&
  //         latitudeexists == false &&
  //         longitudeexists == false
  //       ) {
  //         console.log("adding new address");
  //         const newAddress = [
  //           {
  //             latitude: data.locallatitude,
  //             longitude: data.locallongitude,
  //             address: data.localDeliveryAddress,
  //           },
  //         ];
  //         const updatedAddressList = [...newAddress, ...deliveryAddress];
  //         console.log(updatedAddressList);
  //         await transaction.update(docRef, {
  //           deliveryAddress: updatedAddressList,
  //         });
  //       }

  //       // WRITE TO CONTACT NUMBER
  //       // CHECKS IF CONTACTS ALREADY EXISTS IF NOT ADDS IT TO FIRESTORE

  //       let phonenumberexists = false;
  //       let nameexists = false;
  //       contactPerson.map((d) => {
  //         if (d.phoneNumber == data.localphonenumber) {
  //           console.log("phonenumber already exists");
  //           phonenumberexists = true;
  //         }
  //         if (d.name == data.localname) {
  //           console.log("name already exists");
  //           nameexists = true;
  //         }
  //       });
  //       if (phonenumberexists == false || nameexists == false) {
  //         console.log("updating contact");
  //         const newContact = [
  //           { name: data.localname, phoneNumber: data.localphonenumber },
  //         ];
  //         const updatedContactList = [...newContact, ...contactPerson];
  //         console.log(updatedContactList);
  //         await transaction.update(docRef, {
  //           contactPerson: updatedContactList,
  //         });
  //       }

  //       // WRITE TO ORDERS
  //       // ORDERS WILL BE ADDED TO ORDER LIST WHEN ORDER IS PLACED

  //       const new_orders =
  //         {
  //           orderDate: data.orderDate,
  //           contactName: data.localname,
  //           deliveryAddress: data.localDeliveryAddress,
  //           contactPhoneNumber: data.localphonenumber,
  //           deliveryAddressLatitude: data.locallatitude,
  //           deliveryAddressLongitude: data.locallongitude,
  //           cart: data.cart,
  //           itemsTotal: data.itemstotal,
  //           vat: data.vat,
  //           shippingTotal: data.shippingtotal,
  //           grandTotal: data.grandTotal,
  //           delivered: false,
  //           reference: data.reference,
  //           paid: false,
  //           userName: data.username,
  //           userPhoneNumber : data.userphonenumber,
  //           deliveryNotes : data.deliveryNotes,
  //           orderAcceptedByClient : false,
  //           userWhoAcceptedOrder : null,
  //           orderAcceptedByClientDate : null,
  //           clientIDWhoAcceptedOrder : null,
  //           totalWeight : data.totalWeight,
  //           deliveryVehicle : data.deliveryVehicle,
  //           needAssistance : data.needAssistance,
  //           userId : data.userid
  //         }

  //       // const updated_orders = [...new_orders, ...orders];
  //       // console.log(updated_orders);
  //       console.log(new_orders)

  //       await transaction.update(docRef, { ['orders']: arrayUnion(new_orders) });

  //       // DELETE CART BY UPDATING IT TO AN EMPTY ARRAY
  //       await transaction.update(docRef, { cart: [] });
  //     });

  //     console.log("Checkout Transaction successfully committed!");
  //   } catch (e) {
  //     console.log("Transaction failed: ", e);
  //     throw new Error(e);
  //   }
  // }

  // async transactionCreatePayment(userid, amount, reference, paymentprovider) {
  //   const docRef = doc(this.db, "Users" + "/", userid);
  //   try {
  //     await runTransaction(this.db, async (transaction) => {
  //       // READ
  //       const doc = await transaction.get(docRef);
  //       const orders = doc.data().orders;
  //       const payments = doc.data().payments;

  //       const data = [];
  //       let totalpayments = parseFloat(amount);

  //       payments.map((payment) => {
  //         data.push(payment);
  //         console.log(parseFloat(payment.amount));
  //         totalpayments += parseFloat(payment.amount);
  //       });

  //       orders.sort((a, b) => {
  //         return (
  //           new Date(a.orderDate.seconds * 1000).getTime() -
  //           new Date(b.orderDate.seconds * 1000).getTime()
  //         );
  //       });

  //       console.log("Total Payments: ", totalpayments);
  //       orders.map((order) => {
  //         totalpayments -= parseFloat(order.grandTotal);
  //         totalpayments = Math.round(totalpayments);
  //         if (totalpayments >= 0) {
  //           console.log("Order Paid");
  //           console.log(order.reference);
  //           if (order.paid == false) {
  //             console.log(
  //               "Updating Order to Paid with reference ",
  //               order.reference
  //             );
  //             // WRITE
  //             transaction.update(docRef, {
  //               ["orders"]: arrayRemove(order),
  //             });
  //             order.paid = true;
  //             // WRITE
  //             transaction.update(docRef, {
  //               ["orders"]: arrayUnion(order),
  //             });
  //             console.log(order);
  //           }
  //         }
  //         if (order.paid == true && totalpayments < 0) {
  //           console.log("Order Was Paid but now unpaid");
  //           console.log(order.reference);
  //           // WRITE
  //           transaction.update(docRef, {
  //             ["orders"]: arrayRemove(order),
  //           });
  //           order.paid = false;
  //           // WRITE
  //           transaction.update(docRef, {
  //             ["orders"]: arrayUnion(order),
  //           });
  //           console.log(order);
  //         }
  //       });

  //       // WRITE
  //       transaction.update(docRef, {
  //         ['payments']: arrayUnion({
  //           date: new Date(),
  //           amount: amount,
  //           reference: reference,
  //           paymentprovider: paymentprovider,
  //         }),
  //       });
  //     });
  //     console.log("Transaction successfully committed!");
  //   } catch (e) {
  //     console.log("Transaction failed: ", e);
  //   }
  // }
}

export default cloudFirestoreFunctions;
