import React from 'react';

const CheckoutSuccess = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-md w-full md:w-96">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">Checkout Success</h2>
          <p className="mt-4 text-gray-600">Thank you for your purchase!</p>
          <p className="mt-2 text-gray-600">
            Your order number is:{' '}
            <strong className="font-semibold text-gray-800">#{Math.floor(Math.random() * 1000000)}</strong>
          </p>
          <p className="mt-4 text-gray-600">
            We've sent a confirmation email to <strong className="font-semibold text-gray-800">your@email.com</strong>.
            If you have any questions, please contact our support team.
          </p>
        </div>
        <button
          className="mt-6 bg-green-500 text-white w-full py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={() => window.location.reload()}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
