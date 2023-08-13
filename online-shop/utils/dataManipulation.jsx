// import firebase from 'firebase/app';
// import 'firebase/firestore';
import { format, utcToZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import Joi from 'joi';
import businessCalculations from './businessCalculations';
import dateConverter from '../functions/utils/dateConverter';
import AppConfig from '../src/AppConfig';

class dataManipulation {
  constructor() {}

  convertDateToNanoSecondsAndSeconds(dateObject) {
    const date = new Date(dateObject);
    const nanoseconds = (date.getTime() % 1000) * 1000000;
    const seconds = Math.floor(date.getTime() / 1000);
    const result = { nanoseconds: nanoseconds, seconds: seconds };

    const schema = Joi.object();

    const { error } = schema.validate(result);
    if (error) {
      throw new Error(error);
    }

    return result;
  }

  accountStatementData(orders, payments, forTesting = false) {
    const data = [];

    const schemaOrder = Joi.object({
      userWhoAcceptedOrder: Joi.any(),
      userPhoneNumber: Joi.string(),
      delivered: Joi.boolean(),
      cart: Joi.array(),
      reference: Joi.string(),
      orderAcceptedByClient: Joi.boolean(),
      deliveryAddress: Joi.string(),
      deliveryVehicle: Joi.string(),
      orderAcceptedByClientDate: Joi.any(),
      needAssistance: Joi.boolean(),
      grandTotal: Joi.number(),
      contactName: Joi.string(),
      vat: Joi.number(),
      userName: Joi.string(),
      deliveryNotes: Joi.string(),
      userId: Joi.string(),
      shippingTotal: Joi.number(),
      deliveryAddressLatitude: Joi.number(),
      itemsTotal: Joi.number(),
      paid: Joi.boolean(),
      totalWeight: Joi.number(),
      contactPhoneNumber: Joi.string(),
      deliveryAddressLongitude: Joi.number(),
      clientIDWhoAcceptedOrder: Joi.string(),
      orderDate: Joi.object(),
    }).unknown(false);

    const schemaPayments = Joi.object({
      amount: Joi.number(),
      date: Joi.object(),
      paymentprovider: Joi.string(),
      reference: Joi.string(),
    }).unknown(false);

    const { error1 } = schemaPayments.validate(payments);
    if (error1) {
      throw new Error(error1);
    }

    const { error2 } = schemaOrder.validate(orders);
    if (error2) {
      throw new Error(error2);
    }

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
        const dateA = new Date(a.date._seconds);
        const dateB = new Date(b.date._seconds);
        return dateB - dateA;
      }
    });

    data.reverse();

    const dataToUse = [];
    data.map((item) => {
      if (item.paymentprovider) {
        let proofOfPaymentLink = '';
        if (item.proofOfPaymentLink) {
          proofOfPaymentLink = item.proofOfPaymentLink;
        }

        const dataToPush = [item.date, item.paymentprovider + ' ' + item.reference, '', parseFloat(item.amount),proofOfPaymentLink];
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

      if (item[2] == '') {
        let proofOfPaymentLink = item.splice(4, 1)[0];
        item.push(proofOfPaymentLink)
      }


    

    });

    if (forTesting) {
      dataToUse.map((item) => {
        item[0] = this.convertDateToNanoSecondsAndSeconds(item[0]);
      });
    }
    
    const dataToUseSchema = Joi.array().required();
    
    const { error } = dataToUseSchema.validate(dataToUse);
    if (error) {
      throw new Error(error);
    }
    
    return dataToUse;
  }
  
  accountStatementTable(tableData, forTesting = false) {
    function createData(date, reference, credit, debit, runningBalance, color, proofOfPaymentLink) {
      return { date, reference, credit, debit, runningBalance, color, proofOfPaymentLink };
    }
    const rowsdata = [];
    tableData.map((item) => {
      let date = null;
      if (forTesting) {
        const parsed = parseISO(item[0]);
        date = format(parsed, 'M/d/yyyy');
      } else {
        date = this.convertDateTimeStampToDateString(item[0]);
      }

      let proofOfPaymentLink
      if (item[6]) {
        proofOfPaymentLink = item[6]
      }

      rowsdata.push(createData(date, item[1], item[2], item[3], item[4], item[5], proofOfPaymentLink));
    });


    return rowsdata;
  }

  getOrderFromReference(referencenumber, orders, forTesting = false) {
    const referenceNumberSchema = Joi.string().required();
    const { error } = referenceNumberSchema.validate(referencenumber);
    if (error) {
      throw new Error(error);
    }

    const schemaOrder = Joi.object({
      userWhoAcceptedOrder: Joi.any(),
      userPhoneNumber: Joi.string(),
      delivered: Joi.boolean(),
      cart: Joi.array(),
      reference: Joi.string(),
      orderAcceptedByClient: Joi.boolean(),
      deliveryAddress: Joi.string(),
      deliveryVehicle: Joi.string(),
      orderAcceptedByClientDate: Joi.any(),
      needAssistance: Joi.boolean(),
      grandTotal: Joi.number(),
      contactName: Joi.string(),
      vat: Joi.number(),
      userName: Joi.string(),
      deliveryNotes: Joi.string(),
      userId: Joi.string(),
      shippingTotal: Joi.number(),
      deliveryAddressLatitude: Joi.number(),
      itemsTotal: Joi.number(),
      paid: Joi.boolean(),
      totalWeight: Joi.number(),
      contactPhoneNumber: Joi.string(),
      deliveryAddressLongitude: Joi.number(),
      clientIDWhoAcceptedOrder: Joi.string(),
      orderDate: Joi.object(),
    }).unknown(false);

    const { error2 } = schemaOrder.validate(orders);
    if (error2) {
      throw new Error(error2);
    }

    let orderfiltered = null;
    orders.map((order) => {
      if (order.reference === referencenumber) {
        orderfiltered = order;
      }
    });

    if (forTesting) {
      orderfiltered['orderDate'] = this.convertDateToNanoSecondsAndSeconds(orderfiltered['orderDate']);
    }

    const orderFilteredSchema = Joi.object({
      userWhoAcceptedOrder: Joi.any(),
      userPhoneNumber: Joi.string(),
      delivered: Joi.boolean().required(),
      cart: Joi.array().required(),
      reference: Joi.string().required(),
      orderAcceptedByClient: Joi.boolean().required(),
      deliveryAddress: Joi.string().required(),
      deliveryVehicle: Joi.string().required(),
      orderAcceptedByClientDate: Joi.any(),
      needAssistance: Joi.boolean().required(),
      grandTotal: Joi.number().required(),
      contactName: Joi.string().required(),
      vat: Joi.number().required(),
      userName: Joi.string().required(),
      deliveryNotes: Joi.string().required(),
      userId: Joi.string().required(),
      shippingTotal: Joi.number().required(),
      deliveryAddressLatitude: Joi.number().required(),
      itemsTotal: Joi.number().required(),
      paid: Joi.boolean().required(),
      totalWeight: Joi.number().required(),
      contactPhoneNumber: Joi.string().required(),
      deliveryAddressLongitude: Joi.number().required(),
      clientIDWhoAcceptedOrder: Joi.string().required(),
      orderDate: Joi.object().required(),
    }).unknown(false);

    const { error3 } = orderFilteredSchema.validate(orderfiltered);
    if (error3) {
      throw new Error(error3);
    }

    return orderfiltered;
  }

  getAllCustomerNamesFromUsers(users) {
    const schemaUsers = Joi.array();

    const { error } = schemaUsers.validate(users);
    if (error) {
      throw new Error(error);
    }

    const customers = [];
    users.map((user) => {
      customers.push(user.name);
    });

    const schemaCustomers = Joi.array();

    const { error2 } = schemaCustomers.validate(customers);
    if (error2) {
      throw new Error(error2);
    }

    return customers;
  }

  getUserUidFromUsers(users, selectedName) {
    const schemaUsers = Joi.array();
    const schemaSelectedName = Joi.string();

    const { error1 } = schemaSelectedName.validate(selectedName);
    const { error } = schemaUsers.validate(users);

    if (error || error1) {
      throw new Error(error);
    }

    const user = users.find((user) => user.name === selectedName);
    if (user) {
      const userId = user.uid;

      const schemaUserId = Joi.string();
      const { error2 } = schemaUserId.validate(userId);
      if (error2) {
        throw new Error(error2);
      }

      return userId;
    }
    return undefined;
  }

  filterOrders(orders, startDate, referenceNumber, delivered, paid, selectedName) {
    const schemaOrder = Joi.array();

    const { error } = schemaOrder.validate(orders);
    if (error) {
      throw new Error(error);
    }

    const schemaDate = Joi.string();
    const { error2 } = schemaDate.validate(startDate);
    if (error2) {
      throw new Error(error2);
    }

    const schemaReferenceNumber = Joi.string();
    const { error3 } = schemaReferenceNumber.validate(referenceNumber);
    if (error3) {
      throw new Error(error3);
    }

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

    const dataFilteredByPaidSchema = Joi.array().items(
      Joi.object({
        userWhoAcceptedOrder: Joi.any().required(),
        userPhoneNumber: Joi.string().required(),
        delivered: Joi.boolean().required(),
        cart: Joi.array().required(),
        reference: Joi.string().required(),
        orderAcceptedByClient: Joi.boolean().required(),
        deliveryAddress: Joi.string().required(),
        deliveryVehicle: Joi.string().required(),
        orderAcceptedByClientDate: Joi.any().required(),
        needAssistance: Joi.boolean().required(),
        grandTotal: Joi.number().required(),
        contactName: Joi.string().required(),
        vat: Joi.number().required(),
        userName: Joi.string().required(),
        deliveryNotes: Joi.string().required(),
        userId: Joi.string().required(),
        shippingTotal: Joi.number().required(),
        deliveryAddressLatitude: Joi.number().required(),
        itemsTotal: Joi.number().required(),
        paid: Joi.boolean().required(),
        totalWeight: Joi.number().required(),
        contactPhoneNumber: Joi.string().required(),
        deliveryAddressLongitude: Joi.number().required(),
        clientIDWhoAcceptedOrder: Joi.string().required(),
        orderDate: Joi.object().required(),
      }).unknown(false)
    );

    const { error6 } = dataFilteredByPaidSchema.validate(dataFilteredByPaid);

    if (error6) {
      throw new Error(error6);
    }

    return dataFilteredByPaid;
  }

  getCategoryList(categories, hiddenCategories = null) {
    const c = [];
    categories.map((category) => {
      if (hiddenCategories !== null) {
        if (hiddenCategories.includes(category.category)) {
          return;
        }
      }
      c.push(category.category);
    });

    const schema = Joi.array();
    const { error } = schema.validate(c);
    if (error) {
      throw new Error(error);
    }

    const categoryWithFavorites = ['Favorites', ...c.sort()];

    return categoryWithFavorites;
  }

  getCheckoutPageTableDate(product_list, cart, cartItemPrice,urlOfBir2303) {
    const productListSchema = Joi.array();
    const productListCart = Joi.object();

    const { error1 } = productListSchema.validate(product_list);
    const { error2 } = productListCart.validate(cart);

    if (error1 || error2) {
      throw new Error(error1);
    }

    function createData(itemimage, itemName, itemquantity, pieces, itemprice, itemtotal, weighttotal, itemId) {
      return { itemimage, itemName, itemquantity, pieces, itemprice, itemtotal, weighttotal, itemId };
    }

    let rows_non_state = [];
    let total_non_state = 0;
    let total_weight_non_state = 0;

    console.log(product_list)

    Object.entries(cart).map(([key, quantity]) => {
      product_list.map((product) => {
        if (product.itemId === key) {
      
          let productPrice;
    
          if (cartItemPrice === null) {
            productPrice = product.price;
          } else {
            productPrice = cartItemPrice[key];
          }

          console.log(product.weight)

          total_weight_non_state += product.weight * quantity;
          total_non_state += productPrice * quantity;
          const weight = product.weight * quantity;


            

          let row = createData(
            product.imageLinks[0],
            `${product.itemName} (${product.pieces} pieces)`,
            quantity.toLocaleString(),
            (product.pieces * quantity).toLocaleString(),
            parseInt(productPrice).toLocaleString(),
            (productPrice * quantity).toLocaleString(),
            weight,
            product.itemId
          );

          rows_non_state.push(row);
        }
      });
    });

    const businesscalculations = new businessCalculations();
    const vat = businesscalculations.getValueAddedTax(total_non_state,urlOfBir2303);
    const items_total = total_non_state - vat;

    const toReturn = [rows_non_state, items_total, total_weight_non_state, vat];

    const schema = Joi.array().ordered(Joi.array(), Joi.number(), Joi.number());

    const { error3 } = schema.validate(toReturn);

    if (error3) {
      throw new Error(error3);
    }

    return toReturn;
  }

  getAllProductsInCategory(products, categorySelected, wholesale, retail, favorites) {
    // const productsSchema = Joi.array()

    const productsSchema = Joi.array();
    const { error } = productsSchema.validate(products);
    if (error) {
      throw new Error(error);
    }

    const categorySchema = Joi.string().required();
    const { error2 } = categorySchema.validate(categorySelected);
    if (error2) {
      throw new Error(error2);
    }

    const wholesaleSchema = Joi.boolean().required();
    const { error3 } = wholesaleSchema.validate(wholesale);
    if (error3) {
      throw new Error(error3);
    }

    const retailSchema = Joi.boolean().required();
    const { error4 } = retailSchema.validate(retail);
    if (error4) {
      throw new Error(error4);
    }

    const favoritesSchema = Joi.array().required();
    const { error5 } = favoritesSchema.validate(favorites);
    if (error5) {
      throw new Error(error5);
    }

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
    let wholesale_count = 0;
    let retail_count = 0;

    for (let i = 0; i < products.length; i++) {
      if (products[i].category === categorySelected) {
        if (products[i].unit === 'Pack') {
          retail_count += 1;
          if (retail_count == 1) {
            products[i]['forTutorial'] = true;
          } else {
            products[i]['forTutorial'] = false;
          }
        }
        else{
          wholesale_count += 1;
          if (wholesale_count == 1) {
            products[i]['forTutorial'] = true;
          } else {
            products[i]['forTutorial'] = false;
          }
        }
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

    selected_products.sort((a, b) => {
      if (a.imageLinks.length === 0 && b.imageLinks.length > 0) {
        return 1; // a comes after b if a has no imageLinks
      }
      if (a.imageLinks.length > 0 && b.imageLinks.length === 0) {
        return -1; // a comes before b if b has no imageLinks
      }
      return 0; // a and b have the same condition, maintain their original order
    });

    const selectedProductsSchema = Joi.array();

    const { error6 } = selectedProductsSchema.validate(selected_products);
    if (error6) {
      throw new Error(error6);
    }

    // SET ORDER OF PRODUCTS BY CATEGORY
    if (categorySelected == 'Paper Bag') {
      
    }
    // console.log(selected_products)
    return selected_products;
  }

  cleanGeocode(address) {
    if (address != '') {
      const addressSchema = Joi.string().required();
      const { error } = addressSchema.validate(address);
      if (error) {
        throw new Error(error);
      }

      let foundComma = false;
      let newString = '';

      for (let i = 0; i < address.length; i++) {
        const string = address[i];
        if (string == ',') {
          foundComma = true;
          continue;
        }

        if (foundComma) {
          newString += string;
        }
      }
      return newString;
    }
  }

  createPayMayaCheckoutItems(itemRows) {
    const itemRowsSchema = Joi.array().items(
      Joi.object({
        itemId: Joi.string().required(),
        itemName: Joi.string().required(),
        itemimage: Joi.any(),
        itemprice: Joi.string().required(),
        itemquantity: Joi.string().required(),
        itemtotal: Joi.string().required(),
        weighttotal: Joi.number().required(),
      }).unknown(false)
    );

    const { error } = itemRowsSchema.validate(itemRows);

    if (error) {
      throw new Error(error);
    }

    const toReturn = [];

    itemRows.map((item) => {
      const itemId = item.itemId;
      const itemName = item.itemName;
      const itemPrice = parseFloat(item.itemprice);
      const itemQuantity = parseInt(item.itemquantity);
      const itemTotal = parseFloat(item.itemtotal);
    });
  }

  convertDateTimeStampToDateString(timestamp) {
    let date;
    if (timestamp._seconds === undefined) {
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    }
    if (timestamp.seconds === undefined) {
      date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  getSecondsDifferenceBetweentTwoDates(expiryDate, dateNow) {
    const differenceInMilliseconds = dateNow - expiryDate;
    const differenceInSeconds = differenceInMilliseconds / 1000;
    return differenceInSeconds;
  }

  countAllOrdersOfUserInASpecificYear(orders, year) {
    let count = 0;
    orders.forEach((order) => {
      const orderDate = order.orderDate
      const date = new Date(orderDate._seconds * 1000 + orderDate._nanoseconds / 1000000);
      const orderYear = date.getFullYear();

      if (orderYear == year) {
        count += 1;
      }
    })
    return count;
  }

  // convertTimestampToFirebaseTimestamp(timestamp) {
  //   const date = new Date(timestamp.seconds * 1000);
  //   date.setMilliseconds(timestamp.nanoseconds / 1000000);
  //   const firebaseTimeStamp = firebase.firestore.Timestamp.fromDate(date);
  //   return firebaseTimeStamp;
  // }
}

export default dataManipulation;
