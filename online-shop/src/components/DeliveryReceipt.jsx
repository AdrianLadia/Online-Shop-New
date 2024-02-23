import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const formatNumber = (number) => {
  return parseFloat(number).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const DeliveryReceipt = ({ order, products }) => {
  const printRef = useRef();
  const downloadPdfDocument = () => {
    setTimeout(() => {
      const estimatedLength = products.length * 22
      console.log('estimatedLength', estimatedLength)
      const content = printRef.current;
      const opt = {
        margin: 0,
        filename: 'DR.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { 
          unit: 'mm', 
          format: [80,  estimatedLength + 100], // Specify width as 80mm, and auto height
          orientation: 'portrait',
        },
      };
      html2pdf().from(content).set(opt).save();
    }, 1000);
  };

  if (products.length === 0) {
    return <div>Loading...</div>;
  }

  const orderDetails = { deliveryFee: order.shippingTotal, cart: [] };
  const cart = order.cart;
  const cartItemsPrice = order.cartItemsPrice;

  console.log(cart)
  console.log('products', products)

  let correctProductData = 0
  Object.keys(cart).map((key) => {
    const itemId = key;
    const quantity = cart[key];
    const price = cartItemsPrice[key];
    const itemDataFromProducts = products.filter((product) => product.itemId === itemId)[0];
    console.log('itemDataFromProducts', itemDataFromProducts);
    console.log('itemId', itemId);
    console.log('products', products);
    try {
      const itemName = itemDataFromProducts.itemName;
      const pieces = itemDataFromProducts.pieces;
      orderDetails.cart.push({ id: itemId, name: itemName, price: price, quantity: quantity, pieces: pieces });
    }
    catch {
      correctProductData += 1
    }
  });

  if (correctProductData > 0) {
    return null
  }

  let grandTotal = 0;
  let itemsTotal = 0;
  orderDetails.cart.forEach((element) => {
    const quantity = element.quantity;
    const price = element.price;
    const total = quantity * price;
    grandTotal += total;
    itemsTotal += total;
    element['total'] = total;
  });

  grandTotal += orderDetails.deliveryFee;

  return (
    <div>
      <div
        ref={printRef}
        className="print:p-0 m-4 p-2 py-6 bg-white shadow-lg rounded-lg print:shadow-none print:bg-transparent"
        style={{ maxWidth: '272px' }}
      >
        {' '}
        {/* Adjusted for 72mm width */}
        <h2 className="text-xl font-bold text-center mb-4">Delivery Receipt</h2>
        <div className="border-t border-b border-gray-300 my-4 py-2">
          <div className="flex text-xs  justify-between py-1">
            <span className="w-3/10 break-words">Items</span>
            <span className="w-1/10">Qty</span>
            <span className="w-3/10 ">Price</span>
            <span className="w-3/10">Total</span>
          </div>
          {orderDetails.cart.map((item, index) => (
            <div key={index} className="flex  text-xs justify-between py-1">
              <span className="w-3/10 break-words">{`${item.name} (${item.pieces} pieces)`}</span>
              <span className="w-1/10 flex  items-center">{item.quantity}</span>
              <span className="w-3/10 flex  items-center">{formatNumber(item.price)}</span>
              <span className="w-3/10 flex  items-center">{formatNumber(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between py-1">
          <span>Total Items</span>
          <span>{formatNumber(itemsTotal)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Delivery Fee</span>
          <span>{formatNumber(orderDetails.deliveryFee)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Grand Total</span>
          <span>{formatNumber(grandTotal)}</span>
        </div>
        <p className="text-center mt-8 text-sm">Thank you for purchasing!</p>
      </div>

      <div className="flex justify-center">
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={downloadPdfDocument}
        >
          Download Receipt as PDF
        </button>
      </div>
    </div>
  );
};

export default DeliveryReceipt;
