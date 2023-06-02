import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutFailed = () => {

  const navigateTo = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-md w-full md:w-96">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className="mt-6 text-2xl font-semibold text-gray-800">Checkout Failed</h2>
          <p className="mt-4 text-gray-600">Unfortunately, we couldn't process your payment.</p>
          <p className="mt-2 text-gray-600">Please try again or contact our support team for assistance.</p>
        </div>
        <button
          className="mt-6 bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          onClick={() => navigateTo('/')}
        >
          Back to Shop
        </button>
      </div>
    </div>
  );
};

export default CheckoutFailed;
