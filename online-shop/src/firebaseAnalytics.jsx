import { getAnalytics, logEvent } from 'firebase/analytics';
import cloudFirestoreDb from './cloudFirestoreDb';

class firebaseAnalytics {
  constructor(app,cloudfirestore) {
    this.analytics = getAnalytics(app);
    this.cloudFirestoreDb = cloudfirestore;
  }

  logEvent(eventName, eventParams) {
    logEvent(this.analytics, eventName, eventParams);
  }

  logChangeCategoryEvent(category) {
    window.fbq('trackCustom', 'change_category', { category: category });
    this.cloudFirestoreDb.postToConversionApi('change_category', { category: category });
    this.logEvent('change_category', { category: category }, false);
  }

  logOpenHomePageEvent() {
    window.fbq('trackCustom', 'open_home_page', {});
    this.cloudFirestoreDb.postToConversionApi('open_home_page', {});
    this.logEvent('open_home_page', {});
  }

  logOpenStorePageEvent() {
    window.fbq('trackCustom', 'open_store_page', {});
    this.cloudFirestoreDb.postToConversionApi('open_store_page', {});
    this.logEvent('open_store_page', {});
  }

  logOpenCartEvent(cart) {
    this.logEvent('view_cart', { cart: cart });
  }

  logOpenCheckoutPageEvent(cart, itemsTotal) {
    this.logEvent('open_checkout_page', {
      cart: cart,
      items_total: itemsTotal,
    });
  }

  logPlaceOrderEvent(cart, grandTotal,guestEmail,guestPhone,guestName) {
    window.fbq('trackCustom', 'Purchase', { currency: 'PHP', value: grandTotal, cart: cart });
    this.cloudFirestoreDb.postToConversionApi('Purchase', { currency: 'PHP', value: grandTotal, cart: cart },guestEmail,guestPhone,guestName);
    this.logEvent('placed_order', { cart: cart, grand_total: grandTotal });
  }

  logCheckoutInitiatedEvent(cart) {
    this.logEvent('checkout_initiated', { cart: cart });
  }

  logOpenProductModalEvent(itemId, itemName, category) {
    window.fbq('trackCustom', 'view_modal', { item_id: itemId, item_name: itemName, category: category });
    this.cloudFirestoreDb.postToConversionApi('view_modal', {
      item_id: itemId,
      item_name: itemName,
      category: category,
    });
    this.logEvent(
      'view_product_modal',
      {
        item_id: itemId,
        item_name: itemName,
        category: category,
      },
      false
    );
  }

  logOpenPaymentPageEvent(
    referenceNumber,
    itemsTotal,
    deliveryFee,
    grandTotal,
    vat,
    area,
    paymentMethodSelected,
    date,
    rows
  ) {
    this.logEvent('open_payment_page', {
      reference_number: referenceNumber,
      items_total: itemsTotal,
      delivery_fee: deliveryFee,
      grand_total: grandTotal,
      vat: vat,
      area: area,
      payment_method_selected: paymentMethodSelected,
      date: date,
      rows: rows,
    });
  }

  logAddToCartEvent(itemId, itemName, itemCategory, quantity, price) {
    window.fbq('trackCustom', 'add_to_cart', {
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      quantity: quantity,
      price: price,
    });
    this.cloudFirestoreDb.postToConversionApi('add_to_cart', {
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      quantity: quantity,
      price: price,
    });
    this.logEvent('add_to_cart', {
      item_id: itemId,
      item_name: itemName,
      item_category: itemCategory,
      quantity: quantity,
      price: price,
    });
  }
}

export default firebaseAnalytics;
