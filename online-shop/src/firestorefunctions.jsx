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
import Joi from "joi";

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
      if (!db._settingsFrozen) {
        connectFirestoreEmulator(db, "localhost", 8080);
      }
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
    data
  ) {

    console.log(data)
    const schema = Joi.object({
      userid: Joi.string().required(),
      username: Joi.string().required(),
      localDeliveryAddress: Joi.string().required(),
      locallatitude: Joi.number().required(),
      locallongitude: Joi.number().required(),
      localphonenumber: Joi.string().required(),
      localname: Joi.string().required(),
      cart: Joi.array().required(),
      itemstotal: Joi.number().required(),
      vat: Joi.number().required(),
      shippingtotal: Joi.number().required(),
      grandTotal: Joi.number().required(),
      reference: Joi.string().required(),
      userphonenumber: Joi.string().allow(''),
      deliveryNotes: Joi.string().allow(''),
      totalWeight: Joi.number().required(),
      deliveryVehicle: Joi.string().required(),
      needAssistance: Joi.boolean().required(),
      eMail: Joi.string().required(),
    }).unknown(false);


    const { error} = schema.validate(data)
    if (error) {
      throw new Error(error)
    }

    data['orderDate'] = new Date()



    try {
      await runTransaction(this.db, async (transaction) => {

        const docRef = doc(this.db, "Users" + "/", data.userid);
        const usersdoc = await transaction.get(docRef);
        const deliveryAddress = usersdoc.data().deliveryAddress;
        const contactPerson = usersdoc.data().contactPerson;
        const cartUniqueItems = Array.from(new Set(data.cart))

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
        
        await Promise.all(cartUniqueItems.map(async (itemId) => {
          const prodref = doc(this.db, "Products" + "/", itemId);
          const orderQuantity = data.cart.filter((c) => c == itemId).length
          const newStocksAvailable = currentInventory[itemId] - orderQuantity
          await transaction.update(prodref, {['stocksOnHold']: arrayUnion({reference: data.reference, quantity: orderQuantity, userId: data.userid})});
          await transaction.update(prodref, {['stocksAvailable']: newStocksAvailable});
        }))

        

        // WRITE TO DELIVER ADDRESS LIST
        let addressexists = false;
        let latitudeexists = false;
        let longitudeexists = false;
        deliveryAddress.map((d) => {
          if (d.address == data.localDeliveryAddress) {
            console.log("address already exists");
            addressexists = true;
          }
          if (d.latitude == data.locallatitude) {
            console.log("latitude already exists");
            latitudeexists = true;
          }
          if (d.longitude == data.locallongitude) {
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
              latitude: data.locallatitude,
              longitude: data.locallongitude,
              address: data.localDeliveryAddress,
            },
          ];
          const updatedAddressList = [...newAddress, ...deliveryAddress];
          console.log(updatedAddressList);
          await transaction.update(docRef, {
            deliveryAddress: updatedAddressList,
          });
        }

        // WRITE TO CONTACT NUMBER
        // CHECKS IF CONTACTS ALREADY EXISTS IF NOT ADDS IT TO FIRESTORE

        let phonenumberexists = false;
        let nameexists = false;
        contactPerson.map((d) => {
          if (d.phoneNumber == data.localphonenumber) {
            console.log("phonenumber already exists");
            phonenumberexists = true;
          }
          if (d.name == data.localname) {
            console.log("name already exists");
            nameexists = true;
          }
        });
        if (phonenumberexists == false || nameexists == false) {
          console.log("updating contact");
          const newContact = [
            { name: data.localname, phoneNumber: data.localphonenumber },
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
            orderDate: data.orderDate,
            contactName: data.localname,
            deliveryAddress: data.localDeliveryAddress,
            contactPhoneNumber: data.localphonenumber,
            deliveryAddressLatitude: data.locallatitude,
            deliveryAddressLongitude: data.locallongitude,
            cart: data.cart,
            itemsTotal: data.itemstotal,
            vat: data.vat,
            shippingTotal: data.shippingtotal,
            grandTotal: data.grandTotal,
            delivered: false,
            reference: data.reference,
            paid: false,
            userName: data.username,
            userPhoneNumber : data.userphonenumber,
            deliveryNotes : data.deliveryNotes,
            orderAcceptedByClient : false,
            userWhoAcceptedOrder : null,
            orderAcceptedByClientDate : null,
            clientIDWhoAcceptedOrder : null,
            totalWeight : data.totalWeight,
            deliveryVehicle : data.deliveryVehicle,
            needAssistance : data.needAssistance,
            userId : data.userid
          }
        

        // const updated_orders = [...new_orders, ...orders];
        // console.log(updated_orders);
        console.log(new_orders)
        
        await transaction.update(docRef, { ['orders']: arrayUnion(new_orders) });

        // DELETE CART BY UPDATING IT TO AN EMPTY ARRAY
        await transaction.update(docRef, { cart: [] });
      });

      console.log("Checkout Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
      throw new Error(e);
    }
  }

  async transactionCreatePayment(userid, amount, reference, paymentprovider) {

    const userIdSchema = Joi.string().required();
    const amountSchema = Joi.number().required();
    const referenceSchema = Joi.string().required();
    const paymentproviderSchema = Joi.string().required();

    console.log(typeof(amount))
    console.log(amount)

    const {error1} = userIdSchema.validate(userid);


    const {error2} = amountSchema.validate(amount);


    const {error3} = referenceSchema.validate(reference);


    const {error4} = paymentproviderSchema.validate(paymentprovider);

    if(error1 || error2 || error3 || error4){
      console.log(error1, error2, error3, error4)
      throw new Error("Data Validation Error")
    }
    
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
            new Date(a.orderDate.seconds * 1000).getTime() -
            new Date(b.orderDate.seconds * 1000).getTime()
          );
        });

        console.log("Total Payments: ", totalpayments);
        orders.map((order) => {
          totalpayments -= parseFloat(order.grandTotal);
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
