import { getAnalytics, logEvent } from 'firebase/analytics';

class firebaseAnalytics {
  constructor(app) {
    this.analytics = getAnalytics(app);
  }

  logEvent(eventName, eventParams) {
    window.fbq('trackCustom', eventName, eventParams)
    logEvent(this.analytics, eventName, eventParams);
  }

  logChangeCategoryEvent(category) {
    this.logEvent('change_category', { category: category });
  }

  logOpenHomePageEvent() {
    this.logEvent('open_home_page', {});
  }

  logOpenStorePageEvent() {
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

  logPlaceOrderEvent() {
    this.logEvent('placed_order', {});
  }

  logCheckoutInitiatedEvent(cart) {
    this.logEvent('checkout_initiated', { cart: cart });
  }

  logOpenProductModalEvent(itemId, itemName) {
    this.logEvent('view_product_modal', {
      item_id: itemId,
      item_name: itemName
    });
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
