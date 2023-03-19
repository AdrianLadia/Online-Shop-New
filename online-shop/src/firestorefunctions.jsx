import { getFirestore,connectFirestoreEmulator  } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";

const consolelog = false;

class firestorefunctions {
  constructor(app,emulator = false) {
    // Initialize Cloud Firestore and get a reference to the service
    if (emulator === false) {
      const db = getFirestore(app);
      this.db = db;
    }
    if(emulator === true) {
      const db = getFirestore();
      connectFirestoreEmulator(db, "localhost", 8080);
      this.db = db;

    }
  }

  async createDocument(data, id, collection) {
    try {
      const docRef = await setDoc(doc(this.db, collection + "/", id), data);
      if (consolelog) {
        console.log("Document written in " + collection + " " + id, data);
      }
    } catch (e) {
      if (consolelog) {
        console.error("Error adding document: ", e);
      }
    }
  }

  async readAllDataFromCollection(collectionname) {
    const querySnapshot = await getDocs(collection(this.db, collectionname));
    const products = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      products.push(doc.data());
    });

    if (consolelog) {
      console.log("Read all data from " + collectionname, products);
    }
    return products;
  }

  async readAllIdsFromCollection(collectionname) {
    const querySnapshot = await getDocs(collection(this.db, collectionname));
    const ids = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      ids.push(doc.id);
    });

    if (consolelog) {
      console.log("Read all ids from " + collectionname, ids);
    }

    return ids;
  }

  async readSelectedDataFromCollection(collectionname, id) {
    const docRef = doc(this.db, collectionname + "/", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      if (consolelog) {
        console.log(
          "Read Selected Data From " + collectionname,
          docSnap.data()
        );
      }

      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  
  async deleteDocumentFromCollection(collectionname, id) {
    const docRef = doc(this.db, collectionname + "/", id);

    if (consolelog) {
      console.log("Deleted document from " + collectionname + " " + id);
    }

    await deleteDoc(docRef);
  }

  async updateDocumentFromCollection(collectionname, id, data) {
    const docRef = doc(this.db, collectionname + "/", id);
    await updateDoc(docRef, data)
      .then(() => {
        if (consolelog) {
          console.log(
            "Document successfully updated from " + collectionname + " " + id,
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }

  async addDocumentArrayFromCollection(collectionname, id, data, arrayname) {
    const arrayRef = doc(this.db, collectionname + "/", id);

    if (consolelog) {
      console.log(
        "Added document array from " +
          collectionname +
          " " +
          id +
          " " +
          arrayname,
        data
      );
    }

    await updateDoc(arrayRef, {
      [arrayname]: arrayUnion(data),
    });
  }

  async deleteDocumentFromCollectionArray(
    collectionname,
    id,
    data,
    arrayname,
    localphonenumber
  ) {
    const arrayRef = doc(this.db, collectionname + "/", id);

    if (consolelog) {
      console.log(
        "Deleted document from collection array from " +
          collectionname +
          " " +
          id +
          " " +
          arrayname,
        data
      );
    }
    await updateDoc(arrayRef, {
      [arrayname]: arrayRemove(data),
    });
  }

  async transactionPlaceOrder(
    userid,
    localDeliveryAddress,
    locallatitude,
    locallongitude,
    localphonenumber,
    localname,
    orderdate,
    name,
    address,
    phonenumber,
    cart,
    itemstotal,
    vat,
    shippingtotal,
    grandtotal,
    reference,
    username,
    userphonenumber,
    deliveryNotes,
    totalWeight,
    deliveryVehicle,
    needAssistance
  ) {

    console.log( 
      userid,
      localDeliveryAddress,
      locallatitude,
      locallongitude,
      localphonenumber,
      localname,
      orderdate,
      name,
      address,
      phonenumber,
      cart,
      itemstotal,
      vat,
      shippingtotal,
      grandtotal,
      reference,
      username,
      userphonenumber,
      deliveryNotes,
      totalWeight,
      deliveryVehicle,
      needAssistance)

    try {
      await runTransaction(this.db, async (transaction) => {
        // READ
        const docRef = doc(this.db, "Users" + "/", userid);
        const usersdoc = await transaction.get(docRef);
        const deliveryAddress = usersdoc.data().deliveryaddress;
        const contactPerson = usersdoc.data().contactPerson;
        const cartUniqueItems = Array.from(new Set(cart))

        const currentInventory = {}
        await Promise.all(cartUniqueItems.map(async(c) => {
          const productRef = doc(this.db, "Products" + "/", c);
          const productdoc = await transaction.get(productRef);
          // currentInventory.push(productdoc.data().stocksAvailable)
          currentInventory[c] = productdoc.data().stocksAvailable
        }))
        
        console.log(currentInventory)
        // WRITE
        // WRITE TO PRODUCTS ON HOLD
        
        await Promise.all(cartUniqueItems.map(async (itemid) => {
          const prodref = doc(this.db, "Products" + "/", itemid);
          const orderQuantity = cart.filter((c) => c == itemid).length
          const newStocksAvailable = currentInventory[itemid] - orderQuantity
          await transaction.update(prodref, {['stocksOnHold']: arrayUnion({reference: reference, quantity: orderQuantity, userid: userid})});
          await transaction.update(prodref, {['stocksAvailable']: newStocksAvailable});
        }))

        

        // WRITE TO DELIVER ADDRESS LIST
        let addressexists = false;
        let latitudeexists = false;
        let longitudeexists = false;
        deliveryAddress.map((d) => {
          if (d.address == localDeliveryAddress) {
            console.log("address already exists");
            addressexists = true;
          }
          if (d.latitude == locallatitude) {
            console.log("latitude already exists");
            latitudeexists = true;
          }
          if (d.longitude == locallongitude) {
            console.log("longitude already exists");
            longitudeexists = true;
          }
        });
        if (
          addressexists == false &&
          latitudeexists == false &&
          longitudeexists == false
        ) {
          console.log("adding new address");
          const newAddress = [
            {
              latitude: locallatitude,
              longitude: locallongitude,
              address: localDeliveryAddress,
            },
          ];
          const updatedAddressList = [...newAddress, ...deliveryAddress];
          console.log(updatedAddressList);
          await transaction.update(docRef, {
            deliveryaddress: updatedAddressList,
          });
        }

        // WRITE TO CONTACT NUMBER
        // CHECKS IF CONTACTS ALREADY EXISTS IF NOT ADDS IT TO FIRESTORE

        let phonenumberexists = false;
        let nameexists = false;
        contactPerson.map((d) => {
          if (d.phonenumber == localphonenumber) {
            console.log("phonenumber already exists");
            phonenumberexists = true;
          }
          if (d.name == localname) {
            console.log("name already exists");
            nameexists = true;
          }
        });
        if (phonenumberexists == false || nameexists == false) {
          console.log("updating contact");
          const newContact = [
            { name: localname, phonenumber: localphonenumber },
          ];
          const updatedContactList = [...newContact, ...contactPerson];
          console.log(updatedContactList);
          await transaction.update(docRef, {
            contactPerson: updatedContactList,
          });
        }

        // WRITE TO ORDERS
        // ORDERS WILL BE ADDED TO ORDER LIST WHEN ORDER IS PLACED

        const new_orders = 
          {
            orderdate: orderdate,
            name: name,
            address: address,
            phonenumber: phonenumber,
            latitude: locallatitude,
            longitude: locallongitude,
            cart: cart,
            itemstotal: itemstotal,
            vat: vat,
            shippingtotal: shippingtotal,
            grandtotal: grandtotal,
            delivered: false,
            reference: reference,
            paid: false,
            username: username,
            userphonenumber : userphonenumber,
            deliveryNotes : deliveryNotes,
            orderAcceptedByClient : false,
            userWhoAcceptedOrder : null,
            orderAcceptedByClientDate : null,
            clientIDWhoAcceptedOrder : null,
            totalWeight : totalWeight,
            deliveryVehicle : deliveryVehicle.name,
            needAssistance : needAssistance,
            userid : userid
          }

          console.log(new_orders)
        

        // const updated_orders = [...new_orders, ...orders];
        // console.log(updated_orders);

        await transaction.update(docRef, { ['orders']: arrayUnion(new_orders) });

        // DELETE CART BY UPDATING IT TO AN EMPTY ARRAY
        await transaction.update(docRef, { cart: [] });
      });

      console.log("Checkout Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }

  async transactionCreatePayment(userid, amount, reference, paymentprovider) {
    const docRef = doc(this.db, "Users" + "/", userid);
    try {
      await runTransaction(this.db, async (transaction) => {
        // READ
        const doc = await transaction.get(docRef);
        const orders = doc.data().orders;
        const payments = doc.data().payments;

        const data = [];
        let totalpayments = parseFloat(amount);

        payments.map((payment) => {
          data.push(payment);
          console.log(parseFloat(payment.amount));
          totalpayments += parseFloat(payment.amount);
        });

        orders.sort((a, b) => {
          return (
            new Date(a.orderdate.seconds * 1000).getTime() -
            new Date(b.orderdate.seconds * 1000).getTime()
          );
        });

        console.log("Total Payments: ", totalpayments);
        orders.map((order) => {
          totalpayments -= parseFloat(order.grandtotal);
          totalpayments = Math.round(totalpayments);
          if (totalpayments >= 0) {
            console.log("Order Paid");
            console.log(order.reference);
            if (order.paid == false) {
              console.log(
                "Updating Order to Paid with reference ",
                order.reference
              );
              // WRITE
              transaction.update(docRef, {
                ["orders"]: arrayRemove(order),
              });
              order.paid = true;
              // WRITE
              transaction.update(docRef, {
                ["orders"]: arrayUnion(order),
              });
              console.log(order);
            }
          }
          if (order.paid == true && totalpayments < 0) {
            console.log("Order Was Paid but now unpaid");
            console.log(order.reference);
            // WRITE
            transaction.update(docRef, {
              ["orders"]: arrayRemove(order),
            });
            order.paid = false;
            // WRITE
            transaction.update(docRef, {
              ["orders"]: arrayUnion(order),
            });
            console.log(order);
          }
        });

        // WRITE
        transaction.update(docRef, {
          ['payments']: arrayUnion({
            date: new Date(),
            amount: amount,
            reference: reference,
            paymentprovider: paymentprovider,
          }),
        });
      });
      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  }
}

export default firestorefunctions;
