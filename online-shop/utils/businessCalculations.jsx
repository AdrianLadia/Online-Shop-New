import serviceAreas from '../src/data/serviceAreas';
import lalamoveDeliveryVehicles from '../src/data/lalamoveDeliveryVehicles';
import Joi from 'joi';
import cloudFirestoreDb from '../src/cloudFirestoreDb';
import PaymayaSdk from '../src/components/PaymayaSdk';
import { useNavigate } from 'react-router-dom';
import AppConfig from '../src/AppConfig';

class businessCalculations {
  constructor() {
    this.serviceareas = new serviceAreas();
    this.lalamovedeliveryvehicles = new lalamoveDeliveryVehicles();
    this.cloudfirestore = new cloudFirestoreDb();
  }

  readAllParentProductsFromOnlineStoreProducts(products) {

    const parentProducts = [];
    products.map((product) => {

      if (product.parentProductID === '') {
        parentProducts.push(product.itemId);
      }
    });

    return parentProducts;
  }

  getSafetyStock(averageSalesPerDay) {
    const averageSalesPerDaySchema = Joi.number().required().allow(null);

    const { error } = averageSalesPerDaySchema.validate(averageSalesPerDay);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // multiplier is equal to days
    const multiplier = 2;

    const safetyStock = Math.round(averageSalesPerDay) * multiplier;

    const safetyStockSchema = Joi.number().required();
    const { error2 } = safetyStockSchema.validate(safetyStock);
    if (error2) {
      throw new Error(error2.details[0].message);
    }
    return safetyStock;
  }

  getStocksAvailableLessSafetyStock(stocksAvailable, averageSalesPerDay, isRetail=false) {
    // VALIDATION
    const stocksAvailableSchema = Joi.number().required();
    const averageSalesPerDaySchema = Joi.number().required();
    const { error1 } = stocksAvailableSchema.validate(stocksAvailable);
    const { error2 } = averageSalesPerDaySchema.validate(averageSalesPerDay);
    if (error1 || error2) {
      throw new Error(error1.details[0].message);
    }

    // FUNCTION
    let stocksAvailableLessSafetyStock
    if (isRetail) {
      stocksAvailableLessSafetyStock = stocksAvailable - 10
    }
    else {
      stocksAvailableLessSafetyStock = stocksAvailable - this.getSafetyStock(averageSalesPerDay);
    }

    // VALIDATION
    const stocksAvailableLessSafetyStockSchema = Joi.number().required();
    const { error3 } = stocksAvailableLessSafetyStockSchema.validate(stocksAvailableLessSafetyStock);
    if (error3) {
      throw new Error(error3.details[0].message);
    }
    return stocksAvailableLessSafetyStock;
  }

  //Counts the cart and returns an object for example { "itemID": 2, "itemID": 1 }
  getCartCount(cart) {
    // VALIDATION
    const cartSchema = Joi.array().required();
    const { error } = cartSchema.validate(cart);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // FUNCTION
    const counts = {};
    cart.forEach((str) => {
      counts[str] = counts[str] ? counts[str] + 1 : 1;
    });

    // VALIDATION
    const countsSchema = Joi.object().required();
    const { error2 } = countsSchema.validate(counts);
    if (error2) {
      throw new Error(error2.details[0].message);
    }

    return counts;
  }

  getLatitudeDifferenceOfPaperboyAndSelectedLocation(paperboylatitude, selectedlatitudem) {
    const paperboylatitudeSchema = Joi.number().required();
    const selectedlatitudemSchema = Joi.number().required();

    const { error1 } = paperboylatitudeSchema.validate(paperboylatitude);
    const { error2 } = selectedlatitudemSchema.validate(selectedlatitudem);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }

    const difference = Math.abs(paperboylatitude - selectedlatitudem);

    const differenceSchema = Joi.number().required();
    const { error3 } = differenceSchema.validate(difference);
    if (error3) {
      throw new Error('Data Validation Error');
    }

    return difference;
  }

  getLongitudeDifferenceOfPaperboyAndSelectedLocation(paperboylongitude, selectedlongitudem) {
    const paperboylongitudeSchema = Joi.number().required();
    const selectedlongitudemSchema = Joi.number().required();

    const { error1 } = paperboylongitudeSchema.validate(paperboylongitude);
    const { error2 } = selectedlongitudemSchema.validate(selectedlongitudem);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }

    const difference = Math.abs(paperboylongitude - selectedlongitudem);

    const differenceSchema = Joi.number().required();
    const { error3 } = differenceSchema.validate(difference);

    if (error3) {
      throw new Error('Data Validation Error');
    }

    return difference;
  }

  getTotalDifferenceOfPaperboyAndSelectedLocation(
    paperboylatitude,
    paperboylongitude,
    selectedlatitudem,
    selectedlongitudem
  ) {
    const paperboylatitudeSchema = Joi.number().required();
    const paperboylongitudeSchema = Joi.number().required();
    const selectedlatitudemSchema = Joi.number().required();
    const selectedlongitudemSchema = Joi.number().required();

    const { error1 } = paperboylatitudeSchema.validate(paperboylatitude);
    const { error2 } = paperboylongitudeSchema.validate(paperboylongitude);
    const { error3 } = selectedlatitudemSchema.validate(selectedlatitudem);
    const { error4 } = selectedlongitudemSchema.validate(selectedlongitudem);

    if (error1 || error2 || error3 || error4) {
      throw new Error('Data Validation Error');
    }

    const latdifference = this.getLatitudeDifferenceOfPaperboyAndSelectedLocation(paperboylatitude, selectedlatitudem);
    const longdifference = this.getLongitudeDifferenceOfPaperboyAndSelectedLocation(
      paperboylongitude,
      selectedlongitudem
    );

    const difference = latdifference + longdifference;

    const differenceSchema = Joi.number().required();
    const { error5 } = differenceSchema.validate(difference);
    if (error5) {
      throw new Error('Data Validation Error');
    }

    return difference;
  }

  convertTotalDifferenceToKilometers(totaldifference) {
    const totaldifferenceSchema = Joi.number().required();
    const { error } = totaldifferenceSchema.validate(totaldifference);
    if (error) {
      throw new Error('Data Validation Error');
    }

    const km = totaldifference * 111.1;

    const kmSchema = Joi.number().required();
    const { error2 } = kmSchema.validate(km);
    if (error2) {
      throw new Error('Data Validation Error');
    }

    return km;
  }

  getLocationsInPoint(latitude, longitude) {
    const latitudeSchema = Joi.number().required();
    const longitudeSchema = Joi.number().required();

    const { error1 } = latitudeSchema.validate(latitude);
    const { error2 } = longitudeSchema.validate(longitude);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }

    function isPointInPolygon(point, polygon) {
      let x = point[0],
        y = point[1];
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
          yi = polygon[i][1];
        let xj = polygon[j][0],
          yj = polygon[j][1];

        let intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      const insideSchema = Joi.boolean().required();
      const { error3 } = insideSchema.validate(inside);
      if (error3) {
        throw new Error('Data Validation Error');
      }

      return inside;
    }

    const locations = [
      [this.serviceareas.lalamoveServiceArea, 'lalamoveServiceArea'],
      [this.serviceareas.iloiloArea, 'iloiloArea'],
      [this.serviceareas.leyteMaasinArea, 'leyteMaasinArea'],
      [this.serviceareas.cagayanDeOroArea, 'cagayanDeOroArea'],
      [this.serviceareas.surigaoArea, 'surigaoArea'],
      [this.serviceareas.butuanArea, 'butuanArea'],
      [this.serviceareas.dapitanArea, 'dapitanArea'],
      [this.serviceareas.zamboangaArea, 'zamboangaArea'],
      [this.serviceareas.pagadianArea, 'pagadianArea'],
      [this.serviceareas.davaoArea, 'davaoArea'],
      [this.serviceareas.generalSantosArea, 'generalSantosArea'],
      [this.serviceareas.bacolodArea, 'bacolodArea'],
      [this.serviceareas.dumagueteArea, 'dumagueteArea'],
      [this.serviceareas.boholArea, 'boholArea'],
      [this.serviceareas.masbateArea, 'masbateArea'],
      [this.serviceareas.manilaArea, 'manilaArea'],
      [this.serviceareas.samarArea, 'samarArea'],
      [this.serviceareas.leytePalomponArea, 'leytePalomponArea'],
    ];

    const locationsInDeliveryPoint = [];

    locations.map((location) => {
      const polygon = location[0];
      const name = location[1];
      const result = isPointInPolygon([latitude, longitude], polygon);

      if (result) {
        locationsInDeliveryPoint.push(name);
      }
    });

    const locationsInDeliveryPointSchema = Joi.array().required();
    const { error4 } = locationsInDeliveryPointSchema.validate(locationsInDeliveryPoint);
    if (error4) {
      throw new Error('Data Validation Error');
    }

    return locationsInDeliveryPoint;
  }

  checkIfAreasHasLalamoveServiceArea(areas) {
    const areasSchema = Joi.array().required();
    const { error } = areasSchema.validate(areas);
    if (error) {
      throw new Error('Data Validation Error');
    }

    if (areas.includes('lalamoveServiceArea')) {
      return true;
    }
  }

  getVehicleForDelivery(weightOfItems) {

    const weightOfItemsSchema = Joi.number().required();
    const { error } = weightOfItemsSchema.validate(weightOfItems);
    if (error) {
      throw new Error('Data Validation Error');
    }

    const vehicleSchema = Joi.object().required();

    if (weightOfItems <= this.lalamovedeliveryvehicles.motorcycle.maxWeight) {

      const { error2 } = vehicleSchema.validate(this.lalamovedeliveryvehicles.motorcycle);

      if (error2) {
        throw new Error('Data Validation Error');
      }

      return this.lalamovedeliveryvehicles.motorcycle;
    }
    if (
      weightOfItems <= this.lalamovedeliveryvehicles.sedan.maxWeight &&
      weightOfItems > this.lalamovedeliveryvehicles.motorcycle.maxWeight
    ) {
      const { error3 } = vehicleSchema.validate(this.lalamovedeliveryvehicles.sedan);

      if (error3) {
        throw new Error('Data Validation Error');
      }

      return this.lalamovedeliveryvehicles.sedan;
    }
    if (
      weightOfItems <= this.lalamovedeliveryvehicles.mpv.maxWeight &&
      weightOfItems > this.lalamovedeliveryvehicles.sedan.maxWeight
    ) {
      const { error4 } = vehicleSchema.validate(this.lalamovedeliveryvehicles.mpv);

      if (error4) {
        throw new Error('Data Validation Error');
      }

      return this.lalamovedeliveryvehicles.mpv;
    }
    if (
      weightOfItems <= this.lalamovedeliveryvehicles.pickup.maxWeight &&
      weightOfItems > this.lalamovedeliveryvehicles.mpv.maxWeight
    ) {
      const { error5 } = vehicleSchema.validate(this.lalamovedeliveryvehicles.pickup);
      if (error5) {
        throw new Error('Data Validation Error');
      }

      return this.lalamovedeliveryvehicles.pickup;
    }
    if (
      weightOfItems <= this.lalamovedeliveryvehicles.van.maxWeight &&
      weightOfItems > this.lalamovedeliveryvehicles.pickup.maxWeight
    ) {
      const { error6 } = vehicleSchema.validate(this.lalamovedeliveryvehicles.van);
      if (error6) {
        throw new Error('Data Validation Error');
      }

      return this.lalamovedeliveryvehicles.van;
    }
    if (
    
      weightOfItems > this.lalamovedeliveryvehicles.van.maxWeight
    ) {
      const { error7 } = vehicleSchema.validate(this.lalamovedeliveryvehicles.closedvan);
      if (error7) {
        throw new Error('Data Validation Error');
      }

      return this.lalamovedeliveryvehicles.closedvan;
    } else {
      throw new Error('No Vehicle Selected By Conditions');
    }
  }

  getDeliveryFee(kilometers, vehicleObject, needAssistance) {
    const kilometersSchema = Joi.number().required();
    const vehicleObjectSchema = Joi.object().required();
    const needAssistanceSchema = Joi.boolean().required();

    const { error1 } = kilometersSchema.validate(kilometers);
    const { error2 } = vehicleObjectSchema.validate(vehicleObject);
    const { error3 } = needAssistanceSchema.validate(needAssistance);

    if (error1 || error2 || error3) {
      throw new Error('Data Validation Error');
    }

    let finalDelFee = null;
    const delFeeWithoutMinimum = Math.round(kilometers * vehicleObject.deliveryFeePerKm);
    if (delFeeWithoutMinimum < vehicleObject.minDelFee) {
      finalDelFee = vehicleObject.minDelFee;
    } else {
      finalDelFee = delFeeWithoutMinimum;
    }
    if (needAssistance) {
      finalDelFee = finalDelFee + vehicleObject.driverAssistsPrice;
    }

    const finalDelFeeSchema = Joi.number().required();
    const { error4 } = finalDelFeeSchema.validate(finalDelFee);
    if (error4) {
      throw new Error('Data Validation Error');
    }

    return finalDelFee;
  }

  async checkStocksIfAvailableInFirestore(cart) {

    const cartSchema = Joi.object().required();

    const { error2 } = cartSchema.validate(cart);

    if (error2) {
      throw new Error('Data Validation Error');
    }

    // function countStrings(arr) {
    //   const counts = {};
    //   arr.forEach((str) => {
    //     counts[str] = counts[str] ? counts[str] + 1 : 1;
    //   });
    //   return counts;
    // }
    // CONFIRM AGAIN IF STOCKS AVAILABLE
    let message = 'Unfortunately someone else might have bought the stocks listed below. \n \n';
    let outOfStockDetected = false;
    // const count = countStrings(cart);
    // const countEntries = Object.entries(count);
    const products = await this.cloudfirestore.readAllProductsForOnlineStore();
    Object.entries(cart).map(([itemId, quantity]) => {
      if (itemId.slice(-4) === "-RET") {
        return
      } 
      products.map((dataitem) => {
        if (dataitem.itemId === itemId) {
          const stocksAvailableLessSafetyStock = this.getStocksAvailableLessSafetyStock(
            dataitem.stocksAvailable,
            dataitem.averageSalesPerDay
          );

          if (stocksAvailableLessSafetyStock < quantity) {
            let stocksLeft;
            if (stocksAvailableLessSafetyStock < 0) {
              stocksLeft = 0;
            } else {
              stocksLeft = stocksAvailableLessSafetyStock;
            }
            message = message + `${dataitem.itemName} - ${stocksLeft} stocks left \n`;
            outOfStockDetected = true;

          }
        }
      });
      message += '\nPlease refresh the page to see the updated stocks.';
    });

    const toReturnSchema = Joi.array().required();

    if (outOfStockDetected) {
      const toReturn = [true, message];
      const { error3 } = toReturnSchema.validate(toReturn);
      if (error3) {
        throw new Error('Data Validation Error');
      }

      return toReturn;
    } else {
      const toReturn = [false, message];
      const { error4 } = toReturnSchema.validate(toReturn);
      if (error4) {
        throw new Error('Data Validation Error');
      }

      return toReturn;
    }
  }

  getValueAddedTax(totalPrice,noVat = new AppConfig().getNoVat()) {
    const totalPriceSchema = Joi.number().required();
    const { error } = totalPriceSchema.validate(totalPrice);
    if (error) {
      throw new Error('Data Validation Error');
    }


    let vatPercentage

    if (noVat) {
      vatPercentage = 1.0
    }
    if (!noVat) {
      vatPercentage = 1.12
    }

    const vat = totalPrice - totalPrice / vatPercentage;
    const roundedVat = Math.round(vat * 100) / 100;

    const vatSchema = Joi.number().required();
    const { error2 } = vatSchema.validate(vat);
    if (error2) {
      throw new Error('Data Validation Error');
    }
    return roundedVat;
  }

  getGrandTotal(totalPrice, valueAddedTax, deliveryFee) {
    const totalPriceSchema = Joi.number().required();
    const valueAddedTaxSchema = Joi.number().required();
    const deliveryFeeSchema = Joi.number().required();

    const { error1 } = totalPriceSchema.validate(totalPrice);
    const { error2 } = valueAddedTaxSchema.validate(valueAddedTax);
    const { error3 } = deliveryFeeSchema.validate(deliveryFee);

    if (error1 || error2 || error3) {
      throw new Error('Data Validation Error');
    }

    const grandTotal = totalPrice + valueAddedTax + deliveryFee;

    const grandTotalSchema = Joi.number().required();
    const { error4 } = grandTotalSchema.validate(grandTotal);
    if (error4) {
      throw new Error('Data Validation Error');
    }

    return grandTotal;
  }

  addToCart(cart, product) {
    const cartSchema = Joi.object().required();
    const productSchema = Joi.string().required();

    const { error1 } = cartSchema.validate(cart);
    const { error2 } = productSchema.validate(product);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }

    if (cart[product] === undefined) {
      cart[product] = 0;
    }


    cart[product] += 1;


    const newCartSchema = Joi.object().required();
    const { error3 } = newCartSchema.validate(cart);
    if (error3) {
      throw new Error('Data Validation Error');
    }

    return cart;
  }

  removeFromCart(cart, product) {
    const cartSchema = Joi.object().required();
    const productSchema = Joi.string().required();

    const { error1 } = cartSchema.validate(cart);
    const { error2 } = productSchema.validate(product);

    if (error1 || error2) {
      throw new Error('Data Validation Error');
    }


    cart[product] -= 1;


    Object.entries(cart).map(([itemId, quantity]) => {
      if (quantity === 0) {
        delete cart[itemId];
      }
    });

    const cartCopySchema = Joi.object().required();
    const { error3 } = cartCopySchema.validate(cart);
    if (error3) {
      throw new Error('Data Validation Error');
    }

    return cart;
  }

  addToCartWithQuantity(itemId, quantity, cart) {
    const itemIdSchema = Joi.string().required();
    const quantitySchema = Joi.number().required();
    const cartSchema = Joi.object().required();

    const { error1 } = itemIdSchema.validate(itemId);
    const { error2 } = quantitySchema.validate(quantity);
    const { error3 } = cartSchema.validate(cart);

    if (error1 || error2 || error3) {
      throw new Error('Data Validation Error');
    }

    if (cart[itemId] == null) {
      cart[itemId] = 0
    }

    cart[itemId] += parseFloat(quantity)



    const newCartSchema = Joi.object().required();
    const { error4 } = newCartSchema.validate(cart);
    if (error4) {
      throw new Error('Data Validation Error');
    }

    return cart;
  }

  afterCheckoutRedirectLogic(data,testing=false) {
    const dataSchema = Joi.object(
      { paymentMethodSelected : Joi.string().required(),
        referenceNumber : Joi.string().required().allow(''),
        grandTotal : Joi.number().required(),
        deliveryFee : Joi.number().required().allow(null),
        vat : Joi.number().required().allow(null),
        rows : Joi.array().required().allow(null),
        area : Joi.array().required().allow(null),
        fullName : Joi.string().required(),
        eMail : Joi.string().required(),
        phoneNumber : Joi.string().required().allow(''),
        setMayaRedirectUrl : Joi.func().required(),
        setMayaCheckoutId : Joi.func().required(),
        localDeliveryAddress : Joi.string().required().allow(null),
        addressText : Joi.string().required().allow(null),
        userId : Joi.string().required(),
        navigateTo : Joi.func(),
        itemsTotal : Joi.number().required().allow(null),
        date: Joi.date().required()
      }
    ).required();

    const { error } = dataSchema.validate(data);

    if (error) {
      throw new Error(error);
    }

    const paymentMethodSelected = data.paymentMethodSelected;

    if (['maya','visa','mastercard','gcash'].includes(paymentMethodSelected)) {
      const fullName = data.fullName;
      const firstName = fullName.split(' ')[0];
      const lastName = fullName.split(' ')[1];
      const eMail = data.eMail;
      const phoneNumber = data.phoneNumber;
      const totalPrice = data.grandTotal;
      if (testing === false) {
        PaymayaSdk(
          data.setMayaRedirectUrl,
          data.setMayaCheckoutId,
          firstName,
          lastName,
          eMail,
          phoneNumber,
          totalPrice,
          data.localDeliveryAddress,
          data.addressText,
          data.referenceNumber,
          data.userId
        );
      }
      else {
        return paymentMethodSelected
      } 
    }
    if (['bdo','unionbank','gcash'].includes(paymentMethodSelected)) {
      if (testing === false) {
        data.navigateTo('/checkout/proofOfPayment', {
          state: {
            paymentMethodSelected: paymentMethodSelected,
            referenceNumber: data.referenceNumber,
            itemsTotal: data.itemsTotal,
            deliveryFee: data.deliveryFee,
            grandTotal: data.grandTotal,
            vat: data.vat,
            rows: data.rows,
            area: data.area,
            date: data.date,
          },
        });
      }
      else {
        return paymentMethodSelected
      }
    }



    
  }

  generateOrderReference() {
    const date = new Date();
    const randomNumber = Math.floor(Math.random() * 1000000);
    return (
      date.getHours().toLocaleString() +
      date.getMinutes().toLocaleString() +
      date.getMonth().toString() +
      date.getDate().toString() +
      date.getFullYear().toString() +
      '-' +
      randomNumber
    );
  }
}

export default businessCalculations;
